/**
 * Resend email client.
 *
 * Two transactional emails per lead:
 *   1. Confirmation email to the lead   (only if lead.email is provided)
 *   2. Notification email to Nevet      (always, with optional Notion link)
 *
 * Required env:
 *   RESEND_API_KEY  — Resend secret
 *   EMAIL_FROM      — must be on a Resend-verified domain
 *   EMAIL_TO        — Nevet's inbox
 *
 * Templates are inline HTML (RTL Hebrew) — no external template engine.
 */

import { Resend } from "resend";
import type { NotionLead } from "@/lib/notion-client";

const BRAND = {
  name: "Proto-Model",
  primary: "#6366f1",
  secondary: "#8b5cf6",
  accent: "#06b6d4",
};

interface SendResult {
  ok: boolean;
  id?: string;
  error?: string;
}

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function envFrom(): string | null {
  return process.env.EMAIL_FROM ?? null;
}

function envTo(): string | null {
  return process.env.EMAIL_TO ?? null;
}

function escape(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shellHtml(innerHtml: string): string {
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
</head>
<body style="margin:0;padding:24px;background:#f8fafc;font-family:'Heebo','Segoe UI',Arial,sans-serif;color:#0f172a;direction:rtl;text-align:right;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.06);">
    <tr><td style="background:linear-gradient(135deg,${BRAND.primary} 0%,${BRAND.secondary} 100%);padding:24px 28px;color:#ffffff;">
      <div style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.85;">${BRAND.name}</div>
    </td></tr>
    <tr><td style="padding:28px;">${innerHtml}</td></tr>
    <tr><td style="padding:18px 28px;background:#f1f5f9;color:#64748b;font-size:12px;">
      ${BRAND.name} · givat-haim ichud · Israel
    </td></tr>
  </table>
</body>
</html>`;
}

/**
 * Confirmation email to the lead. Hebrew primary, English fallback line.
 */
export async function sendLeadConfirmation(lead: {
  name: string;
  email: string;
}): Promise<SendResult> {
  const resend = getClient();
  const from = envFrom();
  if (!resend || !from) return { ok: false, error: "missing_config" };

  const inner = `
    <h1 style="margin:0 0 12px;font-size:22px;font-weight:800;color:#0f172a;">
      תודה ${escape(lead.name)} 🙏
    </h1>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#334155;">
      קיבלנו את הפנייה שלך ב-${BRAND.name}.
      נבט יחזור אליך באופן אישי <strong>תוך 24 שעות</strong> כדי להבין את הצרכים לעומק.
    </p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#334155;">
      בינתיים — אם תרצה לדבר ישירות, אפשר לפנות במייל
      <a href="mailto:${escape(from)}" style="color:${BRAND.primary};text-decoration:none;font-weight:600;">${escape(from)}</a>.
    </p>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:22px 0;" />
    <p style="margin:0;font-size:12px;color:#64748b;direction:ltr;text-align:left;">
      Thanks for reaching out — Nevet will get back to you within 24 hours.
    </p>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: [lead.email],
      subject: "קיבלנו את הפנייה שלך — Proto-Model",
      html: shellHtml(inner),
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: data?.id };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "resend_unknown_error",
    };
  }
}

/**
 * Notification email to Nevet — full lead details + link to the Notion row.
 */
export async function sendLeadNotification(
  lead: NotionLead,
  notionUrl?: string,
): Promise<SendResult> {
  const resend = getClient();
  const from = envFrom();
  const to = envTo();
  if (!resend || !from || !to) return { ok: false, error: "missing_config" };

  const sourceLabel =
    lead.source === "chatbot" ? "צ'אטבוט AI" : "טופס יצירת קשר";

  const rows: [string, string | undefined][] = [
    ["שם", lead.name],
    ["חברה", lead.company],
    ["טלפון", lead.phone],
    ["אימייל", lead.email],
    ["מקור", sourceLabel],
    ["AI Score", typeof lead.aiScore === "number" ? `${lead.aiScore}/100` : undefined],
  ];

  const rowsHtml = rows
    .filter(([, v]) => v !== undefined && v !== "")
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding:8px 12px;font-size:13px;color:#64748b;width:110px;">${escape(k)}</td>
        <td style="padding:8px 12px;font-size:14px;color:#0f172a;font-weight:600;">${escape(String(v))}</td>
      </tr>`,
    )
    .join("");

  const notionBlock = notionUrl
    ? `<p style="margin:18px 0 0;"><a href="${escape(notionUrl)}" style="display:inline-block;background:${BRAND.primary};color:#ffffff;padding:10px 18px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">פתח ב-Notion ↗</a></p>`
    : `<p style="margin:18px 0 0;font-size:13px;color:#dc2626;">⚠ לא נכתבה רשומה ל-Notion (בדוק לוגים).</p>`;

  const inner = `
    <h1 style="margin:0 0 6px;font-size:20px;font-weight:800;color:#0f172a;">ליד חדש 🎯</h1>
    <p style="margin:0 0 18px;font-size:13px;color:#64748b;">${escape(sourceLabel)}</p>
    <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;background:#f8fafc;border-radius:12px;overflow:hidden;">${rowsHtml}</table>
    <h3 style="margin:22px 0 8px;font-size:14px;color:#0f172a;">האתגר</h3>
    <div style="font-size:14px;line-height:1.7;color:#334155;background:#f8fafc;border-radius:12px;padding:14px;white-space:pre-wrap;">${escape(lead.challenge)}</div>
    ${lead.aiSummary ? `<h3 style="margin:22px 0 8px;font-size:14px;color:#0f172a;">סיכום AI</h3><div style="font-size:14px;line-height:1.7;color:#334155;background:#eef2ff;border-radius:12px;padding:14px;white-space:pre-wrap;">${escape(lead.aiSummary)}</div>` : ""}
    ${notionBlock}
  `;

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      subject: `🎯 ליד חדש — ${lead.name}${lead.company ? ` (${lead.company})` : ""}`,
      html: shellHtml(inner),
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: data?.id };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "resend_unknown_error",
    };
  }
}

/**
 * Reachability check used by /api/health.
 * Resend has no public ping endpoint — we hit the domains list as a cheap
 * authenticated call. 401/403 means bad key.
 */
export async function pingResend(): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "missing_config" };

  try {
    const res = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (res.status === 401 || res.status === 403) {
      return { ok: false, error: `resend_${res.status}` };
    }
    if (!res.ok) return { ok: false, error: `resend_${res.status}` };
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "resend_unknown_error",
    };
  }
}
