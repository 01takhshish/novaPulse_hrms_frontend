"use client";

import type { ReactNode } from "react";
import {
  leadErrorInputClass,
  leadInputClass,
  useLeadSubmit,
} from "@/lib/use-lead-submit";
import { services, serviceLabels, type Service } from "@/lib/site";

/** Inline version of the demo form, for pages where a modal would be the wrong shape. */
export function LeadForm({
  source,
  defaultService = "General Inquiry",
  submitLabel = "Send enquiry",
  messageLabel = "How can we help?",
  messagePlaceholder = "Tell us about your team size, locations, or current requirements...",
}: {
  source: string;
  defaultService?: Service;
  submitLabel?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
}) {
  const { status, submit, fieldErrors } = useLeadSubmit(source);

  if (status.kind === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <p className="text-4xl" aria-hidden="true">🎉</p>
        <p className="mt-3 text-base font-bold text-emerald-900">Request received</p>
        <p className="mt-2 text-sm text-emerald-800">{status.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {/* Honeypot: invisible to people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden [clip-path:inset(50%)]">
        <label htmlFor={`${source}-gotcha`}>Leave this field empty</label>
        <input id={`${source}-gotcha`} name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field id={`${source}-name`} label="Your name" errors={fieldErrors.name}>
          <input id={`${source}-name`} name="name" type="text" required autoComplete="name"
            placeholder="e.g., Praveen Sharma"
            className={`${leadInputClass} ${fieldErrors.name ? leadErrorInputClass : ""}`} />
        </Field>
        <Field id={`${source}-phone`} label="Mobile number" errors={fieldErrors.phone}>
          <input id={`${source}-phone`} name="phone" type="tel" required autoComplete="tel"
            placeholder="+91 98765 43210"
            className={`${leadInputClass} ${fieldErrors.phone ? leadErrorInputClass : ""}`} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field id={`${source}-company`} label="Company name" errors={fieldErrors.company}>
          <input id={`${source}-company`} name="company" type="text" required autoComplete="organization"
            placeholder="e.g., Enterprise Ltd"
            className={`${leadInputClass} ${fieldErrors.company ? leadErrorInputClass : ""}`} />
        </Field>
        <Field id={`${source}-email`} label="Official email" errors={fieldErrors.email}>
          <input id={`${source}-email`} name="email" type="email" required autoComplete="email"
            placeholder="name@company.com"
            className={`${leadInputClass} ${fieldErrors.email ? leadErrorInputClass : ""}`} />
        </Field>
      </div>

      <Field id={`${source}-service`} label="What do you need?" errors={fieldErrors.service}>
        <select id={`${source}-service`} name="service" required defaultValue={defaultService}
          className={leadInputClass}>
          {services.map((value) => (
            <option key={value} value={value}>{serviceLabels[value]}</option>
          ))}
        </select>
      </Field>

      <Field id={`${source}-message`} label={messageLabel} optional errors={fieldErrors.message}>
        <textarea id={`${source}-message`} name="message" rows={4}
          placeholder={messagePlaceholder} className={leadInputClass} />
      </Field>

      {status.kind === "error" && (
        <p role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-600">
          {status.message}
        </p>
      )}

      <button type="submit" disabled={status.kind === "sending"}
        className="w-full rounded-xl bg-brand-800 py-3.5 font-bold text-white shadow-md shadow-brand-900/20 transition-all hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-60">
        {status.kind === "sending" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}

function Field({
  id, label, optional, errors, children,
}: {
  id: string; label: string; optional?: boolean; errors?: string[]; children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-slate-700">
        {label} {!optional && <span className="text-red-500">*</span>}
      </label>
      {children}
      {errors?.[0] && <p className="mt-1 text-[11px] font-semibold text-red-600">{errors[0]}</p>}
    </div>
  );
}
