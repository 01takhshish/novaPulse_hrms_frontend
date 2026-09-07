import Link from "next/link";
import type { ReactNode } from "react";
import { BlobBackdrop } from "@/components/motion/blob-backdrop";
import { Reveal } from "@/components/motion/reveal";

export type Crumb = { href?: string; label: string };

/**
 * Shared hero for the secondary pages, so /about, /contact, /clients,
 * /careers and /industries share one rhythm instead of five near-copies.
 */
export function PageHero({
  eyebrow,
  title,
  highlight,
  intro,
  crumbs,
  align = "left",
  media,
  children,
}: {
  eyebrow: string;
  title: string;
  /** Rendered on its own line in the brand gradient. */
  highlight?: string;
  intro?: string;
  crumbs?: Crumb[];
  align?: "left" | "center";
  /** Optional visual for the right-hand column. Forces a two-column hero. */
  media?: ReactNode;
  children?: ReactNode;
}) {
  const centered = align === "center" && !media;
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-purple-100/70 via-slate-50 to-white pt-32 pb-16 md:pt-40 md:pb-20">
      <BlobBackdrop />
      <div
        className={`relative z-10 mx-auto px-6 ${centered ? "max-w-4xl text-center" : "max-w-7xl"}`}
      >
        <div className={media ? "grid grid-cols-1 items-center gap-12 lg:grid-cols-12" : undefined}>
        <div className={media ? "lg:col-span-6" : undefined}>
        {crumbs && crumbs.length > 0 && (
          <Reveal>
            <nav aria-label="Breadcrumb" className="mb-6 text-xs font-semibold text-slate-500">
              {crumbs.map((crumb, i) => (
                <span key={crumb.label}>
                  {i > 0 && <span className="mx-2 text-slate-300">/</span>}
                  {crumb.href ? (
                    <Link href={crumb.href} className="inline-block py-1.5 hover:text-brand-800">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="inline-block py-1.5 text-slate-900">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          </Reveal>
        )}

        <Reveal>
          <span className="mb-6 inline-block rounded-full border border-brand-200 bg-brand-100 px-4 py-1.5 text-xs font-bold text-brand-900">
            {eyebrow}
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="text-4xl/[1.1] font-extrabold tracking-tight text-slate-900 md:text-6xl/[1.05]">
            {title}
            {highlight && (
              <>
                <br />
                <span className="bg-gradient-to-r from-brand-900 via-purple-800 to-brand-700 bg-clip-text text-transparent">
                  {highlight}
                </span>
              </>
            )}
          </h1>
        </Reveal>
        {intro && (
          <Reveal delay={160}>
            <p
              className={`mt-6 text-base leading-relaxed text-slate-600 md:text-lg ${
                centered ? "mx-auto max-w-2xl" : "max-w-2xl"
              }`}
            >
              {intro}
            </p>
          </Reveal>
        )}
        {children && <Reveal delay={240}>{children}</Reveal>}
        </div>
        {media && (
          <div className="lg:col-span-6">
            <Reveal variant="scale" delay={200}>{media}</Reveal>
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
