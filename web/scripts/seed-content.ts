import { connectionOptions, migrationUrl } from "../lib/db/config";
import "dotenv/config";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import matter from "gray-matter";
import { posts, servicePages } from "../lib/db/schema";
import { services as staticServices } from "../content/services";

/**
 * One-time import of the MDX posts in content/blog into the posts table, and of
 * the service pages in content/services.ts into service_pages.
 *
 * Idempotent: a slug that already exists is skipped, never overwritten, so
 * re-running this after someone has edited a post in /admin cannot clobber
 * their work. The MDX files and content/services.ts stay in the repo as the
 * seed source and as a rollback path — content/services.ts is also the runtime
 * fallback if the database is unreachable during a build.
 */

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

/**
 * The MDX build evaluated `<Callout>` as a React component. Database posts
 * render as plain Markdown (see lib/blog/markdown.tsx for why), where the same
 * box is expressed as a `:::callout` container directive.
 */
function rewriteCallouts(body: string): string {
  return body
    .replace(/^[ \t]*<Callout>[ \t]*$/gm, ":::callout")
    .replace(/^[ \t]*<\/Callout>[ \t]*$/gm, ":::");
}

function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Unparseable date in frontmatter: ${String(value)}`);
  }
  return parsed;
}

type Db = ReturnType<typeof drizzle>;

async function seedPosts(db: Db) {
  const files = (await readdir(CONTENT_DIR)).filter((file) => file.endsWith(".mdx"));
  if (files.length === 0) {
    console.log("no .mdx files in content/blog — nothing to seed");
    return;
  }

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const raw = await readFile(path.join(CONTENT_DIR, file), "utf8");
    const { data, content } = matter(raw);

    const body = rewriteCallouts(content).trim();
    if (/<[A-Z]/.test(body)) {
      // A JSX component other than Callout would render as literal text, so
      // fail loudly rather than quietly publishing broken markup.
      throw new Error(`${file} still contains JSX — add a directive mapping for it first`);
    }

    const publishedAt = toDate(data.date);

    const inserted = await db
      .insert(posts)
      .values({
        slug,
        title: String(data.title),
        description: String(data.description),
        body,
        author: String(data.author ?? "Nova Pulse"),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        coverUrl: data.cover ? String(data.cover) : null,
        coverAlt: data.coverAlt ? String(data.coverAlt) : null,
        featured: data.featured === true,
        status: "published",
        publishedAt,
        createdAt: publishedAt,
      })
      .onConflictDoNothing({ target: posts.slug })
      .returning({ id: posts.id });

    console.log(inserted.length > 0 ? `imported ${slug}` : `skipped ${slug} (already exists)`);
  }
}

/**
 * Services seed published, in the order they appear in content/services.ts —
 * that array order is what drives the header menu today, so preserving it as
 * `sort_order` keeps the navigation identical after the switch.
 */
async function seedServices(db: Db) {
  for (const [index, service] of staticServices.entries()) {
    const inserted = await db
      .insert(servicePages)
      .values({
        slug: service.slug,
        name: service.name,
        title: service.title,
        eyebrow: service.eyebrow,
        tagline: service.tagline,
        description: service.description,
        menuBlurb: service.menuBlurb,
        icon: service.icon,
        illustration: service.illustration,
        imageSrc: service.image?.src ?? null,
        imageAlt: service.image?.alt ?? null,
        demoService: service.demoService,
        problems: service.problems,
        capabilities: service.capabilities,
        stats: service.stats,
        process: service.process,
        faqs: service.faqs,
        related: service.related,
        sortOrder: index,
        status: "published",
      })
      .onConflictDoNothing({ target: servicePages.slug })
      .returning({ id: servicePages.id });

    console.log(
      inserted.length > 0
        ? `imported service ${service.slug}`
        : `skipped service ${service.slug} (already exists)`,
    );
  }
}

async function main() {
  const url = migrationUrl();
  if (!url) throw new Error("DATABASE_URL is required");

  const sql = postgres(url, { max: 1, ...connectionOptions(url) });
  const db = drizzle(sql, { schema: { posts, servicePages } });

  try {
    await seedPosts(db);
    await seedServices(db);
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
