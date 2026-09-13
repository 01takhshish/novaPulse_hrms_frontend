import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/guard";
import { signOutAction } from "@/lib/auth/actions";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Nova Pulse Admin" },
  robots: { index: false, follow: false },
};

/** Guards every page beneath it; /admin/login deliberately sits outside. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-base font-extrabold text-slate-900">
              Nova Pulse
            </Link>
            <AdminNav isAdmin={user.role === "admin"} />
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/" className="font-semibold text-slate-500 hover:text-slate-900">
              View site
            </Link>
            <span className="hidden text-slate-400 sm:inline">{user.email}</span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
