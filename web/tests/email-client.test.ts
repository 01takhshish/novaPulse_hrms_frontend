import { expect, it, vi } from "vitest";
const send = vi.hoisted(() => vi.fn());
vi.mock("resend", () => ({ Resend: class { emails = { send }; } }));
vi.mock("@/lib/env", () => ({ emailConfigured: () => true, env: () => ({ RESEND_API_KEY: "test", LEAD_NOTIFICATION_FROM: "from@example.com", LEAD_NOTIFICATION_TO: "to@example.com" }) }));
import { sendEmail } from "@/lib/email/client";
it("reports a returned provider error as a failure, not success", async () => {
  send.mockResolvedValueOnce({ data: null, error: { message: "Invalid sender" } });
  expect(await sendEmail({ subject: "Test", html: "Test", text: "Test", idempotencyKey: "lead-test" })).toEqual({ sent: false, reason: "provider_rejected" });
  expect(send.mock.calls[0][1]).toEqual({ idempotencyKey: "lead-test" });
});
