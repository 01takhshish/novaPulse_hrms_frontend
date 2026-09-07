import { FaAward, FaFileInvoice, FaShieldHalved } from "react-icons/fa6";
import { site } from "@/lib/site";

const credentials = [
  { Icon: FaAward, tone: "text-emerald-400", title: "Govt. Recognized MSME", detail: site.msme },
  { Icon: FaFileInvoice, tone: "text-blue-400", title: "GST Registered Entity", detail: site.gstin },
  { Icon: FaShieldHalved, tone: "text-purple-400", title: "Enterprise Security Audit", detail: "Verified Deployment" },
];

export function TrustStrip() {
  return (
    <section className="py-8 bg-slate-900 text-white border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold tracking-widest text-brand-400 uppercase block">
              Government &amp; Corporate Compliance
            </span>
            <h2 className="text-base md:text-lg font-bold text-slate-100">
              Verified Commercial Infrastructure
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4 md:gap-8 text-xs">
            {credentials.map(({ Icon, tone, title, detail }) => (
              <div
                key={title}
                className="flex items-center gap-2.5 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700"
              >
                <Icon className={`${tone} text-base shrink-0`} />
                <div>
                  <span className="block font-bold text-white">{title}</span>
                  <span className="text-[11px] text-slate-400">{detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
