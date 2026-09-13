import { beforeEach, describe, expect, it, vi } from "vitest";

// revalidatePath needs Next's request store, which does not exist under Vitest.
// The service's contract is "a mutation revalidates the right paths", so the
// calls are recorded and asserted rather than executed.
const revalidatePath = vi.fn();
vi.mock("next/cache", () => ({ revalidatePath: (path: string) => revalidatePath(path) }));

const { createPost, updatePost, deletePost, listAll } = await import("@/lib/blog/service");
const { getPosts, getPost, getPostSlugs, getTags } = await import("@/lib/blog");
const { db } = await import("@/lib/db/client");
const { posts, users } = await import("@/lib/db/schema");
const { eq } = await import("drizzle-orm");

async function seedUser() {
  const [user] = await db()
    .insert(users)
    .values({
      email: "editor@novapulse.co.in",
      name: "Editor",
      passwordHash: "not-a-real-hash",
      role: "admin",
    })
    .returning();
  return user;
}

function draft(overrides: Record<string, unknown> = {}) {
  return {
    title: "Biometric attendance and the DPDP Act",
    slug: "biometric-attendance-and-the-dpdp-act",
    description: "What changes for Indian businesses storing fingerprint templates on site.",
    body: "## Heading\n\n".concat("A body long enough to clear the fifty character minimum. "),
    author: "Nova Pulse",
    tags: ["Compliance", "compliance", "Biometrics"],
    featured: false,
    status: "draft" as const,
    ...overrides,
  };
}

