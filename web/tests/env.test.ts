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

it("parses LEAD_NOTIFICATION_TO as a comma-separated recipient list", async () => {
  vi.resetModules();
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv("LEAD_NOTIFICATION_FROM", "Nova Pulse <notifications@example.com>");
  vi.stubEnv("LEAD_NOTIFICATION_TO", "sales@example.com, owner@example.com");
  try {
    const { env, emailConfigured } = await import("@/lib/env");
    expect(env().LEAD_NOTIFICATION_TO).toEqual(["sales@example.com", "owner@example.com"]);
    expect(emailConfigured()).toBe(true);
  } finally { vi.unstubAllEnvs(); }
});

it("rejects a recipient list containing an invalid address", async () => {
  vi.resetModules();
  vi.stubEnv("LEAD_NOTIFICATION_TO", "sales@example.com,not-an-email");
  try {
    const { env } = await import("@/lib/env");
    expect(() => env()).toThrow(/LEAD_NOTIFICATION_TO/);
  } finally { vi.unstubAllEnvs(); }
});
