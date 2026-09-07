"use client";

import { useActionState, useEffect, useRef } from "react";
import { addNoteAction, type ActionState } from "@/lib/leads/actions";

const initial: ActionState = {};

export function NoteForm({ leadId }: { leadId: string }) {
  const [state, action, pending] = useActionState(addNoteAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <input type="hidden" name="leadId" value={leadId} />
      <label htmlFor="body" className="block text-xs font-semibold text-slate-700">
        Add a note
      </label>
      <textarea
        id="body"
        name="body"
        rows={3}
        required
        placeholder="Called and left a voicemail; following up Thursday."
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-brand-700 focus:outline-none"
      />
      {state.error && (
        <p role="alert" className="text-xs font-semibold text-red-600">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-brand-800 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-900 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save note"}
      </button>
    </form>
  );
}
