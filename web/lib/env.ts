import "server-only";
import { z } from "zod";

/**
 * Server-only environment contract.
 *
 * Validated lazily rather than at module load: `next build` imports route
 * handlers for static analysis, and we don't want a missing DATABASE_URL to
 * break a build that never touches the database. The first real access fails
 * loudly instead.
 */
const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid Postgres connection string"),
  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET must be at least 32 characters — generate with `openssl rand -base64 32`"),
  RESEND_API_KEY: z.string().min(1).optional(),
  LEAD_NOTIFICATION_TO: z.string().email().optional(),
  LEAD_NOTIFICATION_FROM: z.string().min(1).optional(),
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
