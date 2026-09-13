import { describe, expect, it } from "vitest";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { extractHeadings, readingMinutes } from "@/lib/blog/derive";

/**
 * The on-this-page nav is built by extractHeadings() but the anchors it links
 * to are written into the HTML by rehype-slug. If the two ever disagree, every
 * table-of-contents link silently scrolls nowhere — so they are compared here
 * against the real pipeline rather than assumed to match.
 */
async function slugsFromRehype(markdown: string): Promise<string[]> {
  const ids: string[] = [];
  const tree = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(remarkRehype)
    .use(rehypeSlug)
    .run(unified().use(remarkParse).use(remarkGfm).use(remarkDirective).parse(markdown));

  visit(tree, "element", (node: { tagName?: string; properties?: { id?: string } }) => {
    if (node.tagName === "h2" && node.properties?.id) ids.push(node.properties.id);
  });
  return ids;
}

const SAMPLES = [
  "## The four handoffs",
  "## Device to spreadsheet",
  "## What the DPDP Act actually says",
  "## Fingerprint, face or RFID?",
  "## Cost, accuracy and hygiene",
  "## **Bold** heading with `code`",
];

describe("heading extraction", () => {
  it("produces the same ids rehype-slug writes into the HTML", async () => {
    for (const sample of SAMPLES) {
      const body = `${sample}\n\nSome body text under the heading.\n`;
      const [derived] = extractHeadings(body);
      const [rendered] = await slugsFromRehype(body);
      expect(derived?.id, `mismatch for ${sample}`).toBe(rendered);
    }
  });

  it("ignores a ## line inside a fenced code block", () => {
    const body = [
      "## Real heading",
      "",
      "```bash",
      "## not a heading, a shell comment",
      "```",
      "",
      "## Another real heading",
    ].join("\n");

    expect(extractHeadings(body).map((h) => h.text)).toEqual([
      "Real heading",
      "Another real heading",
    ]);
  });

  it("strips inline markup from the visible heading text", () => {
    expect(extractHeadings("## **Bold** heading with `code`")[0].text).toBe(
      "Bold heading with code",
    );
  });

  it("rounds reading time up and never reports zero minutes", () => {
    expect(readingMinutes("one two three")).toBe(1);
    expect(readingMinutes(Array(201).fill("word").join(" "))).toBe(2);
  });
});
