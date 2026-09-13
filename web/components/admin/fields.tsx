"use client";

/** The form primitives shared by the post and service editors. */

export const input =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100";
export const labelText = "text-xs font-bold text-slate-700";

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelText}>{label}</span>
      <div className="mt-1.5">{children}</div>
      {error ? <ErrorText>{error[0]}</ErrorText> : hint ? (
        <span className="mt-1.5 block text-[11px] text-slate-400">{hint}</span>
      ) : null}
    </label>
  );
}

export function ErrorText({ children }: { children: React.ReactNode }) {
  return <span className="mt-1.5 block text-[11px] font-semibold text-rose-600">{children}</span>;
}

export function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold transition-colors ${
        active ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}

export function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
        {title}
      </p>
      {children}
    </div>
  );
}
