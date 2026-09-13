import { leadFilterSchema } from "@/lib/leads/validation";
import { reportError } from "@/lib/errors";
import { requireUser } from "@/lib/auth/guard";
import { toCsv } from "@/lib/csv";
import { allLeadsForExport } from "@/lib/leads/service";

export const dynamic = "force-dynamic";

const HEADERS = [
  "id", "created_at", "name", "company", "email", "phone", "service",
  "status", "message", "source", "utm_source", "utm_medium", "utm_campaign",
] as const;

export async function GET(request: Request) {
  await requireUser();
  const parsed = leadFilterSchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return Response.json({ error: "Invalid export filters." }, { status: 400 });
  try {
  const leads = await allLeadsForExport(5000, parsed.data);

  const csv = toCsv(
    HEADERS,
    leads.map((l) => [
      l.id, l.createdAt, l.name, l.company, l.email, l.phone, l.service,
      l.status, l.message, l.source, l.utmSource, l.utmMedium, l.utmCampaign,
    ]),
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="novapulse-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
  } catch (error) {
    reportError("export", error);
    return Response.json({ error: "Export is temporarily unavailable." }, { status: 503 });
  }
}
