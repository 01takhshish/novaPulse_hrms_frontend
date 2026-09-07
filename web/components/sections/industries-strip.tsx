import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { Icon } from "@/components/icon";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { industries } from "@/content/industries";

/** Homepage teaser for the industry pages. */
export function IndustriesStrip() {
  return (
    <section id="industries" className="border-b border-slate-200 bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div data-reveal="up" className="mx-auto mb-16 max-w-3xl text-center">
          <span className="text-xs font-bold tracking-widest text-brand-800 uppercase">
            Sector fit
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900">
            Configured for your floor
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-600">
            A factory gate at shift change and a hospital staff entrance need different hardware,
            different rules and different rosters.
          </p>
        </div>

        <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" step={90}>
          {industries.map((industry) => (
            <Link
              key={industry.slug}
              href={`/industries/${industry.slug}`}
              className="lift sheen group flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-7 hover:border-brand-400 hover:shadow-xl"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-lg text-brand-800 transition-colors group-hover:bg-brand-800 group-hover:text-white">
                <Icon name={industry.icon} />
              </div>
              <h3 className="text-base font-bold text-slate-900">{industry.name}</h3>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-600">
                {industry.tagline}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-brand-800">
                Explore
                <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </RevealGroup>

        <Reveal delay={200} className="mt-10 text-center">
          <Link
            href="/industries"
            className="link-underline inline-flex items-center gap-2 py-1.5 text-sm font-bold text-brand-800"
          >
            See all industries <FaArrowRight className="text-xs" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
