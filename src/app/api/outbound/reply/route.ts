/**
 * POST /api/outbound/reply
 *
 * Webhook called by the third-party LinkedIn tool (Waalaxy / Heyreach / etc.)
 * when a prospect replies to an outbound message. Also callable manually.
 *
 * Auth:  X-Outbound-Secret header must match OUTBOUND_TRIGGER_SECRET.
 * Body:  { targetId: string, replyText: string, repliedAt?: ISO string }
 *
 * 1. Marks the target as `replied` and stamps Last Contact in Notion.
 * 2. Appends the reply text as a comment on the target's page.
 * 3. Sends Nevet a Resend email with the reply preview + Notion link.
 */

import { NextRequest, NextResponse } from "next/server";
import { logReply, getTarget } from "@/lib/notion-client";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

interface ReplyBody {
  targetId?: string;
  replyText?: string;
  repliedAt?: string;
}

function log(payload: Record<string, unknown>): void {
  console.log(JSON.stringify(payload));
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function authorize(req: NextRequest): boolean {
  const expected = process.env.OUTBOUND_TRIGGER_SECRET;
  if (!expected) return false;
  const supplied = req.headers.get("x-outbound-secret") ?? "";
  return constantTimeEqual(supplied, expected);
}

function escape(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendReplyNotification(args: {
  targetName: string;
  targetCompany?: string;
  targetLinkedIn?: string;
  replyText: string;
  notionUrl: string;
  repliedAt: string;
}): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = process.env.EMAIL_TO;
  if (!key || !from || !to) return { ok: false, error: "missing_config" };

  try {
    const resend = new Resend(key);
    const headerLine = args.targetCompany
      ? `${escape(args.targetName)} · ${escape(args.targetCompany)}`
      : escape(args.targetName);

    const linkedInLink = args.targetLinkedIn
      ? `<a href="${escape(args.targetLinkedIn)}" style="color:#6366f1;text-decoration:none;font-weight:600;">פרופיל LinkedIn ↗</a>`
      : "";

    const html = `<!doctype html>
<html lang="he" dir="rtl">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:24px;background:#f8fafc;font-family:Heebo,'Segoe UI',Arial,sans-serif;color:#0f172a;direction:rtl;text-align:right;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.06);">
    <tr><td style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:24px 28px;color:#ffffff;">
      <div style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.85;">Outbound · Reply</div>
      <div style="margin-top:6px;font-size:18px;font-weight:700;">${headerLine}</div>
    </td></tr>
    <tr><td style="padding:28px;">
      <p style="margin:0 0 8px;font-size:13px;color:#64748b;">${escape(args.repliedAt)}</p>
      <h3 style="margin:0 0 8px;font-size:14px;color:#0f172a;">תוכן התשובה</h3>
      <div style="font-size:14px;line-height:1.7;color:#334155;background:#f8fafc;border-radius:12px;padding:14px;white-space:pre-wrap;">${escape(args.replyText)}</div>
      <p style="margin:18px 0 0;display:flex;gap:10px;flex-wrap:wrap;">
        <a href="${escape(args.notionUrl)}" style="display:inline-block;background:#6366f1;color:#ffffff;padding:10px 18px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">פתח ב-Notion ↗</a>
        ${linkedInLink}
      </p>
    </td></tr>
    <tr><td style="padding:18px 28px;background:#f1f5f9;color:#64748b;font-size:12px;">NBH Engineering Solutions · Outbound Pipeline</td></tr>
  </table>
</body></html>`;

    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject: `📩 תשובה מ-${args.targetName}${args.targetCompany ? ` (${args.targetCompany})` : ""}`,
      html,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "resend_unknown_error" };
  }
}

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();

  if (!authorize(req)) {
    log({ requestId, event: "reply_unauthorized" });
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: ReplyBody;
  try {
    body = (await req.json()) as ReplyBody;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const targetId = body.targetId?.trim();
  const replyText = body.replyText?.trim();
  if (!targetId || !replyText) {
    return NextResponse.json({ error: "missing_targetId_or_replyText" }, { status: 400 });
  }
  const repliedAt = body.repliedAt ?? new Date().toISOString();

  log({ requestId, event: "reply_received", targetId, length: replyText.length });

  try {
    await logReply(targetId, replyText);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log({ requestId, channel: "notion", status: "fail", error: message });
    return NextResponse.json({ error: "notion_failed", requestId, detail: message }, { status: 500 });
  }
  log({ requestId, channel: "notion", status: "ok" });

  let targetName = "לקוח";
  let targetCompany: string | undefined;
  let targetLinkedIn: string | undefined;
  try {
    const target = await getTarget(targetId);
    if (target) {
      targetName = target.name || targetName;
      targetCompany = target.company;
      targetLinkedIn = target.linkedinUrl;
    }
  } catch (err) {
    log({
      requestId,
      channel: "notion_get_target",
      status: "fail",
      error: err instanceof Error ? err.message : String(err),
    });
  }

  const notionUrl = `https://www.notion.so/${targetId.replace(/-/g, "")}`;
  const emailRes = await sendReplyNotification({
    targetName,
    targetCompany,
    targetLinkedIn,
    replyText,
    notionUrl,
    repliedAt,
  });
  log({
    requestId,
    channel: "email_reply_notification",
    status: emailRes.ok ? "ok" : "fail",
    error: emailRes.error,
  });

  return NextResponse.json({ ok: true, requestId });
}
