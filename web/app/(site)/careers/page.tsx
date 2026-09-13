import type { Metadata } from "next";
import Image from "next/image";
import { Icon } from "@/components/icon";
import { LeadForm } from "@/components/lead-form";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { careerReasons, locations, openRoles } from "@/content/company";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Work at Nova Pulse — deployment, sales and support roles across HRMS, biometric hardware, workplace security and B2B growth, in Delhi NCR and Uttar Pradesh.",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Small team,"
        highlight="real deployments"
        intro="We install the systems we sell. That means the people here do more than one job — and see the whole arc from first conversation to a working system on a client's floor."
        crumbs={[{ href: "/", label: "Home" }, { label: "Careers" }]}
      />

      <section className="border-b border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-3" step={100}>
            {careerReasons.map((reason) => (
              <div key={reason.title}
                className="lift h-full rounded-3xl border border-slate-200 bg-slate-50 p-8 hover:border-brand-400 hover:shadow-xl">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-xl text-brand-800">
                  <Icon name={reason.icon} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">{reason.title}</h2>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{reason.body}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* OPEN ROLES — falls back to a general application when none are listed */}
      <section className="border-b border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
              Open roles
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
              {openRoles.length > 0 ? "Currently hiring" : "No open roles right now"}
            </h2>
          </Reveal>

          {openRoles.length > 0 ? (
            <RevealGroup className="space-y-4" step={80}>
              {openRoles.map((role) => (
                <div key={role.title}
                  className="lift flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{role.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{role.summary}</p>
                    <p className="mt-2 text-xs font-semibold text-slate-500">
                      {role.location} · {role.type}
                    </p>
                  </div>
                  <a href={`mailto:${site.email}?subject=Application: ${encodeURIComponent(role.title)}`}
                    className="shrink-0 rounded-xl bg-brand-800 px-6 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-brand-900">
                    Apply
                  </a>
                </div>
              ))}
            </RevealGroup>
          ) : (
            <Reveal>
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="text-4xl" aria-hidden="true">👋</p>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  We are not advertising a specific vacancy at the moment — but we hire when we meet
                  the right person. If you work in workforce technology, security hardware,
                  recruitment or B2B sales, send us your details and we will keep them on file.
                </p>
                <p className="mt-4 text-xs text-slate-500">
                  Based in {locations.map((l) => l.city).join(" and ")}.
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* GENERAL APPLICATION */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
                  General application
                </span>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
                  Introduce yourself
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-slate-600">
                  Tell us what you do and what you would want to work on. Use the message field for
                  a short summary — if there is a fit we will ask for your CV by email rather than
                  collecting documents through this form.
                </p>
                <p className="mt-4 text-xs text-slate-500">
                  Prefer email? Write to{" "}
                  <a href={`mailto:${site.email}`}
                    className="link-underline inline-block py-1 font-semibold text-brand-800">
                    {site.email}
                  </a>
                  .
                </p>
              </Reveal>
              <Reveal delay={140} className="mt-8">
                <Image src="/images/team.webp" alt="The Nova Pulse team"
                  width={800} height={1200} sizes="(min-width: 1024px) 400px, 100vw"
                  className="h-auto w-full rounded-3xl border border-slate-200 object-cover shadow-xl" />
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={80}>
                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl md:p-10">
                  <LeadForm
                    source="careers-page"
                    companyLabel="Current company or college"
                    serviceLabel="Area of interest"
                    submitLabel="Send application"
                    messageLabel="About you"
                    messagePlaceholder="What you do now, what you'd like to work on, and anything we should look at."
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
