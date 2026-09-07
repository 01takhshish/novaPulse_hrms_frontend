import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

const capabilities = [
  { title: "Hire", blurb: "Executive & Sales Recruitment" },
  { title: "Secure", blurb: "HRMS, Biometrics, Payroll, CCTV" },
  { title: "Grow", blurb: "B2B Outbound & Sales Pipelines" },
];

export function About() {
  return (
    <section id="about" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-6">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-purple-100 via-purple-50 to-slate-100 border border-brand-200 shadow-md">
          <span className="text-xs font-bold tracking-widest text-brand-800 uppercase block mb-2">
            About The Company
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4">
            About Nova Pulse
          </h2>
          <p className="text-slate-700 leading-relaxed text-sm md:text-base mb-6">
            Nova Pulse helps growing businesses manage their workforce, secure their operations,
            hire the right people, and build a stronger sales pipeline through technology and
            business solutions.
          </p>
          <Link
            href="/about"
            className="link-underline mb-8 inline-flex items-center gap-2 py-1.5 text-sm font-bold text-brand-800"
          >
            Read the full story <FaArrowRight className="text-xs" />
          </Link>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-brand-200/80 text-xs">
            {capabilities.map(({ title, blurb }) => (
              <div key={title}>
                <span className="font-bold text-slate-900 block">{title}</span>
                <span className="text-slate-600">{blurb}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
