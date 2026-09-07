import Link from "next/link";
import type { ReactNode } from "react";
import type { MDXComponents } from "mdx/types";

/**
 * Prose styling for MDX. Written as explicit element overrides rather than
 * pulling in the typography plugin, so post styling uses the same brand tokens
 * as the rest of the site and stays under our control.
 */
export function Callout({ children }: { children: ReactNode }) {
  return (
    <aside className="my-8 rounded-2xl border-l-4 border-brand-700 bg-brand-50 p-6 text-slate-800">
      <div className="[&>p]:my-0 [&>p]:text-[0.95rem] [&>p]:leading-relaxed">{children}</div>
    </aside>
  );
}

export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      {...props}
      className="mt-14 scroll-mt-28 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl"
    />
  ),
  h3: (props) => (
    <h3 {...props} className="mt-10 scroll-mt-28 text-lg font-bold text-slate-900 md:text-xl" />
  ),
  p: (props) => <p {...props} className="mt-5 text-[1.02rem] leading-[1.8] text-slate-700" />,
  ul: (props) => <ul {...props} className="mt-5 list-disc space-y-2.5 pl-6 text-slate-700" />,
  ol: (props) => <ol {...props} className="mt-5 list-decimal space-y-2.5 pl-6 text-slate-700" />,
  li: (props) => <li {...props} className="text-[1.02rem] leading-[1.75] pl-1.5" />,
  strong: (props) => <strong {...props} className="font-bold text-slate-900" />,
  blockquote: (props) => (
    <blockquote
      {...props}
      className="my-8 border-l-4 border-brand-200 pl-6 text-lg italic leading-relaxed text-slate-600"
    />
  ),
  hr: () => <hr className="my-12 border-slate-200" />,
  code: (props) => (
    <code
      {...props}
      className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.86em] text-brand-900"
    />
  ),
  pre: (props) => (
    <pre
      {...props}
      className="my-6 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-900 p-5 text-sm text-slate-100"
    />
  ),
  a: ({ href = "", ...props }) => {
    const external = /^https?:\/\//.test(href);
    return external ? (
      <a
        {...props}
        href={href}
        target="_blank"
        rel="noopener"
        className="font-semibold text-brand-800 underline underline-offset-2 hover:text-brand-900"
      />
    ) : (
      <Link
        {...props}
        href={href}
        className="font-semibold text-brand-800 underline underline-offset-2 hover:text-brand-900"
      />
    );
  },
  Callout,
};
