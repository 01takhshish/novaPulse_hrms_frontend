import { env } from "@/lib/env";
import { secretMatches } from "@/lib/http";
import { reportError } from "@/lib/errors";
import { pruneRateLimitHits } from "@/lib/rate-limit";
import { pruneExpiredLeads, pruneUnusedImages } from "@/lib/maintenance";
import { processNotifications } from "@/lib/email/queue";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  // Missing secret fails closed before any database access.
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || !secretMatches(request.headers.get("authorization"), `Bearer ${secret}`)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    env();
    const expiredLeads = await pruneExpiredLeads();
    await pruneRateLimitHits();
    const notifications = await processNotifications(20);
    const unusedImages = await pruneUnusedImages();
    return Response.json({ expiredLeads, notifications, unusedImages }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    reportError("maintenance", error);
    return Response.json({ error: "Maintenance failed. Check server logs and retry." }, { status: 503 });
  }
}
