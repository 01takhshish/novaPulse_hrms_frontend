"use client";

import { useActionState } from "react";
import { signInAction, type SignInState } from "@/lib/auth/actions";

const initial: SignInState = {};

export function SignInForm() {
  const [state, action, pending] = useActionState(signInAction, initial);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-brand-700 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-brand-700 focus:outline-none"
        />
      </div>

      {state.error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-brand-800 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-900 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
