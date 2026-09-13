"use server";

import { reportError } from "@/lib/errors";
import { clientIp } from "@/lib/http";


import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { checkRateLimit, hashIdentifier } from "@/lib/rate-limit";
import { verifyPassword } from "./password";
import { createSession, destroySession } from "./session";

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  password: z.string().min(1).max(72),
});

export type SignInState = { error?: string };

/** Ten attempts per IP per 15 minutes, counted before the password is checked. */
const LOGIN_RATE_LIMIT = { limit: 10, windowSeconds: 900 };

export async function signInAction(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Enter a valid email and password." };

  try {
  const ip = clientIp(await headers());
  const limit = await checkRateLimit({
    bucket: `login:${ip ? hashIdentifier(ip) : "unknown"}`,
    ...LOGIN_RATE_LIMIT,
  });
  if (!limit.allowed) {
    return { error: "Too many attempts. Please try again later." };
  }

  const user = await db().query.users.findFirst({
    where: eq(users.email, parsed.data.email),
  });

  // Same message and comparable timing whether the account exists or not, so
  // the form cannot be used to enumerate valid addresses.
  const valid = user
    ? await verifyPassword(parsed.data.password, user.passwordHash)
    : await verifyPassword(parsed.data.password, "$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW");

  if (!user || !valid) return { error: "Incorrect email or password." };

  await createSession(user);
  } catch (error) {
    reportError("sign-in", error);
    return { error: "Sign-in is temporarily unavailable. Please try again." };
  }
  redirect("/admin");
}

export async function signOutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
