import { DemoButton } from "@/components/demo-modal";
import { site } from "@/lib/site";
import { btnPrimaryOnDark, btnSecondaryOnDark } from "@/lib/ui/button";

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
            className={`${btnPrimaryOnDark} w-full sm:w-auto`}
          >
            Book a Free Demo
          </DemoButton>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener"
            className={`${btnSecondaryOnDark} w-full sm:w-auto`}
          >
            Talk to an Expert
          </a>
        </div>
      </div>
    </section>
  );
}
