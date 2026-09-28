import type { Metadata } from "next";
import { FaCalendarCheck, FaCheck, FaPhone, FaWhatsapp } from "react-icons/fa6";
import { DemoButton } from "@/components/demo-modal";
import { Icon } from "@/components/icon";
import { PageHero } from "@/components/page-hero";
import {
  customPlanPoints,
  pricingIntro,
  pricingNote,
  quoteFactors,
} from "@/content/pricing";
import { site } from "@/lib/site";
import { btnPrimary, btnPrimaryOnDark, btnSecondary } from "@/lib/ui/button";

export const metadata: Metadata = {
  title: "HRMS Pricing & Custom Plans",
  description:
    "NovaPulse HRMS plans are scoped to your business — HR, attendance, biometric integration and payroll for growing Indian businesses. Tell us your headcount and requirements and we'll send a written proposal.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="NovaPulse HRMS Plans"
        title="A plan built"
        highlight="around your business"
        intro={pricingIntro}
        crumbs={[{ href: "/", label: "Home" }, { label: "Pricing" }]}
        align="center"
      />

      <section className="pb-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10" data-reveal="up">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              What shapes your plan
            </h2>
            <p className="text-sm text-slate-600 mt-3 max-w-2xl mx-auto leading-relaxed">
              A short call covers these six points. After that you get a written proposal with
              exact numbers — nothing hidden, nothing to negotiate later.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {quoteFactors.map((factor) => (
              <div
                key={factor.title}
                data-reveal="up"
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center mb-4">
                  <Icon name={factor.icon} />
                </div>
                <h3 className="font-bold text-slate-900">{factor.title}</h3>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{factor.blurb}</p>
              </div>
            ))}
          </div>

          <div
            data-reveal="up"
            className="mt-10 rounded-3xl bg-slate-900 text-white p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          >
            <div>
              <h2 className="text-2xl font-extrabold">Already set up for</h2>
              <p className="text-sm text-slate-300 mt-1">
                Requirements we handle as standard
              </p>
              <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-slate-200">
                {customPlanPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <FaCheck className="text-brand-300 mt-1 shrink-0 text-xs" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-slate-300 mb-5 leading-relaxed">
                Tell us your workforce size and requirements. We&apos;ll come back with a plan
                built around your business.
              </p>
              <DemoButton
                service="HRMS & Payroll"
                source="pricing-page-custom"
                className={btnPrimaryOnDark}
              >
                Connect With Us
              </DemoButton>
            </div>
          </div>

          <p className="mt-8 max-w-3xl mx-auto text-xs text-slate-500 text-center leading-relaxed">
            {pricingNote}
          </p>

          <div className="mt-12 text-center flex flex-col sm:flex-row justify-center items-center gap-4">
            <DemoButton
              service="HRMS & Payroll"
              source="pricing-page-cta"
              className={btnPrimary}
            >
              <FaCalendarCheck className="text-brand-200" /> Book a Free Demo
            </DemoButton>
            <a
              href={site.whatsappWithMessage}
              target="_blank"
              rel="noopener"
              className={btnSecondary}
            >
              <FaWhatsapp className="w-5 h-5 text-emerald-600" /> Talk to an HRMS Expert
            </a>
            <a
              href={site.phoneHref}
              className={btnSecondary}
            >
              <FaPhone className="w-4 h-4 text-brand-700" /> {site.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
