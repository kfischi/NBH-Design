/**
 * POST /api/chat/submit
 *
 * Called when the AI intake conversation finishes. Steps:
 *   1. Claude generates a structured Hebrew summary of the conversation.
 *   2. Notion (canonical) — create a lead row with the summary attached.
 *   3. Resend — notification email to Nevet, with link to the Notion page.
 *   4. Resend — confirmation email to the lead (only if email was extracted).
 *   5. n8n + WAHA — fire if env is set, otherwise skip (Phase 2).
 *
 * Body: { messages: { role: "user"|"assistant"; content: string }[] }
 */

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createLead, type NotionLead } from "@/lib/notion-client";
import {
  sendLeadConfirmation,
  sendLeadNotification,
} from "@/lib/email-client";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface ChatMessage {
  role: string;
  content: string;
}

/* ── Summary generator ──────────────────────────────────────────────── */

async function generateSummary(messages: ChatMessage[]): Promise<string> {
  const msg = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 800,
    system: `אתה עוזר שמפיק סיכומים מובנים של שיחות קבלה לפרויקטים הנדסיים.
צור סיכום קצר וברור בעברית בפורמט ווטסאפ (כוכביות לבולד).
כלול: שם + חברה, סוג פרויקט, מיקום/גודל, לוח זמנים, תקציב, אתגר/בעיה, טלפון.
אם מידע חסר — ציין "לא צוין".
פתח ב: 🏗️ *סיכום פרויקט — Proto-Model*`,
    messages: [
      {
        role: "user",
        content: `להלן שיחת הקבלה המלאה:\n\n${messages
          .map((m) => `${m.role === "user" ? "לקוח" : "יועץ"}: ${m.content}`)
          .join("\n\n")}\n\nצור סיכום מובנה.`,
      },
    ],
  });

  const block = msg.content[0];
  return block.type === "text" ? block.text : "";
}

/* ── Heuristic extraction from the user-side of the conversation ─────── */

interface ExtractedLead {
  name: string;
  company?: string;
  phone?: string;
  email?: string;
}

function extractLead(messages: ChatMessage[]): ExtractedLead {
  const userText = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n");

  const emailMatch = userText.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  const phoneMatch = userText.match(
    /(?:\+?972[-.\s]?|0)5\d[-.\s]?\d{3}[-.\s]?\d{4}/,
  );

  const firstUserMsg = messages.find((m) => m.role === "user")?.content ?? "";
  const firstWord = firstUserMsg.trim().split(/[\s,،]+/)[0] ?? "";
  const name = firstWord.length > 1 && firstWord.length < 40 ? firstWord : "לקוח";

  return {
    name,
    phone: phoneMatch?.[0],
    email: emailMatch?.[0],
  };
}

/* ── Phase 2 channels (deferred) ────────────────────────────────────── */

async function sendWhatsApp(summary: string): Promise<void> {
  const base = process.env.WAHA_BASE_URL;
  const to = process.env.WAHA_TO_NUMBER;
  const session = process.env.WAHA_SESSION ?? "default";
  if (!base || !to) throw new Error("not_configured");

  const res = await fetch(`${base}/api/sendText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.WAHA_API_KEY
        ? { "X-Api-Key": process.env.WAHA_API_KEY }
        : {}),
    },
    body: JSON.stringify({ session, chatId: `${to}@c.us`, text: summary }),
  });
  if (!res.ok) throw new Error(`waha_${res.status}`);
}

async function triggerN8N(summary: string, lead: ExtractedLead): Promise<void> {
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
      source: "chatbot",
      summary,
      lead,
      timestamp: new Date().toISOString(),
    }),
  });
  if (!res.ok) throw new Error(`n8n_${res.status}`);
}

/* ── Logging helpers ─────────────────────────────────────────────────── */

function log(payload: Record<string, unknown>): void {
  console.log(JSON.stringify(payload));
}

function logChannel(
  requestId: string,
  channel: string,
  result: PromiseSettledResult<unknown>,
): void {
  if (result.status === "fulfilled") {
    log({ requestId, channel, status: "ok" });
  } else {
    log({
      requestId,
      channel,
      status: "fail",
      error: String(
        result.reason instanceof Error ? result.reason.message : result.reason,
      ),
    });
  }
}

/* ── Route handler ──────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    const { messages } = (await req.json()) as { messages: ChatMessage[] };

    if (!messages?.length) {
      return NextResponse.json({ error: "אין הודעות" }, { status: 400 });
    }

    const extracted = extractLead(messages);
    log({
      requestId,
      event: "lead_received",
      route: "chat/submit",
      name: extracted.name,
      hasEmail: Boolean(extracted.email),
      hasPhone: Boolean(extracted.phone),
    });

    const summary = await generateSummary(messages);

    const leadForNotion: NotionLead = {
      name: extracted.name,
      phone: extracted.phone,
      email: extracted.email,
      challenge: summary,
      source: "chatbot",
      aiSummary: summary,
    };

    // 1) Notion (canonical, awaited).
    const notionResult = await createLead(leadForNotion);
    log({
      requestId,
      channel: "notion",
      status: notionResult.ok ? "ok" : "fail",
      pageId: notionResult.pageId,
      error: notionResult.error,
    });

    // 2) Fan out the rest.
    const tasks: Array<Promise<unknown>> = [
      sendLeadNotification(leadForNotion, notionResult.url),
      sendWhatsApp(summary),
      triggerN8N(summary, extracted),
    ];
    if (extracted.email) {
      tasks.push(
        sendLeadConfirmation({ name: extracted.name, email: extracted.email }),
      );
    }

    const [notifyRes, whatsappRes, n8nRes, confirmRes] =
      await Promise.allSettled(tasks);

    logChannel(requestId, "email_notification", notifyRes);
    logChannel(requestId, "whatsapp", whatsappRes);
    logChannel(requestId, "n8n", n8nRes);
    if (confirmRes) logChannel(requestId, "email_confirmation", confirmRes);

    return NextResponse.json({ ok: true, requestId, summary });
  } catch (err) {
    log({
      requestId,
      event: "unhandled_error",
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
