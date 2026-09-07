import { FaCircleCheck, FaDoorClosed, FaUserShield, FaVideo } from "react-icons/fa6";

const capabilities = [
  {
    Icon: FaVideo,
    title: "CCTV Surveillance",
    blurb:
      "High-definition IP cameras, NVR infrastructure, and remote mobile viewing systems for 24/7 corporate workplace protection.",
    tag: "Multi-Camera Scalability",
  },
  {
    Icon: FaDoorClosed,
    title: "Access Control Systems",
    blurb:
      "Electromagnetic door locks, turnstiles, and restricted server room access tied to employee biometrics or smart cards.",
    tag: "Role-Based Entry Protocols",
  },
  {
    Icon: FaUserShield,
    title: "Visitor Management",
    blurb:
      "Digital badge generation, visitor logging, and entry verification to keep company facilities protected from unauthorized entry.",
    tag: "Digital Logbook Tracking",
  },
];

export function Security() {
  return (
    <section id="security" className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16" data-reveal="up">
          <span className="text-xs font-bold tracking-widest text-brand-800 uppercase">
            Premises Protection
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-2">
            Complete Workforce Security
          </h2>
          <p className="text-slate-600 mt-4 text-sm md:text-base">
            Secure your workplace while keeping workforce information connected, monitored, and
            accessible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {capabilities.map(({ Icon, title, blurb, tag }, i) => (
            <div
              key={title}
              data-reveal="up"
              style={{ "--reveal-delay": `${i * 110}ms` } as React.CSSProperties}
              className="lift p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-brand-400 hover:shadow-xl"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-brand-800 flex items-center justify-center text-xl font-bold mb-5">
                  <Icon  />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{blurb}</p>
              </div>
              <div className="text-xs text-brand-800 font-semibold flex items-center gap-1.5">
                <FaCircleCheck className="text-emerald-500" /> {tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
