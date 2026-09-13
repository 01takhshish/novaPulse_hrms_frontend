import "server-only";
import { and, eq, isNull, lt, lte, or, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { notificationJobs, leads } from "@/lib/db/schema";
import { emailConfigured } from "@/lib/env";
import { reportError } from "@/lib/errors";
import { sendLeadNotification } from "./lead-notification";

/** Row leases allow concurrent workers and recover after a killed invocation. */
export async function processNotifications(limit = 20, leadId?: string) {
  if (!emailConfigured()) return { sent: 0, failed: 0, skipped: true };
  let sent = 0, failed = 0;
  for (let i = 0; i < limit; i++) {
    const job = await db().transaction(async (tx) => {
      const now = new Date();
      const [pending] = await tx.select().from(notificationJobs).where(and(
        isNull(notificationJobs.sentAt), lt(notificationJobs.attempts, 10),
        lte(notificationJobs.nextAttemptAt, now),
        or(isNull(notificationJobs.lockedUntil), lte(notificationJobs.lockedUntil, now)),
        leadId ? eq(notificationJobs.leadId, leadId) : undefined,
      )).orderBy(notificationJobs.nextAttemptAt).limit(1).for("update", { skipLocked: true });
      if (!pending) return null;
      const [claimed] = await tx.update(notificationJobs).set({
        attempts: sql`${notificationJobs.attempts} + 1`,
        lockedUntil: new Date(Date.now() + 5 * 60_000),
      }).where(eq(notificationJobs.id, pending.id)).returning();
      return claimed;
    });
    if (!job) break;
    let delivered = false;
    try {
      const lead = await db().query.leads.findFirst({ where: eq(leads.id, job.leadId) });
      if (!lead) continue;
      delivered = (await sendLeadNotification(lead)).sent;
    } catch (error) { reportError("notification", error); }
    await db().update(notificationJobs).set({
      sentAt: delivered ? new Date() : null,
      lockedUntil: null,
      lastError: delivered ? null : "delivery_failed",
      nextAttemptAt: new Date(Date.now() + Math.min(86400, 60 * 2 ** job.attempts) * 1000),
    }).where(eq(notificationJobs.id, job.id));
    if (delivered) sent++; else failed++;
  }
  return { sent, failed, skipped: false };
}
