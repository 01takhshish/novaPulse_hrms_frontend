import { timingSafeEqual } from "node:crypto";

export class BodyTooLarge extends Error {}
export async function readBody(request: Request, maxBytes: number): Promise<Uint8Array> {
  if (Number(request.headers.get("content-length")) > maxBytes) throw new BodyTooLarge();
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) { await reader.cancel(); throw new BodyTooLarge(); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return Buffer.concat(chunks);
}

export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  if (!origin) return true;

  // Local reverse proxies can expose an internal request URL (for example
  // `localhost`) while preserving the browser's public Host header. Compare
  // the origin host to the forwarded/public host as well as Request.url.
  const originUrl = new URL(origin);
  const publicHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  return (
    origin === new URL(request.url).origin ||
    Boolean(publicHost && originUrl.host === publicHost)
  );
}

export function secretMatches(actual: string | null, expected: string): boolean {
  if (!actual) return false;
  const a = Buffer.from(actual), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function clientIp(headers: Headers): string | null {
  // Accept these only behind a proxy that overwrites client-supplied forwarding headers.
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip");
}
