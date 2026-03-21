/**
 * POST /api/n8n/trigger
 *
 * Triggers a specific N8N workflow from the Next.js app.
 * Used internally (e.g. from server actions or cron jobs) to kick off
 * AI automations without going through the contact form.
 *
 * Body:
 *   { workflow: "lead-ai-agent" | "content-update" | "weekly-report", data: {...} }
 *
 * Security: requires TRIGGER_SECRET header (internal use only).
 */

import { NextRequest, NextResponse } from "next/server";
import { triggerWebhook } from "@/lib/n8n-client";

const WORKFLOW_PATHS: Record<string, string> = {
  "lead-ai-agent":   "nbh-lead-agent",
  "content-update":  "nbh-content-update",
  "weekly-report":   "nbh-weekly-report",
  "deploy-prod":     "nbh-deploy-production",
  "deploy-staging":  "nbh-deploy-staging",
};

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.TRIGGER_SECRET;
  if (!secret) return false; // must be configured
  return req.headers.get("x-trigger-secret") === secret;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { workflow: string; data?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const webhookPath = WORKFLOW_PATHS[body.workflow];
  if (!webhookPath) {
    return NextResponse.json(
      { error: `Unknown workflow: ${body.workflow}`, available: Object.keys(WORKFLOW_PATHS) },
      { status: 400 },
    );
  }

  try {
    const result = await triggerWebhook(webhookPath, {
      ...body.data,
      triggeredAt: new Date().toISOString(),
      triggeredBy: "nextjs-api",
    });

    return NextResponse.json({ ok: true, workflow: body.workflow, result });
  } catch (err) {
    console.error("[n8n/trigger] error:", err);
    return NextResponse.json({ error: "Failed to trigger workflow" }, { status: 502 });
  }
}
