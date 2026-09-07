import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion/reveal";

const steps = [
  {
    icon: "FaClipboardCheck",
    title: "Understand",
    blurb:
      "We audit your current workforce tools, security gaps, hiring pipeline, or lead generation requirements.",
  },
  {
    icon: "FaBullseye",
    title: "Recommend",
    blurb:
      "We curate the right HRMS configuration, biometric hardware models, staffing criteria, or lead engine.",
  },
  {
    icon: "FaScrewdriverWrench",
    title: "Implement",
    blurb:
      "End-to-end system configuration, machine LAN setup, payroll rules mapping, and staff onboarding.",
  },
  {
    icon: "FaHeadset",
    title: "Support",
    blurb:
      "Dedicated account manager for ongoing technical assistance, hardware maintenance, and campaign tuning.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-b border-slate-200 bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div data-reveal="up" className="mx-auto mb-16 max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
            Seamless execution
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">How it works</h2>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            A structured four-step framework from first consultation to full deployment.
          </p>
        </div>

        <div className="relative">
          {/* Connector, drawn only where the steps sit side by side */}
          <div
            aria-hidden="true"
            className="absolute left-[12.5%] right-[12.5%] top-9 hidden h-0.5 md:block"
          >
            <div className="np-connector h-full w-full rounded-full bg-gradient-to-r from-brand-200 via-brand-500 to-brand-200" />
          </div>

          <ol className="relative grid grid-cols-1 gap-8 md:grid-cols-4">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 110} className="text-center">
                <div className="mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-2xl border-4 border-white bg-brand-100 text-2xl text-brand-800 shadow-lg shadow-brand-900/10">
                  <Icon name={step.icon} />
                </div>
                <div className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-brand-700">
                  Step {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-600">
                  {step.blurb}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
