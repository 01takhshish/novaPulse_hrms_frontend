import { contentWrite, ContentConflict, verifyAsset } from "@/lib/db/content-write";
import { isUuid } from "@/lib/ids";
import "server-only";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { posts, type NewPostRow, type PostRow } from "@/lib/db/schema";
import type { PostFilter, PostInput } from "./validation";

/** The only file that writes SQL for posts. */

/**
 * Published posts, newest first. `published_at` is the public date and is
 * never rewritten by an edit, so ordering stays stable.
 */
export async function listPublished(): Promise<PostRow[]> {
  return db()
    .select()
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt), desc(posts.createdAt));
}

export async function findPublishedBySlug(slug: string): Promise<PostRow | null> {
  const [row] = await db()
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
    .limit(1);
  return row ?? null;
}

/** Admin listing — includes drafts. */
export async function listAll(filter: PostFilter = {}): Promise<PostRow[]> {
  const conditions = [];
  if (filter.status) conditions.push(eq(posts.status, filter.status));
  if (filter.query) {
    const term = `%${filter.query}%`;
    conditions.push(or(ilike(posts.title, term), ilike(posts.slug, term)));
  }
  return db()
    .select()
    .from(posts)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(posts.updatedAt));
}

export async function findById(id: string): Promise<PostRow | null> {
  if (!isUuid(id)) return null;
  const [row] = await db().select().from(posts).where(eq(posts.id, id)).limit(1);
  return row ?? null;
}

export async function findBySlug(slug: string): Promise<PostRow | null> {
  const [row] = await db().select().from(posts).where(or(eq(posts.slug, slug), sql`${slug} = ANY(${posts.previousSlugs})`)).limit(1);
  return row ?? null;
}

export async function insertPost(row: NewPostRow): Promise<PostRow> {
  return contentWrite(async (tx) => {
    const [clash] = await tx.select({ id: posts.id }).from(posts)
      .where(or(eq(posts.slug, row.slug), sql`${row.slug} = ANY(${posts.previousSlugs})`)).limit(1);
    if (clash) throw new ContentConflict("slug", "That URL is already in use or reserved by a previous URL.");
    await verifyAsset(tx, row.coverUrl, "coverUrl");
    const [created] = await tx.insert(posts).values(row).returning();
    return created;
  });
}

export async function updatePost(
  id: string,
  input: PostInput,
  options: { userId: string; publishedAt: Date | null },
): Promise<PostRow | null> {
  return contentWrite(async (tx) => {
    const [existing] = await tx.select().from(posts).where(eq(posts.id, id)).limit(1);
    if (!existing) return null;
    const [clash] = await tx.select({ id: posts.id }).from(posts)
      .where(or(eq(posts.slug, input.slug), sql`${input.slug} = ANY(${posts.previousSlugs})`)).limit(1);
    if (clash && clash.id !== id) throw new ContentConflict("slug", "That URL is already in use or reserved by a previous URL.");
    await verifyAsset(tx, input.coverUrl, "coverUrl");
    const previousSlugs = [...new Set([...existing.previousSlugs, ...(existing.slug !== input.slug ? [existing.slug] : [])])].filter((slug) => slug !== input.slug);
    const [row] = await tx
    .update(posts)
    .set({
      title: input.title,
      slug: input.slug,
      previousSlugs,
      description: input.description,
      body: input.body,
      author: input.author,
      tags: input.tags,
      coverUrl: input.coverUrl ?? null,
      coverAlt: input.coverAlt ?? null,
      featured: input.featured,
      status: input.status,
      publishedAt: options.publishedAt,
      updatedAt: new Date(),
      updatedBy: options.userId,
    })
    .where(eq(posts.id, id))
    .returning();
    return row ?? null;
  });
}

export async function deletePost(id: string): Promise<boolean> {
  return contentWrite(async (tx) => {
    const rows = await tx.delete(posts).where(eq(posts.id, id)).returning({ id: posts.id });
    return rows.length > 0;
  });
}

/** Tag counts over published posts only, so a draft cannot invent a tag page. */
export async function publishedTagCounts(): Promise<{ tag: string; count: number }[]> {
  const rows = await db()
    .select({ tag: sql<string>`tag`, count: sql<number>`count(*)::int` })
    .from(sql`${posts}, unnest(${posts.tags}) as tag`)
    .where(eq(posts.status, "published"))
    .groupBy(sql`tag`);
  return rows.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export async function findPublishedAlias(slug: string): Promise<string | null> {
  const [row] = await db().select({ slug: posts.slug }).from(posts)
    .where(and(eq(posts.status, "published"), sql`${slug} = ANY(${posts.previousSlugs})`)).limit(1);
  return row?.slug ?? null;
}
