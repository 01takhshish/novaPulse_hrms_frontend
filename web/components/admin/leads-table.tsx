import Link from "next/link";
import type { Lead } from "@/lib/leads/types";
import { StatusBadge } from "./status-badge";

const dateFormat = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function LeadsTable({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <p className="text-sm font-semibold text-slate-900">No leads yet</p>
        <p className="mt-1 text-xs text-slate-500">
          Submissions from the site&rsquo;s demo form will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
          <tr>
            <th scope="col" className="px-4 py-3 font-bold">Contact</th>
            <th scope="col" className="px-4 py-3 font-bold">Requirement</th>
            <th scope="col" className="px-4 py-3 font-bold">Status</th>
            <th scope="col" className="px-4 py-3 font-bold">Received</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="font-bold text-slate-900 hover:text-brand-800"
                >
                  {lead.name}
                </Link>
                <div className="text-xs text-slate-500">{lead.company}</div>
                <div className="text-xs text-slate-400">{lead.email}</div>
              </td>
              <td className="px-4 py-3 text-xs text-slate-600">
                {lead.service}
                {lead.source && <div className="text-slate-400">via {lead.source}</div>}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-4 py-3 text-xs text-slate-500">
                {dateFormat.format(lead.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
