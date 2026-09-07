import { getPosts } from "@/lib/blog";
import { site } from "@/lib/site";

/** RSS 2.0. Cheap to serve, and the way most people still follow a B2B blog. */
export async function GET() {
  const posts = await getPosts();

  const escape = (value: string) =>
    value.replace(/[<>&'"]/g, (c) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!,
    );

  const items = posts
    .map(
      (post) => `    <item>
      <title>${escape(post.title)}</title>
      <link>${site.url}/blog/${post.slug}</link>
      <guid isPermaLink="true">${site.url}/blog/${post.slug}</guid>
      <description>${escape(post.description)}</description>
      <pubDate>${post.date.toUTCString()}</pubDate>
      ${post.tags.map((t) => `<category>${escape(t)}</category>`).join("")}
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.name)} Blog</title>
    <link>${site.url}/blog</link>
    <description>${escape(site.description)}</description>
    <language>en-IN</language>
    <atom:link href="${site.url}/blog/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
