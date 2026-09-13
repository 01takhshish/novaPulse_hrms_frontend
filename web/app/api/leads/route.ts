import { after, NextResponse } from "next/server";
import { createLead } from "@/lib/leads/service";
import { processNotifications } from "@/lib/email/queue";
import { BodyTooLarge, clientIp, readBody, sameOrigin } from "@/lib/http";
import { reportError } from "@/lib/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Send a JSON request." }, { status: 415 });
  }
  try {
    let body: unknown;
    let malformed = false;
    try { body = JSON.parse(new TextDecoder().decode(await readBody(request, 16_384))); }
    catch (error) { if (error instanceof BodyTooLarge) throw error; malformed = true; }
    // Even malformed JSON reaches the limiter, but can never be persisted.
    const result = await createLead(body, { ip: clientIp(request.headers), userAgent: request.headers.get("user-agent") });
    if (result.ok) {
      after(async () => {
        try { await processNotifications(1, result.data.id); }
        catch (error) { reportError("notification-worker", error); }
      });
      return NextResponse.json({ id: result.data.id }, { status: 201 });
    }
    if (result.error.kind === "rate_limited") return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(result.error.retryAfterSeconds) } },
    );
    if (malformed) return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
    if (result.error.kind === "validation") return NextResponse.json(
      { error: "Please check the highlighted fields.", fieldErrors: result.error.fieldErrors }, { status: 422 },
    );
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof BodyTooLarge) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    reportError("lead-submit", error);
    return NextResponse.json({ error: "We could not save your enquiry. Please try again or contact us directly." }, { status: 503 });
  }
}
