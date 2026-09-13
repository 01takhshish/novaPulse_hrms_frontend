import { z } from "zod";

export const databaseUrlSchema = z.string().url().refine((value) => {
  const url = new URL(value);
  return ["postgres:", "postgresql:"].includes(url.protocol);
}, "Use a PostgreSQL connection URL");

export function connectionOptions(connectionString: string) {
  const url = new URL(databaseUrlSchema.parse(connectionString));
  const neon = url.hostname.endsWith(".neon.tech");
  return {
    // Transaction pooling must not depend on connection-local prepared state.
    prepare: false,
    ...(neon ? { ssl: "verify-full" as const } : {}),
    connect_timeout: 15,
    idle_timeout: 20,
  };
}

export function migrationUrl(environment: Record<string, string | undefined> = process.env) {
  const value = environment.DIRECT_DATABASE_URL?.trim() || environment.DATABASE_URL;
  const url = databaseUrlSchema.parse(value);
  if (new URL(url).hostname.endsWith(".neon.tech") && new URL(url).hostname.includes("-pooler.")) {
    throw new Error("Set DIRECT_DATABASE_URL to the direct Neon connection for migrations.");
  }
  return url;
}
