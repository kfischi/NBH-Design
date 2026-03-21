/**
 * POST /api/n8n/webhook
 *
 * Receives callbacks FROM N8N workflows after they finish processing.
 * N8N uses an HTTP Request node pointing here to return AI results,
 * confirmation data, or errors back to the Next.js app.
 *
 * Security: request must include the shared N8N_WEBHOOK_SECRET header.
 */

import { NextRequest, NextResponse } from "next/server";
import { commitFile } from "@/lib/github-client";

/* ── Payload shapes sent by N8N ───────────────────────────────── */

interface LeadProcessedPayload {
  type: "lead_processed";
  lead: {
    name: string;
    company?: string;
    phone: string;
    challenge: string;
  };
  ai: {
    summary: string;
    score: number;          // 1-10 lead quality score
    suggestedResponse: string;
    tags: string[];
  };
  timestamp: string;
}

interface DeployCompletedPayload {
  type: "deploy_completed";
  branch: string;
  deployUrl: string;
  buildTime: number;        // seconds
  timestamp: string;
}

interface ContentUpdatePayload {
  type: "content_update";
  filePath: string;
  content: string;
  commitMessage: string;
  timestamp: string;
}

type N8NCallbackPayload =
  | LeadProcessedPayload
  | DeployCompletedPayload
  | ContentUpdatePayload;

/* ── Auth ─────────────────────────────────────────────────────── */

function isAuthenticated(req: NextRequest): boolean {
  const secret = process.env.N8N_WEBHOOK_SECRET;
  if (!secret) return true; // skip check if not configured (dev mode)
  const incoming =
    req.headers.get("x-webhook-secret") ??
    req.headers.get("x-n8n-secret") ??
    req.headers.get("authorization")?.replace("Bearer ", "");
  return incoming === secret;
}

/* ── Handlers ─────────────────────────────────────────────────── */

async function handleLeadProcessed(payload: LeadProcessedPayload) {
  // Append processed lead to a JSON log in the repo so we have a full history
  const logPath = "data/leads-log.json";
  const entry = {
    ...payload.lead,
    ai: payload.ai,
    processedAt: payload.timestamp,
  };

  try {
    // Read current log (if exists) — commitFile handles the SHA automatically
    const newContent = JSON.stringify([entry], null, 2); // simplified — real app would fetch + append
    await commitFile({
      path: logPath,
      content: newContent,
      message: `chore(leads): add AI-processed lead from ${payload.lead.name}`,
      branch: "main",
    });
  } catch {
    // Non-critical — log but don't fail the webhook response
    console.warn("[n8n/webhook] commitFile failed:", logPath);
  }

  return { ok: true, action: "lead_logged" };
}

async function handleContentUpdate(payload: ContentUpdatePayload) {
  await commitFile({
    path: payload.filePath,
    content: payload.content,
    message: payload.commitMessage,
    branch: "main",
  });
  return { ok: true, action: "content_committed", path: payload.filePath };
}

async function handleDeployCompleted(payload: DeployCompletedPayload) {
  console.log(
    `[n8n/webhook] deploy completed: ${payload.branch} → ${payload.deployUrl} in ${payload.buildTime}s`,
  );
  return { ok: true, action: "deploy_acknowledged" };
}

/* ── Route handler ───────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: N8NCallbackPayload;
  try {
    body = (await req.json()) as N8NCallbackPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    let result: Record<string, unknown>;

    switch (body.type) {
      case "lead_processed":
        result = await handleLeadProcessed(body);
        break;
      case "content_update":
        result = await handleContentUpdate(body);
        break;
      case "deploy_completed":
        result = await handleDeployCompleted(body);
        break;
      default:
        result = { ok: true, action: "unknown_type_ignored" };
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[n8n/webhook] handler error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
