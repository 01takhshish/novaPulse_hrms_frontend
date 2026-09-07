"use client";

import { useMemo, useState } from "react";
import { FaArrowRight, FaClock, FaTriangleExclamation } from "react-icons/fa6";
import { DemoButton } from "@/components/demo-modal";

/**
 * Payroll effort estimator.
 *
 * Deliberately models *effort*, not money saved: the inputs are things a
 * finance lead actually knows (headcount, branches, days spent), and the
 * output is hours, so nothing here pretends to be a verified ROI figure.
 * The assumptions are stated on screen.
 */
const HOURS_PER_DAY = 8;
/** Reconciliation still needs a human; we do not claim the work goes to zero. */
const AUTOMATED_SHARE = 0.7;

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function PayrollSavings() {
  const [employees, setEmployees] = useState(150);
  const [branches, setBranches] = useState(3);
  const [days, setDays] = useState(3);

  const result = useMemo(() => {
    // Collection overhead scales with sites, not just headcount.
    const collectionHours = branches * 1.5;
    const currentHours = days * HOURS_PER_DAY + collectionHours;
    const savedHours = currentHours * AUTOMATED_SHARE;
    return {
      currentHours: Math.round(currentHours),
      savedHours: Math.round(savedHours),
      remainingHours: Math.round(currentHours - savedHours),
      yearlyDays: Math.round((savedHours * 12) / HOURS_PER_DAY),
    };
  }, [branches, days]);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Inputs */}
        <div className="p-8 md:p-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
            Estimator
          </span>
          <h3 className="mt-2 text-2xl font-extrabold text-slate-900">
            How long is month-end costing you?
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Three questions. No email required.
          </p>

          <div className="mt-8 space-y-7">
            <Slider label="Employees on payroll" value={employees} min={10} max={1000} step={10}
              onChange={setEmployees} format={(v) => inr.format(v)} />
            <Slider label="Branches or sites" value={branches} min={1} max={25} step={1}
              onChange={setBranches} format={(v) => String(v)} />
            <Slider label="Days spent on payroll each month" value={days} min={1} max={10} step={1}
              onChange={setDays} format={(v) => `${v} ${v === 1 ? "day" : "days"}`} />
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              What this assumes
            </p>
            <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-slate-600">
              <li>· An 8-hour working day.</li>
              <li>· About 1.5 hours of collection overhead per site, per month.</li>
              <li>· Automation removes roughly {Math.round(AUTOMATED_SHARE * 100)}% of routine effort.</li>
              <li>· Exceptions and reconciliation still need a person.</li>
            </ul>
          </div>
        </div>

        {/* Output */}
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 p-8 text-white md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,rgba(168,85,247,0.35),transparent_60%)]" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-400">
              <FaClock /> Estimated effort
            </div>

            <dl className="mt-6 space-y-5">
              <Stat label="Hours spent on payroll today, per month"
                value={`${result.currentHours} hrs`} tone="text-white" />
              <Stat label="Hours automation could remove, per month"
                value={`${result.savedHours} hrs`} tone="text-emerald-300" />
              <Stat label="Hours still needing a human"
                value={`${result.remainingHours} hrs`} tone="text-purple-200" />
            </dl>

            <div className="mt-7 rounded-2xl border border-white/15 bg-white/5 p-5">
              <p className="text-sm text-purple-100">
                That is roughly{" "}
                <strong className="text-2xl font-extrabold text-white">
                  {result.yearlyDays} working days
                </strong>{" "}
                a year returned to your finance team, for {inr.format(employees)} employees across{" "}
                {branches} {branches === 1 ? "site" : "sites"}.
              </p>
            </div>

            <p className="mt-5 flex items-start gap-2 text-[11px] leading-relaxed text-purple-300">
              <FaTriangleExclamation className="mt-0.5 shrink-0" />
              An estimate, not a quote. It assumes automation removes about{" "}
              {Math.round(AUTOMATED_SHARE * 100)}% of routine payroll effort and that an
              8-hour day is worked — reconciliation and exceptions still need people.
            </p>

            <DemoButton
              service="HRMS & Payroll"
              source="payroll-calculator"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-brand-900 shadow-lg transition-transform hover:scale-102 sm:w-auto"
            >
              Get an exact figure for your setup <FaArrowRight className="text-xs" />
            </DemoButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label, value, min, max, step, onChange, format,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; format: (v: number) => string;
}) {
  const id = label.replace(/\s+/g, "-").toLowerCase();
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-xs font-semibold text-slate-700">{label}</label>
        <output htmlFor={id} className="text-sm font-extrabold text-brand-800">
          {format(value)}
        </output>
      </div>
      <input
        id={id} type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="np-range"
      />
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3">
      <dt className="text-xs text-purple-200">{label}</dt>
      <dd className={`text-xl font-extrabold tabular-nums ${tone}`}>{value}</dd>
    </div>
  );
}
