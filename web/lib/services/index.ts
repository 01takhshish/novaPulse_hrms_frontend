import "server-only";
import {
  services as staticServices,
  type ServiceContent,
} from "@/content/services";
import type { ServicePageRow } from "@/lib/db/schema";
import * as repo from "./repository";
import { serviceInputSchema } from "./validation";

/**
 * Public read API for service pages. Rows live in Postgres and are written
 * through /admin; this module is the only thing the site pages talk to, so the
 * store moved without the pages changing shape.
 *
 * `content/services.ts` stays in the repo and is still the seed source. It is
 * also the fallback here, which matters more for services than it did for the
 * blog: the header menu is built from this list, so an unreachable database
 * would otherwise blank the navigation on all 30 pages rather than just one.
 */
export type { ServiceContent };

/**
 * Rows carry five jsonb columns. Postgres guarantees they are valid JSON and
 * nothing more — it will not stop a hand-run UPDATE from putting a string where
 * a stat array belongs. Validating on the way out means a bad row degrades to
 * its static counterpart instead of throwing inside a Server Component.
 */
function toContent(row: ServicePageRow): ServiceContent | null {
  const parsed = serviceInputSchema.safeParse({
    slug: row.slug,
    name: row.name,
    title: row.title,
    eyebrow: row.eyebrow,
    tagline: row.tagline,
    description: row.description,
    menuBlurb: row.menuBlurb,
    icon: row.icon,
    illustration: row.illustration,
    imageSrc: row.imageSrc ?? undefined,
    imageAlt: row.imageAlt ?? undefined,
    demoService: row.demoService,
    problems: row.problems,
    capabilities: row.capabilities,
    stats: row.stats,
    process: row.process,
    faqs: row.faqs,
    related: row.related,
    sortOrder: row.sortOrder,
    status: row.status,
  });

  if (!parsed.success) {
    console.error(`[services] row "${row.slug}" failed validation`, parsed.error.issues);
    return staticServices.find((service) => service.slug === row.slug) ?? null;
  }

  const input = parsed.data;
  return {
    slug: input.slug,
    name: input.name,
    title: input.title,
    eyebrow: input.eyebrow,
    tagline: input.tagline,
    description: input.description,
    menuBlurb: input.menuBlurb,
    icon: input.icon,
    illustration: input.illustration,
    image:
      input.imageSrc && input.imageAlt
        ? { src: input.imageSrc, alt: input.imageAlt }
        : undefined,
    problems: input.problems,
    capabilities: input.capabilities,
    stats: input.stats,
    process: input.process,
    faqs: input.faqs,
    demoService: input.demoService,
    related: input.related,
  };
}

/**
 * Pages are prerendered at build time, so an unreachable database during a
 * deploy would otherwise fail the whole build.
 */
async function safely<T>(read: () => Promise<T>, fallback: T): Promise<T> {
  // A configured database failure must throw, preserving an existing ISR page
  // rather than caching empty content or resurrecting unpublished seed content.
  if (!process.env.DATABASE_URL?.trim()) return fallback;
  return read();
}

export async function getServices(): Promise<ServiceContent[]> {
  const rows = await safely(() => repo.listPublished(), null);
  // `null` means the read threw. An empty array means an admin genuinely has
  // nothing published, which is a real state and must not resurrect the
  // static list behind their back.
  if (rows === null) return staticServices;
  return rows.map(toContent).filter((service): service is ServiceContent => service !== null);
}

export async function getService(slug: string): Promise<ServiceContent | null> {
  const row = await safely(() => repo.findPublishedBySlug(slug), undefined);
  if (row === undefined) {
    return staticServices.find((service) => service.slug === slug) ?? null;
  }
  return row ? toContent(row) : null;
}

export async function getServiceSlugs(): Promise<string[]> {
  return (await getServices()).map((service) => service.slug);
}

/** The header dropdown. Only the four fields it renders, to keep the payload small. */
export type SolutionsMenuItem = {
  href: string;
  icon: string;
  title: string;
  blurb: string;
};

export async function getSolutionsMenu(): Promise<SolutionsMenuItem[]> {
  return (await getServices()).map((service) => ({
    href: `/services/${service.slug}`,
    icon: service.icon,
    title: service.name,
    blurb: service.menuBlurb,
  }));
}

export async function getServiceRedirect(slug: string): Promise<string | null> {
  return safely(() => repo.findPublishedAlias(slug), null);
}

/** Local industry/homepage references can follow a renamed service without exposing drafts. */
export async function getServiceForReference(slug: string): Promise<ServiceContent | null> {
  const current = await getService(slug);
  if (current) return current;
  const target = await getServiceRedirect(slug);
  return target ? getService(target) : null;
}
