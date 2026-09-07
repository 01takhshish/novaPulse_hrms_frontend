"use client";

import { useId, useState, type ReactNode } from "react";

/**
 * Accessible disclosure. Uses button + aria-expanded rather than <details> so
 * the open/close height can be animated and only one item stays open.
 */
export function Accordion({
  items,
}: {
  items: { question: string; answer: ReactNode }[];
}) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.question}
            className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-colors ${
              isOpen ? "border-brand-300" : "border-slate-200"
            }`}
          >
            <h3>
              <button
                type="button"
                id={`${base}-btn-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${base}-panel-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-bold text-slate-900 hover:bg-slate-50"
              >
                {item.question}
                <span
                  aria-hidden="true"
                  className={`shrink-0 text-xl leading-none text-brand-700 transition-transform duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={`${base}-panel-${i}`}
              role="region"
              aria-labelledby={`${base}-btn-${i}`}
              hidden={!isOpen}
              className="px-6 pb-5"
            >
              <div className="text-sm leading-relaxed text-slate-600">{item.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
