import type { ReactNode } from "react";

/**
 * Shared shell for the legal pages. `pt-32` clears the fixed 80px header.
 */
export function LegalLayout({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white">
      <section className="pt-32 pb-16 bg-gradient-to-b from-purple-100/60 via-slate-50 to-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-xs font-bold tracking-widest text-brand-800 uppercase">Legal</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-4">{title}</h1>
          <p className="text-sm text-slate-600 leading-relaxed">{intro}</p>
          <p className="text-xs text-slate-500 mt-4">Last updated: {updated}</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">{children}</div>
    </div>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-slate-900 mb-3">{heading}</h2>
      <div className="space-y-3 text-sm text-slate-600 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-brand-800 [&_a]:font-semibold hover:[&_a]:underline">
        {children}
      </div>
    </section>
  );
}
