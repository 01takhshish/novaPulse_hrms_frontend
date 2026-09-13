/** Test commands fail closed rather than adopting DATABASE_URL from .env.local. */
export function testDatabaseUrl() {
  const value = process.env.TEST_DATABASE_URL;
  if (!value) throw new Error("Set TEST_DATABASE_URL to an isolated local database ending in _test.");
  const url = new URL(value);
  if (!["postgres:", "postgresql:"].includes(url.protocol) || !["localhost", "127.0.0.1", "::1", "[::1]"].includes(url.hostname) || !url.pathname.endsWith("_test")) {
    throw new Error("Tests may truncate only an isolated local PostgreSQL database ending in _test.");
  }
  return value;
}
