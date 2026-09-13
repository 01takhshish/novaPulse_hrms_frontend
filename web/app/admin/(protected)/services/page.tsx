import { requireAdmin } from "@/lib/auth/guard";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import { formatPostDate } from "@/lib/blog/derive";
import { listAll } from "@/lib/services/service";
import { serviceFilterSchema } from "@/lib/services/validation";

export const dynamic = "force-dynamic";
export const metadata = { title: "Services" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const raw = await searchParams;
  // An unparseable query string falls back to "show everything" rather than 500ing.
  const filter = serviceFilterSchema.safeParse(raw).data ?? {};
  const services = await listAll(filter);

  const counts = {
    all: services.length,
    published: services.filter((s) => s.status === "published").length,
    draft: services.filter((s) => s.status === "draft").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Services</h1>
          <p className="mt-1 text-xs text-slate-500">
            {counts.published} published · {counts.draft} draft · listed in menu order
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-800 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-900"
        >
          <FaPlus className="text-[10px]" /> New service
        </Link>
      </div>

      <nav className="flex flex-wrap gap-2" aria-label="Filter by status">
        <FilterChip href="/admin/services" active={!filter.status}>
          All {counts.all}
        </FilterChip>
        <FilterChip href="/admin/services?status=published" active={filter.status === "published"}>
          Published {counts.published}
        </FilterChip>
        <FilterChip href="/admin/services?status=draft" active={filter.status === "draft"}>
          Drafts {counts.draft}
        </FilterChip>
      </nav>

      {services.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-sm text-slate-500">
          No services yet.{" "}
          <Link href="/admin/services/new" className="font-bold text-brand-800">
            Create the first one.
          </Link>
        </p>
      ) : (
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {services.map((service) => (
            <li key={service.id}>
              <Link
                href={`/admin/services/${service.id}`}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="w-6 shrink-0 text-[11px] font-bold text-slate-300">
                    {service.sortOrder}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">{service.name}</p>
                    <p className="mt-0.5 truncate text-[11px] text-slate-500">
                      /services/{service.slug} · {service.capabilities.length} capabilities
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <span className="text-[11px] text-slate-400">
                    Edited {formatPostDate(service.updatedAt)}
                  </span>
                  <StatusBadge status={service.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
        active ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      {children}
    </Link>
  );
}

function StatusBadge({ status }: { status: "draft" | "published" }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
        status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
      }`}
    >
      {status}
    </span>
  );
}
