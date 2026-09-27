"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { FaCheck, FaPhone, FaWhatsapp, FaXmark } from "react-icons/fa6";
import { useDemoModal } from "@/components/demo-modal";
import { Icon } from "@/components/icon";
import {
  customPlanPoints,
  pricingHeading,
  pricingIntro,
  pricingNote,
  quoteFactors,
} from "@/content/pricing";
import { site } from "@/lib/site";

export function PricingButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const close = useCallback(() => setIsOpen(false), []);

  // Escape to dismiss, focus trapped inside the dialog, page frozen behind it,
  // and focus returned to whatever opened it.
  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    const focusable = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => el.offsetParent !== null);

    focusable()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const [first] = items;
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, [isOpen, close]);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={className}>
        {children}
      </button>
      {isOpen && <PricingModal ref={dialogRef} onClose={close} />}
    </>
  );
}

function PricingModal({
  onClose,
  ref,
}: {
  onClose: () => void;
  ref?: React.Ref<HTMLDivElement>;
}) {
  const openDemo = useDemoModal();

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-start p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pricingModalTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        className="bg-white w-full max-w-3xl rounded-3xl border border-slate-200 shadow-2xl relative text-slate-800 my-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close pricing"
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors z-10"
        >
          <FaXmark className="text-lg" />
        </button>

        <div className="p-6 md:p-10">
          <div className="max-w-xl mb-8 pr-10">
            <span className="text-xs font-bold text-brand-800 uppercase tracking-wider">
              NovaPulse HRMS Plans
            </span>
            <h3
              id="pricingModalTitle"
              className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1"
            >
              {pricingHeading}
            </h3>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">{pricingIntro}</p>
          </div>

          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
            What shapes your plan
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quoteFactors.map((factor) => (
              <div
                key={factor.title}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200"
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-800 flex items-center justify-center text-sm shrink-0">
                    <Icon name={factor.icon} />
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm">{factor.title}</h5>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{factor.blurb}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-900 text-white p-6 md:p-8">
            <h4 className="text-lg font-extrabold">Already set up for requirements like</h4>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-200">
              {customPlanPoints.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <FaCheck className="text-brand-300 mt-0.5 shrink-0" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openDemo("HRMS & Payroll", "pricing-custom");
                }}
                className="px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-sm font-bold transition-colors"
              >
                Connect With Us
              </button>
              <a
                href={site.whatsappWithMessage}
                target="_blank"
                rel="noopener"
                className="px-6 py-3 rounded-xl border border-slate-600 hover:bg-slate-800 text-sm font-bold transition-colors inline-flex items-center justify-center gap-2"
              >
                <FaWhatsapp className="text-emerald-400" /> WhatsApp
              </a>
              <a
                href={site.phoneHref}
                className="px-6 py-3 rounded-xl border border-slate-600 hover:bg-slate-800 text-sm font-bold transition-colors inline-flex items-center justify-center gap-2"
              >
                <FaPhone className="text-brand-300" /> {site.phone}
              </a>
            </div>
          </div>

          <p className="mt-6 text-[11px] text-slate-500 leading-relaxed">{pricingNote}</p>
        </div>
      </div>
    </div>
  );
}
