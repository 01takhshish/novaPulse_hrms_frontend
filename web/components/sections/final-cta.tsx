import { DemoButton } from "@/components/demo-modal";
import { site } from "@/lib/site";

export function FinalCta() {
  return (
    <section className="py-20 bg-slate-900 text-white text-center">
      <div className="max-w-4xl mx-auto px-6">
        <span className="text-xs font-bold tracking-widest text-brand-400 uppercase mb-3 block">
          Ready to Scale Your Operations?
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
          Ready to Build a Smarter Business?
        </h2>
        <p className="text-slate-300 max-w-xl mx-auto mb-10 text-sm md:text-base leading-relaxed">
          Let&rsquo;s discuss your HRMS, biometric, security, hiring, or growth requirements with
          our product specialists.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <DemoButton
            service="General Inquiry"
            source="final-cta"
            className="px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-base transition-all shadow-lg w-full sm:w-auto"
          >
            Book a Free Demo
          </DemoButton>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener"
            className="px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-base transition-all w-full sm:w-auto"
          >
            Talk to an Expert
          </a>
        </div>
      </div>
    </section>
  );
}
