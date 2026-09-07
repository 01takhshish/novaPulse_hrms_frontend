import "server-only";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { z } from "zod";

/**
 * File-backed blog. Posts are MDX in content/blog, read at build time, so pages
 * prerender to static HTML with no database and no CMS to keep online.
 */
const BLOG_DIR = join(process.cwd(), "content", "blog");

const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  // Frontmatter dates parse to Date via YAML; accept a string too.
  date: z.union([z.date(), z.string()]).transform((v) => new Date(v)),
  author: z.string().default("Nova Pulse"),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
});

export type PostMeta = z.infer<typeof frontmatterSchema> & {
  slug: string;
  readingMinutes: number;
};

export type Heading = { id: string; text: string };
export type Post = PostMeta & { content: string; headings: Heading[] };

/**
 * Pulls the `##` headings for the table of contents. Ids must match what
 * rehype-slug generates, so the anchors line up.
 */
function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  for (const line of content.split("\n")) {
    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const text = match[1].replace(/[*`_]/g, "");
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    headings.push({ id, text });
  }
  return headings;
}

/** ~200 wpm, rounded up, minimum one minute. */
function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

async function parseFile(filename: string): Promise<Post> {
  const slug = filename.replace(/\.mdx?$/, "");
  const raw = await readFile(join(BLOG_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    // Fail the build rather than publishing a post with broken metadata.
    throw new Error(
      `Invalid frontmatter in content/blog/${filename}:\n` +
        parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n"),
    );
  }

  return {
    ...parsed.data,
    slug,
    content,
    readingMinutes: readingMinutes(content),
    headings: extractHeadings(content),
  };
}

async function allPosts(): Promise<Post[]> {
  let files: string[];
  try {
    files = (await readdir(BLOG_DIR)).filter((f) => /\.mdx?$/.test(f));
  } catch {
    return [];
  }
  const posts = await Promise.all(files.map(parseFile));
  return posts
    .filter((p) => !p.draft || process.env.NODE_ENV === "development")
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function getPosts(tag?: string): Promise<PostMeta[]> {
  // Drop the body so a listing page never ships every post's full MDX.
  const posts = (await allPosts()).map((post) => {
    const meta = { ...post } as Partial<Post>;
    delete meta.content;
    delete meta.headings;
    return meta as PostMeta;
  });
  if (!tag) return posts;
  const wanted = tag.toLowerCase();
  return posts.filter((p) => p.tags.some((t) => t.toLowerCase() === wanted));
}

export async function getPost(slug: string): Promise<Post | null> {
  return (await allPosts()).find((p) => p.slug === slug) ?? null;
}

export async function getPostSlugs(): Promise<string[]> {
  return (await allPosts()).map((p) => p.slug);
}

export async function getTags(): Promise<{ tag: string; count: number }[]> {
  const counts = new Map<string, number>();
  for (const post of await allPosts()) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export const formatPostDate = (date: Date) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(date);
