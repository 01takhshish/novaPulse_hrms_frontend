import { FaCircleCheck } from "react-icons/fa6";
import { DemoButton } from "@/components/demo-modal";

/** Bespoke line-art marks carried over verbatim from the legacy markup. */
const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "w-16 h-16 text-brand-700",
  "aria-hidden": true,
};

const devices = [
  {
    art: (
      <svg {...svgProps}>
        <path d="M12 12c0-3 2.5-5 5-5v0a5 5 0 0 1 5 5v4a5 5 0 0 1-5 5c-4 0-7-3-7-7v-3a7 7 0 0 0-7-7" />
        <path d="M5 14v1a7 7 0 0 0 7 7" />
        <path d="M9 13v1a3 3 0 0 0 3 3" />
      </svg>
    ),
    title: "FaFingerprint Attendance",
    blurb:
      "High-speed optical biometric scanners with real-time push data protocols for error-free clock-ins.",
    tag: "Fast Clock-In",
  },
  {
    art: (
      <svg {...svgProps}>
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 16v1" />
      </svg>
    ),
    title: "Face Recognition",
    blurb:
      "Touchless AI-powered facial recognition machines for rapid verification, even in low-light environments.",
    tag: "Contactless Capture",
  },
  {
    art: (
      <svg {...svgProps}>
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
        <circle cx="7" cy="15" r="1" />
      </svg>
    ),
    title: "RFID & Smart Cards",
    blurb:
      "Proximity card solutions tailored for factories, corporate facilities, and rapid batch shift changes.",
    tag: "High-Throughput Shifts",
  },
  {
    art: (
      <svg {...svgProps}>
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="M12 12v9" />
        <path d="m16 16-4-4-4 4" />
      </svg>
    ),
    title: "Cloud Synchronization",
    blurb:
      "Automatic Wi-Fi, LAN, or 4G data push directly into central HRMS without manual pen-drive extraction.",
    tag: "Zero Manual Effort",
  },
];

export function Biometrics() {
  return (
    <section id="biometrics" className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16" data-reveal="up">
          <span className="text-xs font-bold tracking-widest text-brand-800 uppercase">
            Hardware &amp; Device Ecosystem
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-2">
            Smart Biometric Attendance
          </h2>
          <p className="text-slate-600 mt-4 text-sm md:text-base">
            Capture accurate employee attendance and connect it seamlessly with your HRMS and
            payroll workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {devices.map((device, i) => (
            <div
              key={device.title}
              data-reveal="up"
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
              className="lift tilt p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-500 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="h-36 w-full rounded-xl bg-purple-50/80 border border-purple-100 flex items-center justify-center mb-4 text-brand-800 group-hover:scale-102 transition-transform">
                  {device.art}
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">{device.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{device.blurb}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] font-bold text-brand-800 flex items-center gap-1.5">
                <FaCircleCheck className="text-emerald-500" /> {device.tag}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-slate-900 to-brand-950 p-8 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div>
            <h3 className="text-xl font-bold">
              Need assistance with biometric machine setup or integration?
            </h3>
            <p className="text-slate-300 text-xs mt-1">
              We assist with device procurement, LAN configuration, cloud setup, and HRMS payroll
              mapping.
            </p>
          </div>
          <DemoButton
            service="Biometric Attendance"
            source="biometrics-banner"
            className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm rounded-xl shadow-md transition-all whitespace-nowrap"
          >
            Explore Biometric Solutions
          </DemoButton>
        </div>
      </div>
    </section>
  );
}
