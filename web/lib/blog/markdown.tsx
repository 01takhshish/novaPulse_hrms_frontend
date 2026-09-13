import Markdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { visit } from "unist-util-visit";
import type { Node } from "unist";
import { Callout, mdxComponents } from "@/components/blog/mdx-components";

/**
 * Post bodies come out of the database, so they are rendered as Markdown, not
 * MDX.
 *
 * `MDXRemote` compiles and *evaluates* its source on the server. That is fine
 * for files in git, where a human reviews every commit, but not for a column
 * any signed-in author can write — it would turn a phished admin password into
 * server-side code execution. react-markdown parses to a fixed node tree and
 * evaluates nothing, and raw HTML is ignored because rehype-raw is absent.
 *
 * The one thing MDX gave us that plain Markdown does not is <Callout>, so it
 * comes back as a `:::callout` container directive below.
 */

type DirectiveNode = Node & {
  name?: string;
  data?: { hName?: string; hProperties?: Record<string, string> };
};

function remarkCallout() {
  return (tree: Node) => {
    visit(tree, (node: DirectiveNode) => {
      if (node.type !== "containerDirective" || node.name !== "callout") return;
      const data = node.data ?? (node.data = {});
      data.hName = "aside";
      data.hProperties = { "data-callout": "true" };
    });
  };
}

// The element styling is shared with the MDX pipeline so migrated posts render
// identically; only the Callout entry, which is a component name rather than an
// element, has to be handled separately.
const elementStyles = Object.fromEntries(
  Object.entries(mdxComponents).filter(([key]) => key !== "Callout"),
);

const components = {
  ...elementStyles,
  aside: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) =>
    "data-callout" in props ? <Callout>{children}</Callout> : <aside {...props}>{children}</aside>,
} as Components;

export function PostBody({ source }: { source: string }) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm, remarkDirective, remarkCallout]}
      rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]}
      components={components}
    >
      {source}
    </Markdown>
  );
}
