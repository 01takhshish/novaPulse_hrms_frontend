"use client";

import { useActionState } from "react";
import { FaTrash } from "react-icons/fa6";
import { deleteLeadAction, type ActionState } from "@/lib/leads/actions";

const EMPTY: ActionState = {};

export function DeleteLead({ id, name }: { id: string; name: string }) {
  const [state, action, pending] = useActionState(deleteLeadAction, EMPTY);

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm(`Delete the lead from ${name}? This cannot be undone.`)) event.preventDefault();
      }}
    >
      <input type="hidden" name="leadId" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-bold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
      >
        <FaTrash className="text-[10px]" /> {pending ? "Deleting…" : "Delete"}
      </button>
      {state.error && <p role="alert" className="mt-1 text-[11px] font-medium text-red-700">{state.error}</p>}
    </form>
  );
}
