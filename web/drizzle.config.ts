import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
import { migrationUrl } from "./lib/db/config";
config({ path: ".env.local", quiet: true });

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: migrationUrl() },
  strict: true,
  verbose: true,
});
