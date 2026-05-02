/**
 * Notion CRM client.
 *
 * Notion is the canonical lead store. Every contact submission and chatbot
 * intake ends up here as a row in the Leads database.
 *
 * Required env:
 *   NOTION_API_KEY            — internal integration secret
 *   NOTION_LEADS_DATABASE_ID  — id of the Leads database (32 chars, no dashes)
 *
 * The integration must be explicitly connected to the database from the Notion
 * UI (database → ··· → Connections → Add the integration).
 */

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

export type LeadSource = "website-form" | "chatbot";

export interface NotionLead {
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  challenge: string;
  source: LeadSource;
  aiScore?: number;
  aiSummary?: string;
}

export interface CreateLeadResult {
  ok: boolean;
  pageId?: string;
  url?: string;
  error?: string;
}

/** Hebrew label shown in the Notion `Source` select column. */
const SOURCE_LABEL: Record<LeadSource, string> = {
  "website-form": "אתר",
  chatbot: "צ'אטבוט AI",
};

interface NotionPageResponse {
  id: string;
  url: string;
}

interface NotionErrorResponse {
  message?: string;
  code?: string;
}

type NotionRichTextProperty = {
  rich_text: Array<{ text: { content: string } }>;
};

type NotionTitleProperty = {
  title: Array<{ text: { content: string } }>;
};

type NotionSelectProperty = { select: { name: string } };
type NotionPhoneProperty = { phone_number: string };
type NotionEmailProperty = { email: string };
type NotionDateProperty = { date: { start: string } };
type NotionNumberProperty = { number: number };

type NotionProperty =
  | NotionTitleProperty
  | NotionRichTextProperty
  | NotionSelectProperty
  | NotionPhoneProperty
  | NotionEmailProperty
  | NotionDateProperty
  | NotionNumberProperty;

function richText(content: string): NotionRichTextProperty {
  return { rich_text: [{ text: { content: content.slice(0, 2000) } }] };
}

function buildProperties(lead: NotionLead): Record<string, NotionProperty> {
  const props: Record<string, NotionProperty> = {
    Name: { title: [{ text: { content: lead.name.slice(0, 120) } }] },
    Status: { select: { name: "ליד חדש" } },
    Source: { select: { name: SOURCE_LABEL[lead.source] } },
    Challenge: richText(lead.challenge),
    Date: { date: { start: new Date().toISOString() } },
  };

  if (lead.company) props.Company = richText(lead.company);
  if (lead.phone) props.Phone = { phone_number: lead.phone };
  if (lead.email) props.Email = { email: lead.email };
  if (typeof lead.aiScore === "number") props["AI Score"] = { number: lead.aiScore };
  if (lead.aiSummary) props["AI Summary"] = richText(lead.aiSummary);

  return props;
}

/**
 * Creates a new lead row in the Notion database.
 * Always resolves — failures are returned in the result, not thrown.
 */
export async function createLead(lead: NotionLead): Promise<CreateLeadResult> {
  const apiKey = process.env.NOTION_API_KEY;
  const dbId = process.env.NOTION_LEADS_DATABASE_ID;

  if (!apiKey || !dbId) {
    return { ok: false, error: "missing_config" };
  }

  try {
    const res = await fetch(`${NOTION_API}/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Notion-Version": NOTION_VERSION,
      },
      body: JSON.stringify({
        parent: { database_id: dbId },
        properties: buildProperties(lead),
      }),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as NotionErrorResponse;
      return {
        ok: false,
        error: `notion_${res.status}_${body.code ?? "unknown"}: ${body.message ?? ""}`.slice(0, 300),
      };
    }

    const data = (await res.json()) as NotionPageResponse;
    return { ok: true, pageId: data.id, url: data.url };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "notion_unknown_error",
    };
  }
}

/**
 * Lightweight reachability check used by /api/health.
 * Verifies the API key is valid and the database is accessible.
 */
export async function pingNotion(): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.NOTION_API_KEY;
  const dbId = process.env.NOTION_LEADS_DATABASE_ID;

  if (!apiKey || !dbId) return { ok: false, error: "missing_config" };

  try {
    const res = await fetch(`${NOTION_API}/databases/${dbId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Notion-Version": NOTION_VERSION,
      },
    });
    if (!res.ok) return { ok: false, error: `notion_${res.status}` };
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "notion_unknown_error",
    };
  }
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Outbound LinkedIn pipeline                                            */
/* ────────────────────────────────────────────────────────────────────── */

export type Industry = "defense" | "agritech" | "industry" | "other";

export type TargetStatus =
  | "new"
  | "researched"
  | "ready_for_outreach"
  | "draft_ready"
  | "approved"
  | "sent"
  | "replied"
  | "closed";

export type DraftStatus = "draft" | "approved" | "sent" | "replied";

export type DraftChannel = "linkedin_dm" | "linkedin_inmail" | "email";

export interface OutboundTarget {
  id: string;
  name: string;
  title?: string;
  company?: string;
  industry?: Industry;
  linkedinUrl?: string;
  email?: string;
  notes?: string;
  status: TargetStatus;
  dateAdded?: string;
  lastContact?: string;
}

