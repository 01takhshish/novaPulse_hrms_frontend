import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";

/**
 * Structural facts about the offering, not performance claims — each number is
 * something you can point at on this site. Replace with measured metrics only
 * when you have them.
 */
const stats = [
  { value: 5, label: "Service lines", detail: "Hire, secure and grow, from one partner" },
  { value: 5, label: "Sectors deployed in", detail: "Factory floors to campuses" },
  { value: 3, label: "Biometric modes", detail: "Face, fingerprint and RFID" },
  { value: 2, label: "Offices", detail: "Delhi NCR and Uttar Pradesh" },
];

export function StatsBand() {
  return (
    <section className="relative overflow-hidden border-y border-slate-800 bg-slate-900 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(107,33,168,0.55),transparent_55%)]" />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
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
