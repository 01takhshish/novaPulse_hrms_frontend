import { getServiceRedirect } from "@/lib/services";
import { serializeJsonLd } from "@/lib/json-ld";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { FaArrowRight, FaCalendarCheck, FaCircleCheck } from "react-icons/fa6";
import { DemoButton } from "@/components/demo-modal";
import { Icon } from "@/components/icon";
import { Illustration } from "@/components/illustrations";
import { BlobBackdrop } from "@/components/motion/blob-backdrop";
import { PayrollSavings } from "@/components/tools/payroll-savings";
import { Counter } from "@/components/motion/counter";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { getService, getServiceSlugs } from "@/lib/services";
import { site } from "@/lib/site";

/**
 * Prerenders every published service at build. `getServiceSlugs` degrades to the
 * static list if the database is unreachable, so a blip during a deploy costs a
 * stale set of prerendered pages rather than a failed build.
 */
export async function generateStaticParams() {
  return (await getServiceSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const service = await getService((await params).slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.title} | ${site.name}`,
      description: service.description,
      url: `${site.url}/services/${service.slug}`,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const service = await getService((await params).slug);
  if (!service) {
    const target = await getServiceRedirect((await params).slug);
    if (target) permanentRedirect(`/services/${target}`);
    notFound();
  }

  const related = (await Promise.all(service.related.map(getService))).filter(
    (s): s is NonNullable<typeof s> => Boolean(s),
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: { "@type": "Organization", name: site.name, url: site.url },
    areaServed: { "@type": "Country", name: "India" },
    url: `${site.url}/services/${service.slug}`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd([schema, faqSchema]) }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-100/70 via-slate-50 to-white pt-32 pb-20 md:pt-40 md:pb-24">
        <BlobBackdrop />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <Reveal>
            <nav aria-label="Breadcrumb" className="mb-6 text-xs font-semibold text-slate-500">
              <Link href="/" className="inline-block py-1.5 hover:text-brand-800">Home</Link>
              <span className="mx-2 text-slate-300">/</span>
              <Link href="/services" className="inline-block py-1.5 hover:text-brand-800">Services</Link>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-slate-900">{service.name}</span>
            </nav>
          </Reveal>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-brand-200 bg-brand-100 px-4 py-1.5 text-xs font-bold text-brand-900">
                  <Icon name={service.icon} className="text-brand-700" />
                  {service.eyebrow}
                </div>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="text-4xl/[1.1] font-extrabold tracking-tight text-slate-900 md:text-5xl/[1.1]">
                  {service.title}
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-5 max-w-2xl bg-gradient-to-r from-brand-900 via-purple-800 to-brand-700 bg-clip-text text-lg font-bold text-transparent md:text-2xl">
                  {service.tagline}
                </p>
              </Reveal>
              <Reveal delay={240}>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
                  {service.description}
                </p>
              </Reveal>
              <Reveal delay={320}>
                <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                  <DemoButton
                    service={service.name}
                    source={`service-${service.slug}-hero`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-800 px-8 py-4 text-base font-bold text-white shadow-lg shadow-brand-900/20 transition-all hover:scale-102 hover:bg-brand-900 sm:w-auto"
                  >
                    <FaCalendarCheck className="text-brand-200" /> Book a free demo
                  </DemoButton>
                  <a
                    href={site.whatsapp}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-4 text-base font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-100 sm:w-auto"
                  >
                    Talk to an expert
                  </a>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal variant="scale" delay={200}>
                {service.image ? (
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl">
                    <Image
                      src={service.image.src}
                      alt={service.image.alt}
                      width={1400}
                      height={933}
                      priority
                      sizes="(min-width: 1024px) 500px, 100vw"
                      className="h-auto w-full rounded-2xl object-cover"
                    />
                  </div>
                ) : (
                  <div className="tilt rounded-3xl border border-brand-200 bg-white p-4 shadow-2xl">
                    <Illustration name={service.illustration} className="h-auto w-full" />
                    <div className="grid grid-cols-3 gap-3 border-t border-slate-100 px-2 pb-1 pt-5">
                      {service.stats.map((stat) => (
                        <div key={stat.label}>
                          <div className="text-xl font-extrabold text-slate-900">
                            <Counter to={stat.value} prefix={stat.prefix} suffix={stat.suffix}
                              decimals={stat.decimals} />
                          </div>
                          <div className="mt-1 text-[10px] leading-snug text-slate-500">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* STATS (when the hero used a photo instead) */}
      {service.image && (
        <section className="border-y border-slate-200 bg-slate-900 py-10">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 sm:grid-cols-3">
            {service.stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 90} className="text-center">
                <div className="text-3xl font-extrabold text-white md:text-4xl">
                  <Counter to={stat.value} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} />
                </div>
                <div className="mt-1.5 text-xs text-slate-400">{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* PROBLEMS */}
      <section className="border-b border-slate-200 bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="mx-auto mb-16 max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
              What we fix
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
              The problems this solves
            </h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-3" step={110}>
            {service.problems.map((problem) => (
              <div
                key={problem.title}
                className="lift sheen h-full rounded-3xl border border-slate-200 bg-slate-50 p-8"
              >
                <h3 className="text-lg font-bold text-slate-900">{problem.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{problem.body}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="border-b border-slate-200 bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="mx-auto mb-16 max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
              Capabilities
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
              What you get
            </h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-2" step={100}>
            {service.capabilities.map((capability) => (
              <div
                key={capability.title}
                className="lift h-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:border-brand-400 hover:shadow-xl"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-xl text-brand-800">
                  <Icon name={capability.icon} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{capability.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{capability.body}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-b border-slate-200 bg-white py-24">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="mb-16 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
              How it runs
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
              The process
            </h2>
          </Reveal>
          {/* Flex rather than absolute offsets: the step badge can never be
              clipped off the left edge on a narrow viewport. */}
          <ol className="space-y-4">
            {service.process.map((step, i) => (
              <Reveal
                as="li"
                key={step.title}
                variant="up"
                delay={i * 80}
                className="flex items-stretch gap-4"
              >
                <div className="flex flex-col items-center">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-800 text-[11px] font-bold text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {i < service.process.length - 1 && (
                    <span aria-hidden="true" className="mt-1 w-0.5 flex-1 bg-brand-100" />
                  )}
                </div>
                <div className="mb-1 flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {service.image && (
        <section className="border-b border-slate-200 bg-white py-16">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal variant="scale">
              <div className="tilt rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-10">
                <Illustration name={service.illustration} className="mx-auto h-auto w-full max-w-lg" />
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {service.slug === "hrms-payroll" && (
        <section className="border-b border-slate-200 bg-slate-50 py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="mb-10 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
                Try it yourself
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
                What is month-end actually costing you?
              </h2>
            </Reveal>
            <Reveal variant="scale" delay={80}>
              <PayrollSavings />
            </Reveal>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="border-b border-slate-200 bg-slate-50 py-24">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
              Questions
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
              Frequently asked
            </h2>
          </Reveal>
          <div className="space-y-3">
            {service.faqs.map((faq, i) => (
              <Reveal key={faq.question} delay={i * 70}>
                <details className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm open:border-brand-300">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-slate-900 marker:hidden">
                    {faq.question}
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-brand-700 transition-transform duration-300 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED + CTA */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          {related.length > 0 && (
            <>
              <Reveal className="mb-10">
                <h2 className="text-xs font-bold uppercase tracking-widest text-brand-800">
                  Works well with
                </h2>
              </Reveal>
              <RevealGroup className="mb-20 grid grid-cols-1 gap-6 md:grid-cols-2" step={100}>
                {related.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/services/${other.slug}`}
                    className="lift group flex h-full items-start gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-7 hover:border-brand-400"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-xl text-brand-800 transition-colors group-hover:bg-brand-800 group-hover:text-white">
                      <Icon name={other.icon} />
                    </div>
                    <div>
                      <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                        {other.title}
                        <FaArrowRight className="text-xs text-brand-700 transition-transform group-hover:translate-x-1" />
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                        {other.tagline}
                      </p>
                    </div>
                  </Link>
                ))}
              </RevealGroup>
            </>
          )}

          <Reveal variant="scale">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 p-10 text-center md:p-16">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.35),transparent_60%)]" />
              <div className="relative z-10">
                <h2 className="text-3xl font-extrabold text-white md:text-4xl">
                  Ready to talk about {service.name.toLowerCase()}?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-purple-200 md:text-base">
                  Tell us your team size, locations and current setup. We&rsquo;ll show you exactly
                  what a deployment looks like.
                </p>
                <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <DemoButton
                    service={service.name}
                    source={`service-${service.slug}-cta`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-brand-900 shadow-lg transition-all hover:scale-102 sm:w-auto"
                  >
                    <FaCircleCheck className="text-brand-700" /> Book a free demo
                  </DemoButton>
                  <a
                    href={site.phoneHref}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-white/25 px-8 py-4 text-base font-bold text-white transition-all hover:bg-white/10 sm:w-auto"
                  >
                    {site.phone}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
