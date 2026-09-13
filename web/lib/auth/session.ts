import "server-only";
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users, type UserRow } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { isUuid } from "@/lib/ids";

const COOKIE_NAME = "novapulse_session";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours
const ISSUER = "novapulse";

export type SessionUser = Pick<UserRow, "id" | "email" | "name" | "role">;

function secret(): Uint8Array {
  return new TextEncoder().encode(env().AUTH_SECRET);
}

export async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({ email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret());

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}

/**
 * Verifies the cookie, then re-reads the user. The extra query means a
 * deleted or demoted account loses access immediately rather than when its
 * token happens to expire.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret(), { issuer: ISSUER, algorithms: ["HS256"] });
    if (!isUuid(payload.sub)) return null;

    const user = await db().query.users.findFirst({
      where: eq(users.id, payload.sub),
      columns: { id: true, email: true, name: true, role: true },
    });
    return user ?? null;
  } catch {
    return null;
  }
}
