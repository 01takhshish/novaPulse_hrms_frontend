import "server-only";
import { eq, sql } from "drizzle-orm";
import { mediaAssets } from "./schema";
import { db } from "./client";

export class ContentConflict extends Error {
  constructor(public field: string, message: string) { super(message); }
}

/** Serialize rare CMS writes so slug reservations and references stay consistent. */
export async function contentWrite<T>(write: (tx: Parameters<Parameters<ReturnType<typeof db>["transaction"]>[0]>[0]) => Promise<T>) {
  return db().transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(78452119)`);
    return write(tx);
  });
}

export async function verifyAsset(tx: Parameters<Parameters<ReturnType<typeof db>["transaction"]>[0]>[0], url: string | null | undefined, field: string) {
  if (!url || url.startsWith("/images/")) return;
  const [asset] = await tx.select({ id: mediaAssets.id }).from(mediaAssets).where(eq(mediaAssets.url, url)).limit(1);
  if (!asset) throw new ContentConflict(field, "This upload is unavailable. Please upload the image again.");
}
