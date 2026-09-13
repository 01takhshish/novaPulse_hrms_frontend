import "server-only";
import { z } from "zod";
import { databaseUrlSchema } from "@/lib/db/config";

const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => typeof value === "string" && !value.trim() ? undefined : value, schema.optional());

/**
 * Server-only environment contract.
 *
 * Validated lazily rather than at module load: `next build` imports route
 * handlers for static analysis, and we don't want a missing DATABASE_URL to
 * break a build that never touches the database. The first real access fails
 * loudly instead.
 */
const envSchema = z.object({
  DATABASE_URL: databaseUrlSchema,
  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET must be at least 32 characters — generate with `openssl rand -base64 32`"),
  RESEND_API_KEY: optional(z.string().min(1)),
  LEAD_NOTIFICATION_TO: optional(z.string().email()),
  LEAD_NOTIFICATION_FROM: optional(z.string().min(1)),
  /** Set by Vercel when a Blob store is connected; only cover uploads need it. */
  BLOB_READ_WRITE_TOKEN: optional(z.string().min(1)),
  CRON_SECRET: optional(z.string().min(32)),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function env(): Env {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }
  cached = parsed.data;
  return cached;
}

/** Email notifications are optional; the app degrades gracefully without them. */
export function emailConfigured(): boolean {
  const e = env();
  return Boolean(e.RESEND_API_KEY && e.LEAD_NOTIFICATION_TO && e.LEAD_NOTIFICATION_FROM);
}

/** Cover image uploads are optional; everything else in /admin works without them. */
export function blobConfigured(): boolean {
  return Boolean(env().BLOB_READ_WRITE_TOKEN);
}
