import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/admin/sign-in-form";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await getSessionUser()) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
            Nova Pulse
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900">Lead dashboard</h1>
          <p className="mt-1 text-xs text-slate-500">Sign in to manage enquiries.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
