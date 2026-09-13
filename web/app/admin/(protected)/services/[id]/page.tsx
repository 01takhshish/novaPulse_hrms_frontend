import { requireAdmin } from "@/lib/auth/guard";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { DeleteService } from "@/components/admin/delete-service";
import { ServiceForm } from "@/components/admin/service-form";
import { formatPostDate } from "@/lib/blog/derive";
import { findById, listAll } from "@/lib/services/service";
import { toFormValues, toSiblings } from "../form-values";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit service" };

export default async function EditServicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const { id } = await params;
  // A malformed id would make the uuid comparison throw, so treat anything
  // that isn't a real service as a 404 rather than a 500.
  const service = await findById(id);
  if (!service) notFound();

  const [all, search] = await Promise.all([listAll(), searchParams]);
  const justCreated = "created" in search;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/services"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition-colors hover:text-brand-800"
      >
        <FaArrowLeft className="text-[10px]" /> Services
      </Link>

      {justCreated && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
          Service created. Keep editing below — changes save when you hit Save draft or Publish.
        </p>
      )}

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">{service.name}</h1>
        <p className="mt-1 text-xs text-slate-500">
          Last edited {formatPostDate(service.updatedAt)} · /services/{service.slug}
        </p>
      </div>

      <ServiceForm
        initial={toFormValues(service)}
        siblings={toSiblings(all, service.id)}
        onDelete={<DeleteService id={service.id} name={service.name} />}
      />
    </div>
  );
}
