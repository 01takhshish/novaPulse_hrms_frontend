import { FaArrowRight, FaCircleCheck, FaShieldHalved, FaChartLine, FaUserGroup } from "react-icons/fa6";

const pillars = [
  {
    Icon: FaUserGroup,
    index: "Pillar 01",
    title: "Hire",
    subtitle: "Build the Right Team",
    blurb:
      "Find, evaluate, and place high-performing people across sales, management, executive leadership, and scalable corporate staffing.",
    bullets: [
      "Executive & Management Search",
      "B2B Sales & Revenue Hiring",
      "Candidate Audits & Verification",
    ],
    href: "/services/corporate-hiring",
    cta: "Explore Hiring",
  },
  {
    Icon: FaShieldHalved,
    index: "Pillar 02",
    title: "Secure",
    subtitle: "Manage Workforce & Safeguard Operations",
    blurb:
      "Simplify attendance and payroll while securing physical facilities with integrated biometric machines, access control, and CCTV systems.",
    bullets: [
      "HRMS & Multi-Branch Payroll",
      "Biometric Machine Hardware & Cloud Sync",
      "CCTV & Access Control Systems",
    ],
    href: "/services/hrms-payroll",
    cta: "Explore Workforce & Security",
  },
  {
    Icon: FaChartLine,
    index: "Pillar 03",
    title: "Grow",
    subtitle: "Build a Stronger Sales Pipeline",
    blurb:
      "Generate predictable B2B sales pipelines with multi-channel outbound prospecting, LinkedIn outreach, and qualified appointment setting.",
    bullets: [
      "High-Intent LinkedIn Prospecting",
      "Cold Email & Calling Pipelines",
      "Qualified Sales Appointment Setting",
    ],
    href: "/services/b2b-lead-generation",
    cta: "Explore Growth",
  },
];

export function Pillars() {
  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16" data-reveal="up">
          <span className="text-xs font-bold tracking-widest text-brand-800 uppercase">
            Strategic Capabilities
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">
            Hire. Secure. Grow.
          </h2>
          <p className="text-slate-600 mt-3 text-sm md:text-base">
            A single enterprise ecosystem built to streamline internal operations, protect
            facilities, and scale revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              data-reveal="up"
              style={{ "--reveal-delay": `${i * 110}ms` } as React.CSSProperties}
              className="lift p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-brand-500 hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-800 flex items-center justify-center text-2xl font-bold group-hover:bg-brand-800 group-hover:text-white transition-colors">
                    <pillar.Icon  />
                  </div>
                  <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">
                    {pillar.index}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{pillar.title}</h3>
                <div className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-4">
                  {pillar.subtitle}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{pillar.blurb}</p>
                <ul className="space-y-2.5 text-xs text-slate-700 font-semibold mb-8">
                  {pillar.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-2">
                      <FaCircleCheck className="text-brand-700 shrink-0" /> {bullet}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={pillar.href}
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white border border-slate-300 font-bold text-sm text-slate-900 hover:bg-brand-800 hover:text-white hover:border-brand-800 transition-all shadow-sm"
              >
                {pillar.cta} <FaArrowRight className="text-xs" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
