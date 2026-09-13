import { z } from "zod";
import { slugify } from "@/lib/blog/derive";
import { services as demoServices } from "@/lib/site";
import { iconNames, illustrationNames } from "./registry";

/**
 * Shared by the admin editor form and the server action, so the browser and the
 * server enforce exactly the same rules. Free of server-only imports.
 */

export const serviceStatuses = ["draft", "published"] as const;
export type ServiceStatus = (typeof serviceStatuses)[number];
export const serviceStatusSchema = z.enum(serviceStatuses);

/**
 * Reserved because /services/<slug> would collide with a real route. Normalised
 * through `slugify` at construction, since the value being checked has already
 * been through it.
 */
const RESERVED_SLUGS = new Set(["new", "edit", "admin", "api"].map(slugify));

const slugSchema = z
  .string()
  .trim()
  .min(3, "Slug must be at least 3 characters")
  .max(140)
  .transform(slugify)
  .refine((value) => value.length >= 3, "Slug must contain letters or numbers")
  .refine((value) => !RESERVED_SLUGS.has(value), "That slug is reserved");

/**
 * Same rule as blog covers: an absolute Vercel Blob URL from the uploader, or a
 * path into /public for the images already in the repo. Anything else — and in
 * particular `javascript:` or `data:` — would end up in an <img src>.
 */
const imageSrcSchema = z
  .string()
  .trim()
  .max(600)
  .refine(
    (value) =>
      value === "" ||
      value.startsWith("/images/") ||
      /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//.test(value),
    "Upload an image, or use a path beginning /images/",
  )
  .optional()
  .transform((value) => (value ? value : undefined));

/**
 * Dropdown-backed, not free text. A service saved with an icon or illustration
 * name that no longer resolves renders as a hole in the page — or throws, in
 * development. The allowlists come from registry.ts, which is compile-time
 * checked against the real component registries.
 */
const iconSchema = z.enum(iconNames, { message: "Pick an icon from the list" });
const illustrationSchema = z.enum(illustrationNames, {
  message: "Pick an illustration from the list",
});

const demoServiceSchema = z.enum(demoServices, {
  message: "Pick one of the demo form's service options",
});

const sectionSchema = z.object({
  title: z.string().trim().min(3, "Give this a title").max(160),
  body: z.string().trim().min(10, "Write a sentence or two").max(1200),
});

const capabilitySchema = sectionSchema.extend({ icon: iconSchema });

/**
 * `value` is the number the counter animates to, `label` is what it counts.
 * Deliberately loose about units: the site uses these for structural facts like
 * "6 stages from punch to payslip", not for performance claims.
 */
const statSchema = z.object({
  value: z.number().finite("Enter a number"),
  label: z.string().trim().min(2, "Say what this number counts").max(120),
  prefix: z.string().trim().max(8).optional(),
  suffix: z.string().trim().max(12).optional(),
  decimals: z.number().int().min(0).max(2).optional(),
});

const faqSchema = z.object({
  question: z.string().trim().min(6, "Write the question").max(200),
  answer: z.string().trim().min(10, "Write the answer").max(1200),
});

/**
 * A repeating section the author added and then left entirely blank is a
 * changed mind, not a mistake worth reporting, so blank rows are dropped.
 *
 * This has to happen *before* validation, not in a `.transform()` afterwards:
 * by then the empty strings have already failed each row's minimum lengths and
 * the author is staring at "Write the answer" on a row they never filled in.
 */
function pruneEmpty(value: unknown): unknown {
  if (!Array.isArray(value)) return value;
  return value.filter((row) => {
    if (typeof row !== "object" || row === null) return true;
    return Object.values(row).some((field) =>
      typeof field === "string" ? field.trim() !== "" : field !== undefined,
    );
  });
}

/** An array of repeating sections, blank rows pruned before they are checked. */
function rows<T extends z.ZodType>(schema: T, max: number, message?: string) {
  return z.preprocess(pruneEmpty, z.array(schema).max(max, message)).default([]);
}

export const serviceInputSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(2, "Give the service a short name").max(120),
  title: z.string().trim().min(4, "Give the page a title").max(200),
  eyebrow: z.string().trim().min(2, "The eyebrow sits above the title").max(120),
  tagline: z.string().trim().min(10, "One line under the title").max(320),
  description: z
    .string()
    .trim()
    .min(20, "Write a short description — it is the meta description")
    .max(320),
  menuBlurb: z
    .string()
    .trim()
    .min(4, "One short line for the header dropdown")
    .max(80, "The header dropdown only has room for a short line"),
  icon: iconSchema,
  illustration: illustrationSchema,
  imageSrc: imageSrcSchema,
  imageAlt: z.string().trim().max(200).optional(),
  demoService: demoServiceSchema,
  problems: rows(sectionSchema, 8, "Eight problems is plenty"),
  capabilities: rows(capabilitySchema, 12),
  stats: rows(statSchema, 4, "The stat band fits four"),
  process: rows(sectionSchema, 8),
  faqs: rows(faqSchema, 12),
  related: z
    .array(z.string().trim().min(1).max(140))
    .max(4, "Four related services is plenty")
    .default([])
    // De-duped here; whether each slug exists is a database question, so the
    // service layer checks that.
    .transform((slugs) => [...new Set(slugs.map(slugify))]),
  sortOrder: z.number().int().min(0).max(999).default(0),
  status: serviceStatusSchema.default("draft"),
});

export type ServiceInput = z.infer<typeof serviceInputSchema>;
export type ServiceInputValues = z.input<typeof serviceInputSchema>;

export const serviceFormSchema = serviceInputSchema
  .refine((input) => input.status !== "published" || input.capabilities.length > 0, {
    path: ["capabilities"],
    message: "A published service page needs at least one capability",
  })
  .refine((input) => !input.imageSrc || Boolean(input.imageAlt?.trim()), {
    path: ["imageAlt"],
    message: "Describe the image for screen readers",
  })
  // A service cannot be related to itself: the related-services strip would
  // render a card linking back to the page you are already on.
  .refine((input) => !input.related.includes(input.slug), {
    path: ["related"],
    message: "A service cannot be related to itself",
  });

export const serviceFilterSchema = z.object({
  status: serviceStatusSchema.optional(),
  query: z.string().trim().max(120).optional(),
});
export type ServiceFilter = z.infer<typeof serviceFilterSchema>;
