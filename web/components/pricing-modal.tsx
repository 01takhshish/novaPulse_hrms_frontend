"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { useDemoModal } from "@/components/demo-modal";
import { customPlanPoints, hrmsPlans as plans, pricingDisclaimer } from "@/content/pricing";

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
  const bookDemo = (source: string) => {
    onClose();
    openDemo("HRMS & Payroll", source);
  };

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
        className="bg-white w-full max-w-5xl rounded-3xl border border-slate-200 shadow-2xl relative text-slate-800 my-8"
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
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-brand-800 uppercase tracking-wider">
              NovaPulse HRMS Pricing
            </span>
            <h3 id="pricingModalTitle" className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
              Plans That Grow With Your Business
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              Simple, transparent plans for teams of every size — upgrade as your workforce grows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-6 flex flex-col ${
                  plan.popular
                    ? "border-brand-800 shadow-lg shadow-brand-900/10"
                    : "border-slate-200 shadow-sm"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-brand-800 text-white text-[10px] font-bold uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                <h4 className="font-extrabold text-slate-900 text-lg">{plan.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{plan.blurb}</p>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-slate-900">{plan.price}</span>
                  <span className="text-sm text-slate-500 font-medium"> / month</span>
                </div>
                <p className="text-xs font-bold text-brand-800 mt-2">{plan.limit}</p>
                <p className="text-[11px] text-slate-500">{plan.extra}</p>
                <ul className="mt-4 space-y-2.5 text-xs text-slate-700 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <FaCheck className="text-brand-700 mt-0.5 shrink-0" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => bookDemo(`pricing-${plan.id}`)}
                  className={`mt-6 w-full py-3 rounded-xl text-sm font-bold transition-colors ${
                    plan.popular
                      ? "bg-brand-800 hover:bg-brand-900 text-white shadow-md shadow-brand-900/20"
                      : "border border-brand-800 text-brand-800 hover:bg-brand-50"
                  }`}
                >
                  Book a Demo
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-900 text-white p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h4 className="text-lg font-extrabold">Custom Plan</h4>
              <p className="text-xs text-slate-300 mt-0.5">Built Around Your Business</p>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-200">
                {customPlanPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <FaCheck className="text-brand-300 mt-0.5 shrink-0" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-slate-300 mb-4">
                Tell us your workforce size and requirements. We&apos;ll create a plan around
                your business.
              </p>
              <button
                type="button"
                onClick={() => bookDemo("pricing-custom")}
                className="px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-sm font-bold transition-colors"
              >
                Get Custom Quote
              </button>
            </div>
          </div>

          <p className="mt-6 text-[11px] text-slate-500 text-center leading-relaxed">
            {pricingDisclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}
