import "server-only";
import type { PostRow } from "@/lib/db/schema";
import { extractHeadings, readingMinutes, type Heading } from "./derive";
import * as repo from "./repository";

/**
 * Public read API for the blog. Posts live in Postgres and are written through
 * /admin; this module is the only thing the site pages talk to, which is what
 * let the store move off the filesystem without touching a single page.
 *
 * Shape is kept deliberately stable — `cover` rather than the column's
 * `cover_url` — so the listing and article pages did not have to change.
 */
export type { Heading };

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: Date;
  author: string;
  tags: string[];
  cover?: string;
  coverAlt?: string;
  featured: boolean;
  readingMinutes: number;
};

export type Post = PostMeta & { content: string; headings: Heading[] };

function toMeta(row: PostRow): PostMeta {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    // A published row always has publishedAt; createdAt is a defensive fallback
    // so a bad row renders with a plausible date instead of crashing the page.
    date: row.publishedAt ?? row.createdAt,
    author: row.author,
    tags: row.tags,
    cover: row.coverUrl ?? undefined,
    coverAlt: row.coverAlt ?? undefined,
    featured: row.featured,
    readingMinutes: readingMinutes(row.body),
  };
}

/**
 * Pages are prerendered at build time, so an unreachable database during a
 * deploy would otherwise fail the whole build. Degrading to an empty blog
 * keeps the other 30 pages shipping; the posts come back on the next
 * revalidation.
 */
async function safely<T>(read: () => Promise<T>, fallback: T): Promise<T> {
  // A configured database failure must throw, preserving an existing ISR page
  // rather than caching empty content or resurrecting unpublished seed content.
  if (!process.env.DATABASE_URL?.trim()) return fallback;
  return read();
}

export async function getPosts(tag?: string): Promise<PostMeta[]> {
  const rows = await safely(() => repo.listPublished(), []);
  const metas = rows.map(toMeta);
  if (!tag) return metas;
  const wanted = tag.toLowerCase();
  return metas.filter((post) => post.tags.some((t) => t.toLowerCase() === wanted));
}

export async function getPost(slug: string): Promise<Post | null> {
  const row = await safely(() => repo.findPublishedBySlug(slug), null);
  if (!row) return null;
  return {
    ...toMeta(row),
    content: row.body,
    headings: extractHeadings(row.body),
  };
}

export async function getPostSlugs(): Promise<string[]> {
  const rows = await safely(() => repo.listPublished(), []);
  return rows.map((row) => row.slug);
}

export async function getTags(): Promise<{ tag: string; count: number }[]> {
  return safely(() => repo.publishedTagCounts(), []);
}

export { formatPostDate } from "./derive";

export async function getPostRedirect(slug: string): Promise<string | null> {
  return safely(() => repo.findPublishedAlias(slug), null);
}
