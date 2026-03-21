/**
 * POST /api/chat/submit
 *
 * Called when the intake conversation is complete.
 * Steps:
 *  1. Uses Claude to generate a structured Hebrew summary from the conversation
 *  2. Sends summary to Nevet via WhatsApp (WAHA)
 *  3. Creates a Notion entry (if configured)
 *  4. Triggers N8N lead-agent webhook (if configured)
 *
 * Body: { messages: { role: "user"|"assistant"; content: string }[] }
 */

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/* ── Summary generator ──────────────────────────────────────────── */

async function generateSummary(
  messages: { role: string; content: string }[]
): Promise<string> {
  const msg = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 800,
    system: `אתה עוזר שמפיק סיכומים מובנים של שיחות קבלה לפרויקטים הנדסיים.
צור סיכום קצר וברור בעברית בפורמט ווטסאפ (כוכביות לבולד).
כלול: שם + חברה, סוג פרויקט, מיקום/גודל, לוח זמנים, תקציב, אתגר/בעיה, טלפון.
אם מידע חסר — ציין "לא צוין".
פתח ב: 🏗️ *סיכום פרויקט — NBH Engineering*`,
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

/* ── WhatsApp via WAHA ──────────────────────────────────────────── */

async function sendWhatsApp(summary: string): Promise<void> {
  const base = process.env.WAHA_BASE_URL;
  const to = process.env.WAHA_TO_NUMBER;
  const session = process.env.WAHA_SESSION ?? "default";
  if (!base || !to) return;

  await fetch(`${base}/api/sendText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.WAHA_API_KEY ? { "X-Api-Key": process.env.WAHA_API_KEY } : {}),
    },
    body: JSON.stringify({ session, chatId: `${to}@c.us`, text: summary }),
  });
}

/* ── Notion lead ────────────────────────────────────────────────── */

async function createNotionLead(summary: string, name: string): Promise<void> {
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
        Name: { title: [{ text: { content: name || "ליד מצ'אטבוט" } }] },
        Status: { select: { name: "ליד חדש" } },
        Source: { select: { name: "צ'אטבוט AI" } },
        Challenge: { rich_text: [{ text: { content: summary.slice(0, 2000) } }] },
        Date: { date: { start: new Date().toISOString() } },
      },
    }),
  });
}

/* ── N8N hook ───────────────────────────────────────────────────── */

async function triggerN8N(summary: string): Promise<void> {
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
      source: "chatbot",
      summary,
      timestamp: new Date().toISOString(),
    }),
  });
}

/* ── Route handler ──────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as {
      messages: { role: string; content: string }[];
    };

    if (!messages?.length) {
      return NextResponse.json({ error: "אין הודעות" }, { status: 400 });
    }

    // Extract a name heuristically from the first few user messages
    const firstUserMsg = messages.find((m) => m.role === "user")?.content ?? "";
    const name = firstUserMsg.split(/[\s,،]/)[0] ?? "לקוח";

    const summary = await generateSummary(messages);

    await Promise.allSettled([
      sendWhatsApp(summary),
      createNotionLead(summary, name),
      triggerN8N(summary),
    ]);

    return NextResponse.json({ ok: true, summary });
  } catch (err) {
    console.error("[chat/submit] error:", err);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
