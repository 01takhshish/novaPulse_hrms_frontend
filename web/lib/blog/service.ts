import { ContentConflict } from "@/lib/db/content-write";
import { databaseErrorCode, reportError } from "@/lib/errors";
import "server-only";
import { revalidatePath } from "next/cache";
import { err, ok, type Result } from "@/lib/result";
import type { PostRow } from "@/lib/db/schema";
import * as repo from "./repository";
import { postFormSchema, type PostInput } from "./validation";

export type PostMutationError =
  | { kind: "validation"; fieldErrors: Record<string, string[]> }
  | { kind: "not_found" }
  | { kind: "unavailable" };

/**
 * Published pages are prerendered, so a database write is invisible until the
 * affected paths are revalidated. Every mutation goes through here to make
 * forgetting one impossible.
 */
function revalidateBlog(slug: string, previousSlug?: string) {
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  // A slug change orphans the old prerendered page unless it is cleared too.
  if (previousSlug && previousSlug !== slug) revalidatePath(`/blog/${previousSlug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/blog/feed.xml");
}

function fieldError(field: string, message: string): PostMutationError {
  return { kind: "validation", fieldErrors: { [field]: [message] } };
}

/**
 * `published_at` is the public date on the article. It is stamped once, when
 * the post first goes live, and never rewritten — otherwise fixing a typo in a
 * year-old post would shove it back to the top of the blog.
 */
function resolvePublishedAt(input: PostInput, existing: PostRow | null): Date | null {
  if (input.status !== "published") return existing?.publishedAt ?? null;
  return existing?.publishedAt ?? new Date();
}

export async function createPost(
  raw: unknown,
  userId: string,
): Promise<Result<PostRow, PostMutationError>> {
  try {
  const parsed = postFormSchema.safeParse(raw);
  if (!parsed.success) {
    return err({
      kind: "validation",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    });
  }
  const input = parsed.data;

  // Checked before insert so the author gets a field error rather than a
  // unique-constraint 500.
  if (await repo.findBySlug(input.slug)) {
    return err(fieldError("slug", "A post with that slug already exists"));
  }

  const post = await repo.insertPost({
    title: input.title,
    slug: input.slug,
    description: input.description,
    body: input.body,
    author: input.author,
    tags: input.tags,
    coverUrl: input.coverUrl ?? null,
    coverAlt: input.coverAlt ?? null,
    featured: input.featured,
    status: input.status,
    publishedAt: resolvePublishedAt(input, null),
    createdBy: userId,
    updatedBy: userId,
  });

  if (post.status === "published") revalidateBlog(post.slug);
  return ok(post);
  } catch (error) {
    if (error instanceof ContentConflict) return err(fieldError(error.field, error.message));
    if (databaseErrorCode(error) === "23505") return err(fieldError("slug", "That URL is already in use."));
    reportError("blog-write", error);
    return err({ kind: "unavailable" });
  }
}

export async function updatePost(
  id: string,
  raw: unknown,
  userId: string,
): Promise<Result<PostRow, PostMutationError>> {
  try {
  const existing = await repo.findById(id);
  if (!existing) return err({ kind: "not_found" });

  const parsed = postFormSchema.safeParse(raw);
  if (!parsed.success) {
    return err({
      kind: "validation",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    });
  }
  const input = parsed.data;

  const clash = await repo.findBySlug(input.slug);
  if (clash && clash.id !== id) {
    return err(fieldError("slug", "A post with that slug already exists"));
  }

  const post = await repo.updatePost(id, input, {
    userId,
    publishedAt: resolvePublishedAt(input, existing),
  });
  if (!post) return err({ kind: "not_found" });

  // Revalidate when it is live now OR was live before — unpublishing has to
  // take the page down just as reliably as publishing puts it up.
  if (post.status === "published" || existing.status === "published") {
    revalidateBlog(post.slug, existing.slug);
  }
  return ok(post);
  } catch (error) {
    if (error instanceof ContentConflict) return err(fieldError(error.field, error.message));
    if (databaseErrorCode(error) === "23505") return err(fieldError("slug", "That URL is already in use."));
    reportError("blog-write", error);
    return err({ kind: "unavailable" });
  }
}

export async function deletePost(id: string): Promise<Result<true, PostMutationError>> {
  try {
  const existing = await repo.findById(id);
  if (!existing) return err({ kind: "not_found" });

  await repo.deletePost(id);
  if (existing.status === "published") revalidateBlog(existing.slug);
  return ok(true);
  } catch (error) {
    if (error instanceof ContentConflict) return err(fieldError(error.field, error.message));
    if (databaseErrorCode(error) === "23505") return err(fieldError("slug", "That URL is already in use."));
    reportError("blog-write", error);
    return err({ kind: "unavailable" });
  }
}

export const listAll = repo.listAll;
export const findById = repo.findById;
