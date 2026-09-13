import sharp from "sharp";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The upload endpoint is the one place an authenticated user hands us a file.
 * These cover the parts that would be exploitable if they regressed: the auth
 * gate, the size cap, and the magic-byte sniff that stops a script wearing a
 * .png extension.
 */
type PutArgs = [pathname: string, body: unknown, options: Record<string, unknown>];
const put = vi.fn<(...args: PutArgs) => Promise<{ url: string }>>(async (pathname) => ({
  url: `https://abc.public.blob.vercel-storage.com/${pathname}`,
}));
vi.mock("@vercel/blob", () => ({ put: (...args: PutArgs) => put(...args), del: vi.fn() }));

const getSessionUser = vi.fn();
vi.mock("@/lib/auth/session", () => ({ getSessionUser: () => getSessionUser() }));

const { POST } = await import("@/app/api/admin/upload/route");

const PNG = new Uint8Array(await sharp({ create: { width: 2, height: 2, channels: 3, background: "white" } }).png().toBuffer());
const JPG = new Uint8Array(await sharp({ create: { width: 2, height: 2, channels: 3, background: "white" } }).jpeg().toBuffer());
const SCRIPT = new TextEncoder().encode("<?php system($_GET['c']); ?>          ");

function upload(bytes: Uint8Array, name = "cover.png", type = "image/png") {
  const form = new FormData();
  form.set("file", new File([bytes as BlobPart], name, { type }));
  return POST(new Request("http://localhost/api/admin/upload", { method: "POST", body: form }));
}

describe("POST /api/admin/upload", () => {
  beforeEach(async () => {
    put.mockClear();
    getSessionUser.mockReset();
    getSessionUser.mockResolvedValue({ id: "11111111-1111-1111-1111-111111111111", role: "admin" });
    process.env.BLOB_READ_WRITE_TOKEN = "test-token";
    await db().insert(users).values({ id: "11111111-1111-1111-1111-111111111111", email: "upload@example.com", name: "Uploader", passwordHash: "test", role: "admin" });
  });

  it("refuses an unauthenticated upload without touching storage", async () => {
    getSessionUser.mockResolvedValue(null);
    const response = await upload(PNG);
    expect(response.status).toBe(401);
    expect(put).not.toHaveBeenCalled();
  });

  it("refuses viewers before calling storage", async () => {
    getSessionUser.mockResolvedValue({ id: "11111111-1111-1111-1111-111111111111", role: "viewer" });
    expect((await upload(PNG)).status).toBe(403);
    expect(put).not.toHaveBeenCalled();
  });

  it("rejects a truncated file even if its PNG signature is valid", async () => {
    expect((await upload(PNG.slice(0, 12))).status).toBe(415);
    expect(put).not.toHaveBeenCalled();
  });

  it("accepts a real PNG and returns the stored URL", async () => {
    const response = await upload(PNG);
    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toMatchObject({
      url: expect.stringContaining("public.blob.vercel-storage.com"),
    });
  });

  it("accepts a JPG even when the extension says otherwise", async () => {
    const response = await upload(JPG, "photo.png", "image/png");
    expect(response.status).toBe(201);
    // The stored name comes from the sniffed type, not the client's filename.
    expect(put.mock.calls[0][0]).toBe("cms/image.webp");
  });

  it("rejects a script renamed to .png, despite an image Content-Type", async () => {
    const response = await upload(SCRIPT, "payload.png", "image/png");
    expect(response.status).toBe(415);
    expect(put).not.toHaveBeenCalled();
  });

  it("rejects an empty file", async () => {
    const response = await upload(new Uint8Array(0));
    expect(response.status).toBe(400);
    expect(put).not.toHaveBeenCalled();
  });

  it("rejects a file over the 4 MB cap", async () => {
    const oversized = new Uint8Array(4 * 1024 * 1024 + 1);
    oversized.set(PNG);
    const response = await upload(oversized);
    expect(response.status).toBe(413);
    expect(put).not.toHaveBeenCalled();
  });

  it("never stores a client-supplied filename", async () => {
    await upload(PNG, "../../../etc/passwd.png");
    expect(put.mock.calls[0][0]).toBe("cms/image.webp");
    expect(put.mock.calls[0][2]).toMatchObject({ addRandomSuffix: true, access: "public" });
  });

});

describe("POST /api/admin/upload without blob storage", () => {
  it("says so plainly instead of failing inside the storage SDK", async () => {
    // lib/env caches after its first read, so this needs a fresh module
    // registry rather than just deleting the variable.
    const original = process.env.BLOB_READ_WRITE_TOKEN;
    delete process.env.BLOB_READ_WRITE_TOKEN;
    vi.resetModules();
    put.mockClear();
    getSessionUser.mockResolvedValue({ id: "11111111-1111-1111-1111-111111111111", role: "admin" });

    try {
      const route = await import("@/app/api/admin/upload/route");
      const form = new FormData();
      form.set("file", new File([PNG as BlobPart], "cover.png", { type: "image/png" }));
      const response = await route.POST(
        new Request("http://localhost/api/admin/upload", { method: "POST", body: form }),
      );
      expect(response.status).toBe(503);
      expect(put).not.toHaveBeenCalled();
    } finally {
      if (original) process.env.BLOB_READ_WRITE_TOKEN = original;
    }
  });
});
