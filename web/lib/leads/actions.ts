"use server";

import { reportError } from "@/lib/errors";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guard";
import * as service from "./service";
import { createNoteSchema, deleteLeadSchema, updateLeadStatusSchema } from "./validation";

export type ActionState = { error?: string; success?: boolean };

/**
 * Mutations for the admin UI. Every one re-checks the session server-side —
 * the layout guard protects rendering, not POSTs.
 */
export async function updateLeadStatusAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = updateLeadStatusSchema.safeParse({
    leadId: formData.get("leadId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return { error: "Invalid status update." };

  try {
  const updated = await service.updateLeadStatus(parsed.data.leadId, parsed.data.status);
  if (!updated) return { error: "Lead not found." };

  revalidatePath("/admin");
  revalidatePath(`/admin/leads/${parsed.data.leadId}`);
  return { success: true };
  } catch (error) {
    reportError("lead-update", error);
    return { error: "Could not save your changes. Please try again." };
  }
}

export async function addNoteAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAdmin();

  const parsed = createNoteSchema.safeParse({
    leadId: formData.get("leadId"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid note." };
  }

  try {
  const note = await service.addNote({
    leadId: parsed.data.leadId,
    authorId: user.id,
    authorName: user.name,
    body: parsed.data.body,
  });
  if (!note) return { error: "Lead no longer exists." };

  revalidatePath(`/admin/leads/${parsed.data.leadId}`);
  return { success: true };
  } catch (error) {
    reportError("lead-update", error);
    return { error: "Could not save your changes. Please try again." };
  }
}

/** Permanently removes a lead and its dependent notes and notification job. */
export async function deleteLeadAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = deleteLeadSchema.safeParse({ leadId: formData.get("leadId") });
  if (!parsed.success) return { error: "Invalid lead." };

  const result = await service.deleteLead(parsed.data.leadId);
  if (!result.ok) {
    return {
      error:
        result.error.kind === "not_found"
          ? "This lead has already been deleted."
          : "Could not delete this lead. Please try again.",
    };
  }

  revalidatePath("/admin");
  redirect("/admin");
}
