"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { FaXmark } from "react-icons/fa6";
import {
  leadErrorInputClass,
  leadInputClass,
  useLeadSubmit,
} from "@/lib/use-lead-submit";
type OpenModal = (service?: string, source?: string) => void;

/**
 * Replaces the legacy global `openDemoModal(service)`. Sections stay server
 * components and opt into the client boundary only by rendering <DemoButton>.
 */
const DemoModalContext = createContext<OpenModal | null>(null);

export function useDemoModal() {
  const open = useContext(DemoModalContext);
  if (!open) throw new Error("useDemoModal must be used inside <DemoModalProvider>");
  return open;
}

export function DemoModalProvider({
  children,
  serviceOptions,
}: {
  children: ReactNode;
  serviceOptions: readonly string[];
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [service, setService] = useState("General Inquiry");
  const [source, setSource] = useState("unknown");

  const open = useCallback<OpenModal>((next = "General Inquiry", from = "unknown") => {
    setService(next);
    setSource(from);
    setIsOpen(true);
  }, []);

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
    <DemoModalContext.Provider value={open}>
      {children}
      {isOpen && (
        <DemoModal ref={dialogRef} service={service} serviceOptions={serviceOptions} source={source} onClose={close} />
      )}
    </DemoModalContext.Provider>
  );
}

export function DemoButton({
  service = "General Inquiry",
  source = "unknown",
  className,
  children,
}: {
  service?: string;
  /** Which CTA this was, so the admin can see what actually converts. */
  source?: string;
  className?: string;
  children: ReactNode;
}) {
  const open = useDemoModal();
  return (
    <button type="button" onClick={() => open(service, source)} className={className}>
      {children}
    </button>
  );
}

function DemoModal({
  service,
  serviceOptions,
  source,
  onClose,
  ref,
}: {
  service: string;
  serviceOptions: readonly string[];
  source: string;
  onClose: () => void;
  ref?: React.Ref<HTMLDivElement>;
}) {
  const { status, submit, fieldErrors } = useLeadSubmit(source);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl relative text-slate-800 my-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors"
        >
          <FaXmark className="text-lg" />
        </button>

        <div className="p-8 md:p-10">
          <div className="mb-6">
            <span className="text-xs font-bold text-brand-800 uppercase tracking-wider">
              Schedule Demonstration
            </span>
            <h3 id="modalTitle" className="text-2xl font-extrabold text-slate-900 mt-1">
              Book a Free Demo
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Connect directly with our technical team to explore customized solutions.
            </p>
          </div>

          {status.kind === "success" ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
              <p className="text-4xl" aria-hidden="true">🎉</p>
              <p className="mt-3 text-sm font-semibold text-emerald-900">{status.message}</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 px-6 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white text-sm font-bold transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-4">
              {/* Honeypot: invisible to people, irresistible to bots. */}
              <div aria-hidden="true" className="absolute h-px w-px overflow-hidden [clip-path:inset(50%)]">
                <label htmlFor="_gotcha">Leave this field empty</label>
                <input id="_gotcha" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field id="name" label="Your Name" errors={fieldErrors.name}>
                  <input id="name" name="name" type="text" required autoComplete="name" placeholder="e.g., Praveen Sharma" className={`${leadInputClass} ${fieldErrors.name ? leadErrorInputClass : ""}`} />
                </Field>
                <Field id="phone" label="Mobile Number" errors={fieldErrors.phone}>
                  <input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="+91 98765 43210" className={`${leadInputClass} ${fieldErrors.phone ? leadErrorInputClass : ""}`} />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field id="company" label="Company Name" errors={fieldErrors.company}>
                  <input id="company" name="company" type="text" required autoComplete="organization" placeholder="e.g., Enterprise Ltd" className={`${leadInputClass} ${fieldErrors.company ? leadErrorInputClass : ""}`} />
                </Field>
                <Field id="email" label="Official Email" errors={fieldErrors.email}>
                  <input id="email" name="email" type="email" required autoComplete="email" placeholder="name@company.com" className={`${leadInputClass} ${fieldErrors.email ? leadErrorInputClass : ""}`} />
                </Field>
              </div>

              <Field id="service" label="Primary Requirement" errors={fieldErrors.service}>
                <select
                  id="service"
                  name="service"
                  required
                  defaultValue={service}
                  className={`${leadInputClass} cursor-pointer bg-white text-slate-900 hover:border-brand-300 focus:ring-2 focus:ring-brand-100 ${fieldErrors.service ? leadErrorInputClass : ""}`}
                >
                  {serviceOptions.map((value) => (
                    <option key={value} value={value} className="bg-white text-slate-900">
                      {value}
                    </option>
                  ))}
                </select>
              </Field>

              <Field id="message" label="Message / Requirements (Optional)" optional errors={fieldErrors.message}>
                <textarea id="message" name="message" rows={2} placeholder="Tell us about your team size, locations, or current requirements..." className={leadInputClass} />
              </Field>

              {status.kind === "error" && (
                <p role="alert" className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                  {status.message}
                </p>
              )}

              <button
                type="submit"
                disabled={status.kind === "sending"}
                className="w-full mt-2 py-3.5 rounded-xl bg-brand-800 hover:bg-brand-900 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold transition-all shadow-md shadow-brand-900/20"
              >
                {status.kind === "sending" ? "Submitting..." : "Book My Demo"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  optional,
  errors,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  errors?: string[];
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-700 mb-1">
        {label} {!optional && <span className="text-red-500">*</span>}
      </label>
      {children}
      {errors?.[0] && (
        <p className="mt-1 text-[11px] font-semibold text-red-600">{errors[0]}</p>
      )}
    </div>
  );
}
