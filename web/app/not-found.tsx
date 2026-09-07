import Link from "next/link";
import { site } from "@/lib/site";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-100/60 via-slate-50 to-slate-50 px-6 py-24">
      <div className="max-w-lg text-center">
        <span className="text-xs font-bold tracking-widest text-brand-800 uppercase">
          Error 404
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-3 mb-4">
          Page not found
        </h1>
        <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8">
          The page you were looking for doesn&rsquo;t exist or has moved. Head back to the
          homepage, or talk to us directly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-7 py-3.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-bold text-sm transition-colors shadow-lg shadow-brand-900/20"
          >
            Back to homepage
          </Link>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener"
            className="px-7 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-sm transition-colors"
          >
            Talk to an expert
          </a>
        </div>
      </div>
    </div>
  );
}
