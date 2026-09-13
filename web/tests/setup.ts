import { testDatabaseUrl } from "../lib/db/test-config";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { beforeAll, beforeEach, afterAll } from "vitest";

config({ path: ".env.test", override: false, quiet: true });
const url = testDatabaseUrl();
process.env.DATABASE_URL = url;
process.env.AUTH_SECRET = "isolated-test-secret-at-least-32-characters";
const sql = postgres(url, { max: 1 });
beforeAll(async () => { await migrate(drizzle(sql), { migrationsFolder: "./drizzle" }); });
beforeEach(async () => {
  await sql`TRUNCATE TABLE lead_notes, notification_jobs, media_assets, leads, posts, rate_limit_hits, service_pages, users RESTART IDENTITY CASCADE`;
});
afterAll(async () => { await sql.end(); });
