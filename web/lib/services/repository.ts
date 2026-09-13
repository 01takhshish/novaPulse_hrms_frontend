import { contentWrite, ContentConflict, verifyAsset } from "@/lib/db/content-write";
import { isUuid } from "@/lib/ids";
import "server-only";
import { and, asc, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { servicePages, type NewServicePageRow, type ServicePageRow } from "@/lib/db/schema";
import type { ServiceFilter, ServiceInput } from "./validation";

/** The only file that writes SQL for service pages. */

/** Published pages in menu order; `name` breaks ties so the order is stable. */
export async function listPublished(): Promise<ServicePageRow[]> {
  return db()
    .select()
    .from(servicePages)
    .where(eq(servicePages.status, "published"))
    .orderBy(asc(servicePages.sortOrder), asc(servicePages.name));
}

export async function findPublishedBySlug(slug: string): Promise<ServicePageRow | null> {
  const [row] = await db()
    .select()
    .from(servicePages)
    .where(and(eq(servicePages.slug, slug), eq(servicePages.status, "published")))
    .limit(1);
  return row ?? null;
}

/** Admin listing — includes drafts. */
export async function listAll(filter: ServiceFilter = {}): Promise<ServicePageRow[]> {
  const conditions = [];
  if (filter.status) conditions.push(eq(servicePages.status, filter.status));
  if (filter.query) {
    const term = `%${filter.query}%`;
    conditions.push(
      or(ilike(servicePages.name, term), ilike(servicePages.slug, term)),
    );
  }
  return db()
    .select()
    .from(servicePages)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(asc(servicePages.sortOrder), desc(servicePages.updatedAt));
}

export async function findById(id: string): Promise<ServicePageRow | null> {
  if (!isUuid(id)) return null;
  const [row] = await db()
    .select()
    .from(servicePages)
    .where(eq(servicePages.id, id))
    .limit(1);
  return row ?? null;
}

export async function findBySlug(slug: string): Promise<ServicePageRow | null> {
  const [row] = await db()
    .select()
    .from(servicePages)
    .where(or(eq(servicePages.slug, slug), sql`${slug} = ANY(${servicePages.previousSlugs})`))
    .limit(1);
  return row ?? null;
}

/**
 * Which of the given slugs exist at all — drafts included, since a related
 * service that is not live yet is a legitimate thing to link ahead of launch.
 */
export async function existingSlugs(slugs: string[]): Promise<Set<string>> {
  if (slugs.length === 0) return new Set();
  const rows = await db()
    .select({ slug: servicePages.slug })
    .from(servicePages)
    .where(inArray(servicePages.slug, slugs));
  return new Set(rows.map((row) => row.slug));
}

export async function insertService(row: NewServicePageRow): Promise<ServicePageRow> {
  return contentWrite(async (tx) => {
    const [clash] = await tx.select({ id: servicePages.id }).from(servicePages)
      .where(or(eq(servicePages.slug, row.slug), sql`${row.slug} = ANY(${servicePages.previousSlugs})`)).limit(1);
    if (clash) throw new ContentConflict("slug", "That URL is already in use or reserved by a previous URL.");
    if (row.related?.length) {
      const targets = await tx.select({ slug: servicePages.slug }).from(servicePages).where(inArray(servicePages.slug, row.related));
      if (targets.length !== row.related.length) throw new ContentConflict("related", "A related service no longer exists. Reload and try again.");
    }

    await verifyAsset(tx, row.imageSrc, "imageSrc");
    const [created] = await tx.insert(servicePages).values(row).returning();
    return created;
  });
}

export async function updateService(
  id: string,
  input: ServiceInput,
  options: { userId: string },
): Promise<ServicePageRow | null> {
  return contentWrite(async (tx) => {
    const [existing] = await tx.select().from(servicePages).where(eq(servicePages.id, id)).limit(1);
    if (!existing) return null;
    const [clash] = await tx.select({ id: servicePages.id }).from(servicePages)
      .where(or(eq(servicePages.slug, input.slug), sql`${input.slug} = ANY(${servicePages.previousSlugs})`)).limit(1);
    if (clash && clash.id !== id) throw new ContentConflict("slug", "That URL is already in use or reserved by a previous URL.");
    if (input.related.length) {
      const targets = await tx.select({ slug: servicePages.slug }).from(servicePages).where(inArray(servicePages.slug, input.related));
      if (targets.length !== input.related.length) throw new ContentConflict("related", "A related service no longer exists. Reload and try again.");
    }

    await verifyAsset(tx, input.imageSrc, "imageSrc");
    const previousSlugs = [...new Set([...existing.previousSlugs, ...(existing.slug !== input.slug ? [existing.slug] : [])])].filter((slug) => slug !== input.slug);
    const [row] = await tx
    .update(servicePages)
    .set({
      slug: input.slug,
      previousSlugs,
      name: input.name,
      title: input.title,
      eyebrow: input.eyebrow,
      tagline: input.tagline,
      description: input.description,
      menuBlurb: input.menuBlurb,
      icon: input.icon,
      illustration: input.illustration,
      imageSrc: input.imageSrc ?? null,
      imageAlt: input.imageAlt ?? null,
      demoService: input.demoService,
      problems: input.problems,
      capabilities: input.capabilities,
      stats: input.stats,
      process: input.process,
      faqs: input.faqs,
      related: input.related,
      sortOrder: input.sortOrder,
      status: input.status,
      updatedAt: new Date(),
      updatedBy: options.userId,
    })
    .where(eq(servicePages.id, id))
    .returning();

    if (existing.slug !== input.slug) {
      await tx.update(servicePages).set({ related: sql`array_replace(${servicePages.related}, ${existing.slug}, ${input.slug})` })
        .where(sql`${existing.slug} = ANY(${servicePages.related})`);
    }
    return row ?? null;
  });
}

export async function deleteService(id: string): Promise<boolean> {
  return contentWrite(async (tx) => {
    const [existing] = await tx.select().from(servicePages).where(eq(servicePages.id, id)).limit(1);
    if (!existing) return false;
    const references = await tx.select({ id: servicePages.id }).from(servicePages)
      .where(sql`${existing.slug} = ANY(${servicePages.related}) AND ${servicePages.id} <> ${id}`);
    if (references.length) throw new ContentConflict("related", "Remove references from related services before deleting.");

    const rows = await tx.delete(servicePages).where(eq(servicePages.id, id)).returning({ id: servicePages.id });
    return rows.length > 0;
  });
}

/**
 * Rows that list `slug` as related. Used when a slug changes or a page is
 * deleted, so the strip on those pages does not keep pointing at a 404.
 */
export async function findReferencing(slug: string): Promise<ServicePageRow[]> {
  const rows = await db().select().from(servicePages);
  return rows.filter((row) => row.related.includes(slug));
}

export async function findPublishedAlias(slug: string): Promise<string | null> {
  const [row] = await db().select({ slug: servicePages.slug }).from(servicePages)
    .where(and(eq(servicePages.status, "published"), sql`${slug} = ANY(${servicePages.previousSlugs})`)).limit(1);
  return row?.slug ?? null;
}
