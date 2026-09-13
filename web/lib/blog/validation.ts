import { z } from "zod";
import { slugify } from "./derive";

/**
 * Shared by the admin editor form and the server actions, so the browser and
 * the server enforce exactly the same rules. Free of server-only imports.
 */
export const postStatuses = ["draft", "published"] as const;
export type PostStatus = (typeof postStatuses)[number];
export const postStatusSchema = z.enum(postStatuses);

/**
 * Reserved because /blog/<slug> would collide with a real route, or because the
 * value reads like one. Normalised through `slugify` at construction, since the
 * value being checked has already been through it — comparing a raw "feed.xml"
 * against a slugified "feed-xml" would never match.
 */
const RESERVED_SLUGS = new Set(
  ["feed.xml", "tag", "new", "edit", "admin", "api"].map(slugify),
);

const slugSchema = z
  .string()
  .trim()
  .min(3, "Slug must be at least 3 characters")
  .max(140)
  .transform(slugify)
  .refine((value) => value.length >= 3, "Slug must contain letters or numbers")
  .refine((value) => !RESERVED_SLUGS.has(value), "That slug is reserved");

/**
 * Cover images come back from Vercel Blob as absolute URLs; the migrated posts
 * reference files already in /public. Both are allowed, nothing else is —
 * a `javascript:` or `data:` URL here would end up in an <img src>.
 */
const coverUrlSchema = z
  .string()
  .trim()
  .max(600)
  .refine(
    (value) =>
      value === "" ||
      value.startsWith("/images/") ||
      /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//.test(value),
    "Upload a cover image, or use a path beginning /images/",
  )
  .optional()
  .transform((value) => (value ? value : undefined));

export const postInputSchema = z.object({
  title: z.string().trim().min(4, "Give the post a title").max(200),
  slug: slugSchema,
  description: z
    .string()
    .trim()
    .min(20, "Write a short description — it is the meta description and the card blurb")
    .max(320),
  body: z.string().trim().max(100_000, "Keep the article under 100,000 characters"),
  author: z.string().trim().min(2).max(120).default("Nova Pulse"),
  tags: z
    .array(z.string().trim().min(1).max(40))
    .max(6, "Six tags is plenty")
    .default([])
    // Case-insensitive de-dupe, first spelling wins, so the /blog tag filter
    // does not end up with both "HRMS" and "hrms".
    .transform((tags) => {
      const seen = new Set<string>();
      return tags.filter((tag) => {
        const key = tag.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }),
  coverUrl: coverUrlSchema,
  coverAlt: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((value) => (value ? value : undefined)),
  featured: z.coerce.boolean().default(false),
  status: postStatusSchema.default("draft"),
});

export type PostInput = z.infer<typeof postInputSchema>;

/**
 * A cover with no alt text is invisible to a screen reader and fails the
 * accessibility bar the rest of the site meets, so the pair is required
 * together or not at all.
 */
export const postFormSchema = postInputSchema.refine(
  (value) => value.status !== "published" || value.body.length >= 50,
  { path: ["body"], message: "Write at least 50 characters before publishing" },
).refine(
  (value) => !value.coverUrl || Boolean(value.coverAlt),
  { path: ["coverAlt"], message: "Describe the image for screen readers" },
);

export const postFilterSchema = z.object({
  status: postStatusSchema.optional(),
  query: z.string().trim().max(120).optional(),
});

export type PostFilter = z.infer<typeof postFilterSchema>;
