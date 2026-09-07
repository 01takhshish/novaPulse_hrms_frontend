import Link from "next/link";
import type { LeadStatusCounts } from "@/lib/leads/types";
import { leadStatuses } from "@/lib/leads/validation";

const TABS = ["all", ...leadStatuses] as const;

export function LeadFilters({
  counts,
  active,
  query,
}: {
  counts: LeadStatusCounts;
  active: string;
  query?: string;
}) {
  const href = (status: string) => {
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (query) params.set("query", query);
    const qs = params.toString();
    return qs ? `/admin?${qs}` : "/admin";
  };

  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const isActive = active === tab;
        return (
          <Link
            key={tab}
            href={href(tab)}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-xl border px-3 py-2 text-xs font-bold capitalize transition-colors ${
              isActive
                ? "border-brand-800 bg-brand-800 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab}
            <span className={isActive ? "ml-1.5 text-brand-200" : "ml-1.5 text-slate-400"}>
              {counts[tab]}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function LeadSearch({ status, query }: { status?: string; query?: string }) {
  return (
    <form action="/admin" method="GET" className="flex gap-2">
      {status && <input type="hidden" name="status" value={status} />}
      <input
        type="search"
        name="query"
        defaultValue={query}
        placeholder="Search name, email, company or phone"
        aria-label="Search leads"
        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-brand-700 focus:outline-none sm:w-80"
      />
      <button
        type="submit"
        className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-800"
      >
        Search
      </button>
    </form>
  );
}
