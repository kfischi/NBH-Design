/**
 * POST /api/chat
 *
 * Streaming chat endpoint for the project-intake AI chatbot.
 * Uses Claude to conduct a smart intake conversation in Hebrew.
 *
 * Body:  { messages: { role: "user"|"assistant"; content: string }[] }
 * Returns: text/plain stream (each chunk is a text delta)
 *
 * When Claude decides enough info has been collected it appends [INTAKE_COMPLETE]
 * to its response — the frontend uses this to show the submit button.
 */

import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `אתה יועץ פרויקטים AI של NBH Engineering Solutions, חברת הנדסה מקצועית ישראלית.
מטרתך: לנהל שיחת קבלה חכמה עם לקוח פוטנציאלי ולאסוף את כל המידע הנחוץ לפתיחת פרויקט.

## כללי שיחה
- דבר עברית בלבד (אם הלקוח מדבר אנגלית — המשך באנגלית)
- שאל שאלה אחת בכל הודעה — אל תעמיס
- היה ידידותי, מקצועי וחם — כמו יועץ בכיר
- אל תכתוב רשימות שאלות — שאל באופן שיחתי טבעי
- התאם את השאלות הבאות לפי התשובות שקיבלת

## נושאים לכסות (בהדרגה, לא בסדר קבוע):
1. שם הלקוח ושם החברה / ארגון
2. סוג הפרויקט ההנדסי (מבנה, תשתיות, תעשייה, MEP, פיקוח בנייה, ייעוץ, אחר)
3. מיקום הפרויקט וסדר גודל (מ"ר / קומות / יחידות)
4. לוח זמנים רצוי — מתי צריך להתחיל ומתי לסיים
5. מסגרת תקציב כללית (טווח)
6. האתגר הספציפי או הבעיה שצריך לפתור
7. האם יש אדריכל / קבלן מבצע / גורמים נוספים מעורבים
8. מספר טלפון ו/או אימייל ליצירת קשר

## מתי לסיים
כאשר ענית על לפחות 5 מהנושאים למעלה (כולל שם וטלפון):
1. כתוב משפט חיובי שמסכם שקיבלת מספיק מידע
2. הבטח שנבט מ-NBH Engineering יחזור אליהם תוך 24 שעות
3. הוסף בשורה נפרדת בסוף ההודעה בדיוק את הטוקן הבא (אל תסביר אותו, פשוט הוסף אותו):
[INTAKE_COMPLETE]

## דוגמת פתיחה
"שלום! אני יועץ הפרויקטים של NBH Engineering. אשמח לעזור לך להתחיל את הפרויקט 🏗️
ספר לי קצת — מה שמך ועם איזו חברה אתה עובד?"`;

export async function POST(req: NextRequest) {
  const { messages } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
  };

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = await client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 600,
          system: SYSTEM_PROMPT,
          messages,
        });

        for await (const chunk of anthropicStream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
      } catch (err) {
        console.error("[chat] stream error:", err);
        controller.enqueue(
          encoder.encode("\n\nמצטערים, אירעה שגיאה. אנא נסה שוב.")
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  });
}
