import { requireAdmin } from "@/lib/auth/guard";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import { listAll } from "@/lib/blog/service";
import { formatPostDate } from "@/lib/blog/derive";
import { postFilterSchema } from "@/lib/blog/validation";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminBlogPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const raw = await searchParams;
  // An unparseable query string falls back to "show everything" rather than 500ing.
  const filter = postFilterSchema.safeParse(raw).data ?? {};
  const posts = await listAll(filter);

  const counts = {
    all: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    draft: posts.filter((p) => p.status === "draft").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Blog</h1>
          <p className="mt-1 text-xs text-slate-500">
            {counts.published} published · {counts.draft} draft
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-800 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-900"
        >
          <FaPlus className="text-[10px]" /> New post
        </Link>
      </div>

      <nav className="flex flex-wrap gap-2" aria-label="Filter by status">
        <FilterChip href="/admin/blog" active={!filter.status}>
          All {counts.all}
        </FilterChip>
        <FilterChip href="/admin/blog?status=published" active={filter.status === "published"}>
          Published {counts.published}
        </FilterChip>
        <FilterChip href="/admin/blog?status=draft" active={filter.status === "draft"}>
          Drafts {counts.draft}
        </FilterChip>
      </nav>

      {posts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-sm text-slate-500">
          No posts yet. <Link href="/admin/blog/new" className="font-bold text-brand-800">Write the first one.</Link>
        </p>
      ) : (
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/admin/blog/${post.id}`}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">{post.title}</p>
                  <p className="mt-0.5 truncate text-[11px] text-slate-500">
                    /blog/{post.slug}
                    {post.tags.length > 0 && ` · ${post.tags.join(", ")}`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <span className="text-[11px] text-slate-400">
                    {post.status === "published" && post.publishedAt
                      ? formatPostDate(post.publishedAt)
                      : `Edited ${formatPostDate(post.updatedAt)}`}
                  </span>
                  <StatusBadge status={post.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
        active ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      {children}
    </Link>
  );
}

function StatusBadge({ status }: { status: "draft" | "published" }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
        status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
      }`}
    >
      {status}
    </span>
  );
}
