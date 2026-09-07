import Image from "next/image";
import { FaCalendarCheck, FaClipboardCheck, FaHeadset, FaUserTie } from "react-icons/fa6";
import { DemoButton } from "@/components/demo-modal";

const services = [
  {
    Icon: FaUserTie,
    title: "Executive & Leadership Search",
    blurb:
      "Headhunting leadership talent and functional department heads who align with your company vision and execute strategy.",
  },
  {
    Icon: FaHeadset,
    title: "Sales & Revenue Talent",
    blurb:
      "Proven B2B sales reps, SDRs, and closing executives rigorously vetted for past quota attainment and revenue performance.",
  },
  {
    Icon: FaClipboardCheck,
    title: "Candidate Background Audits",
    blurb:
      "Employment history cross-checks, credential verification, and risk management auditing for corporate integrity.",
  },
];

const pipeline = [
  "Requirement",
  "Sourcing",
  "Screening",
  "Interview",
  "Verification",
  "Onboarding",
];

export function Hiring() {
  return (
    <section id="hiring" className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16" data-reveal="up">
          <span className="text-xs font-bold tracking-widest text-brand-800 uppercase">
            Talent Acquisition
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-2">
            Build Teams That Move Your Business Forward
          </h2>
          <p className="text-slate-600 mt-4 text-sm md:text-base">
            From finding candidates to building high-performing teams, Nova Pulse supports
            businesses throughout the hiring process.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <div className="lg:col-span-6 order-2 lg:order-1 space-y-4">
            {services.map(({ Icon, title, blurb }) => (
              <div key={title} className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-sm shrink-0">
                    <Icon  />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{blurb}</p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white p-3 shadow-xl group">
              <Image
                src="/images/hiring.webp"
                alt="Nova Pulse corporate recruitment, candidate interviewing, and executive hiring process"
                width={1400}
                height={933}
                sizes="(min-width: 1024px) 600px, 100vw"
                className="w-full h-auto rounded-2xl object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="p-4 bg-slate-50/90 backdrop-blur mt-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-700 animate-pulse" />
                  <span className="text-xs font-bold text-slate-900">
                    Vetted Candidate Sourcing Pipeline
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500">
                  Quality-First Matching
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 mb-12">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-800 mb-6 text-center">
            Structured Recruitment Pipeline
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            {pipeline.map((stage, i) => (
              <div key={stage} className="bg-white p-3.5 rounded-xl border border-slate-200">
                <div className="text-xs font-mono font-bold text-brand-700 mb-1">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="font-bold text-xs text-slate-900">{stage}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <DemoButton
            service="Hiring & Recruitment"
            source="hiring-section"
            className="px-8 py-4 bg-brand-800 hover:bg-brand-900 text-white font-bold rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
          >
            <FaCalendarCheck className="text-brand-200" /> Discuss Your Hiring Needs
          </DemoButton>
        </div>
      </div>
    </section>
  );
}
