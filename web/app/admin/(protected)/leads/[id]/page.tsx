import { requireUser } from "@/lib/auth/guard";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NoteForm } from "@/components/admin/note-form";
import { StatusBadge } from "@/components/admin/status-badge";
import { StatusSelect } from "@/components/admin/status-select";
import { findLeadById } from "@/lib/leads/service";

export const dynamic = "force-dynamic";

const dateTime = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" });

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const lead = await findLeadById(id);
  if (!lead) notFound();

  const attribution = [
    ["Source", lead.source],
    ["UTM source", lead.utmSource],
    ["UTM medium", lead.utmMedium],
    ["UTM campaign", lead.utmCampaign],
    ["UTM term", lead.utmTerm],
    ["UTM content", lead.utmContent],
    ["Referrer", lead.referrer],
  ].filter(([, v]) => v) as Array<[string, string]>;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="text-xs font-bold text-slate-500 hover:text-slate-900">
          ← Back to leads
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-slate-900">{lead.name}</h1>
              <StatusBadge status={lead.status} />
            </div>
            <p className="mt-1 text-sm text-slate-500">{lead.company}</p>
          </div>
          {user.role === "admin" && <StatusSelect leadId={lead.id} status={lead.status} />}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-800">
              Enquiry
            </h2>
            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <Field label="Email">
                <a href={`mailto:${lead.email}`} className="text-brand-800 hover:underline">
                  {lead.email}
                </a>
              </Field>
              <Field label="Phone">
                <a href={`tel:${lead.phone}`} className="text-brand-800 hover:underline">
                  {lead.phone}
                </a>
              </Field>
              <Field label="Requirement">{lead.service}</Field>
              <Field label="Received">{dateTime.format(lead.createdAt)}</Field>
            </dl>
            {lead.message && (
              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500">Message</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">{lead.message}</p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-800">
              Notes
            </h2>
            {user.role === "admin" && <NoteForm leadId={lead.id} />}
            <ul className="mt-6 space-y-4">
              {lead.notes.length === 0 && (
                <li className="text-xs text-slate-400">No notes yet.</li>
              )}
              {lead.notes.map((note) => (
                <li key={note.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-xs font-bold text-slate-900">{note.authorName}</span>
                    <span className="text-[11px] text-slate-400">
                      {dateTime.format(note.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1.5 whitespace-pre-wrap text-sm text-slate-700">{note.body}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-800">
              Attribution
            </h2>
            {attribution.length === 0 ? (
              <p className="text-xs text-slate-400">No campaign data captured.</p>
            ) : (
              <dl className="space-y-3 text-sm">
                {attribution.map(([label, value]) => (
                  <Field key={label} label={label}>
                    <span className="break-all">{value}</span>
                  </Field>
                ))}
              </dl>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-slate-900">{children}</dd>
    </div>
  );
}
