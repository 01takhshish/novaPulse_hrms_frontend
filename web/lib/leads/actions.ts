"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/guard";
import * as service from "./service";
import { createNoteSchema, updateLeadStatusSchema } from "./validation";

export type ActionState = { error?: string; success?: boolean };

/**
 * Mutations for the admin UI. Every one re-checks the session server-side —
 * the layout guard protects rendering, not POSTs.
 */
export async function updateLeadStatusAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const parsed = updateLeadStatusSchema.safeParse({
    leadId: formData.get("leadId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return { error: "Invalid status update." };

  const updated = await service.updateLeadStatus(parsed.data.leadId, parsed.data.status);
  if (!updated) return { error: "Lead not found." };

  revalidatePath("/admin");
  revalidatePath(`/admin/leads/${parsed.data.leadId}`);
  return { success: true };
}

export async function addNoteAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = createNoteSchema.safeParse({
    leadId: formData.get("leadId"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid note." };
  }

  await service.addNote({
    leadId: parsed.data.leadId,
    authorId: user.id,
    authorName: user.name,
    body: parsed.data.body,
  });

  revalidatePath(`/admin/leads/${parsed.data.leadId}`);
  return { success: true };
}
