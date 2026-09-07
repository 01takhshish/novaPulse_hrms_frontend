import { FaCubes, FaBriefcase, FaMicrochip, FaHeadset, FaChartLine, FaScrewdriverWrench } from "react-icons/fa6";

const reasons = [
  {
    Icon: FaCubes,
    title: "One Business Partner",
    blurb:
      "Workforce software, biometric hardware, security, hiring, and sales pipelines all in one ecosystem.",
  },
  {
    Icon: FaMicrochip,
    title: "Technology Focused",
    blurb:
      "Modern HRMS platforms, cloud-synced biometrics, and secure encrypted compliance architecture.",
  },
  {
    Icon: FaScrewdriverWrench,
    title: "Implementation Support",
    blurb:
      "We don't just sell licenses; we handle device installation, LAN configuration, and payroll rules setup.",
  },
  {
    Icon: FaBriefcase,
    title: "Business First",
    blurb:
      "Designed around tangible business ROI: reduced payroll errors, tighter security, and stronger sales pipelines.",
  },
  {
    Icon: FaChartLine,
    title: "Scalable for Growth",
    blurb:
      "Built to adapt seamlessly whether you have 15 employees in one office or 500+ staff across regional branches.",
  },
  {
    Icon: FaHeadset,
    title: "Dedicated Support",
    blurb:
      "Direct human assistance for ongoing support, software queries, and hardware maintenance.",
  },
];

export function WhyUs() {
  return (
    <section id="why-us" className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16" data-reveal="up">
          <span className="text-xs font-bold tracking-widest text-brand-800 uppercase">
            The Nova Pulse Advantage
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-2">
            Why Businesses Choose Nova Pulse
          </h2>
          <p className="text-slate-600 mt-4 text-sm md:text-base">
            Reliable technology integration and commercial execution designed for long-term
            operational success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map(({ Icon, title, blurb }, i) => (
            <div key={title}
              data-reveal="up"
              style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
              className="lift bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-400 hover:shadow-lg">
              <Icon className="text-brand-800 text-2xl mb-3" />
              <h3 className="font-bold text-slate-900 text-base mb-1">{title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{blurb}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
