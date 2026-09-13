import { requireAdmin } from "@/lib/auth/guard";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { PostForm, type PostFormValues } from "@/components/admin/post-form";

export const metadata = { title: "New post" };

const BLANK: PostFormValues = {
  title: "",
  slug: "",
  description: "",
  body: "",
  author: "Nova Pulse",
  tags: "",
  coverUrl: "",
  coverAlt: "",
  featured: false,
  status: "draft",
};

export default async function NewPostPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition-colors hover:text-brand-800"
      >
        <FaArrowLeft className="text-[10px]" /> Blog
      </Link>
      <h1 className="text-2xl font-extrabold text-slate-900">New post</h1>
      <PostForm initial={BLANK} />
    </div>
  );
}
