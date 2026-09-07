import "server-only";
import { Resend } from "resend";
import { emailConfigured, env } from "@/lib/env";

let client: Resend | null = null;

function resend(): Resend {
  if (!client) client = new Resend(env().RESEND_API_KEY);
  return client;
}

/**
 * Notifications must never take a lead down with them: if Resend is
 * unconfigured or erroring, the lead is already committed and we only log.
 */
export async function sendEmail(message: {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<{ sent: boolean; reason?: string }> {
  if (!emailConfigured()) {
    return { sent: false, reason: "email_not_configured" };
  }
  try {
    const e = env();
    await resend().emails.send({
      from: e.LEAD_NOTIFICATION_FROM!,
      to: e.LEAD_NOTIFICATION_TO!,
      subject: message.subject,
      html: message.html,
      text: message.text,
      replyTo: message.replyTo,
    });
    return { sent: true };
  } catch (error) {
    console.error("[email] send failed", error);
    return { sent: false, reason: "send_failed" };
  }
}
