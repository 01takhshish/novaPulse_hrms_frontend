import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { CtaBand } from "@/components/cta-band";
import { Icon } from "@/components/icon";
import { Counter } from "@/components/motion/counter";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { credentials, leadership, locations, values } from "@/content/company";
import { getServices } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Nova Pulse helps growing businesses manage their workforce, secure operations, hire the right people and build a stronger sales pipeline — from Delhi and Mainpuri.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const services = await getServices();

  return (
    <>
      <PageHero
        eyebrow="About the company"
        title="The pulse of every"
        highlight="growing business"
        intro="Nova Pulse helps growing businesses manage their workforce, secure their operations, hire the right people, and build a stronger sales pipeline — through technology and hands-on implementation."
        crumbs={[{ href: "/", label: "Home" }, { label: "About" }]}
      />

      {/* STORY + PHOTOS */}
      <section className="border-b border-slate-200 bg-white py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 px-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
                Why we exist
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
                Five vendors, five invoices, no single answer
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
                <p>
                  Most growing businesses end up buying attendance hardware from one supplier,
                  payroll software from another, cameras from a third, and recruitment from a
                  fourth. Each works. None of them talk to each other.
                </p>
                <p>
                  So the attendance data gets exported to a spreadsheet. The employee who left last
                  month still has door access. And nobody can answer a simple question about
                  headcount without phoning four people.
                </p>
                <p>
                  We put those pieces on one employee record, and we install them ourselves. That
                  is the whole idea — and it is why implementation support, not licence resale, is
                  what we actually sell.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal variant="scale" delay={120}>
              <div className="grid grid-cols-2 gap-4">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
                  <Image src="/images/services.webp" alt="Nova Pulse consultation with a client"
                    width={700} height={466} sizes="(min-width: 1024px) 280px, 45vw"
                    className="h-auto w-full rounded-2xl object-cover" />
                </div>
                <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
                  <Image src="/images/sessions.webp" alt="Nova Pulse corporate training session"
                    width={700} height={466} sizes="(min-width: 1024px) 280px, 45vw"
                    className="h-auto w-full rounded-2xl object-cover" />
                </div>
                <div className="-mt-2 overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
                  <Image src="/images/hrms-payroll.webp" alt="Nova Pulse team at a client deployment"
                    width={700} height={466} sizes="(min-width: 1024px) 280px, 45vw"
                    className="h-auto w-full rounded-2xl object-cover" />
                </div>
                <div className="mt-2 overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
                  <Image src="/images/founder.webp" alt="Nova Pulse leadership"
                    width={700} height={933} sizes="(min-width: 1024px) 280px, 45vw"
                    className="h-auto w-full rounded-2xl object-cover" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CREDENTIALS */}
      <section className="border-b border-slate-800 bg-slate-900 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-3" step={100}>
            {credentials.map((credential) => (
              <div key={credential.label}
                className="flex items-center gap-4 rounded-2xl border border-slate-700 bg-slate-800/80 px-6 py-4">
                <Icon name={credential.icon} className="text-2xl text-brand-400" />
                <div>
                  <span className="block text-sm font-bold text-white">{credential.label}</span>
                  <span className="text-xs text-slate-400">{credential.detail}</span>
                </div>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* VALUES */}
      <section className="border-b border-slate-200 bg-slate-50 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="mx-auto mb-14 max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
              How we work
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
              What we actually optimise for
            </h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-2" step={90}>
            {values.map((value) => (
              <div key={value.title}
                className="lift h-full rounded-3xl border border-slate-200 bg-white p-8 hover:border-brand-400 hover:shadow-xl">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-xl text-brand-800">
                  <Icon name={value.icon} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{value.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{value.body}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* LEADERSHIP — renders only once content/company.ts is populated */}
      {leadership.length > 0 && (
        <section className="border-b border-slate-200 bg-white py-20">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="mb-14 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
                Leadership
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
                Who you will be working with
              </h2>
            </Reveal>
            <RevealGroup className="grid grid-cols-1 gap-8 md:grid-cols-3" step={100}>
              {leadership.map((person) => (
                <div key={person.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
                  <Image src={person.image} alt={person.name} width={400} height={400}
                    className="mb-5 h-24 w-24 rounded-2xl object-cover" />
                  <h3 className="text-lg font-bold text-slate-900">{person.name}</h3>
                  <p className="text-xs font-bold text-brand-700">{person.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{person.bio}</p>
                </div>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {/* REACH */}
      <section className="border-b border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
                  Where we work
                </span>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
                  Delhi NCR, Uttar Pradesh, and wherever your branches are
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-slate-600">
                  Two offices, on-site deployment across northern India, and cloud systems that do
                  not care where a branch is.
                </p>
              </Reveal>
              <Reveal delay={120}>
                <div className="mt-8 grid grid-cols-3 gap-6 border-t border-slate-200 pt-6">
                  <Stat value={services.length} label="Service lines" />
                  <Stat value={locations.length} label="Offices" />
                  <Stat value={6} label="Named clients" />
                </div>
              </Reveal>
            </div>
            <div className="space-y-4 lg:col-span-7">
              {locations.map((location, i) => (
                <Reveal key={location.city} delay={i * 100}>
                  <div className="lift rounded-3xl border border-slate-200 bg-white p-7">
                    <div className="flex items-start gap-4">
                      <Icon name="FaLocationDot" className="mt-0.5 text-xl text-brand-700" />
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{location.city}</h3>
                        <p className="mt-1 text-sm text-slate-600">{location.address}</p>
                        <p className="mt-2 text-xs text-slate-500">{location.note}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
              <Reveal delay={200}>
                <Link href="/contact"
                  className="link-underline inline-flex items-center gap-2 py-1.5 text-sm font-bold text-brand-800">
                  Contact the team <FaArrowRight className="text-xs" />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        source="about-cta"
        title="Want to see how the pieces fit?"
        body={`Tell us what you run today and we'll show you what a connected deployment looks like. Or just call ${site.phone}.`}
      />
    </>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="text-3xl font-extrabold text-slate-900">
        <Counter to={value} />
      </div>
      <div className="mt-1 text-xs text-slate-500">{label}</div>
    </div>
  );
}
