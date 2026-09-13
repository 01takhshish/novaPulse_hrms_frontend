import { connectionOptions, migrationUrl } from "../lib/db/config";
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

/**
 * Applied by `npm run db:migrate`, and in CI/CD before the app boots. Uses its
 * own single-use connection so it never touches the app's pool.
 */
async function main() {
  const url = migrationUrl();
  if (!url) throw new Error("DIRECT_DATABASE_URL or DATABASE_URL is required to run migrations");

  const sql = postgres(url, { max: 1, ...connectionOptions(url) });
  try {
    await migrate(drizzle(sql), { migrationsFolder: "./drizzle" });
    console.log("migrations applied");
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
