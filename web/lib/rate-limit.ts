import "server-only";
import { createHmac } from "node:crypto";
import { and, count, eq, gte, lt } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { rateLimitHits } from "@/lib/db/schema";
import { env } from "@/lib/env";

/**
 * Postgres-backed fixed-window limiter.
 *
 * An in-memory counter is useless on serverless (every invocation is a fresh
 * process), and Redis would mean another paid service for a form that sees a
 * handful of submissions a day. The database we already run is the right tool
 * at this volume.
 */
export type RateLimitResult =
  | { allowed: true; remaining: number }
  | { allowed: false; retryAfterSeconds: number };

/**
 * IPs are never stored in the clear — this HMAC is what lands in the database,
 * for both the limiter and lead attribution.
 */
export function hashIdentifier(value: string): string {
  return createHmac("sha256", env().AUTH_SECRET).update(value).digest("hex").slice(0, 64);
}

export async function checkRateLimit(options: {
  bucket: string;
  limit: number;
  windowSeconds: number;
}): Promise<RateLimitResult> {
  const { bucket, limit, windowSeconds } = options;
  const windowStart = new Date(Date.now() - windowSeconds * 1000);

  const [row] = await db()
    .select({ value: count() })
    .from(rateLimitHits)
    .where(and(eq(rateLimitHits.bucket, bucket), gte(rateLimitHits.createdAt, windowStart)));

  if (row.value >= limit) {
    return { allowed: false, retryAfterSeconds: windowSeconds };
  }

  await db().insert(rateLimitHits).values({ bucket });
  return { allowed: true, remaining: Math.max(0, limit - row.value - 1) };
}

/** Housekeeping so the table cannot grow without bound. */
export async function pruneRateLimitHits(olderThanSeconds = 86_400): Promise<void> {
  const cutoff = new Date(Date.now() - olderThanSeconds * 1000);
  await db().delete(rateLimitHits).where(lt(rateLimitHits.createdAt, cutoff));
}
