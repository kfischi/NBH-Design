/**
 * N8N API Client
 *
 * Typed client for triggering N8N workflows and reading execution results.
 * Used by API routes and server actions to orchestrate AI automations.
 */

const N8N_BASE_URL = process.env.N8N_BASE_URL?.replace(/\/$/, "");
const N8N_API_KEY  = process.env.N8N_API_KEY;

/* ── Types ─────────────────────────────────────────────────────── */

export interface N8NExecution {
  id: string;
  finished: boolean;
  mode: string;
  startedAt: string;
  stoppedAt?: string;
  status: "running" | "success" | "error" | "waiting";
  data?: {
    resultData?: {
      runData?: Record<string, unknown>;
      lastNodeExecuted?: string;
    };
  };
}

export interface WebhookTriggerResult {
  executionId?: string;
  data?: unknown;
}

/* ── Helpers ───────────────────────────────────────────────────── */

function n8nFetch(path: string, init?: RequestInit): Promise<Response> {
  if (!N8N_BASE_URL || !N8N_API_KEY) {
    throw new Error("N8N not configured — set N8N_BASE_URL and N8N_API_KEY");
  }
  return fetch(`${N8N_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-N8N-API-KEY": N8N_API_KEY,
      ...init?.headers,
    },
  });
}

/* ── Webhook trigger (fastest path — no auth needed for public webhooks) */
export async function triggerWebhook(
  webhookPath: string,
  payload: Record<string, unknown>,
  secret?: string,
): Promise<WebhookTriggerResult> {
  const url = `${N8N_BASE_URL}/webhook/${webhookPath}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (secret ?? process.env.N8N_WEBHOOK_SECRET) {
    headers["x-webhook-secret"] = secret ?? process.env.N8N_WEBHOOK_SECRET!;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`N8N webhook error ${res.status}: ${text}`);
  }

  const data = await res.json().catch(() => ({}));
  return data as WebhookTriggerResult;
}

/* ── Execute workflow by ID (via N8N API) */
export async function executeWorkflow(
  workflowId: string,
  inputData?: Record<string, unknown>,
): Promise<N8NExecution> {
  const res = await n8nFetch(`/api/v1/workflows/${workflowId}/run`, {
    method: "POST",
    body: JSON.stringify({ startNodes: [], inputData }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`N8N execute error ${res.status}: ${text}`);
  }

  return res.json() as Promise<N8NExecution>;
}

/* ── Poll execution until finished (max 60 s) */
export async function waitForExecution(
  executionId: string,
  timeoutMs = 60_000,
): Promise<N8NExecution> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const res = await n8nFetch(`/api/v1/executions/${executionId}`);
    if (!res.ok) throw new Error(`N8N execution poll error ${res.status}`);

    const exec = (await res.json()) as N8NExecution;
    if (exec.finished) return exec;

    await new Promise((r) => setTimeout(r, 2000));
  }

  throw new Error(`N8N execution ${executionId} timed out after ${timeoutMs}ms`);
}

/* ── List active workflows */
export async function listWorkflows(): Promise<
  { id: string; name: string; active: boolean }[]
> {
  const res = await n8nFetch("/api/v1/workflows?active=true");
  if (!res.ok) throw new Error(`N8N list workflows error ${res.status}`);
  const body = (await res.json()) as { data: { id: string; name: string; active: boolean }[] };
  return body.data ?? [];
}
