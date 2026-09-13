import { ContentConflict } from "@/lib/db/content-write";
import { databaseErrorCode, reportError } from "@/lib/errors";
import "server-only";
import { revalidatePath } from "next/cache";
import { err, ok, type Result } from "@/lib/result";
import type { ServicePageRow } from "@/lib/db/schema";
import * as repo from "./repository";
import { serviceFormSchema, type ServiceInput } from "./validation";

export type ServiceMutationError =
  | { kind: "validation"; fieldErrors: Record<string, string[]> }
  | { kind: "not_found" }
  | { kind: "unavailable" };

/**
 * Service pages are not just their own route: the header menu on *every* page is
 * built from them, `/services` lists them, `/about` names them and the related
 * strip on sibling services links to them. Revalidating the root layout is
 * heavier than the per-path calls the blog uses, but it is the only thing that
 * actually clears the menu — and a service is published or renamed rarely
 * enough that the cost is irrelevant.
 */
function revalidateServices() {
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
}

function fieldError(field: string, message: string): ServiceMutationError {
  return { kind: "validation", fieldErrors: { [field]: [message] } };
}

/**
 * `related` is a list of slugs, and nothing at the database level stops it
 * pointing at a page that was never created. Checked here rather than in the
 * Zod schema because it needs a query.
 */
async function checkRelated(input: ServiceInput): Promise<ServiceMutationError | null> {
  if (input.related.length === 0) return null;
  const found = await repo.existingSlugs(input.related);
  const missing = input.related.filter((slug) => !found.has(slug));
  if (missing.length === 0) return null;
  return fieldError(
    "related",
    `No service page with ${missing.length === 1 ? "the slug" : "the slugs"} ${missing.join(", ")}`,
  );
}

function parse(raw: unknown): Result<ServiceInput, ServiceMutationError> {
  const parsed = serviceFormSchema.safeParse(raw);
  if (!parsed.success) {
    return err({
      kind: "validation",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    });
  }
  return ok(parsed.data);
}

export async function createService(
  raw: unknown,
  userId: string,
): Promise<Result<ServicePageRow, ServiceMutationError>> {
  try {
  const parsed = parse(raw);
  if (!parsed.ok) return parsed;
  const input = parsed.data;

  // Checked before insert so the author gets a field error rather than a
  // unique-constraint 500.
  if (await repo.findBySlug(input.slug)) {
    return err(fieldError("slug", "A service with that slug already exists"));
  }

  const relatedError = await checkRelated(input);
  if (relatedError) return err(relatedError);

  const row = await repo.insertService({
    slug: input.slug,
    name: input.name,
    title: input.title,
    eyebrow: input.eyebrow,
    tagline: input.tagline,
    description: input.description,
    menuBlurb: input.menuBlurb,
    icon: input.icon,
    illustration: input.illustration,
    imageSrc: input.imageSrc ?? null,
    imageAlt: input.imageAlt ?? null,
    demoService: input.demoService,
    problems: input.problems,
    capabilities: input.capabilities,
    stats: input.stats,
    process: input.process,
    faqs: input.faqs,
    related: input.related,
    sortOrder: input.sortOrder,
    status: input.status,
    createdBy: userId,
    updatedBy: userId,
  });

  if (row.status === "published") revalidateServices();
  return ok(row);
  } catch (error) {
    if (error instanceof ContentConflict) return err(fieldError(error.field, error.message));
    if (databaseErrorCode(error) === "23505") return err(fieldError("slug", "That URL is already in use."));
    reportError("services-write", error);
    return err({ kind: "unavailable" });
  }
}

export async function updateService(
  id: string,
  raw: unknown,
  userId: string,
): Promise<Result<ServicePageRow, ServiceMutationError>> {
  try {
  const existing = await repo.findById(id);
  if (!existing) return err({ kind: "not_found" });

  const parsed = parse(raw);
  if (!parsed.ok) return parsed;
  const input = parsed.data;

  const clash = await repo.findBySlug(input.slug);
  if (clash && clash.id !== id) {
    return err(fieldError("slug", "A service with that slug already exists"));
  }

  const relatedError = await checkRelated(input);
  if (relatedError) return err(relatedError);

  const row = await repo.updateService(id, input, { userId });
  if (!row) return err({ kind: "not_found" });

  // Unpublishing has to take the page down as reliably as publishing puts it up.
  if (row.status === "published" || existing.status === "published") {
    revalidateServices();
  }
  return ok(row);
  } catch (error) {
    if (error instanceof ContentConflict) return err(fieldError(error.field, error.message));
    if (databaseErrorCode(error) === "23505") return err(fieldError("slug", "That URL is already in use."));
    reportError("services-write", error);
    return err({ kind: "unavailable" });
  }
}

/**
 * Refused while another service still lists this one as related, because the
 * alternative is a related-services card that 404s. Telling the author which
 * pages to edit first is more useful than silently rewriting their content.
 */
export async function deleteService(
  id: string,
): Promise<Result<true, ServiceMutationError>> {
  try {
  const existing = await repo.findById(id);
  if (!existing) return err({ kind: "not_found" });

  const referencing = (await repo.findReferencing(existing.slug)).filter(
    (row) => row.id !== id,
  );
  if (referencing.length > 0) {
    return err(
      fieldError(
        "related",
        `Remove it from the related services on ${referencing.map((row) => row.name).join(", ")} first`,
      ),
    );
  }

  await repo.deleteService(id);
  if (existing.status === "published") revalidateServices();
  return ok(true);
  } catch (error) {
    if (error instanceof ContentConflict) return err(fieldError(error.field, error.message));
    if (databaseErrorCode(error) === "23505") return err(fieldError("slug", "That URL is already in use."));
    reportError("services-write", error);
    return err({ kind: "unavailable" });
  }
}

export const listAll = repo.listAll;
export const findById = repo.findById;
