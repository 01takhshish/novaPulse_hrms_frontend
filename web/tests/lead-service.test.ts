import { beforeEach, describe, expect, it, vi } from "vitest";

// Email is a side effect of capturing a lead, not part of it — stub the
// transport so the suite never needs network or an API key.
vi.mock("@/lib/email/client", () => ({
  sendEmail: vi.fn(async () => ({ sent: true })),
}));

const { createLead, listLeads, countByStatus, findLeadById, addNote, updateLeadStatus } =
  await import("@/lib/leads/service");
const { sendEmail } = await import("@/lib/email/client");

const submission = {
  name: "Praveen Sharma",
  email: "praveen@example.com",
  phone: "+91 98765 43210",
  company: "Enterprise Ltd",
  service: "HRMS & Payroll" as const,
  message: "50 staff across two branches",
  source: "hero",
  utmCampaign: "google-hrms",
};

const context = { ip: "203.0.113.10", userAgent: "vitest" };

beforeEach(() => vi.clearAllMocks());

describe("createLead", () => {
  it("persists a valid submission and returns it", async () => {
    const result = await createLead(submission, context);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data.name).toBe("Praveen Sharma");
    expect(result.data.status).toBe("new");
    expect(result.data.source).toBe("hero");
    expect(result.data.utmCampaign).toBe("google-hrms");
  });

  it("never stores the raw IP address", async () => {
    const result = await createLead(submission, context);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data.ipHash).toBeTruthy();
    expect(result.data.ipHash).not.toContain("203.0.113.10");
  });

  it("returns field errors for an invalid submission", async () => {
    const result = await createLead({ ...submission, email: "nope" }, context);
    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.error.kind).toBe("validation");
    if (result.error.kind !== "validation") return;
    expect(result.error.fieldErrors.email).toBeDefined();
  });

  it("drops honeypot submissions without writing or notifying", async () => {
    const result = await createLead({ ...submission, _gotcha: "i am a bot" }, context);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    // Specifically "rejected", not "validation" — a validation error would leak
    // the existence of the honeypot field back to the bot.
    expect(result.error.kind).toBe("rejected");

    const page = await listLeads({ page: 1 });
    expect(page.total).toBe(0);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("rate limits after five submissions from one IP", async () => {
    for (let i = 0; i < 5; i++) {
      const r = await createLead({ ...submission, email: `p${i}@example.com` }, context);
      expect(r.ok).toBe(true);
    }
    const blocked = await createLead({ ...submission, email: "p6@example.com" }, context);
    expect(blocked.ok).toBe(false);
    if (blocked.ok) return;
    expect(blocked.error.kind).toBe("rate_limited");
  });

  it("counts invalid attempts against the rate limit", async () => {
    for (let i = 0; i < 5; i++) {
      await createLead({ ...submission, email: "invalid" }, context);
    }
    const blocked = await createLead(submission, context);
    expect(blocked.ok).toBe(false);
    if (blocked.ok) return;
    expect(blocked.error.kind).toBe("rate_limited");
  });

  it("limits per IP, so one spammer cannot block everyone", async () => {
    for (let i = 0; i < 5; i++) {
      await createLead({ ...submission, email: `p${i}@example.com` }, context);
    }
    const other = await createLead(submission, { ...context, ip: "198.51.100.7" });
    expect(other.ok).toBe(true);
  });

  it("still succeeds when the notification email fails", async () => {
    vi.mocked(sendEmail).mockRejectedValueOnce(new Error("resend down"));
    const result = await createLead(submission, context);
    expect(result.ok).toBe(true);
  });
});

describe("pipeline management", () => {
  it("filters by status and counts each stage", async () => {
    const a = await createLead(submission, context);
    const b = await createLead({ ...submission, email: "b@example.com" }, context);
    expect(a.ok && b.ok).toBe(true);
    if (!a.ok || !b.ok) return;

    await updateLeadStatus(a.data.id, "won");

    const counts = await countByStatus();
    expect(counts.all).toBe(2);
    expect(counts.won).toBe(1);
    expect(counts.new).toBe(1);

    const wonOnly = await listLeads({ page: 1, status: "won" });
    expect(wonOnly.total).toBe(1);
    expect(wonOnly.leads[0].id).toBe(a.data.id);
  });

  it("searches across name, company and email", async () => {
    await createLead(submission, context);
    await createLead(
      { ...submission, name: "Asha Rao", company: "Vedaa Health", email: "asha@vedaa.in" },
      { ...context, ip: "198.51.100.8" },
    );

    expect((await listLeads({ page: 1, query: "Vedaa" })).total).toBe(1);
    expect((await listLeads({ page: 1, query: "asha@" })).total).toBe(1);
    expect((await listLeads({ page: 1, query: "Sharma" })).total).toBe(1);
    expect((await listLeads({ page: 1, query: "nobody" })).total).toBe(0);
  });

  it("attaches notes to a lead, newest first", async () => {
    const created = await createLead(submission, context);
    expect(created.ok).toBe(true);
    if (!created.ok) return;

    await addNote({
      leadId: created.data.id,
      authorId: null,
      authorName: "Sales",
      body: "Left a voicemail",
    });
    await addNote({
      leadId: created.data.id,
      authorId: null,
      authorName: "Sales",
      body: "Demo booked for Thursday",
    });

    const lead = await findLeadById(created.data.id);
    expect(lead?.notes).toHaveLength(2);
    expect(lead?.notes[0].body).toBe("Demo booked for Thursday");
  });

  it("returns null for an unknown lead rather than throwing", async () => {
    expect(await findLeadById("00000000-0000-0000-0000-000000000000")).toBeNull();
  });
});
