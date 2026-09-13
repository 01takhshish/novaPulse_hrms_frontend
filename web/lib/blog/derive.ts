/**
 * Values computed from the post body at read time rather than stored, so they
 * can never go stale against an edit. Deliberately free of server-only imports
 * so tests and the admin preview can both use them.
 */

export type Heading = { id: string; text: string };

/**
 * Pulls the `##` headings for the table of contents. Ids must match what
 * rehype-slug generates, or the anchors silently stop working.
 */
export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  let inFence = false;

  for (const line of content.split("\n")) {
    // A `## comment` inside a code fence is not a heading.
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

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
export function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Slugs are part of the public URL and are matched against `posts.slug`, so
 * they are normalised the same way everywhere: lowercase, ASCII, hyphenated.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 140)
    .replace(/-+$/, "");
}

export const formatPostDate = (date: Date) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(date);
