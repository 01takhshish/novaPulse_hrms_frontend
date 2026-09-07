import { FaBullseye, FaCalendarCheck, FaChartLine, FaCheck, FaFingerprint, FaShieldHalved, FaUserCheck, FaUserTie, FaUsersGear, FaWhatsapp } from "react-icons/fa6";
import { Counter } from "@/components/motion/counter";
import { DemoButton } from "@/components/demo-modal";
import { site } from "@/lib/site";

const heroProof = [
  "Live Cloud Integration",
  "Verified Hardware Compatibility",
  "Multi-Location Deployment",
];

const valueMatrix = [
  { Icon: FaUsersGear, title: "Workforce Tech", blurb: "Automated HRMS & Payroll" },
  { Icon: FaFingerprint, title: "Biometric Devices", blurb: "Hardware & Cloud Sync" },
  { Icon: FaUserTie, title: "Talent Search", blurb: "Executive & Sales Hiring" },
  { Icon: FaBullseye, title: "Sales Pipelines", blurb: "Targeted B2B Lead Engines" },
];

export function Hero() {
  return (
    <section
      id="hero"
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-purple-100/60 via-slate-50 to-slate-50"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#e9d5ff,transparent_65%)]" />
      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-brand-100 text-brand-900 border border-brand-200 mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-700 animate-pulse" />
              Hire. Secure. Grow.
            </div>

            <h1 className="text-4xl/10 md:text-5xl/none lg:text-6xl/none font-extrabold tracking-tight text-slate-900 mb-6">
              The Pulse of Every
              <br />
              <span className="bg-gradient-to-r from-brand-900 via-purple-800 to-brand-700 bg-clip-text text-transparent">
                Growing Business
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Hire better. Secure your operations. Grow your business with integrated HRMS,
              biometric attendance, security, recruitment, and B2B growth solutions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-10">
              <DemoButton
                service="General Inquiry"
                source="hero"
                className="px-8 py-4 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-bold text-base transition-all shadow-lg shadow-brand-900/20 hover:scale-102 w-full sm:w-auto inline-flex items-center justify-center gap-2"
              >
                <FaCalendarCheck className="text-brand-200" /> Book a Free Demo
              </DemoButton>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener"
                className="px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-base transition-all shadow-sm w-full sm:w-auto inline-flex items-center justify-center gap-2"
              >
                <FaWhatsapp className="w-5 h-5 text-emerald-600" /> Talk to an Expert
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
              {heroProof.map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <FaCheck className="text-emerald-600 font-bold" /> {item}
                </div>
              ))}
            </div>
          </div>

          {/* Platform mockup */}
          <div className="lg:col-span-5">
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200 p-5 shadow-2xl overflow-hidden hover:shadow-brand-900/10 transition-shadow">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-[11px] font-bold text-slate-400 ml-2">
                    Nova Pulse Workspace Hub
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-50 text-brand-800 font-bold">
                  Live Sync
                </span>
              </div>

              <div className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <div className="text-[11px] text-slate-500">Biometric Attendance</div>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5">
                      <Counter to={99.4} decimals={1} suffix="% On-Time" />
                    </div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-1">
                      <FaChartLine  /> Real-time sync
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <div className="text-[11px] text-slate-500">Payroll Processing</div>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5">1-Click Ready</div>
                    <div className="text-[10px] text-brand-800 font-bold mt-1 inline-flex items-center gap-1">
                      <FaShieldHalved  /> Zero errors
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-brand-50/70 rounded-xl border border-brand-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-800 text-white flex items-center justify-center text-xs">
                      <FaFingerprint  />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Device LAN/Cloud Log</div>
                      <div className="text-[10px] text-slate-500">Face Recognition • Push active</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Connected
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-brand-800 flex items-center justify-center text-xs">
                      <FaUserCheck  />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Sales &amp; Leadership Pipeline
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Candidate verification &amp; qualification
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto pt-10 border-t border-slate-200/80 text-left">
          {valueMatrix.map(({ Icon, title, blurb }) => (
            <div
              key={title}
              className="lift bg-white/90 backdrop-blur p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-400 hover:shadow-lg"
            >
              <Icon className="text-brand-800 text-lg mb-1" />
              <div className="font-bold text-sm text-slate-900">{title}</div>
              <div className="text-xs text-slate-500">{blurb}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
