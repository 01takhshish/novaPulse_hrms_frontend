"use client";

import { useId } from "react";
import { FaArrowDown, FaArrowUp, FaPlus, FaTrash } from "react-icons/fa6";
import { ErrorText, labelText } from "@/components/admin/fields";

/**
 * The editor for one of a service page's repeating sections — problems,
 * capabilities, process steps, FAQs, stats.
 *
 * Rows are React state and are submitted as a single JSON hidden input rather
 * than as `problems[0].title` field names, because the author can add, remove
 * and reorder them and re-indexing flat form keys on every one of those edits
 * is how rows quietly go missing. The server treats the JSON as untrusted input
 * and runs it through Zod like anything else.
 */
export function Repeatable<T extends Record<string, unknown>>({
  name,
  label,
  hint,
  rows,
  onChange,
  blank,
  max,
  error,
  serialize,
  summary,
  children,
}: {
  name: string;
  label: string;
  hint?: string;
  rows: T[];
  onChange: (rows: T[]) => void;
  blank: () => T;
  max: number;
  error?: string[];
  /**
   * Rows are edited as strings — a number input hands back "" while you are
   * mid-type — so a section whose stored shape is not its editing shape
   * converts here, once, on the way into the hidden input.
   */
  serialize?: (rows: T[]) => unknown;
  /** Collapsed-row heading, so a long list stays scannable. */
  summary: (row: T, index: number) => string;
  children: (row: T, set: (patch: Partial<T>) => void, index: number) => React.ReactNode;
}) {
  const groupId = useId();

  const update = (index: number, patch: Partial<T>) =>
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <section aria-labelledby={groupId}>
      <input type="hidden" name={name} value={JSON.stringify(serialize ? serialize(rows) : rows)} />

      <div className="mb-2 flex items-center justify-between">
        <span id={groupId} className={labelText}>
          {label}
        </span>
        <span className="text-[11px] text-slate-400">
          {rows.length} of {max}
        </span>
      </div>

      <div className="space-y-3">
        {rows.map((row, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="truncate text-[11px] font-bold uppercase tracking-widest text-slate-400">
                {index + 1}. {summary(row, index) || "Untitled"}
              </p>
              <div className="flex shrink-0 items-center gap-1">
                <RowButton
                  label={`Move ${label} ${index + 1} up`}
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  <FaArrowUp />
                </RowButton>
                <RowButton
                  label={`Move ${label} ${index + 1} down`}
                  disabled={index === rows.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <FaArrowDown />
                </RowButton>
                <RowButton
                  label={`Remove ${label} ${index + 1}`}
                  danger
                  onClick={() => onChange(rows.filter((_, i) => i !== index))}
                >
                  <FaTrash />
                </RowButton>
              </div>
            </div>
            <div className="space-y-3">
              {children(row, (patch) => update(index, patch), index)}
            </div>
          </div>
        ))}
      </div>

      {rows.length < max && (
        <button
          type="button"
          onClick={() => onChange([...rows, blank()])}
          className="mt-3 inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-3.5 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-brand-400 hover:text-brand-800"
        >
          <FaPlus className="text-[10px]" /> Add {label.toLowerCase().replace(/s$/, "")}
        </button>
      )}

      {error ? (
        <ErrorText>{error[0]}</ErrorText>
      ) : hint ? (
        <p className="mt-2 text-[11px] text-slate-400">{hint}</p>
      ) : null}
    </section>
  );
}

function RowButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`rounded-md p-1.5 text-[10px] transition-colors disabled:opacity-30 ${
        danger
          ? "text-rose-500 hover:bg-rose-50"
          : "text-slate-500 hover:bg-slate-200/70 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}
