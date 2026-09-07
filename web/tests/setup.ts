import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { beforeAll, beforeEach, afterAll } from "vitest";

config({ path: ".env.test", override: true });

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

beforeAll(async () => {
  await migrate(drizzle(sql), { migrationsFolder: "./drizzle" });
});

beforeEach(async () => {
  // RESTART IDENTITY keeps sequences predictable; CASCADE handles the FKs.
  await sql`TRUNCATE TABLE lead_notes, leads, rate_limit_hits, users RESTART IDENTITY CASCADE`;
});

afterAll(async () => {
  await sql.end();
});
