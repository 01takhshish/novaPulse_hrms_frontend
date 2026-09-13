import "server-only";
import type { Lead } from "@/lib/leads/types";
import { siteUrl } from "@/lib/site";
import { sendEmail } from "./client";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

export async function sendLeadNotification(lead: Lead) {
  const adminUrl = `${siteUrl}/admin/leads/${lead.id}`;
  const rows: Array<[string, string | null]> = [
    ["Name", lead.name],
    ["Company", lead.company],
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["Requirement", lead.service],
    ["Message", lead.message],
    ["Source", lead.source],
    ["Campaign", lead.utmCampaign],
  ];

  const text = [
    `New enquiry from ${lead.name} (${lead.company})`,
    "",
    ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
    "",
    `Open in admin: ${adminUrl}`,
  ].join("\n");

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:560px">
      <p style="font-size:12px;letter-spacing:1px;color:#6b21a8;font-weight:700;margin:0 0 4px">
        NEW ENQUIRY
      </p>
      <h1 style="font-size:20px;margin:0 0 16px;color:#0f172a">
        ${escapeHtml(lead.name)} — ${escapeHtml(lead.company)}
      </h1>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${rows
          .filter(([, v]) => v)
          .map(
            ([k, v]) => `<tr>
              <td style="padding:6px 12px 6px 0;color:#64748b;vertical-align:top;white-space:nowrap">${k}</td>
              <td style="padding:6px 0;color:#0f172a">${escapeHtml(String(v))}</td>
            </tr>`,
          )
          .join("")}
      </table>
      <p style="margin:24px 0 0">
        <a href="${adminUrl}" style="background:#6b21a8;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block">
          Open in admin
        </a>
      </p>
    </div>`;

  return sendEmail({
    subject: `New enquiry: ${lead.name} — ${lead.service}`,
    html,
    text,
    replyTo: lead.email,
    idempotencyKey: `lead-${lead.id}`,
  });
}
