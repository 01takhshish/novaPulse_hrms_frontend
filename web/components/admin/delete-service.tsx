"use client";

import { useActionState } from "react";
import { FaTrash } from "react-icons/fa6";
import { deleteServiceAction, type ServiceFormState } from "@/lib/services/actions";

const EMPTY: ServiceFormState = {};

/**
 * Unlike deleting a post, this can be refused — another service may still list
 * this one as related — so the button reports back instead of always
 * redirecting.
 */
export function DeleteService({ id, name }: { id: string; name: string }) {
  const [state, formAction, pending] = useActionState(deleteServiceAction, EMPTY);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
      >
        <FaTrash className="text-[10px]" /> {pending ? "Deleting…" : "Delete service"}
      </button>
      {state.message && (
        <p role="status" className="mt-2.5 text-[11px] font-semibold text-rose-700">
          {state.message}
        </p>
      )}
    </form>
  );
}