export interface DraftInput {
  targetId: string;
  subject: string;
  channel: DraftChannel;
  touchNumber: number;
  body: string;
  notes?: string;
}

export interface DraftSummary {
  id: string;
  url: string;
  subject: string;
  channel: DraftChannel;
  touchNumber: number;
  body: string;
  status: DraftStatus;
  generatedAt?: string;
  notes?: string;
  targetName?: string;
  targetCompany?: string;
  targetUrl?: string;
}

/* ── Notion property readers (untyped JSON → typed values) ───────────── */

interface NotionPropertyValue {
  type: string;
  title?: Array<{ plain_text?: string }>;
  rich_text?: Array<{ plain_text?: string }>;
  select?: { name?: string } | null;
  url?: string | null;
  email?: string | null;
  number?: number | null;
  date?: { start?: string } | null;
  relation?: Array<{ id: string }>;
}

interface NotionPage {
  id: string;
  url: string;
  properties: Record<string, NotionPropertyValue>;
}

interface NotionQueryResponse {
  results: NotionPage[];
}

function readTitle(prop: NotionPropertyValue | undefined): string {
  return (prop?.title ?? []).map((t) => t.plain_text ?? "").join("").trim();
}

function readRichText(prop: NotionPropertyValue | undefined): string {
  return (prop?.rich_text ?? []).map((t) => t.plain_text ?? "").join("").trim();
}

function readSelect(prop: NotionPropertyValue | undefined): string | undefined {
  return prop?.select?.name ?? undefined;
}

function readUrl(prop: NotionPropertyValue | undefined): string | undefined {
  return prop?.url ?? undefined;
}

function readEmail(prop: NotionPropertyValue | undefined): string | undefined {
  return prop?.email ?? undefined;
}

function readDate(prop: NotionPropertyValue | undefined): string | undefined {
  return prop?.date?.start ?? undefined;
}

function readNumber(prop: NotionPropertyValue | undefined): number | undefined {
  return typeof prop?.number === "number" ? prop.number : undefined;
}

function readRelationId(prop: NotionPropertyValue | undefined): string | undefined {
  return prop?.relation?.[0]?.id;
}

function asIndustry(value: string | undefined): Industry | undefined {
  if (value === "defense" || value === "agritech" || value === "industry" || value === "other") {
    return value;
  }
  return undefined;
}

function asTargetStatus(value: string | undefined): TargetStatus {
  const allowed: TargetStatus[] = [
    "new",
    "researched",
    "ready_for_outreach",
    "draft_ready",
    "approved",
    "sent",
    "replied",
    "closed",
  ];
  return (allowed as string[]).includes(value ?? "") ? (value as TargetStatus) : "new";
}

function asDraftStatus(value: string | undefined): DraftStatus {
  const allowed: DraftStatus[] = ["draft", "approved", "sent", "replied"];
  return (allowed as string[]).includes(value ?? "") ? (value as DraftStatus) : "draft";
}

function asDraftChannel(value: string | undefined): DraftChannel {
  const allowed: DraftChannel[] = ["linkedin_dm", "linkedin_inmail", "email"];
  return (allowed as string[]).includes(value ?? "") ? (value as DraftChannel) : "linkedin_dm";
}

function pageToTarget(page: NotionPage): OutboundTarget {
  const p = page.properties;
  return {
    id: page.id,
    name: readTitle(p.Name),
    title: readRichText(p.Title) || undefined,
    company: readRichText(p.Company) || undefined,
    industry: asIndustry(readSelect(p.Industry)),
    linkedinUrl: readUrl(p["LinkedIn URL"]),
    email: readEmail(p.Email),
    notes: readRichText(p.Notes) || undefined,
    status: asTargetStatus(readSelect(p.Status)),
    dateAdded: readDate(p["Date Added"]),
    lastContact: readDate(p["Last Contact"]),
  };
}

function pageToDraft(page: NotionPage): DraftSummary {
  const p = page.properties;
  return {
    id: page.id,
    url: page.url,
    subject: readTitle(p.Subject),
    channel: asDraftChannel(readSelect(p.Channel)),
    touchNumber: readNumber(p["Touch #"]) ?? 1,
    body: readRichText(p["Draft Body"]),
    status: asDraftStatus(readSelect(p.Status)),
    generatedAt: readDate(p["Generated At"]),
    notes: readRichText(p.Notes) || undefined,
  };
}

/* ── Internal request helper ─────────────────────────────────────────── */

