import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowRight, FaQuoteLeft, FaStar } from "react-icons/fa6";
import { CtaBand } from "@/components/cta-band";
import { Icon } from "@/components/icon";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { clients, partners, testimonials } from "@/content/clients";
import { industries } from "@/content/industries";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Clients & Partners",
  description:
    "The organisations Nova Pulse works with, the technology partners behind our deployments, and what clients say about the results.",
  alternates: { canonical: "/clients" },
};

export default function ClientsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Clients & Partners",
    url: `${site.url}/clients`,
    review: testimonials.map((t) => ({
      "@type": "Review",
      reviewBody: t.quote,
      author: { "@type": "Person", name: t.name },
      itemReviewed: { "@type": "Organization", name: site.name },
    })),
  };

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        eyebrow="Proof"
        title="Trusted by growing"
        highlight="organisations"
        intro="Manufacturing, healthcare, staffing and BPO businesses across Delhi NCR and Uttar Pradesh — plus the technology partners whose platforms sit behind our deployments."
        crumbs={[{ href: "/", label: "Home" }, { label: "Clients" }]}
        align="center"
      />

      {/* CLIENT GRID */}
      <section className="border-b border-slate-200 bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <RevealGroup
            className="grid grid-cols-2 gap-4 md:grid-cols-3"
            step={70}
          >
            {clients.map((client) => (
              <div key={client.name}
                className="lift flex h-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 hover:border-brand-400">
                <Icon name={client.icon} className="text-xl text-brand-700" />
                <span className="text-sm font-bold text-slate-900">{client.name}</span>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="border-b border-slate-200 bg-slate-50 py-20">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal className="mb-12 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
                In their words
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
                What clients say
              </h2>
            </Reveal>
            {testimonials.map((testimonial, i) => (
              <Reveal key={testimonial.name} variant="scale" delay={i * 100}>
                <figure className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-purple-900 to-slate-900 p-9 text-white shadow-xl md:p-12">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(168,85,247,0.35),transparent_60%)]" />
                  <div className="relative z-10">
                    <FaQuoteLeft className="text-3xl text-brand-400/70" />
                    <div className="mt-5 flex items-center gap-1 text-amber-300 text-xs">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <FaStar key={s} />
                      ))}
                      <span className="ml-2 font-semibold text-purple-200">
                        Verified client experience
                      </span>
                    </div>
                    <blockquote className="mt-5 text-lg font-medium italic leading-relaxed text-slate-100 md:text-xl">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-6 border-t border-white/15 pt-5">
                      <div className="text-sm font-bold text-white">{testimonial.name}</div>
                      <div className="text-xs text-purple-200">{testimonial.role}</div>
                      <div className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-brand-400">
                        {testimonial.service}
                      </div>
                    </figcaption>
                  </div>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* PARTNERS */}
      <section className="border-b border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
              Technology &amp; security integrations
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
              Partners behind the work
            </h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-2" step={100}>
            {partners.map((partner) => (
              <div key={partner.name}
                className="lift h-full rounded-3xl border border-slate-200 bg-slate-50 p-8 hover:border-brand-400 hover:shadow-xl">
                <Icon name={partner.icon} className={`text-3xl ${partner.tone}`} />
                <h3 className="mt-5 text-lg font-bold text-slate-900">{partner.name}</h3>
                <p className="text-xs font-bold text-brand-700">{partner.blurb}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{partner.detail}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* SECTORS */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
              Sectors we deploy in
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 md:text-3xl">
              Built for these environments
            </h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" step={80}>
            {industries.map((industry) => (
              <Link key={industry.slug} href={`/industries/${industry.slug}`}
                className="lift group flex h-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 hover:border-brand-400">
                <Icon name={industry.icon} className="text-xl text-brand-700" />
                <span className="flex-1 text-sm font-bold text-slate-900">{industry.name}</span>
                <FaArrowRight className="text-xs text-brand-700 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CtaBand
        source="clients-cta"
        title="Want a reference call?"
        body="We can put you in touch with a client running a comparable deployment, so you hear it from someone who is not selling to you."
        cta="Request a reference"
      />
    </>
  );
}
