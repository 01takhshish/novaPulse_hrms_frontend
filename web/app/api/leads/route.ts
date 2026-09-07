import { NextResponse } from "next/server";
import { createLead } from "@/lib/leads/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Trusts only the leftmost hop, which is the one the platform sets. */
function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip");
}

/**
 * Thin transport layer: parse the body, hand it to the service, translate the
 * domain result into a status code. All the rules live in the service.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const result = await createLead(body, {
    ip: clientIp(request),
    userAgent: request.headers.get("user-agent"),
  });

  if (result.ok) {
    return NextResponse.json({ id: result.data.id }, { status: 201 });
  }

  switch (result.error.kind) {
    case "validation":
      return NextResponse.json(
        { error: "Please check the highlighted fields.", fieldErrors: result.error.fieldErrors },
        { status: 422 },
      );
    case "rate_limited":
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(result.error.retryAfterSeconds) } },
      );
    case "rejected":
      // Honeypot tripped. Report success so the bot stops retrying.
      return NextResponse.json({ ok: true }, { status: 201 });
  }
}
