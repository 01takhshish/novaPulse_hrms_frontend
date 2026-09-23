import type { Metadata } from "next";
import { FaCalendarCheck, FaCheck, FaWhatsapp } from "react-icons/fa6";
import { DemoButton } from "@/components/demo-modal";
import { PageHero } from "@/components/page-hero";
import { customPlanPoints, hrmsPlans, pricingDisclaimer } from "@/content/pricing";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "HRMS Pricing & Plans",
  description:
    "NovaPulse HRMS plans from ₹799/month — HR, attendance, biometric integration and payroll for growing Indian businesses. MSME, Growth, Professional and custom enterprise plans.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="NovaPulse HRMS Pricing"
        title="Plans that grow"
        highlight="with your business"
        intro="Simple, transparent plans for teams of every size — upgrade as your workforce grows."
        crumbs={[{ href: "/", label: "Home" }, { label: "Pricing" }]}
        align="center"
      />

      <section className="pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {hrmsPlans.map((plan) => (
              <div
                key={plan.id}
                data-reveal="up"
                className={`relative rounded-3xl border p-7 flex flex-col bg-white ${
                  plan.popular
                    ? "border-brand-800 shadow-xl shadow-brand-900/10"
                    : "border-slate-200 shadow-sm"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-brand-800 text-white text-[10px] font-bold uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                <h2 className="font-extrabold text-slate-900 text-xl">{plan.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{plan.blurb}</p>
                <div className="mt-5">
                  <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                  <span className="text-sm text-slate-500 font-medium"> / month</span>
                </div>
                <p className="text-xs font-bold text-brand-800 mt-2">{plan.limit}</p>
                <p className="text-[11px] text-slate-500">{plan.extra}</p>
                <ul className="mt-5 space-y-2.5 text-sm text-slate-700 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <FaCheck className="text-brand-700 mt-1 shrink-0 text-xs" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <DemoButton
                  service="HRMS & Payroll"
                  source={`pricing-page-${plan.id}`}
                  className={`mt-7 w-full py-3.5 rounded-xl text-sm font-bold transition-colors ${
                    plan.popular
                      ? "bg-brand-800 hover:bg-brand-900 text-white shadow-md shadow-brand-900/20"
                      : "border border-brand-800 text-brand-800 hover:bg-brand-50"
                  }`}
                >
                  Book a Demo
                </DemoButton>
              </div>
            ))}
          </div>

          <div
            data-reveal="up"
            className="mt-8 max-w-5xl mx-auto rounded-3xl bg-slate-900 text-white p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          >
            <div>
              <h2 className="text-2xl font-extrabold">Custom Plan</h2>
              <p className="text-sm text-slate-300 mt-1">Built Around Your Business</p>
              <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-slate-200">
                {customPlanPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <FaCheck className="text-brand-300 mt-1 shrink-0 text-xs" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-slate-300 mb-5">
                Tell us your workforce size and requirements. We&apos;ll create a plan around
                your business.
              </p>
              <DemoButton
                service="HRMS & Payroll"
                source="pricing-page-custom"
                className="px-7 py-3.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-sm font-bold transition-colors"
              >
                Get Custom Quote
              </DemoButton>
            </div>
          </div>

          <p className="mt-8 max-w-3xl mx-auto text-xs text-slate-500 text-center leading-relaxed">
            {pricingDisclaimer}
          </p>

          <div className="mt-12 text-center flex flex-col sm:flex-row justify-center items-center gap-4">
            <DemoButton
              service="HRMS & Payroll"
              source="pricing-page-cta"
              className="px-8 py-4 bg-brand-800 hover:bg-brand-900 text-white font-bold rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
            >
              <FaCalendarCheck className="text-brand-200" /> Book a Free Demo
            </DemoButton>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener"
              className="px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold transition-all inline-flex items-center gap-2"
            >
              <FaWhatsapp className="w-5 h-5 text-emerald-600" /> Talk to an HRMS Expert
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
