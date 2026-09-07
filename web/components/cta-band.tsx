import { FaArrowRight } from "react-icons/fa6";
import { DemoButton } from "@/components/demo-modal";
import { Reveal } from "@/components/motion/reveal";
import { site, type Service } from "@/lib/site";

/** The closing conversion block. Same shape on every secondary page. */
export function CtaBand({
  title,
  body,
  service = "General Inquiry",
  source,
  cta = "Book a free demo",
}: {
  title: string;
  body: string;
  service?: Service;
  source: string;
  cta?: string;
}) {
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal variant="scale">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 p-10 text-center md:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.35),transparent_60%)]" />
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold text-white md:text-4xl">{title}</h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-purple-200 md:text-base">
                {body}
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <DemoButton
                  service={service}
                  source={source}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-brand-900 shadow-lg transition-transform hover:scale-102 sm:w-auto"
                >
                  {cta} <FaArrowRight className="text-xs" />
                </DemoButton>
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-white/25 px-8 py-4 text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
                >
                  WhatsApp us
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
