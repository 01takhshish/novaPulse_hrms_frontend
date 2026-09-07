"use server";

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
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
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

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
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
    : await verifyPassword(parsed.data.password, "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin");

  if (!user || !valid) return { error: "Incorrect email or password." };

  await createSession(user);
  redirect("/admin");
}

export async function signOutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
