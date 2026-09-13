import { isUuid } from "@/lib/ids";
import "server-only";
import { and, count, desc, eq, gte, ilike, or, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { leadNotes, leads, notificationJobs, type NewLeadRow } from "@/lib/db/schema";
import type { Lead, LeadListPage, LeadStatusCounts, LeadWithNotes } from "./types";
import type { LeadFilter, LeadStatus } from "./validation";

/**
 * The only module that issues SQL for leads. Everything above it works in
 * domain terms, which keeps the service layer testable and means swapping the
 * storage engine touches exactly one file.
 */
export const PAGE_SIZE = 25;

export async function insertLead(row: NewLeadRow): Promise<Lead> {
  return db().transaction(async (tx) => {
    const [created] = await tx.insert(leads).values(row).returning();
    await tx.insert(notificationJobs).values({ leadId: created.id });
    return created;
  });
}

export async function listLeads(filter: LeadFilter): Promise<LeadListPage> {
  const conditions = [];
  if (filter.status) conditions.push(eq(leads.status, filter.status));
  if (filter.query) {
    const term = `%${filter.query}%`;
    conditions.push(
      or(
        ilike(leads.name, term),
        ilike(leads.email, term),
        ilike(leads.company, term),
        ilike(leads.phone, term),
      ),
    );
  }
  const where = conditions.length ? and(...conditions) : undefined;

  const [rows, [{ value: total }]] = await Promise.all([
    db()
      .select()
      .from(leads)
      .where(where)
      .orderBy(desc(leads.createdAt))
      .limit(PAGE_SIZE)
      .offset((filter.page - 1) * PAGE_SIZE),
    db().select({ value: count() }).from(leads).where(where),
  ]);

  return {
    leads: rows,
    total,
    page: filter.page,
    pageSize: PAGE_SIZE,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function countByStatus(): Promise<LeadStatusCounts> {
  const rows = await db()
    .select({ status: leads.status, value: count() })
    .from(leads)
    .groupBy(leads.status);

  const counts: LeadStatusCounts = {
    all: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    won: 0,
    lost: 0,
  };
  for (const row of rows) {
    counts[row.status] = row.value;
    counts.all += row.value;
  }
  return counts;
}

export async function findLeadById(id: string): Promise<LeadWithNotes | null> {
  if (!isUuid(id)) return null;
  const lead = await db().query.leads.findFirst({
    where: eq(leads.id, id),
    with: { notes: { orderBy: (n, { desc: d }) => [d(n.createdAt)] } },
  });
  return lead ?? null;
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead | null> {
  const [updated] = await db()
    .update(leads)
    .set({ status, updatedAt: new Date(), ...(status === "won" ? { becameCustomerAt: sql`coalesce(${leads.becameCustomerAt}, now())` } : {}) })
    .where(eq(leads.id, id))
    .returning();
  return updated ?? null;
}

export async function addNote(input: {
  leadId: string;
  authorId: string | null;
  authorName: string;
  body: string;
}) {
  return db().transaction(async (tx) => {
    const [lead] = await tx.update(leads).set({ updatedAt: new Date() })
      .where(eq(leads.id, input.leadId)).returning({ id: leads.id });
    if (!lead) return null;
    const [note] = await tx.insert(leadNotes).values(input).returning();
    return note;
  });
}

/** Feeds the CSV export; deliberately unpaginated but ordered and bounded. */
export async function allLeadsForExport(limit = 5000, filter: Pick<LeadFilter, "status" | "query"> = {}): Promise<Lead[]> {
  const term = `%${filter.query ?? ""}%`;
  return db().select().from(leads).where(and(
    filter.status ? eq(leads.status, filter.status) : undefined,
    filter.query ? or(ilike(leads.name, term), ilike(leads.email, term), ilike(leads.company, term), ilike(leads.phone, term)) : undefined,
  )).orderBy(desc(leads.createdAt)).limit(limit);
}

export async function leadsCreatedSince(since: Date): Promise<number> {
  const [row] = await db()
    .select({ value: count() })
    .from(leads)
    .where(gte(leads.createdAt, since));
  return row.value;
}
