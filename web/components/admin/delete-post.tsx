"use client";
import { useActionState } from "react";
import { deletePostAction, type PostFormState } from "@/lib/blog/actions";
export function DeletePost({ id, title }: { id: string; title: string }) {
  const [state, action, pending] = useActionState(deletePostAction, {} as PostFormState);
  return <form action={action} onSubmit={(event) => { if (!confirm(`Delete "${title}" permanently?`)) event.preventDefault(); }}>
    <input type="hidden" name="id" value={id} />
    <button disabled={pending} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700 disabled:opacity-50">{pending ? "Deleting…" : "Delete post"}</button>
    {state.message && <p role="alert" className="mt-2 text-sm text-red-700">{state.message}</p>}
  </form>;
}
