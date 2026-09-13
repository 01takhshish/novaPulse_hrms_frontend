"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import * as service from "./service";
import { postStatusSchema } from "./validation";

export type PostFormState = {
  ok?: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
  /** Echoed back so the form can re-render what the author typed. */
  values?: Record<string, string>;
};

/** "HRMS, Payroll , ,Compliance" -> ["HRMS", "Payroll", "Compliance"] */
function parseTags(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function readForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    body: String(formData.get("body") ?? ""),
    author: String(formData.get("author") ?? "Nova Pulse"),
    tags: parseTags(formData.get("tags")),
    coverUrl: String(formData.get("coverUrl") ?? ""),
    coverAlt: String(formData.get("coverAlt") ?? ""),
    featured: formData.get("featured") === "on",
    // The submit button carries the intent, so "Save draft" and "Publish" are
    // the same action with a different status.
    status: postStatusSchema.catch("draft").parse(formData.get("status")),
  };
}

/** Keeps the author's typing on screen when the server rejects the submission. */
function echo(input: ReturnType<typeof readForm>): Record<string, string> {
  return {
    title: input.title,
    slug: input.slug,
    description: input.description,
    body: input.body,
    author: input.author,
    tags: input.tags.join(", "),
    coverUrl: input.coverUrl,
    coverAlt: input.coverAlt,
    featured: input.featured ? "on" : "",
    status: input.status,
  };
}

export async function savePostAction(
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const user = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const input = readForm(formData);

  const result = id
    ? await service.updatePost(id, input, user.id)
    : await service.createPost(input, user.id);

  if (!result.ok) {
    if (result.error.kind === "unavailable") return { message: "Could not save your changes. Please try again.", values: echo(input) };
    if (result.error.kind === "not_found") {
      return { message: "That post no longer exists.", values: echo(input) };
    }
    return {
      message: "Please check the highlighted fields.",
      fieldErrors: result.error.fieldErrors,
      values: echo(input),
    };
  }

  // A new post has no URL until it exists, so hand the author straight to its
  // editor rather than leaving them on a form that would create a duplicate.
  if (!id) redirect(`/admin/blog/${result.data.id}?created=1`);

  return {
    ok: true,
    values: echo(input),
    message:
      result.data.status === "published" ? "Published — it is live now." : "Draft saved.",
  };
}

export async function deletePostAction(_prev: PostFormState, formData: FormData): Promise<PostFormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { message: "Nothing to delete." };
  const result = await service.deletePost(id);
  if (!result.ok) return { message: result.error.kind === "not_found" ? "That post no longer exists." : "Could not delete this post. Please try again." };
  redirect("/admin/blog");
}
