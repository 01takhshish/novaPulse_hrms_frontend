import { beforeEach, describe, expect, it, vi } from "vitest";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { leads, leadNotes, notificationJobs, users } from "@/lib/db/schema";
import { checkRateLimit, pruneRateLimitHits } from "@/lib/rate-limit";
import { serializeJsonLd } from "@/lib/json-ld";
import { connectionOptions, migrationUrl } from "@/lib/db/config";
import { createLead, updateLeadStatus, addNote, allLeadsForExport } from "@/lib/leads/service";
import { processNotifications } from "@/lib/email/queue";
import { pruneExpiredLeads } from "@/lib/maintenance";
import { BodyTooLarge, readBody, sameOrigin } from "@/lib/http";
import { getServiceRedirect } from "@/lib/services";
import { createService, updateService } from "@/lib/services/service";
import { getPostRedirect } from "@/lib/blog";
import { createPost, updatePost } from "@/lib/blog/service";
import { POST } from "@/app/api/leads/route";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/server", async (original) => ({ ...await original<typeof import("next/server")>(), after: vi.fn() }));
vi.mock("@/lib/email/lead-notification", () => ({ sendLeadNotification: vi.fn(async () => ({ sent: true })) }));
vi.mock("@/lib/env", () => ({
  env: () => ({ DATABASE_URL: process.env.DATABASE_URL!, AUTH_SECRET: "test-secret-at-least-32-characters" }),
  emailConfigured: () => true, blobConfigured: () => false,
}));
const { sendLeadNotification } = await import("@/lib/email/lead-notification");
const valid = { name: "Test Person", email: "person@example.com", phone: "+919876543210", company: "Test Company", service: "General Inquiry" };
const context = { ip: "203.0.113.4", userAgent: "test" };
async function editor() {
  const [row] = await db().insert(users).values({ email: "editor@example.com", name: "Editor", role: "admin", passwordHash: "test" }).returning();
  return row.id;
}
beforeEach(() => vi.clearAllMocks());

