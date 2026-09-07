"use client";

import { useState } from "react";
import { getAttribution } from "@/lib/attribution";
import { site } from "@/lib/site";

export type LeadFormStatus =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "error"; message: string; fieldErrors?: Record<string, string[]> }
  | { kind: "success"; message: string };

/**
 * One submit path for every lead form on the site — the modal and the inline
 * contact form both use this, so validation handling, attribution capture and
 * error copy can never drift apart.
 */
export function useLeadSubmit(source: string) {
  const [status, setStatus] = useState<LeadFormStatus>({ kind: "idle" });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus({ kind: "sending" });

    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      company: String(data.get("company") ?? ""),
      service: String(data.get("service") ?? ""),
      message: String(data.get("message") ?? ""),
      _gotcha: String(data.get("_gotcha") ?? ""),
      source,
      ...getAttribution(),
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        form.reset();
        setStatus({
          kind: "success",
          message: `Thank you, ${payload.name}! Your request is in — our team will contact you shortly.`,
        });
        return;
      }

      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
        fieldErrors?: Record<string, string[]>;
      };
      setStatus({
        kind: "error",
        message:
          body.error ??
          `Something went wrong submitting your request. Please reach us on WhatsApp at ${site.phone}.`,
        fieldErrors: body.fieldErrors,
      });
    } catch {
      setStatus({
        kind: "error",
        message: `We couldn't reach the server. Please check your connection, or message us on WhatsApp at ${site.phone}.`,
      });
    }
  }

  const fieldErrors = status.kind === "error" ? (status.fieldErrors ?? {}) : {};
  return { status, submit, fieldErrors, reset: () => setStatus({ kind: "idle" }) };
}

export const leadInputClass =
  "w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:border-brand-700";
export const leadErrorInputClass = "border-red-400 bg-red-50";
