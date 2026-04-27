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
