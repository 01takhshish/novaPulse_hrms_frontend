import Link from "next/link";
import { LeadFilters, LeadSearch } from "@/components/admin/lead-filters";
import { LeadsTable } from "@/components/admin/leads-table";
import { countByStatus, listLeads } from "@/lib/leads/service";
import { leadFilterSchema } from "@/lib/leads/validation";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  // Unparseable query strings fall back to defaults rather than 500ing.
  const filter = leadFilterSchema.safeParse(raw).data ?? { page: 1 };

  const [page, counts] = await Promise.all([listLeads(filter), countByStatus()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Leads</h1>
          <p className="mt-1 text-xs text-slate-500">
            {page.total} total · showing page {page.page} of {page.pageCount}
          </p>
        </div>
        <a
          href="/admin/export"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Export CSV
        </a>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <LeadFilters counts={counts} active={filter.status ?? "all"} query={filter.query} />
        <LeadSearch status={filter.status} query={filter.query} />
      </div>

      <LeadsTable leads={page.leads} />

      {page.pageCount > 1 && (
        <nav className="flex items-center justify-between text-xs" aria-label="Pagination">
          <PageLink filter={filter} page={page.page - 1} disabled={page.page <= 1}>
            ← Previous
          </PageLink>
          <span className="text-slate-500">
            Page {page.page} of {page.pageCount}
          </span>
          <PageLink
            filter={filter}
            page={page.page + 1}
            disabled={page.page >= page.pageCount}
          >
            Next →
          </PageLink>
        </nav>
      )}
    </div>
  );
}

function PageLink({
  filter,
  page,
  disabled,
  children,
}: {
  filter: { status?: string; query?: string };
  page: number;
  disabled: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return <span className="cursor-not-allowed rounded-lg px-3 py-2 text-slate-300">{children}</span>;
  }
  const params = new URLSearchParams();
  if (filter.status) params.set("status", filter.status);
  if (filter.query) params.set("query", filter.query);
  params.set("page", String(page));
  return (
    <Link
      href={`/admin?${params}`}
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-bold text-slate-700 hover:bg-slate-50"
    >
      {children}
    </Link>
  );
}
