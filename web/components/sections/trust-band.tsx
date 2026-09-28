import { FaAward, FaFileInvoice } from "react-icons/fa6";
import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/lib/site";

/**
 * Registration credentials plus the structural facts about the offering, in one
 * dark band. These were two adjacent slate-900 sections; a visitor read them as
 * one anyway, and merging them removes a seam and a heading.
 *
 * Only credentials with a number you can verify are listed here. The stats are
 * structural facts — each is something you can point at elsewhere on this site,
 * not a performance claim. Replace with measured metrics only when you have them.
 */
const credentials = [
  { Icon: FaAward, tone: "text-emerald-400", title: "Govt. recognised MSME", detail: site.msme },
  { Icon: FaFileInvoice, tone: "text-blue-400", title: "GST registered entity", detail: site.gstin },
];

const stats = [
  { value: 5, label: "Service lines", detail: "Hire, secure and grow, from one partner" },
  { value: 5, label: "Sectors deployed in", detail: "Factory floors to campuses" },
  { value: 3, label: "Biometric modes", detail: "Face, fingerprint and RFID" },
  { value: 2, label: "Offices", detail: "Delhi NCR and Uttar Pradesh" },
];

export function TrustBand() {
  return (
    <section className="relative overflow-hidden border-y border-slate-800 bg-slate-900 py-14 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(107,33,168,0.55),transparent_55%)]" />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-5 lg:flex-row">
          <div>
            <span className="block text-xs font-bold uppercase tracking-widest text-brand-400">
              Government &amp; corporate compliance
            </span>
            <h2 className="text-base font-bold text-slate-100 md:text-lg">
              Verified commercial infrastructure
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            {credentials.map(({ Icon, tone, title, detail }) => (
              <div
                key={title}
                className="flex items-center gap-2.5 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2"
              >
                <Icon className={`${tone} shrink-0 text-base`} />
                <div>
                  <span className="block font-bold text-white">{title}</span>
                  <span className="text-[11px] text-slate-400">{detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 border-t border-slate-800 pt-12 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 100} className="text-center">
              <div className="text-4xl font-extrabold text-white md:text-5xl">
                <Counter to={stat.value} />
              </div>
              <div className="mt-2 text-sm font-bold text-brand-400">{stat.label}</div>
              <div className="mt-1 text-xs leading-snug text-slate-400">{stat.detail}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
