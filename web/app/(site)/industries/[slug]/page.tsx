import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowRight } from "react-icons/fa6";
import { CtaBand } from "@/components/cta-band";
import { Icon } from "@/components/icon";
import { Illustration } from "@/components/illustrations";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { getIndustry, industries } from "@/content/industries";
import { getServiceForReference } from "@/lib/services";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const industry = getIndustry((await params).slug);
  if (!industry) return {};
  return {
    title: industry.title,
    description: industry.description,
    alternates: { canonical: `/industries/${industry.slug}` },
    openGraph: {
      title: `${industry.title} | ${site.name}`,
      description: industry.description,
      url: `${site.url}/industries/${industry.slug}`,
    },
  };
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const industry = getIndustry((await params).slug);
  if (!industry) notFound();

  const related = (await Promise.all(industry.services.map(getServiceForReference))).filter(
    (s): s is NonNullable<typeof s> => Boolean(s),
  );

  return (
    <>
      <PageHero
        eyebrow={industry.eyebrow}
        title={industry.title}
        intro={industry.description}
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/industries", label: "Industries" },
          { label: industry.name },
        ]}
        media={
          <div className="tilt rounded-3xl border border-brand-200 bg-white p-4 shadow-2xl">
            <Illustration name={industry.illustration} className="h-auto w-full" />
          </div>
        }
      >
        <p className="mt-6 bg-gradient-to-r from-brand-900 via-purple-800 to-brand-700 bg-clip-text text-lg font-bold text-transparent md:text-2xl">
          {industry.tagline}
        </p>
      </PageHero>

      {/* CHALLENGES */}
      <section className="border-b border-slate-200 bg-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="mx-auto mb-14 max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
              What is different here
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
              The constraints this sector actually has
            </h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-3" step={110}>
            {industry.challenges.map((challenge) => (
              <div key={challenge.title}
                className="lift sheen h-full rounded-3xl border border-slate-200 bg-slate-50 p-8">
                <h3 className="text-lg font-bold text-slate-900">{challenge.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{challenge.body}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* WHAT WE DEPLOY */}
      <section className="border-b border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
              Typical deployment
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
              What we usually recommend
            </h2>
          </Reveal>
          <RevealGroup className="space-y-3" step={80}>
            {industry.notes.map((note) => (
              <div key={note}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                <Icon name="FaCircleCheck" className="mt-0.5 shrink-0 text-lg text-brand-700" />
                <p className="text-sm font-semibold text-slate-800">{note}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* SERVICES FOR THIS SECTOR */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-800">
              Services that apply
            </h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-3" step={100}>
            {related.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`}
                className="lift group flex h-full flex-col rounded-3xl border border-slate-200 bg-slate-50 p-7 hover:border-brand-400 hover:shadow-xl">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-xl text-brand-800 transition-colors group-hover:bg-brand-800 group-hover:text-white">
                  <Icon name={service.icon} />
                </div>
                <h3 className="text-base font-bold text-slate-900">{service.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {service.tagline}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-brand-800">
                  Explore
                  <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CtaBand
        source={`industry-${industry.slug}-cta`}
        title={`Deploying in ${industry.name.toLowerCase()}?`}
        body="Send us your site details — headcount, entry points and shift pattern — and we'll come back with a specific recommendation."
      />
    </>
  );
}
