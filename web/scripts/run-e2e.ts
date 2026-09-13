import { spawnSync } from "node:child_process";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import bcrypt from "bcryptjs";
import { users } from "../lib/db/schema";
import { testDatabaseUrl } from "../lib/db/test-config";

async function main() {
  const url = testDatabaseUrl();
  const sql = postgres(url, { max: 1 });
  try {
    await migrate(drizzle(sql), { migrationsFolder: "./drizzle" });
    await sql`TRUNCATE lead_notes, notification_jobs, media_assets, leads, posts, rate_limit_hits, service_pages, users CASCADE`;
    const passwordHash = await bcrypt.hash("Browser-test-password-2026", 12);
    await drizzle(sql).insert(users).values([
      { email: "admin@example.test", name: "Test Admin", role: "admin", passwordHash },
      { email: "viewer@example.test", name: "Test Viewer", role: "viewer", passwordHash },
    ]);
  } finally {
    await sql.end();
  }

  const environment: NodeJS.ProcessEnv = {
    ...process.env,
    DATABASE_URL: url,
    DIRECT_DATABASE_URL: url,
    AUTH_SECRET: "isolated-browser-test-secret-at-least-32-characters",
    CRON_SECRET: "isolated-browser-cron-secret-at-least-32-characters",
    RESEND_API_KEY: "",
    LEAD_NOTIFICATION_FROM: "",
    LEAD_NOTIFICATION_TO: "",
    BLOB_READ_WRITE_TOKEN: "",
    NODE_ENV: "production",
    NEXT_BUILD_DIR: ".next-e2e",
    NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3107",
    VERCEL_ENV: "preview",
  };

  function run(args: string[]) {
    const result = spawnSync(process.execPath, args, { env: environment, stdio: "inherit" });
    if (result.status !== 0) process.exit(result.status ?? 1);
  }

  run(["--import", "tsx", "scripts/seed-content.ts"]);
  run(["node_modules/next/dist/bin/next", "build", "--webpack"]);
  run(["node_modules/@playwright/test/cli.js", "test"]);
}

void main();
