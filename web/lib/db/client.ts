import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";
import { connectionOptions } from "./config";
import * as schema from "./schema";

/**
 * One pool per process. Next's dev server re-evaluates modules on every edit,
 * so the client is stashed on globalThis to avoid exhausting Postgres
 * connections during development.
 */
const globalForDb = globalThis as unknown as {
  __novapulseSql?: ReturnType<typeof postgres>;
};

function connection() {
  if (!globalForDb.__novapulseSql) {
    globalForDb.__novapulseSql = postgres(env().DATABASE_URL, {
      // Serverless invocations are short-lived; a large pool just starves the DB.
      max: process.env.VERCEL ? 1 : 10,
      ...connectionOptions(env().DATABASE_URL),
    });
  }
  return globalForDb.__novapulseSql;
}

let cachedDb: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function db() {
  if (!cachedDb) cachedDb = drizzle(connection(), { schema });
  return cachedDb;
}

export { schema };
