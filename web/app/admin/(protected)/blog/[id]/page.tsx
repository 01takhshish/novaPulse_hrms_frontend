import { requireAdmin } from "@/lib/auth/guard";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { PostForm, type PostFormValues } from "@/components/admin/post-form";
import { DeletePost } from "@/components/admin/delete-post";
import { formatPostDate } from "@/lib/blog/derive";
import { findById } from "@/lib/blog/service";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit post" };

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const { id } = await params;
  // A malformed id would make the uuid comparison throw, so treat anything
  // that isn't a real post as a 404 rather than a 500.
  const post = await findById(id);
  if (!post) notFound();

  const justCreated = "created" in (await searchParams);

  const initial: PostFormValues = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    description: post.description,
    body: post.body,
    author: post.author,
    tags: post.tags.join(", "),
    coverUrl: post.coverUrl ?? "",
    coverAlt: post.coverAlt ?? "",
    featured: post.featured,
    status: post.status,
  };

  return (
    <div className="space-y-6">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition-colors hover:text-brand-800"
      >
        <FaArrowLeft className="text-[10px]" /> Blog
      </Link>

      {justCreated && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
          Post created. Keep editing below — changes save when you hit Save draft or Publish.
        </p>
      )}

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Edit post</h1>
        <p className="mt-1 text-xs text-slate-500">
          Last edited {formatPostDate(post.updatedAt)}
          {post.publishedAt && ` · published ${formatPostDate(post.publishedAt)}`}
        </p>
      </div>

      <PostForm
        initial={initial}
        onDelete={<DeletePost id={post.id} title={post.title} />}
      />
    </div>
  );
}
