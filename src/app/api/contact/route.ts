/**
 * POST /api/contact
 *
 * Receives the lead form submission and fans out to:
 *   1. N8N webhook  → orchestrates the rest of the automation
 *   2. Email        → immediate confirmation to the lead + notification to Nevet
 *   3. WhatsApp     → WAHA push notification to Nevet's phone
 *   4. CRM          → creates a new lead/deal (HubSpot / Pipedrive / Monday / Notion)
 *
 * N8N then handles:
 *   - Slack / Teams notification (optional)
 *   - CRM enrichment
 *   - Scheduling / calendar booking link
 *   - Follow-up sequences
 */

import { NextRequest, NextResponse } from "next/server";

/* ── Types ─────────────────────────────────────────────────────────── */
interface ContactPayload {
  name: string;
  company?: string;
  phone: string;
  challenge: string;
  source?: string; // utm_source etc.
}

/* ── Helpers ────────────────────────────────────────────────────────── */

/** Fire-and-forget N8N webhook */
async function triggerN8N(payload: ContactPayload) {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) return;

  await fetch(url, {
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
}

/** Send WhatsApp message via WAHA */
async function sendWhatsApp(payload: ContactPayload) {
  const base = process.env.WAHA_BASE_URL;
  const to = process.env.WAHA_TO_NUMBER;
  const session = process.env.WAHA_SESSION ?? "default";
  if (!base || !to) return;

  const text =
    `🔔 *ליד חדש — NBH Engineering*\n\n` +
    `👤 *שם:* ${payload.name}\n` +
    `🏢 *חברה:* ${payload.company || "לא צוין"}\n` +
    `📱 *טלפון:* ${payload.phone}\n\n` +
    `💬 *האתגר:*\n${payload.challenge}`;

  await fetch(`${base}/api/sendText`, {
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
}

/** Create lead in HubSpot (example CRM) */
async function createHubSpotLead(payload: ContactPayload) {
  const apiKey = process.env.HUBSPOT_API_KEY;
  if (!apiKey) return;

  await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      properties: {
        firstname: payload.name.split(" ")[0],
        lastname: payload.name.split(" ").slice(1).join(" "),
        phone: payload.phone,
        company: payload.company ?? "",
        message: payload.challenge,
        hs_lead_status: "NEW",
        lifecyclestage: "lead",
      },
    }),
  });
}

/** Create lead in Notion database (lightweight CRM) */
async function createNotionLead(payload: ContactPayload) {
  const apiKey = process.env.NOTION_API_KEY;
  const dbId = process.env.NOTION_LEADS_DATABASE_ID;
  if (!apiKey || !dbId) return;

  await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { database_id: dbId },
      properties: {
        Name: { title: [{ text: { content: payload.name } }] },
        Company: { rich_text: [{ text: { content: payload.company ?? "" } }] },
        Phone: { phone_number: payload.phone },
        Status: { select: { name: "ליד חדש" } },
        Source: { select: { name: "אתר" } },
        Challenge: {
          rich_text: [{ text: { content: payload.challenge } }],
        },
        Date: { date: { start: new Date().toISOString() } },
      },
    }),
  });
}

/* ── Rate limiting (basic in-memory, swap for Upstash in prod) ────── */
const ipMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const window = 60_000; // 1 minute
  const max = 3;
  const timestamps = (ipMap.get(ip) ?? []).filter((t) => now - t < window);
  timestamps.push(now);
  ipMap.set(ip, timestamps);
  return timestamps.length > max;
}

/* ── Validation ─────────────────────────────────────────────────────── */
function validate(body: Partial<ContactPayload>): string | null {
  if (!body.name?.trim()) return "שם חובה";
  if (!body.phone?.trim()) return "טלפון חובה";
  if (!body.challenge?.trim()) return "תיאור האתגר חובה";
  if (body.name.length > 120) return "שם ארוך מדי";
  if (body.challenge.length > 2000) return "תיאור ארוך מדי";
  return null;
}

/* ── Route handler ──────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    // Rate limit
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "יותר מדי בקשות. נסה שוב בעוד דקה." },
        { status: 429 }
      );
    }

    const body = (await req.json()) as Partial<ContactPayload>;
    const error = validate(body);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const payload: ContactPayload = {
      name: body.name!.trim(),
      company: body.company?.trim(),
      phone: body.phone!.trim(),
      challenge: body.challenge!.trim(),
    };

    // Fan-out — all non-critical, so we use allSettled
    await Promise.allSettled([
      triggerN8N(payload),       // N8N handles email + CRM + Slack internally
      sendWhatsApp(payload),     // Instant WhatsApp ping to Nevet
      createHubSpotLead(payload),// Direct CRM write (fallback if N8N is down)
      createNotionLead(payload), // Notion CRM (lightweight)
    ]);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[contact] error:", err);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
