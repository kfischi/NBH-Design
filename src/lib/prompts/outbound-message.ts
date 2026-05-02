/**
 * System prompt + user-message builder for the outbound LinkedIn drafter.
 *
 * The voice is calibrated — read CONTEXT.md before changing.
 */

import type { OutboundTarget } from "@/lib/notion-client";

export const OUTBOUND_SYSTEM_PROMPT = `אתה כותב הודעות LinkedIn מצומצמות ומכבדות בשם נבט בן חיים, מהנדס מוצר רב-תחומי בעל Proto-Model. נבט עוסק במכניקה, אלקטרוניקה ואוטומציה — תחת קורת גג אחת. הקהל: VP R&D, CTO, ומנכ"לים בתעשיות הביטחון, AgriTech ותעשייה.

כללים מוחלטים:
1. עברית. גוף ראשון. נימה אנושית, לא שיווקית.
2. הודעה אחת בלבד, עד 80 מילים.
3. אין מצגת עצמית מוגזמת. אין רשימת השירותים של נבט.
4. הזכר את החברה של הנמען לפחות פעם אחת.
5. אם יש מידע ספציפי על הנמען (תפקיד, פרויקט, פוסט אחרון) — השתמש בו בדיוק. אסור להמציא.
6. אם אין מידע ספציפי — אל תזייף עניין. כתוב משהו כללי וכן ("ראיתי את החברה ב-X" בלי להמציא מה ראית).
7. סיים בשאלה אחת קונקרטית. לא "בוא נדבר" — שאלה ספציפית שקל לענות עליה ב-2 משפטים.
8. אסור להשתמש במילים: "חולם", "מהפכני", "פורץ דרך", "סינרגיה", "פתרונות מתקדמים", "ערך מוסף".
9. אל תפתח ב-"שלום [שם]" — פנה בשם בלבד או בפנייה טבעית.
10. אם אין מידע מספיק לכתוב הודעה כנה — החזר את המחרוזת המדויקת: SKIP_INSUFFICIENT_DATA

## פורמט פלט
החזר JSON בלבד, ללא טקסט מסביב, בסכמה הזו:
{
  "subject": "<שם פנימי קצר באנגלית, למשל: 'Avi Cohen — touch 1'>",
  "body": "<גוף ההודעה בעברית, עד 80 מילים>",
  "rationale": "<משפט אחד בעברית: על מה התבססה ההתאמה האישית>"
}

אם אין מידע מספיק:
{ "subject": "skip", "body": "SKIP_INSUFFICIENT_DATA", "rationale": "<למה דילגנו>" }`;

const INDUSTRY_LABEL: Record<string, string> = {
  defense: "ביטחון",
  agritech: "AgriTech",
  industry: "תעשייה",
  other: "אחר",
};

/**
 * Builds the user message for Claude — only includes facts that are present.
 * Empty fields are omitted entirely so the model doesn't hallucinate around them.
 */
export function buildOutboundUserMessage(
  target: OutboundTarget,
  touchNumber: number,
): string {
  const lines: string[] = [`# פרטי הנמען (touch ${touchNumber})`];

  lines.push(`שם: ${target.name}`);
  if (target.title) lines.push(`תפקיד: ${target.title}`);
  if (target.company) lines.push(`חברה: ${target.company}`);
  if (target.industry) lines.push(`תחום: ${INDUSTRY_LABEL[target.industry] ?? target.industry}`);
  if (target.linkedinUrl) lines.push(`LinkedIn: ${target.linkedinUrl}`);
  if (target.notes) lines.push(`\n## מה אנחנו יודעים\n${target.notes}`);
  if (target.lastContact) {
    lines.push(`\n(touch קודם נשלח ב-${target.lastContact})`);
  }

  lines.push(
    "",
    "## משימה",
    "כתוב הודעת פתיחה לפי הכללים. החזר JSON בלבד.",
  );

  return lines.join("\n");
}

/**
 * Strict JSON shape returned by Claude. The model is instructed to emit this
 * exact schema; we still validate at runtime before persisting.
 */
export interface OutboundDraftJson {
  subject: string;
  body: string;
  rationale: string;
}

export function parseDraftResponse(text: string): OutboundDraftJson | null {
  // Claude sometimes wraps JSON in ``` fences — strip them.
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");

  try {
    const parsed = JSON.parse(cleaned) as Partial<OutboundDraftJson>;
    if (
      typeof parsed.subject === "string" &&
      typeof parsed.body === "string" &&
      typeof parsed.rationale === "string"
    ) {
      return {
        subject: parsed.subject.trim(),
        body: parsed.body.trim(),
        rationale: parsed.rationale.trim(),
      };
    }
    return null;
  } catch {
    return null;
  }
}
