import "server-only";
import bcrypt from "bcryptjs";

/** Cost 12: ~250ms on current hardware — slow enough to matter, fast enough to log in. */
const COST = 12;

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, COST);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
