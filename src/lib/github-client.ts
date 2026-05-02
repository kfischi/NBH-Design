/**
 * GitHub API Client
 *
 * Used by N8N-triggered automations to:
 *  - Commit file changes directly to the repo (auto-update content)
 *  - Trigger repository_dispatch events (kick off GitHub Actions / Netlify deploy)
 */

const GH_TOKEN = process.env.GITHUB_PAT;
const GH_OWNER = process.env.GITHUB_REPO_OWNER;
const GH_REPO  = process.env.GITHUB_REPO_NAME;

function ghFetch(path: string, init?: RequestInit): Promise<Response> {
  if (!GH_TOKEN || !GH_OWNER || !GH_REPO) {
    throw new Error(
      "GitHub not configured — set GITHUB_PAT, GITHUB_REPO_OWNER, GITHUB_REPO_NAME",
    );
  }
  return fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GH_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      ...init?.headers,
    },
  });
}

/* ── Types ─────────────────────────────────────────────────────── */

export interface CommitResult {
  commit: { sha: string; html_url: string };
  content: { name: string; path: string; sha: string };
}

/* ── Create or update a file in the repo ───────────────────────── */
export async function commitFile(params: {
  path: string;          // e.g. "data/leads-log.json"
  content: string;       // file content (UTF-8 string)
  message: string;       // commit message
  branch?: string;       // defaults to "main"
}): Promise<CommitResult> {
  const branch = params.branch ?? "main";
  const apiPath = `/repos/${GH_OWNER}/${GH_REPO}/contents/${params.path}`;

  // Get current file SHA (needed to update an existing file)
  const existing = await ghFetch(`${apiPath}?ref=${branch}`);
  const existingData = existing.ok ? ((await existing.json()) as { sha: string }) : null;

  const res = await ghFetch(apiPath, {
    method: "PUT",
    body: JSON.stringify({
      message: params.message,
      content: Buffer.from(params.content, "utf-8").toString("base64"),
      branch,
      ...(existingData?.sha ? { sha: existingData.sha } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GitHub commit error ${res.status}: ${text}`);
  }

  return res.json() as Promise<CommitResult>;
}

/* ── Trigger a repository_dispatch event ────────────────────────
   This kicks off the GitHub Action → Netlify deploy pipeline.
   eventType examples: "deploy-production", "deploy-staging", "content-update"
*/
export async function repositoryDispatch(
  eventType: string,
  clientPayload?: Record<string, unknown>,
): Promise<void> {
  const res = await ghFetch(`/repos/${GH_OWNER}/${GH_REPO}/dispatches`, {
    method: "POST",
    body: JSON.stringify({ event_type: eventType, client_payload: clientPayload ?? {} }),
  });

  if (!res.ok && res.status !== 204) {
    const text = await res.text().catch(() => "");
    throw new Error(`GitHub dispatch error ${res.status}: ${text}`);
  }
}

/* ── Get latest commit SHA on a branch ─────────────────────────── */
export async function getLatestCommit(branch = "main"): Promise<string> {
  const res = await ghFetch(
    `/repos/${GH_OWNER}/${GH_REPO}/commits?sha=${branch}&per_page=1`,
  );
  if (!res.ok) throw new Error(`GitHub commits error ${res.status}`);
  const [commit] = (await res.json()) as { sha: string }[];
  return commit.sha;
}
