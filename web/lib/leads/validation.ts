import { z } from "zod";

/**
 * Shared by the public form and the API route, so the browser and the server
 * enforce exactly the same rules. Deliberately free of server-only imports.
 */
const phonePattern = /^[+()\d][\d\s()+-]{7,19}$/;

export const leadSubmissionSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .regex(phonePattern, "Enter a valid phone number")
    .max(32),
  company: z.string().trim().min(2, "Please enter your company name").max(160),
  service: z.string().trim().min(2, "Choose a service").max(120),
  // `.or(z.literal(""))` would be unreachable here — the optional string branch
  // already accepts "". Normalise after parsing instead, so blank messages
  // land in the database as NULL rather than an empty string.
  message: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((value) => (value ? value : undefined)),

  // attribution, filled in by the client — never trusted for anything but reporting
  source: z.string().trim().max(64).optional(),
  utmSource: z.string().trim().max(120).optional(),
  utmMedium: z.string().trim().max(120).optional(),
  utmCampaign: z.string().trim().max(120).optional(),
  utmTerm: z.string().trim().max(120).optional(),
  utmContent: z.string().trim().max(120).optional(),
  referrer: z.string().trim().max(1000).optional(),

  // Honeypot. Accepted by the schema on purpose: rejecting it here would return
  // a 422 that tells the bot exactly which field gave it away. The service
  // decides what to do with it instead, and answers 201 either way.
  _gotcha: z.string().max(200).optional(),
});

export type LeadSubmission = z.infer<typeof leadSubmissionSchema>;

export const leadStatuses = ["new", "contacted", "qualified", "won", "lost"] as const;
export type LeadStatus = (typeof leadStatuses)[number];

export const leadStatusSchema = z.enum(leadStatuses);

export const updateLeadStatusSchema = z.object({
  leadId: z.string().uuid(),
  status: leadStatusSchema,
});

export const createNoteSchema = z.object({
  leadId: z.string().uuid(),
  body: z.string().trim().min(1, "Note cannot be empty").max(4000),
});

export const leadFilterSchema = z.object({
  status: leadStatusSchema.optional(),
  query: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
});

export type LeadFilter = z.infer<typeof leadFilterSchema>;
