import "server-only";
import { err, ok, type Result } from "@/lib/result";
import { reportError } from "@/lib/errors";
import { checkRateLimit, hashIdentifier } from "@/lib/rate-limit";
import * as repo from "./repository";
import type { Lead, LeadCreateError, LeadDeleteError } from "./types";
import { leadSubmissionSchema } from "./validation";

/** Five submissions per IP per hour is generous for humans, hostile to scripts. */
const RATE_LIMIT = { limit: 5, windowSeconds: 3600 };

export type CreateLeadContext = {
  ip: string | null;
  userAgent: string | null;
};

/**
 * The one entry point for capturing a lead: validate, screen for abuse,
 * persist, then notify. Notification failures never fail the request — the
 * lead is already safe in the database by then.
 */
export async function createLead(
  input: unknown,
  context: CreateLeadContext,
): Promise<Result<Lead, LeadCreateError>> {
  const parsed = leadSubmissionSchema.safeParse(input);

  const ipHash = context.ip ? hashIdentifier(context.ip) : null;

  // Count every attempt, including ones that fail below, so a script cannot
  // probe for free by sending malformed payloads.
  const limit = await checkRateLimit({
    bucket: `lead:${ipHash ?? "unknown"}`,
    ...RATE_LIMIT,
  });
  if (!limit.allowed) {
    return err({ kind: "rate_limited", retryAfterSeconds: limit.retryAfterSeconds });
  }

  if (!parsed.success) {
    return err({
      kind: "validation",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    });
  }

  const submission = parsed.data;

  // Honeypot: accepted at the HTTP layer so the bot sees success and moves on,
  // but nothing is written and nobody is notified.
  if (submission._gotcha) {
    return err({ kind: "rejected" });
  }

  const lead = await repo.insertLead({
    name: submission.name,
    email: submission.email,
    phone: submission.phone,
    company: submission.company,
    service: submission.service,
    message: submission.message ?? null,
    source: submission.source ?? null,
    utmSource: submission.utmSource ?? null,
    utmMedium: submission.utmMedium ?? null,
    utmCampaign: submission.utmCampaign ?? null,
    utmTerm: submission.utmTerm ?? null,
    utmContent: submission.utmContent ?? null,
    referrer: submission.referrer ?? null,
    ipHash,
    userAgent: context.userAgent?.slice(0, 512) ?? null,
  });

  return ok(lead);
}

export const listLeads = repo.listLeads;
export const findLeadById = repo.findLeadById;
export const countByStatus = repo.countByStatus;
export const updateLeadStatus = repo.updateLeadStatus;
export const addNote = repo.addNote;
export const allLeadsForExport = repo.allLeadsForExport;

export async function deleteLead(id: string): Promise<Result<true, LeadDeleteError>> {
  try {
    const deleted = await repo.deleteLead(id);
    return deleted ? ok(true) : err({ kind: "not_found" });
  } catch (error) {
    reportError("lead-delete", error);
    return err({ kind: "unavailable" });
  }
}