async function notionRequest(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) throw new Error("missing_config: NOTION_API_KEY");
  return fetch(`${NOTION_API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "Notion-Version": NOTION_VERSION,
      ...(init?.headers ?? {}),
    },
  });
}

/* ── Public API ──────────────────────────────────────────────────────── */

/**
 * Returns targets whose status is `ready_for_outreach`, oldest first.
 * Throws on Notion errors so callers can surface them in logs.
 */
export async function listTargetsReadyForOutreach(
  limit = 10,
): Promise<OutboundTarget[]> {
  const dbId = process.env.NOTION_OUTBOUND_TARGETS_DB_ID;
  if (!dbId) throw new Error("missing_config: NOTION_OUTBOUND_TARGETS_DB_ID");

  const res = await notionRequest(`/databases/${dbId}/query`, {
    method: "POST",
    body: JSON.stringify({
      filter: {
        property: "Status",
        select: { equals: "ready_for_outreach" },
      },
      sorts: [{ property: "Date Added", direction: "ascending" }],
      page_size: Math.min(Math.max(limit, 1), 100),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`notion_${res.status}: ${body.slice(0, 200)}`);
  }

  const data = (await res.json()) as NotionQueryResponse;
  return (data.results ?? []).map(pageToTarget);
}

/**
 * Creates a draft row in the Outbound Drafts database.
 * Always sets status=draft and Generated At=now.
 */
export async function createDraft(
  draft: DraftInput,
): Promise<{ pageId: string; url: string }> {
  const dbId = process.env.NOTION_OUTBOUND_DRAFTS_DB_ID;
  if (!dbId) throw new Error("missing_config: NOTION_OUTBOUND_DRAFTS_DB_ID");

  const properties: Record<string, NotionProperty | { relation: Array<{ id: string }> }> = {
    Subject: { title: [{ text: { content: draft.subject.slice(0, 200) } }] },
    Target: { relation: [{ id: draft.targetId }] },
    Channel: { select: { name: draft.channel } },
    "Touch #": { number: draft.touchNumber },
    "Draft Body": richText(draft.body),
    Status: { select: { name: "draft" } },
    "Generated At": { date: { start: new Date().toISOString() } },
  };
  if (draft.notes) (properties as Record<string, NotionProperty>).Notes = richText(draft.notes);

  const res = await notionRequest("/pages", {
    method: "POST",
    body: JSON.stringify({
      parent: { database_id: dbId },
      properties,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`notion_${res.status}: ${body.slice(0, 200)}`);
  }

  const data = (await res.json()) as NotionPageResponse;
  return { pageId: data.id, url: data.url };
}

/**
 * Patches the Status select on an Outbound Targets row.
 * Pass `lastContact: true` to also stamp Last Contact = now.
 */
export async function updateTargetStatus(
  targetId: string,
  status: TargetStatus,
  options: { lastContact?: boolean } = {},
): Promise<void> {
  const properties: Record<string, NotionProperty> = {
    Status: { select: { name: status } },
  };
  if (options.lastContact) {
    properties["Last Contact"] = { date: { start: new Date().toISOString() } };
  }

  const res = await notionRequest(`/pages/${targetId}`, {
    method: "PATCH",
    body: JSON.stringify({ properties }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`notion_${res.status}: ${body.slice(0, 200)}`);
  }
}

/**
 * Marks a target as `replied`, stamps Last Contact, and appends the reply
 * text as a comment on the target's Notion page so the full thread is visible.
 */
export async function logReply(targetId: string, replyText: string): Promise<void> {
  await updateTargetStatus(targetId, "replied", { lastContact: true });

  const res = await notionRequest("/comments", {
    method: "POST",
    body: JSON.stringify({
      parent: { page_id: targetId },
      rich_text: [
        {
          text: {
            content: `📩 Reply received ${new Date().toISOString()}\n\n${replyText.slice(0, 1900)}`,
          },
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`notion_${res.status}: ${body.slice(0, 200)}`);
  }
}

/**
 * Fetches a single target by id — used by the reply webhook to populate
 * the notification email.
 */
export async function getTarget(targetId: string): Promise<OutboundTarget | null> {
  const res = await notionRequest(`/pages/${targetId}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`notion_${res.status}: ${body.slice(0, 200)}`);
  }
  const data = (await res.json()) as NotionPage;
  return pageToTarget(data);
}

/**
 * Lists recent drafts joined with their target info — used by the admin view.
 * Fetches drafts first, then resolves the Target relation in parallel.
 */
export async function listRecentDrafts(limit = 25): Promise<DraftSummary[]> {
  const dbId = process.env.NOTION_OUTBOUND_DRAFTS_DB_ID;
  if (!dbId) throw new Error("missing_config: NOTION_OUTBOUND_DRAFTS_DB_ID");

  const res = await notionRequest(`/databases/${dbId}/query`, {
    method: "POST",
    body: JSON.stringify({
      sorts: [{ property: "Generated At", direction: "descending" }],
      page_size: Math.min(Math.max(limit, 1), 100),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`notion_${res.status}: ${body.slice(0, 200)}`);
  }

  const data = (await res.json()) as NotionQueryResponse;
  const drafts = (data.results ?? []).map((page) => {
    const summary = pageToDraft(page);
    const targetId = readRelationId(page.properties.Target);
    return { summary, targetId };
  });

  const resolved = await Promise.all(
    drafts.map(async ({ summary, targetId }) => {
      if (!targetId) return summary;
      try {
        const target = await getTarget(targetId);
        return target
          ? {
              ...summary,
              targetName: target.name,
              targetCompany: target.company,
              targetUrl: target.linkedinUrl,
            }
          : summary;
      } catch {
        return summary;
      }
    }),
  );

  return resolved;
}
