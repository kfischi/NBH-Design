/**
 * POST /api/outbound/generate-drafts
 *
 * Daily cron entry point. Pulls targets with status=ready_for_outreach,
 * asks Claude to draft a personalized LinkedIn message for each, writes
 * the draft to Notion, and flips the target to status=draft_ready.
 *
 * Auth:    X-Outbound-Secret header must match OUTBOUND_TRIGGER_SECRET.
 * Body:    { dryRun?: boolean, limit?: number } — limit defaults to 10.
 * Returns: { processed, skipped, drafts: [...], errors: [...] }
 *
 * If the whole batch fails (Notion unreachable, etc.) Nevet gets a Resend
 * email so silent failure isn't an option.
 */

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  listTargetsReadyForOutreach,
  createDraft,
  updateTargetStatus,
  type OutboundTarget,
} from "@/lib/notion-client";
import {
  OUTBOUND_SYSTEM_PROMPT,
  buildOutboundUserMessage,
  parseDraftResponse,
  type OutboundDraftJson,
} from "@/lib/prompts/outbound-message";
import { Resend } from "resend";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface GenerateBody {
  dryRun?: boolean;
  limit?: number;
}

interface DraftResult {
  targetId: string;
  targetName: string;
  draftId?: string;
  preview: string;
  rationale: string;
  status: "created" | "skipped_insufficient_data" | "skipped_invalid_response";
}

interface ErrorResult {
  targetId: string;
  targetName: string;
  error: string;
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

async function generateOne(
  target: OutboundTarget,
  touchNumber: number,
): Promise<OutboundDraftJson | null> {
  const userMessage = buildOutboundUserMessage(target, touchNumber);

  const msg = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 600,
    system: OUTBOUND_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const block = msg.content[0];
  const text = block?.type === "text" ? block.text : "";
  return parseDraftResponse(text);
}

async function notifyFailure(
  requestId: string,
  errorMessage: string,
): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = process.env.EMAIL_TO;
  if (!key || !from || !to) return;

  try {
    const resend = new Resend(key);
    await resend.emails.send({
      from,
      to: [to],
      subject: "⚠ אצווה outbound נכשלה היום",
      html: `<!doctype html><html lang="he" dir="rtl"><body style="font-family:Heebo,Arial,sans-serif;padding:24px;color:#0f172a;direction:rtl;text-align:right;">
        <h2 style="color:#dc2626;margin:0 0 12px;">אצווה outbound נכשלה</h2>
        <p>ה-cron היומי לא הצליח להריץ את כתיבת הטיוטות.</p>
        <p><strong>requestId:</strong> ${requestId}</p>
        <pre style="background:#f1f5f9;padding:12px;border-radius:8px;direction:ltr;text-align:left;white-space:pre-wrap;">${errorMessage.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] ?? c))}</pre>
        <p style="color:#64748b;font-size:13px;">בדוק את לוגי Netlify לפי ה-requestId לעיל.</p>
      </body></html>`,
    });
  } catch (err) {
    log({
      requestId,
      channel: "failure_email",
      status: "fail",
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();

  if (!authorize(req)) {
    log({ requestId, event: "outbound_unauthorized" });
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: GenerateBody = {};
  try {
    body = (await req.json()) as GenerateBody;
  } catch {
    body = {};
  }
  const dryRun = body.dryRun === true;
  const limit = Math.min(Math.max(body.limit ?? 10, 1), 25);

  log({ requestId, event: "outbound_batch_start", dryRun, limit });

  let targets: OutboundTarget[];
  try {
    targets = await listTargetsReadyForOutreach(limit);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log({ requestId, event: "outbound_batch_failed", stage: "list", error: message });
    await notifyFailure(requestId, `Failed to list targets: ${message}`);
    return NextResponse.json({ error: "list_failed", requestId }, { status: 500 });
  }

  log({ requestId, event: "outbound_targets_loaded", count: targets.length });

  const drafts: DraftResult[] = [];
  const errors: ErrorResult[] = [];

  for (const target of targets) {
    try {
      // Touch number: 1 if no prior contact, otherwise default to 2.
      // Refine later by counting existing drafts for this target.
      const touchNumber = target.lastContact ? 2 : 1;

      const json = await generateOne(target, touchNumber);
      if (!json) {
        drafts.push({
          targetId: target.id,
          targetName: target.name,
          preview: "",
          rationale: "",
          status: "skipped_invalid_response",
        });
        log({ requestId, channel: "claude", targetId: target.id, status: "invalid_response" });
        continue;
      }

      if (json.body === "SKIP_INSUFFICIENT_DATA") {
        drafts.push({
          targetId: target.id,
          targetName: target.name,
          preview: "",
          rationale: json.rationale,
          status: "skipped_insufficient_data",
        });
        log({ requestId, channel: "claude", targetId: target.id, status: "skipped" });
        continue;
      }

      if (dryRun) {
        drafts.push({
          targetId: target.id,
          targetName: target.name,
          preview: json.body,
          rationale: json.rationale,
          status: "created",
        });
        continue;
      }

      const created = await createDraft({
        targetId: target.id,
        subject: json.subject,
        channel: "linkedin_dm",
        touchNumber,
        body: json.body,
        notes: json.rationale,
      });

      await updateTargetStatus(target.id, "draft_ready");

      drafts.push({
        targetId: target.id,
        targetName: target.name,
        draftId: created.pageId,
        preview: json.body,
        rationale: json.rationale,
        status: "created",
      });
      log({
        requestId,
        channel: "notion",
        targetId: target.id,
        draftId: created.pageId,
        status: "created",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push({ targetId: target.id, targetName: target.name, error: message });
      log({
        requestId,
        channel: "draft_per_target",
        targetId: target.id,
        status: "fail",
        error: message,
      });
    }
  }

  log({
    requestId,
    event: "outbound_batch_done",
    processed: drafts.filter((d) => d.status === "created").length,
    skipped: drafts.filter((d) => d.status !== "created").length,
    errors: errors.length,
  });

  // If every target errored, treat as a hard failure and email Nevet.
  if (targets.length > 0 && errors.length === targets.length) {
    await notifyFailure(
      requestId,
      `All ${targets.length} targets failed.\n\n${errors
        .map((e) => `- ${e.targetName}: ${e.error}`)
        .join("\n")}`,
    );
  }

  return NextResponse.json({
    requestId,
    dryRun,
    processed: drafts.filter((d) => d.status === "created").length,
    skipped: drafts.filter((d) => d.status !== "created").length,
    drafts,
    errors,
  });
}
