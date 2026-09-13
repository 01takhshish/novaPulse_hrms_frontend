import {
  boolean,
  index,
  integer,
  jsonb,
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
    becameCustomerAt: timestamp("became_customer_at", { withTimezone: true }),

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

/** Drafts are invisible everywhere except /admin. */
export const postStatusEnum = pgEnum("post_status", ["draft", "published"]);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 140 }).notNull().unique(),
    previousSlugs: text("previous_slugs").array().notNull().default([]),
    title: varchar("title", { length: 200 }).notNull(),
    /** Meta description and the listing card blurb. */
    description: varchar("description", { length: 320 }).notNull(),
    /** Markdown, not MDX — see lib/blog/markdown.tsx for why. */
    body: text("body").notNull(),
    author: varchar("author", { length: 120 }).notNull().default("Nova Pulse"),
    tags: text("tags").array().notNull().default([]),
    coverUrl: text("cover_url"),
    coverAlt: varchar("cover_alt", { length: 200 }),
    featured: boolean("featured").notNull().default(false),
    status: postStatusEnum("status").notNull().default("draft"),
    /**
     * Set once, on first publish, and never touched again — it is the public
     * date on the article. Editing a year-old post must not move it back to
     * the top of the blog.
     */
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
  },
  (t) => [index("posts_status_published_at_idx").on(t.status, t.publishedAt)],
);

export type PostRow = typeof posts.$inferSelect;
export type NewPostRow = typeof posts.$inferInsert;

export const serviceStatusEnum = pgEnum("service_status", ["draft", "published"]);

/**
 * The structured sections of a service page. They are stored as jsonb rather
 * than as child tables because they are only ever read and written as a whole
 * page — nothing queries "all capabilities across all services" — and because
 * the admin form edits them as ordered lists. Every one is Zod-validated on the
 * way in and on the way out, so a hand-edited row cannot reach a component.
 */
export type ServiceSection = { title: string; body: string };
export type ServiceCapability = { icon: string; title: string; body: string };
export type ServiceStatItem = {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
};
export type ServiceFaq = { question: string; answer: string };

export const servicePages = pgTable(
  "service_pages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 140 }).notNull().unique(),
    previousSlugs: text("previous_slugs").array().notNull().default([]),
    /** Short label used in navigation and related-service cards. */
    name: varchar("name", { length: 120 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    eyebrow: varchar("eyebrow", { length: 120 }).notNull(),
    tagline: varchar("tagline", { length: 320 }).notNull(),
    /** Meta description. */
    description: varchar("description", { length: 320 }).notNull(),
    /**
     * The one line under the title in the header dropdown. Deliberately its own
     * column rather than a reuse of `eyebrow` — "Attendance, Shifts & Payroll"
     * is what belongs in a nav menu, "Flagship platform" is not.
     */
    menuBlurb: varchar("menu_blurb", { length: 80 }).notNull(),
    /** A react-icons/fa6 name, allowlisted on write — see lib/services/registry.ts. */
    icon: varchar("icon", { length: 60 }).notNull(),
    /** A key of components/illustrations, allowlisted on write. */
    illustration: varchar("illustration", { length: 60 }).notNull(),
    imageSrc: text("image_src"),
    imageAlt: varchar("image_alt", { length: 200 }),
    /**
     * Reuses the lead enum so the service page cannot preselect a demo-form
     * option that the form itself does not offer.
     */
    demoService: leadServiceEnum("demo_service").notNull().default("General Inquiry"),
    problems: jsonb("problems").$type<ServiceSection[]>().notNull().default([]),
    capabilities: jsonb("capabilities").$type<ServiceCapability[]>().notNull().default([]),
    stats: jsonb("stats").$type<ServiceStatItem[]>().notNull().default([]),
    process: jsonb("process").$type<ServiceSection[]>().notNull().default([]),
    faqs: jsonb("faqs").$type<ServiceFaq[]>().notNull().default([]),
    /** Slugs of other service pages; validated to exist before saving. */
    related: text("related").array().notNull().default([]),
    /** Drives the order of /services and the header menu. */
    sortOrder: integer("sort_order").notNull().default(0),
    status: serviceStatusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
  },
  (t) => [index("service_pages_status_sort_order_idx").on(t.status, t.sortOrder)],
);

export type ServicePageRow = typeof servicePages.$inferSelect;
export type NewServicePageRow = typeof servicePages.$inferInsert;

/** Durable notification jobs contain a lead reference, not a duplicate of its PII. */
export const notificationJobs = pgTable("notification_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id").notNull().unique().references(() => leads.id, { onDelete: "cascade" }),
  attempts: integer("attempts").notNull().default(0),
  nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true }).notNull().defaultNow(),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  lastError: varchar("last_error", { length: 80 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("notification_jobs_due_idx").on(t.sentAt, t.nextAttemptAt)]);

export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: text("url").notNull().unique(),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
