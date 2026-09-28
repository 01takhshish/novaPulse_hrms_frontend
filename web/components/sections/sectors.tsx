import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { Icon } from "@/components/icon";
import { industries } from "@/content/industries";

/**
 * The sectors we have deployed in, as links — this row is how the /industries
 * pages get their internal links, which is what it was always really for.
 *
 * Client names and technology partners live on /clients, linked below.
 */
export function Sectors() {
  return (
    <section id="industries" className="border-b border-slate-200 bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center">
          <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-brand-800">
            Sector fit
          </span>
          <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
            Configured for your floor
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {industries.map((industry) => (
            <Link
              key={industry.slug}
              href={`/industries/${industry.slug}`}
              className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-xs font-bold text-slate-800 transition-colors hover:border-brand-400 hover:bg-white hover:text-brand-800"
            >
              <Icon name={industry.icon} />
              {industry.name}
            </Link>
          ))}
        </div>

        <div
          data-reveal="up"
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center"
        >
          <Link
            href="/industries"
            className="link-underline inline-flex items-center gap-2 py-1.5 text-sm font-bold text-brand-800"
          >
            See all industries <FaArrowRight className="text-xs" />
          </Link>
          <Link
            href="/clients"
            className="link-underline inline-flex items-center gap-2 py-1.5 text-sm font-bold text-brand-800"
          >
            See clients &amp; partners <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </section>
  );
}
