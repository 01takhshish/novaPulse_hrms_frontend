import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/** Mirrors the options in the public demo form. */
export const leadServiceEnum = pgEnum("lead_service", [
  "HRMS & Payroll",
  "Biometric Attendance",
  "CCTV & Security",
  "Hiring & Recruitment",
  "Lead Generation",
  "General Inquiry",
]);

/** Sales pipeline stages — the whole point of owning the data. */
export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
]);

export const userRoleEnum = pgEnum("user_role", ["admin", "viewer"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("admin"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),

    // submitted by the prospect
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 32 }).notNull(),
    company: varchar("company", { length: 160 }).notNull(),
    service: leadServiceEnum("service").notNull(),
    message: text("message"),

    // pipeline state, owned by the sales team
    status: leadStatusEnum("status").notNull().default("new"),

    // attribution — which CTA fired, and which campaign paid for it
    source: varchar("source", { length: 64 }),
    utmSource: varchar("utm_source", { length: 120 }),
    utmMedium: varchar("utm_medium", { length: 120 }),
    utmCampaign: varchar("utm_campaign", { length: 120 }),
    utmTerm: varchar("utm_term", { length: 120 }),
    utmContent: varchar("utm_content", { length: 120 }),
    referrer: text("referrer"),

    // abuse triage. The IP is stored as an HMAC, never in the clear — we are a
    // Data Fiduciary under the DPDP Act and this is the minimum that still
    // supports rate limiting.
    ipHash: varchar("ip_hash", { length: 64 }),
    userAgent: text("user_agent"),
  },
  (t) => [
    index("leads_created_at_idx").on(t.createdAt),
    index("leads_status_idx").on(t.status),
    index("leads_ip_hash_idx").on(t.ipHash),
  ],
);

export const leadNotes = pgTable(
  "lead_notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
    authorName: varchar("author_name", { length: 120 }).notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("lead_notes_lead_id_idx").on(t.leadId)],
);

/**
 * Every submission attempt, valid or not, so the limiter also counts requests
 * that failed validation or tripped the honeypot.
 */
export const rateLimitHits = pgTable(
  "rate_limit_hits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bucket: varchar("bucket", { length: 96 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("rate_limit_hits_bucket_created_idx").on(t.bucket, t.createdAt)],
);

export const leadsRelations = relations(leads, ({ many }) => ({
  notes: many(leadNotes),
}));

export const leadNotesRelations = relations(leadNotes, ({ one }) => ({
  lead: one(leads, { fields: [leadNotes.leadId], references: [leads.id] }),
  author: one(users, { fields: [leadNotes.authorId], references: [users.id] }),
}));

export type LeadRow = typeof leads.$inferSelect;
export type NewLeadRow = typeof leads.$inferInsert;
export type LeadNoteRow = typeof leadNotes.$inferSelect;
export type UserRow = typeof users.$inferSelect;