describe("blog service", () => {
  let userId: string;

  beforeEach(async () => {
    revalidatePath.mockClear();
    userId = (await seedUser()).id;
  });

  it("rejects a duplicate slug with a field error, not a crash", async () => {
    const first = await createPost(draft(), userId);
    expect(first.ok).toBe(true);

    const second = await createPost(draft({ title: "A different title" }), userId);
    expect(second.ok).toBe(false);
    if (second.ok) throw new Error("unreachable");
    expect(second.error.kind).toBe("validation");
    if (second.error.kind !== "validation") throw new Error("unreachable");
    expect(second.error.fieldErrors.slug?.[0]).toMatch(/already exists/i);
  });

  it("de-dupes tags case-insensitively and keeps the first spelling", async () => {
    const result = await createPost(draft(), userId);
    if (!result.ok) throw new Error("expected success");
    expect(result.data.tags).toEqual(["Compliance", "Biometrics"]);
  });

  it("keeps drafts out of every public read", async () => {
    const result = await createPost(draft(), userId);
    if (!result.ok) throw new Error("expected success");

    // /blog, the [slug] page, generateStaticParams (sitemap + RSS both read
    // through these), and the tag filter.
    expect(await getPosts()).toEqual([]);
    expect(await getPost(result.data.slug)).toBeNull();
    expect(await getPostSlugs()).toEqual([]);
    expect(await getTags()).toEqual([]);

    // ...but the author still sees it in /admin.
    expect((await listAll({})).map((p) => p.id)).toEqual([result.data.id]);
  });

  it("does not revalidate anything for a draft", async () => {
    await createPost(draft(), userId);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("publishes: stamps published_at once and never rewrites it", async () => {
    const created = await createPost(draft({ status: "published" }), userId);
    if (!created.ok) throw new Error("expected success");
    const firstPublishedAt = created.data.publishedAt;
    expect(firstPublishedAt).toBeInstanceOf(Date);

    const edited = await updatePost(
      created.data.id,
      draft({ status: "published", title: "Same post, fixed typo" }),
      userId,
    );
    if (!edited.ok) throw new Error("expected success");
    expect(edited.data.publishedAt?.getTime()).toBe(firstPublishedAt?.getTime());
    expect(edited.data.updatedAt.getTime()).toBeGreaterThanOrEqual(
      created.data.updatedAt.getTime(),
    );
  });

  it("keeps the original published_at when a post is unpublished and relisted", async () => {
    const created = await createPost(draft({ status: "published" }), userId);
    if (!created.ok) throw new Error("expected success");
    const original = created.data.publishedAt?.getTime();

    await updatePost(created.data.id, draft({ status: "draft" }), userId);
    const relisted = await updatePost(created.data.id, draft({ status: "published" }), userId);
    if (!relisted.ok) throw new Error("expected success");
    expect(relisted.data.publishedAt?.getTime()).toBe(original);
  });

  it("takes the page down when a published post is unpublished", async () => {
    const created = await createPost(draft({ status: "published" }), userId);
    if (!created.ok) throw new Error("expected success");
    revalidatePath.mockClear();

    await updatePost(created.data.id, draft({ status: "draft" }), userId);

    expect(revalidatePath).toHaveBeenCalledWith("/blog");
    expect(revalidatePath).toHaveBeenCalledWith(`/blog/${created.data.slug}`);
    expect(revalidatePath).toHaveBeenCalledWith("/sitemap.xml");
    expect(await getPostSlugs()).toEqual([]);
  });

  it("clears the old path when a slug changes, so nothing is orphaned", async () => {
    const created = await createPost(draft({ status: "published" }), userId);
    if (!created.ok) throw new Error("expected success");
    revalidatePath.mockClear();

    await updatePost(created.data.id, draft({ status: "published", slug: "a-new-slug" }), userId);

    expect(revalidatePath).toHaveBeenCalledWith("/blog/a-new-slug");
    expect(revalidatePath).toHaveBeenCalledWith(`/blog/${created.data.slug}`);
  });

  it("normalises a messy slug rather than rejecting it", async () => {
    const result = await createPost(draft({ slug: "  Biometric Attendance & DPDP!  " }), userId);
    if (!result.ok) throw new Error("expected success");
    expect(result.data.slug).toBe("biometric-attendance-dpdp");
  });

  it("refuses a slug that would collide with a real route", async () => {
    const result = await createPost(draft({ slug: "feed.xml" }), userId);
    expect(result.ok).toBe(false);
  });

  it("refuses a cover URL that is not an uploaded image", async () => {
    const result = await createPost(
      draft({ coverUrl: "javascript:alert(1)", coverAlt: "x" }),
      userId,
    );
    expect(result.ok).toBe(false);
  });

  it("refuses a cover image with no alt text", async () => {
    const result = await createPost(draft({ coverUrl: "/images/hero.png" }), userId);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("unreachable");
    if (result.error.kind !== "validation") throw new Error("unreachable");
    expect(result.error.fieldErrors.coverAlt).toBeDefined();
  });

  it("returns not_found rather than throwing for a missing post", async () => {
    const missing = "00000000-0000-0000-0000-000000000000";
    expect(await updatePost(missing, draft(), userId)).toMatchObject({
      ok: false,
      error: { kind: "not_found" },
    });
    expect(await deletePost(missing)).toMatchObject({ ok: false, error: { kind: "not_found" } });
  });

  it("deletes a published post and clears its page", async () => {
    const created = await createPost(draft({ status: "published" }), userId);
    if (!created.ok) throw new Error("expected success");
    revalidatePath.mockClear();

    expect(await deletePost(created.data.id)).toMatchObject({ ok: true });
    expect(revalidatePath).toHaveBeenCalledWith(`/blog/${created.data.slug}`);
    expect(await listAll({})).toEqual([]);
  });

  it("orders published posts by published_at, newest first", async () => {
    const older = await createPost(draft({ slug: "older-post", status: "published" }), userId);
    const newer = await createPost(draft({ slug: "newer-post", status: "published" }), userId);
    if (!older.ok || !newer.ok) throw new Error("expected success");

    // Both rows are stamped within the same millisecond here, so the dates are
    // set explicitly — otherwise the assertion would be a coin flip.
    await db()
      .update(posts)
      .set({ publishedAt: new Date("2026-01-10T00:00:00Z") })
      .where(eq(posts.id, older.data.id));
    await db()
      .update(posts)
      .set({ publishedAt: new Date("2026-06-10T00:00:00Z") })
      .where(eq(posts.id, newer.data.id));

    const slugs = (await getPosts()).map((post) => post.slug);
    expect(slugs).toEqual(["newer-post", "older-post"]);
  });

  it("filters by tag the same way the public /blog/tag page does", async () => {
    await createPost(draft({ slug: "tagged-post", status: "published" }), userId);
    await createPost(
      draft({ slug: "other-post", status: "published", tags: ["Payroll"] }),
      userId,
    );

    expect((await getPosts("Compliance")).map((p) => p.slug)).toEqual(["tagged-post"]);
    expect(await getTags()).toEqual(
      expect.arrayContaining([
        { tag: "Compliance", count: 1 },
        { tag: "Payroll", count: 1 },
      ]),
    );
  });
});
