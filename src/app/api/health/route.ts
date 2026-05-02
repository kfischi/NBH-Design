/**
 * GET /api/health
 *
 * Lightweight reachability check for the integrations the site depends on.
 * Returns 200 if every essential service is reachable, otherwise 503.
 *
 * Body shape:
 *   {
 *     ok: boolean,
 *     services: {
 *       notion: { status: "ok" | "fail", error?: string },
 *       resend: { status: "ok" | "fail", error?: string }
 *     },
 *     timestamp: string
 *   }
 */

import { NextResponse } from "next/server";
import { pingNotion } from "@/lib/notion-client";
import { pingResend } from "@/lib/email-client";

export const dynamic = "force-dynamic";

export async function GET() {
  const [notion, resend] = await Promise.all([pingNotion(), pingResend()]);

  const ok = notion.ok && resend.ok;

  return NextResponse.json(
    {
      ok,
      services: {
        notion: { status: notion.ok ? "ok" : "fail", error: notion.error },
        resend: { status: resend.ok ? "ok" : "fail", error: resend.error },
      },
      timestamp: new Date().toISOString(),
    },
    { status: ok ? 200 : 503 },
  );
}
