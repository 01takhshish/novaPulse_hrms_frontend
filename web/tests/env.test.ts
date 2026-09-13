import { expect, it, vi } from "vitest";

it("accepts blank optional integrations and preserves the required database contract", async () => {
  vi.resetModules();
  vi.stubEnv("RESEND_API_KEY", "");
  vi.stubEnv("BLOB_READ_WRITE_TOKEN", "");
  vi.stubEnv("LEAD_NOTIFICATION_TO", "");
  vi.stubEnv("LEAD_NOTIFICATION_FROM", "");
  try {
    const { env, emailConfigured, blobConfigured } = await import("@/lib/env");
    expect(env().DATABASE_URL).toContain("_test");
    expect(emailConfigured()).toBe(false);
    expect(blobConfigured()).toBe(false);
  } finally { vi.unstubAllEnvs(); }
});
