import type { LeadStatus } from "@/lib/leads/validation";

const STYLES: Record<LeadStatus, string> = {
  new: "bg-brand-100 text-brand-900 border-brand-200",
  contacted: "bg-blue-50 text-blue-800 border-blue-200",
  qualified: "bg-amber-50 text-amber-800 border-amber-200",
  won: "bg-emerald-50 text-emerald-800 border-emerald-200",
  lost: "bg-slate-100 text-slate-600 border-slate-200",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}
