import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { CtaBand } from "@/components/cta-band";
import { Icon } from "@/components/icon";
import { RevealGroup } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { industries } from "@/content/industries";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "How Nova Pulse deploys attendance, payroll, security and hiring in manufacturing, healthcare, retail, IT/BPO and education — sector by sector.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesIndexPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: industries.map((industry, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: industry.name,
      url: `${site.url}/industries/${industry.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        eyebrow="Industries"
        title="The same stack,"
        highlight="configured for your floor"
        intro="A factory gate at shift change and a hospital staff entrance need different hardware, different rules and different rosters. These pages set out what changes by sector."
        crumbs={[{ href: "/", label: "Home" }, { label: "Industries" }]}
        align="center"
      />

      <section className="bg-white pb-20 md:pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <RevealGroup className="grid grid-cols-1 gap-8 lg:grid-cols-2" step={100}>
            {industries.map((industry) => (
              <Link key={industry.slug} href={`/industries/${industry.slug}`}
                className="lift sheen group flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-slate-50 p-8 hover:border-brand-400 hover:shadow-xl md:p-10">
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-2xl text-brand-800 transition-colors group-hover:bg-brand-800 group-hover:text-white">
                      <Icon name={industry.icon} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      {industry.eyebrow}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{industry.name}</h2>
                  <p className="mt-2 text-sm font-bold text-brand-700">{industry.tagline}</p>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    {industry.description}
                  </p>
                  <ul className="mt-6 space-y-2 text-xs font-semibold text-slate-700">
                    {industry.notes.map((note) => (
                      <li key={note} className="flex items-start gap-2">
                        <Icon name="FaCircleCheck" className="mt-0.5 shrink-0 text-brand-700" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-brand-800">
                  Explore {industry.name}
                  <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CtaBand
        source="industries-index-cta"
        title="Not sure which fits?"
        body="Describe your site — headcount, entry points, shift pattern — and we'll tell you what we would deploy and why."
      />
    </>
  );
}
