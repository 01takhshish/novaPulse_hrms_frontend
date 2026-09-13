"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import * as service from "./service";
import { serviceStatusSchema } from "./validation";

export type ServiceFormState = {
  ok?: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
  /** Echoed back so the form can re-render what the author typed. */
  values?: Record<string, string>;
};

/**
 * The repeating sections travel as JSON in hidden inputs rather than as
 * `problems[0].title`-style field names. The form lets the author add, remove
 * and reorder rows, and re-indexing flat form keys on every one of those edits
 * is exactly the kind of parsing that quietly drops a row. Zod still validates
 * every field, so the JSON is untrusted input like any other.
 */
function readJson(formData: FormData, field: string): unknown {
  const raw = String(formData.get(field) ?? "").trim();
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    // Signals a broken form, not bad authoring — surfaced as a field error so
    // the page says something useful instead of throwing a 500.
    return null;
  }
}

function readForm(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? ""),
    name: String(formData.get("name") ?? ""),
    title: String(formData.get("title") ?? ""),
    eyebrow: String(formData.get("eyebrow") ?? ""),
    tagline: String(formData.get("tagline") ?? ""),
    description: String(formData.get("description") ?? ""),
    menuBlurb: String(formData.get("menuBlurb") ?? ""),
    icon: String(formData.get("icon") ?? ""),
    illustration: String(formData.get("illustration") ?? ""),
    imageSrc: String(formData.get("imageSrc") ?? ""),
    imageAlt: String(formData.get("imageAlt") ?? ""),
    demoService: String(formData.get("demoService") ?? ""),
    problems: readJson(formData, "problems"),
    capabilities: readJson(formData, "capabilities"),
    stats: readJson(formData, "stats"),
    process: readJson(formData, "process"),
    faqs: readJson(formData, "faqs"),
    related: readJson(formData, "related"),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    // The submit button carries the intent, so "Save draft" and "Publish" are
    // the same action with a different status.
    status: serviceStatusSchema.catch("draft").parse(formData.get("status")),
  };
}

type ServiceFormInput = ReturnType<typeof readForm>;

/** Keeps the author's work on screen when the server rejects the submission. */
function echo(input: ServiceFormInput): Record<string, string> {
  const json = (value: unknown) => JSON.stringify(value ?? []);
  return {
    slug: input.slug,
    name: input.name,
    title: input.title,
    eyebrow: input.eyebrow,
    tagline: input.tagline,
    description: input.description,
    menuBlurb: input.menuBlurb,
    icon: input.icon,
    illustration: input.illustration,
    imageSrc: input.imageSrc,
    imageAlt: input.imageAlt,
    demoService: input.demoService,
    problems: json(input.problems),
    capabilities: json(input.capabilities),
    stats: json(input.stats),
    process: json(input.process),
    faqs: json(input.faqs),
    related: json(input.related),
    sortOrder: String(input.sortOrder),
    status: input.status,
  };
}

const JSON_FIELDS = [
  "problems",
  "capabilities",
  "stats",
  "process",
  "faqs",
  "related",
] as const;

function unparseableFields(input: ServiceFormInput): string[] {
  return JSON_FIELDS.filter((field) => input[field] === null);
}

export async function saveServiceAction(
  _prev: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  const user = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const input = readForm(formData);

  const broken = unparseableFields(input);
  if (broken.length > 0) {
    return {
      message: "Some sections could not be read. Reload the page and try again.",
      fieldErrors: Object.fromEntries(
        broken.map((field) => [field, ["This section could not be read"]]),
      ),
      values: echo(input),
    };
  }

  const result = id
    ? await service.updateService(id, input, user.id)
    : await service.createService(input, user.id);

  if (!result.ok) {
    if (result.error.kind === "unavailable") return { message: "Could not save your changes. Please try again.", values: echo(input) };
    if (result.error.kind === "not_found") {
      return { message: "That service no longer exists.", values: echo(input) };
    }
    return {
      message: "Please check the highlighted fields.",
      fieldErrors: result.error.fieldErrors,
      values: echo(input),
    };
  }

  // A new service has no URL until it exists, so hand the author straight to
  // its editor rather than leaving them on a form that would create a duplicate.
  if (!id) redirect(`/admin/services/${result.data.id}?created=1`);

  return {
    ok: true,
    values: echo(input),
    message:
      result.data.status === "published"
        ? "Published — it is live now."
        : "Draft saved.",
  };
}

/**
 * Deletion can legitimately fail — another service may still link to this one —
 * so unlike the blog's, this action reports back instead of always redirecting.
 */
export async function deleteServiceAction(
  _prev: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { message: "Nothing to delete." };

  const result = await service.deleteService(id);
  if (!result.ok) {
    if (result.error.kind === "unavailable") return { message: "Could not delete this service. Please try again." };
    if (result.error.kind === "not_found") {
      return { message: "That service no longer exists." };
    }
    return {
      message: Object.values(result.error.fieldErrors).flat().join(" "),
      fieldErrors: result.error.fieldErrors,
    };
  }
  redirect("/admin/services");
}
