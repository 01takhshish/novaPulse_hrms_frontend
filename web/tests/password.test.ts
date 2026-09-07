import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

describe("password hashing", () => {
  it("verifies a correct password", async () => {
    const hash = await hashPassword("correct horse battery staple");
    expect(await verifyPassword("correct horse battery staple", hash)).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("correct horse battery staple");
    expect(await verifyPassword("wrong password entirely", hash)).toBe(false);
  });

  it("never stores the password in the hash", async () => {
    const hash = await hashPassword("hunter2hunter2");
    expect(hash).not.toContain("hunter2");
  });

  it("salts, so identical passwords hash differently", async () => {
    expect(await hashPassword("same password")).not.toBe(await hashPassword("same password"));
  });
});
