import { connectionOptions, migrationUrl } from "../lib/db/config";
import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import bcrypt from "bcryptjs";
import { users } from "../lib/db/schema";

/**
 * Creates or updates an admin account. Reads from ADMIN_EMAIL / ADMIN_NAME /
 * ADMIN_PASSWORD when set (for scripted provisioning), otherwise prompts.
 */
async function main() {
  const url = migrationUrl();
  if (!url) throw new Error("DATABASE_URL is required");

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = async (label: string, fallback?: string) =>
    fallback ?? (await rl.question(label));

  const email = (await ask("Admin email: ", process.env.ADMIN_EMAIL)).trim().toLowerCase();
  const name = (await ask("Admin name: ", process.env.ADMIN_NAME)).trim();
  const password = await ask("Admin password: ", process.env.ADMIN_PASSWORD);
  rl.close();

  if (password.length < 12) {
    throw new Error("Password must be at least 12 characters");
  }

  const sql = postgres(url, { max: 1, ...connectionOptions(url) });
  const db = drizzle(sql, { schema: { users } });
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const existing = await db.select().from(users).where(eq(users.email, email));

    if (existing.length > 0) {
      await db.update(users).set({ passwordHash, name }).where(eq(users.email, email));
      console.log(`updated admin ${email}`);
    } else {
      await db.insert(users).values({ email, name, passwordHash, role: "admin" });
      console.log(`created admin ${email}`);
    }
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
