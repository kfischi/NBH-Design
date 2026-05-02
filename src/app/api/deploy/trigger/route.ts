/**
 * POST /api/deploy/trigger
 *
 * Unified deploy trigger endpoint — called by N8N (or any external system)
 * to redeploy the site without pushing a commit.
 *
 * Two strategies (tried in order):
 *  1. Netlify Build Hook  — instant, no GitHub involved
 *  2. GitHub repository_dispatch → triggers the CI/CD Action pipeline
 *
 * Body:
 *   { environment: "production" | "staging", reason?: string }
 *
 * Security: requires DEPLOY_WEBHOOK_SECRET header.
 */

import { NextRequest, NextResponse } from "next/server";
import { repositoryDispatch } from "@/lib/github-client";

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.DEPLOY_WEBHOOK_SECRET;
  if (!secret) return false;
  return (
    req.headers.get("x-deploy-secret") === secret ||
    req.headers.get("authorization") === `Bearer ${secret}`
  );
}

async function triggerNetlifyBuildHook(environment: string): Promise<boolean> {
  const hookUrl =
    environment === "staging"
      ? process.env.NETLIFY_DEPLOY_HOOK_STAGING
      : process.env.NETLIFY_DEPLOY_HOOK;

  if (!hookUrl) return false;

  const res = await fetch(hookUrl, { method: "POST" });
  return res.ok;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { environment?: string; reason?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const environment = body.environment === "staging" ? "staging" : "production";
  const reason = body.reason ?? "manual trigger via API";

  // Strategy 1: Netlify Build Hook (fastest)
  const netlifyOk = await triggerNetlifyBuildHook(environment).catch(() => false);

  // Strategy 2: GitHub repository_dispatch (fallback or supplement)
  let githubOk = false;
  try {
    await repositoryDispatch(
      environment === "staging" ? "deploy-staging" : "deploy-production",
      { reason, triggeredAt: new Date().toISOString(), triggeredBy: "deploy-api" },
    );
    githubOk = true;
  } catch (err) {
    console.warn("[deploy/trigger] GitHub dispatch failed:", err);
  }

  if (!netlifyOk && !githubOk) {
    return NextResponse.json(
      { error: "Both deploy strategies failed. Check NETLIFY_DEPLOY_HOOK and GITHUB_PAT." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    environment,
    strategies: { netlify: netlifyOk, github: githubOk },
    reason,
  });
}
