import type { LeadNoteRow, LeadRow } from "@/lib/db/schema";
import type { LeadStatus } from "./validation";

export type Lead = LeadRow;
export type LeadNote = LeadNoteRow;

export type LeadWithNotes = Lead & { notes: LeadNote[] };

export type LeadListPage = {
  leads: Lead[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export type LeadStatusCounts = Record<LeadStatus | "all", number>;

/** Failure modes the API route maps onto HTTP status codes. */
export type LeadCreateError =
  | { kind: "validation"; fieldErrors: Record<string, string[]> }
  | { kind: "rate_limited"; retryAfterSeconds: number }
  | { kind: "rejected" };

export type LeadDeleteError =
  | { kind: "not_found" }
  | { kind: "unavailable" };
