/**
 * POST /api/contact
 *
 * Lead intake from the website contact form.
 *
 * Phase 1 (live):
 *   1. Notion          — canonical lead store (awaited)
 *   2. Resend          — confirmation email to the lead (if email provided)
 *   3. Resend          — notification email to Nevet, with the Notion link
 *
 * Phase 2 (deferred — only fire if env is set):
 *   4. n8n webhook     — orchestration
 *   5. WAHA            — WhatsApp ping to Nevet
 *
 * The user always sees `{ ok: true }` on a 200 — channel failures are logged
 * as structured JSON keyed by requestId so we can grep them in Netlify logs.
 */

import { NextRequest, NextResponse } from "next/server";
import { createLead, type NotionLead } from "@/lib/notion-client";
import {
  sendLeadConfirmation,
  sendLeadNotification,
} from "@/lib/email-client";

interface ContactPayload {
  name: string;
  company?: string;
  phone: string;
  email?: string;
  challenge: string;
  source?: string;
}

/* ── Phase 2 channels (deferred) ────────────────────────────────────── */

async function triggerN8N(payload: ContactPayload): Promise<void> {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) throw new Error("not_configured");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.N8N_WEBHOOK_SECRET
        ? { "x-webhook-secret": process.env.N8N_WEBHOOK_SECRET }
        : {}),
    },
    body: JSON.stringify({
      ...payload,
      timestamp: new Date().toISOString(),
      site: process.env.NEXT_PUBLIC_SITE_NAME,
    }),
  });
  if (!res.ok) throw new Error(`n8n_${res.status}`);
}

async function sendWhatsApp(payload: ContactPayload): Promise<void> {
  const base = process.env.WAHA_BASE_URL;
  const to = process.env.WAHA_TO_NUMBER;
  const session = process.env.WAHA_SESSION ?? "default";
  if (!base || !to) throw new Error("not_configured");

  const text =
    `🔔 *ליד חדש — NBH Engineering*\n\n` +
    `👤 *שם:* ${payload.name}\n` +
    `🏢 *חברה:* ${payload.company || "לא צוין"}\n` +
    `📱 *טלפון:* ${payload.phone}\n\n` +
    `💬 *האתגר:*\n${payload.challenge}`;

  const res = await fetch(`${base}/api/sendText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.WAHA_API_KEY
        ? { "X-Api-Key": process.env.WAHA_API_KEY }
        : {}),
    },
    body: JSON.stringify({
      session,
      chatId: `${to}@c.us`,
      text,
    }),
  });
  if (!res.ok) throw new Error(`waha_${res.status}`);
}

/* ── Rate limiting (in-memory, swap for Upstash in prod) ─────────────── */

const ipMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const window = 60_000;
  const max = 3;
  const timestamps = (ipMap.get(ip) ?? []).filter((t) => now - t < window);
  timestamps.push(now);
  ipMap.set(ip, timestamps);
  return timestamps.length > max;
}

/* ── Validation ──────────────────────────────────────────────────────── */

function validate(body: Partial<ContactPayload>): string | null {
  if (!body.name?.trim()) return "שם חובה";
  if (!body.phone?.trim()) return "טלפון חובה";
  if (!body.challenge?.trim()) return "תיאור האתגר חובה";
  if (body.name.length > 120) return "שם ארוך מדי";
  if (body.challenge.length > 2000) return "תיאור ארוך מדי";
  if (body.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) {
    return "אימייל לא תקין";
  }
  return null;
}

/* ── Logging helpers ─────────────────────────────────────────────────── */

function log(payload: Record<string, unknown>): void {
  console.log(JSON.stringify(payload));
}

function logChannel(
  requestId: string,
  channel: string,
  result: PromiseSettledResult<unknown>,
  extra?: Record<string, unknown>,
): void {
  if (result.status === "fulfilled") {
    log({ requestId, channel, status: "ok", ...extra });
  } else {
    log({
      requestId,
      channel,
      status: "fail",
      error: String(result.reason instanceof Error ? result.reason.message : result.reason),
      ...extra,
    });
  }
}

/* ── Route handler ───────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(ip)) {
      log({ requestId, event: "rate_limited", ip });
      return NextResponse.json(
        { error: "יותר מדי בקשות. נסה שוב בעוד דקה." },
        { status: 429 },
      );
    }

    const body = (await req.json()) as Partial<ContactPayload>;
    const error = validate(body);
    if (error) {
      log({ requestId, event: "validation_error", error });
      return NextResponse.json({ error }, { status: 400 });
    }

    const payload: ContactPayload = {
      name: body.name!.trim(),
      company: body.company?.trim() || undefined,
      phone: body.phone!.trim(),
      email: body.email?.trim() || undefined,
      challenge: body.challenge!.trim(),
      source: body.source,
    };

    log({
      requestId,
      event: "lead_received",
      route: "contact",
      name: payload.name,
      company: payload.company,
      hasEmail: Boolean(payload.email),
    });

    const leadForNotion: NotionLead = {
      name: payload.name,
      company: payload.company,
      phone: payload.phone,
      email: payload.email,
      challenge: payload.challenge,
      source: "website-form",
    };

    // 1) Notion is canonical — await it so we can include the URL in Nevet's email.
    const notionResult = await createLead(leadForNotion);
    log({
      requestId,
      channel: "notion",
      status: notionResult.ok ? "ok" : "fail",
      pageId: notionResult.pageId,
      error: notionResult.error,
    });

    // 2) Fan out the rest in parallel.
    const tasks: Array<Promise<unknown>> = [
      sendLeadNotification(leadForNotion, notionResult.url),
      triggerN8N(payload),
      sendWhatsApp(payload),
    ];
    if (payload.email) {
      tasks.push(
        sendLeadConfirmation({ name: payload.name, email: payload.email }),
      );
    }

    const [notifyRes, n8nRes, whatsappRes, confirmRes] =
      await Promise.allSettled(tasks);

    logChannel(requestId, "email_notification", notifyRes);
    logChannel(requestId, "n8n", n8nRes);
    logChannel(requestId, "whatsapp", whatsappRes);
    if (confirmRes) logChannel(requestId, "email_confirmation", confirmRes);

    return NextResponse.json({ ok: true, requestId }, { status: 200 });
  } catch (err) {
    log({
      requestId,
      event: "unhandled_error",
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