describe("production boundaries", () => {
  it("escapes script delimiters while preserving the exact JSON value", () => {
    const value = { title: '</script><script>alert("x")</script>' };
    const encoded = serializeJsonLd(value);
    expect(encoded).not.toContain("<");
    expect(JSON.parse(encoded)).toEqual(value);
  });
  it("uses verified TLS for Neon and rejects pooled migration connections", () => {
    expect(connectionOptions("postgresql://u:p@ep-test-pooler.us-east-2.aws.neon.tech/db?sslmode=require")).toMatchObject({ ssl: "verify-full", prepare: false });
    expect(() => migrationUrl({ DATABASE_URL: "postgresql://u:p@ep-test-pooler.us-east-2.aws.neon.tech/db" })).toThrow("DIRECT_DATABASE_URL");
    expect(migrationUrl({ DATABASE_URL: "postgresql://u:p@ep-test-pooler.us-east-2.aws.neon.tech/db", DIRECT_DATABASE_URL: "postgresql://u:p@ep-test.us-east-2.aws.neon.tech/db" })).toContain("ep-test.us");
  });
  it("enforces the limit under concurrent requests", async () => {
    const results = await Promise.all(Array.from({ length: 15 }, () => checkRateLimit({ bucket: "concurrent", limit: 5, windowSeconds: 3600 })));
    expect(results.filter((result) => result.allowed)).toHaveLength(5);
  });
  it("prunes expired rate-limit hits", async () => {
    await db().execute(sql`INSERT INTO rate_limit_hits(bucket, created_at) VALUES ('old', now() - interval '2 days'), ('new', now())`);
    await pruneRateLimitHits();
    const rows = await db().execute(sql`SELECT bucket FROM rate_limit_hits`);
    expect(rows.map((row) => row.bucket)).toEqual(["new"]);
  });
  it("bounds streamed request bodies without trusting content-length", async () => {
    const request = new Request("http://localhost/api/leads", { method: "POST", body: "x".repeat(20) });
    await expect(readBody(request, 10)).rejects.toBeInstanceOf(BodyTooLarge);
  });
  it("rejects a cross-origin request", () => {
    expect(sameOrigin(new Request("https://example.com/api/admin/upload", { headers: { origin: "https://evil.example" } }))).toBe(false);
  });
  it("rate limits malformed JSON without saving leads", async () => {
    let last: Response | undefined;
    for (let i = 0; i < 6; i++) last = await POST(new Request("http://localhost/api/leads", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.9" }, body: "{" }));
    expect(last?.status).toBe(429);
    expect(await db().select().from(leads)).toHaveLength(0);
  });
  it("atomically stores a notification job and retries a failure", async () => {
    const lead = await createLead(valid, context);
    expect(lead.ok).toBe(true);
    expect(await db().select().from(notificationJobs)).toHaveLength(1);
    vi.mocked(sendLeadNotification).mockResolvedValueOnce({ sent: false });
    expect((await processNotifications()).failed).toBe(1);
    let [job] = await db().select().from(notificationJobs);
    expect(job.sentAt).toBeNull();
    expect(job.attempts).toBe(1);
    await db().update(notificationJobs).set({ nextAttemptAt: new Date(0) });
    expect((await processNotifications()).sent).toBe(1);
    [job] = await db().select().from(notificationJobs);
    expect(job.sentAt).not.toBeNull();
    expect((await processNotifications()).sent).toBe(0);
  });
  it("does not send the same job from concurrent workers", async () => {
    await createLead(valid, context);
    const results = await Promise.all([processNotifications(), processNotifications(), processNotifications()]);
    expect(results.reduce((sum, value) => sum + value.sent, 0)).toBe(1);
    expect(sendLeadNotification).toHaveBeenCalledTimes(1);
  });
  it("retains customers and cascades expired noncustomer notes and jobs", async () => {
    const a = await createLead(valid, context), b = await createLead({ ...valid, email: "customer@example.com" }, context);
    if (!a.ok || !b.ok) throw new Error("setup failed");
    await addNote({ leadId: a.data.id, authorId: null, authorName: "Sales", body: "Old note" });
    await updateLeadStatus(b.data.id, "won");
    await updateLeadStatus(b.data.id, "lost");
    await db().update(leads).set({ createdAt: new Date("2020-01-01") });
    expect(await pruneExpiredLeads()).toBe(1);
    expect((await db().select().from(leads))[0].id).toBe(b.data.id);
    expect(await db().select().from(leadNotes)).toHaveLength(0);
    expect(await db().select().from(notificationJobs).where(eq(notificationJobs.leadId, a.data.id))).toHaveLength(0);
  });
  it("exports only matching status and search results", async () => {
    const a = await createLead(valid, context);
    await createLead({ ...valid, name: "Another Person", company: "Other Co" }, context);
    if (!a.ok) throw new Error("setup failed");
    await updateLeadStatus(a.data.id, "qualified");
    expect(await allLeadsForExport(5000, { status: "qualified", query: "Test Company" })).toHaveLength(1);
    expect(await allLeadsForExport(5000, { status: "lost" })).toHaveLength(0);
  });
  it("preserves renamed service URLs, updates references and reserves aliases", async () => {
    const id = await editor();
    const base = { slug: "example-service", name: "Example", title: "Example Service", eyebrow: "Solutions", tagline: "A complete example service page.", description: "A complete example service description for visitors.", menuBlurb: "Example service", icon: "FaCubes", illustration: "PayrollFlow", demoService: "General Inquiry", capabilities: [{ icon: "FaCubes", title: "Capability", body: "Useful capability content." }], status: "published" };
    const first = await createService(base, id);
    if (!first.ok) throw new Error(JSON.stringify(first));
    const other = await createService({ ...base, slug: "other-service", related: [base.slug] }, id);
    expect(other.ok).toBe(true);
    expect((await updateService(first.data.id, { ...base, slug: "renamed-service" }, id)).ok).toBe(true);
    expect(await getServiceRedirect(base.slug)).toBe("renamed-service");
    const rows = await db().execute(sql`SELECT related FROM service_pages WHERE slug = 'other-service'`);
    expect(rows[0].related).toEqual(["renamed-service"]);
    expect((await createService(base, id)).ok).toBe(false);
  });
  it("supports empty drafts and keeps renamed blog URLs reserved", async () => {
    const id = await editor();
    const base = { title: "Draft Article", slug: "draft-article", description: "Description for the draft article.", body: "", status: "draft" };
    const post = await createPost(base, id);
    if (!post.ok) throw new Error(JSON.stringify(post));
    expect((await updatePost(post.data.id, { ...base, status: "published" }, id)).ok).toBe(false);
    expect((await updatePost(post.data.id, { ...base, body: "A published article with enough content to be useful to readers.", slug: "published-article", status: "published" }, id)).ok).toBe(true);
    expect(await getPostRedirect(base.slug)).toBe("published-article");
    expect((await createPost(base, id)).ok).toBe(false);
  });
});
