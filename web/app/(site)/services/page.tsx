import { serializeJsonLd } from "@/lib/json-ld";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaCalendarCheck } from "react-icons/fa6";
import { DemoButton } from "@/components/demo-modal";
import { Icon } from "@/components/icon";
import { BlobBackdrop } from "@/components/motion/blob-backdrop";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { getServices } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "HRMS and payroll, biometric attendance, workplace security, corporate hiring and B2B lead generation — what Nova Pulse does for growing businesses.",
  alternates: { canonical: "/services" },
};

/** The headline counts the services, and an admin can now add a sixth. */
const COUNT_WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];

export default async function ServicesIndexPage() {
  const services = await getServices();
  const countWord = COUNT_WORDS[services.length] ?? String(services.length);

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: service.title,
      url: `${site.url}/services/${service.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
      />

      <section className="relative overflow-hidden bg-gradient-to-b from-purple-100/70 via-slate-50 to-white pt-32 pb-20 md:pt-40 md:pb-24">
        <BlobBackdrop />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <span className="mb-6 inline-block rounded-full border border-brand-200 bg-brand-100 px-4 py-1.5 text-xs font-bold text-brand-900">
                  Everything we do
                </span>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="text-4xl/[1.1] font-extrabold tracking-tight text-slate-900 md:text-6xl/[1.05]">
                  {countWord} service{services.length === 1 ? "" : "s"}.
                  <br />
                  <span className="bg-gradient-to-r from-brand-900 via-purple-800 to-brand-700 bg-clip-text text-transparent">
                    One business partner.
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
                  Workforce software, biometric hardware, physical security, hiring and sales
                  pipelines — bought separately they never quite fit together. Bought from one
                  partner, they share the same employee record and the same account manager.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <DemoButton
                  source="services-index-hero"
                  className="mt-9 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-800 px-8 py-4 text-base font-bold text-white shadow-lg shadow-brand-900/20 transition-all hover:scale-102 hover:bg-brand-900"
                >
                  <FaCalendarCheck className="text-brand-200" /> Book a free demo
                </DemoButton>
              </Reveal>
            </div>
            <div className="lg:col-span-5">
              <Reveal variant="scale" delay={200}>
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl">
                  <Image
                    src="/images/services.webp"
                    alt="Nova Pulse consultation with a client in the Delhi office"
                    width={1400}
                    height={933}
                    priority
                    sizes="(min-width: 1024px) 500px, 100vw"
                    className="h-auto w-full rounded-2xl object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <RevealGroup className="grid grid-cols-1 gap-8 lg:grid-cols-2" step={110}>
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="lift sheen group flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-slate-50 p-8 hover:border-brand-400 hover:shadow-xl md:p-10"
              >
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-2xl text-brand-800 transition-colors group-hover:bg-brand-800 group-hover:text-white">
                      <Icon name={service.icon} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      {service.eyebrow}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{service.title}</h2>
                  <p className="mt-2 text-sm font-bold text-brand-700">{service.tagline}</p>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    {service.description}
                  </p>
                  <ul className="mt-6 space-y-2 text-xs font-semibold text-slate-700">
                    {service.capabilities.slice(0, 3).map((capability) => (
                      <li key={capability.title} className="flex items-center gap-2">
                        <Icon name={capability.icon} className="text-brand-700" />
                        {capability.title}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-brand-800">
                  Explore {service.name}
                  <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
