import "server-only";
import { and, eq, isNull, lt, ne, sql } from "drizzle-orm";
import { del } from "@vercel/blob";
import { db } from "@/lib/db/client";
import { leads, mediaAssets } from "@/lib/db/schema";
import { blobConfigured } from "@/lib/env";
import { contentWrite } from "@/lib/db/content-write";
import { reportError } from "@/lib/errors";

export async function pruneExpiredLeads() {
  const deleted = await db().delete(leads).where(and(
    isNull(leads.becameCustomerAt), ne(leads.status, "won"),
    lt(leads.createdAt, sql`now() - interval '24 months'`),
  )).returning({ id: leads.id });
  // PostgreSQL cascades notes and queued notifications.
  return deleted.length;
}

/** A seven-day grace period protects uploads still being used in an editor. */
export async function pruneUnusedImages() {
  if (!blobConfigured()) return 0;
  return contentWrite(async (tx) => {
    const unused = await tx.select().from(mediaAssets).where(and(
      lt(mediaAssets.createdAt, sql`now() - interval '7 days'`),
      sql`NOT EXISTS (SELECT 1 FROM posts WHERE cover_url = ${mediaAssets.url} OR position(${mediaAssets.url} in body) > 0)`,
      sql`NOT EXISTS (SELECT 1 FROM service_pages WHERE image_src = ${mediaAssets.url})`,
    )).limit(20);
    let removed = 0;
    for (const asset of unused) {
      try {
        await del(asset.url);
        await tx.delete(mediaAssets).where(eq(mediaAssets.id, asset.id));
        removed++;
      } catch (error) { reportError("media-cleanup", error); }
    }
    return removed;
  });
}
