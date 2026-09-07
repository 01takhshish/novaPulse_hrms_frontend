"use client";

import { useActionState } from "react";
import { updateLeadStatusAction, type ActionState } from "@/lib/leads/actions";
import { leadStatuses, type LeadStatus } from "@/lib/leads/validation";

const initial: ActionState = {};

export function StatusSelect({ leadId, status }: { leadId: string; status: LeadStatus }) {
  const [state, action, pending] = useActionState(updateLeadStatusAction, initial);

  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="leadId" value={leadId} />
      <label htmlFor="status" className="sr-only">
        Lead status
      </label>
      <select
        id="status"
        name="status"
        // Remount when the persisted status changes, otherwise React keeps the
        // old DOM value and the select drifts out of sync with the badge.
        key={status}
        defaultValue={status}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold capitalize text-slate-800 focus:border-brand-700 focus:outline-none"
      >
        {leadStatuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Update"}
      </button>
      {state.error && (
        <span role="alert" className="text-xs font-semibold text-red-600">
          {state.error}
        </span>
      )}
    </form>
  );
}
