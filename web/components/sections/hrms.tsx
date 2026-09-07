import Image from "next/image";
import {
  FaCalendarCheck,
  FaCalculator,
  FaFileInvoice,
  FaNetworkWired,
  FaChartPie,
  FaServer,
  FaUser,
  FaUsers,
  FaFingerprint,
} from "react-icons/fa6";
import { DemoButton } from "@/components/demo-modal";

const features = [
  {
    Icon: FaUsers,
    title: "Employee Lifecycle Management",
    blurb:
      "Centralized digital onboarding records, structured departmental hierarchies, leave approvals, and employee self-service.",
  },
  {
    Icon: FaCalculator,
    title: "Automated Payroll Systems",
    blurb:
      "Eliminate calculation delays. Real-time sync with biometric logs handles PF, ESI, tax deductions, and generates salary slips.",
  },
  {
    Icon: FaNetworkWired,
    title: "Multi-Branch Architecture",
    blurb:
      "Consolidate attendance and shift schedules across multiple branches, warehouses, or stores into one central management dashboard.",
  },
];

const workflow = [
  { Icon: FaUser, step: "1. Employee", detail: "FaCheck-in / Out" },
  { Icon: FaFingerprint, step: "2. Biometric", detail: "Face / Finger / RFID" },
  { Icon: FaServer, step: "3. HRMS Sync", detail: "Real-Time Cloud Push" },
  { Icon: FaCalendarCheck, step: "4. Leaves & Shifts", detail: "Auto Deductions" },
  { Icon: FaFileInvoice, step: "5. Payroll Run", detail: "1-Click Salary Slips" },
  { Icon: FaChartPie, step: "6. Reports", detail: "Statutory Tax Logs" },
];

export function Hrms() {
  return (
    <section id="workforce-hrms" className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16" data-reveal="up">
          <span className="text-xs font-bold tracking-widest text-brand-800 uppercase">
            Flagship Platform
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-2">
            One Workforce. One Connected System.
          </h2>
          <p className="text-slate-600 mt-4 text-sm md:text-base">
            Connect employee attendance, HRMS, and payroll into one streamlined, error-free
            workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white p-3 shadow-xl group">
              <Image
                src="/images/hrms-payroll.webp"
                alt="Nova Pulse HRMS employee attendance and payroll management software interface"
                width={1400}
                height={863}
                sizes="(min-width: 1024px) 600px, 100vw"
                className="w-full h-auto rounded-2xl object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="p-4 bg-slate-50/90 backdrop-blur mt-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-700 animate-pulse" />
                  <span className="text-xs font-bold text-slate-900">
                    Workforce &amp; Payroll Intelligence
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500">
                  Automated Month-End Slips
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            {features.map(({ Icon, title, blurb }) => (
              <div key={title} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
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
        </div>

        <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-md mb-12">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-800 mb-6 text-center">
            Connected Workforce Architecture
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            {workflow.map(({ Icon, step, detail }) => (
              <div key={step} className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center mx-auto mb-2 font-bold text-sm">
                  <Icon  />
                </div>
                <div className="font-bold text-xs text-slate-900">{step}</div>
                <div className="text-[11px] text-slate-500">{detail}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <DemoButton
            service="HRMS & Payroll"
            source="hrms-section"
            className="px-8 py-4 bg-brand-800 hover:bg-brand-900 text-white font-bold rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
          >
            <FaCalendarCheck className="text-brand-200" /> Book an HRMS Demo
          </DemoButton>
        </div>
      </div>
    </section>
  );
}
