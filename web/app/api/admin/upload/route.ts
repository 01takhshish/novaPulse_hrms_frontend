import { NextResponse } from "next/server";
import { del, put } from "@vercel/blob";
import sharp from "sharp";
import { getSessionUser } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/rate-limit";
import { blobConfigured } from "@/lib/env";
import { BodyTooLarge, readBody, sameOrigin } from "@/lib/http";
import { MAX_IMAGE_BYTES, MAX_IMAGE_PIXELS, MAX_UPLOAD_BYTES } from "@/lib/upload";
import { db } from "@/lib/db/client";
import { mediaAssets } from "@/lib/db/schema";
import { reportError } from "@/lib/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
    if (!blobConfigured()) return NextResponse.json({ error: "Image storage is not configured." }, { status: 503 });
    const limit = await checkRateLimit({ bucket: `upload:${user.id}`, limit: 40, windowSeconds: 3600 });
    if (!limit.allowed) return NextResponse.json({ error: "Too many uploads. Try again later." }, {
      status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) },
    });
    const bytes = await readBody(request, MAX_UPLOAD_BYTES);
    let file: File | null = null;
    try {
      const form = await new Response(Buffer.from(bytes), { headers: { "content-type": request.headers.get("content-type") ?? "" } }).formData();
      const candidate = form.get("file");
      if (candidate instanceof File) file = candidate;
    } catch { return NextResponse.json({ error: "Malformed upload." }, { status: 400 }); }
    if (!file || !file.size) return NextResponse.json({ error: "Choose a nonempty image." }, { status: 400 });
    if (file.size > MAX_IMAGE_BYTES) throw new BodyTooLarge();
    let image: Buffer;
    try {
      const input = Buffer.from(await file.arrayBuffer());
      const decoder = sharp(input, { limitInputPixels: MAX_IMAGE_PIXELS, failOn: "warning" });
      const metadata = await decoder.metadata();
      if (!["jpeg", "png", "webp"].includes(metadata.format ?? "") || (metadata.pages ?? 1) > 1) throw new Error("unsupported image");
      // Decode the complete file, strip metadata, orient, bound dimensions and encode.
      image = await decoder.rotate().resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
    } catch { return NextResponse.json({ error: "Choose a valid, non-animated JPG, PNG or WebP image under 25 megapixels." }, { status: 415 }); }
    const blob = await put("cms/image.webp", image, { access: "public", contentType: "image/webp", addRandomSuffix: true });
    try { await db().insert(mediaAssets).values({ url: blob.url, createdBy: user.id }); }
    catch (error) {
      await del(blob.url).catch((cleanupError) => reportError("upload-rollback", cleanupError));
      throw error;
    }
    return NextResponse.json({ url: blob.url, contentType: "image/webp" }, { status: 201 });
  } catch (error) {
    if (error instanceof BodyTooLarge) return NextResponse.json({ error: "Image must be under 4 MB." }, { status: 413 });
    reportError("upload", error);
    return NextResponse.json({ error: "Upload is temporarily unavailable. Please try again." }, { status: 503 });
  }
}
