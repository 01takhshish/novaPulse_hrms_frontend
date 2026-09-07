import type { Metadata } from "next";
import { FaWhatsapp } from "react-icons/fa6";
import { Icon } from "@/components/icon";
import { LeadForm } from "@/components/lead-form";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { locations } from "@/content/company";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Nova Pulse about HRMS, biometric attendance, workplace security, hiring or B2B lead generation. Delhi and Mainpuri offices, WhatsApp, phone and email.",
  alternates: { canonical: "/contact" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Nova Pulse",
  url: `${site.url}/contact`,
  mainEntity: {
    "@type": "Organization",
    name: site.name,
    telephone: site.phone,
    email: site.email,
    address: locations.map((l) => ({ "@type": "PostalAddress", streetAddress: l.address })),
  },
};

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        eyebrow="Contact"
        title="Tell us what you"
        highlight="need to fix"
        intro="Team size, locations, what you run today. We'll come back with what a deployment actually looks like — including when the answer is that your current setup is fine."
        crumbs={[{ href: "/", label: "Home" }, { label: "Contact" }]}
      />

      <section className="bg-white pb-20 md:pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* FORM */}
            <div className="lg:col-span-7">
              <Reveal>
                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl md:p-10">
                  <h2 className="text-2xl font-extrabold text-slate-900">Send us an enquiry</h2>
                  <p className="mt-1.5 text-sm text-slate-500">
                    We reply within one working day. No call centre.
                  </p>
                  <div className="mt-7">
                    <LeadForm source="contact-page" />
                  </div>
                </div>
              </Reveal>
            </div>

            {/* DIRECT CHANNELS */}
            <aside className="space-y-4 lg:col-span-5">
              <Reveal delay={80}>
                <a href={site.whatsapp} target="_blank" rel="noopener"
                  className="lift flex items-center gap-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 hover:border-emerald-400">
                  <FaWhatsapp className="text-3xl text-emerald-600" />
                  <div>
                    <span className="block text-sm font-bold text-slate-900">
                      WhatsApp — fastest
                    </span>
                    <span className="text-xs text-slate-600">
                      Message us directly, usually answered same day
                    </span>
                  </div>
                </a>
              </Reveal>

              {[
                { icon: "FaPhone", label: "Call us", value: site.phone, href: site.phoneHref },
                { icon: "FaEnvelope", label: "Email", value: site.email, href: `mailto:${site.email}` },
              ].map((channel, i) => (
                <Reveal key={channel.label} delay={140 + i * 70}>
                  <a href={channel.href}
                    className="lift flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 hover:border-brand-400">
                    <Icon name={channel.icon} className="text-2xl text-brand-700" />
                    <div>
                      <span className="block text-sm font-bold text-slate-900">{channel.label}</span>
                      <span className="text-xs text-slate-600 break-all">{channel.value}</span>
                    </div>
                  </a>
                </Reveal>
              ))}

              <Reveal delay={280}>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <h2 className="flex items-center gap-2.5 text-sm font-bold text-slate-900">
                    <Icon name="FaLocationDot" className="text-brand-700" /> Offices
                  </h2>
                  <ul className="mt-4 space-y-4">
                    {locations.map((location) => (
                      <li key={location.city}>
                        <span className="block text-sm font-bold text-slate-900">
                          {location.city}
                        </span>
                        <span className="block text-xs text-slate-600">{location.address}</span>
                        <span className="block text-[11px] text-slate-500">{location.note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={340}>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <h2 className="flex items-center gap-2.5 text-sm font-bold text-slate-900">
                    <Icon name="FaClock" className="text-brand-700" /> Working hours
                  </h2>
                  <dl className="mt-4 space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between gap-4">
                      <dt>Monday – Saturday</dt>
                      <dd className="font-semibold text-slate-900">10:00 – 19:00 IST</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Sunday</dt>
                      <dd className="font-semibold text-slate-900">Closed</dd>
                    </div>
                  </dl>
                  <p className="mt-4 border-t border-slate-200 pt-3 text-[11px] leading-relaxed text-slate-500">
                    Existing customers with a support agreement can reach their account manager
                    outside these hours.
                  </p>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
