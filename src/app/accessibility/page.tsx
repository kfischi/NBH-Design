import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "הצהרת נגישות | Proto-Model",
};

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 text-right">
        <div className="mb-10">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">נגישות</span>
          <h1 className="text-4xl font-black text-slate-900 mt-2 mb-1">הצהרת נגישות</h1>
          <p className="text-sm text-slate-400">עדכון אחרון: מרץ 2026</p>
        </div>

        <div className="space-y-8 text-slate-700 leading-relaxed">

          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
            <p className="text-indigo-900 font-medium">
              Proto-Model מחויבת לנגישות דיגיטלית ולאפשר לכלל המשתמשים — לרבות אנשים עם
              מוגבלויות — לגלוש ולהשתמש באתר בצורה מלאה ושוויונית.
            </p>
          </div>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">רמת הנגישות</h2>
            <p>
              אתר זה שואף לעמוד בדרישות תקן{" "}
              <strong>WCAG 2.1 ברמה AA</strong> ובהנחיות{" "}
              <strong>תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג-2013</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">התאמות נגישות קיימות</h2>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>תמיכה מלאה בניווט מקלדת (Tab, Enter, Escape)</li>
              <li>מבנה כותרות היררכי (H1–H6) לקוראי מסך</li>
              <li>טקסט חלופי (Alt) לאלמנטים ויזואליים</li>
              <li>ניגודיות צבעים עומדת בדרישות WCAG AA</li>
              <li>האתר מוגדר כ-RTL עברית באופן מלא</li>
              <li>פונט Heebo — מותאם לקריאות גבוהה בעברית</li>
              <li>תמיכה בהגדלת טקסט עד 200% ללא שבירת עיצוב</li>
              <li>קישורים ניתנים לזיהוי ויזואלי ברור</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">רכיב הנגישות</h2>
            <p>
              האתר כולל רכיב נגישות נגיש דרך האייקון{" "}
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-white text-sm font-bold">♿</span>{" "}
              המופיע בפינה הקבועה של המסך. הרכיב מאפשר:
            </p>
            <ul className="list-disc list-inside space-y-2 mr-4 mt-3">
              <li>הגדלת טקסט</li>
              <li>הגברת ניגודיות</li>
              <li>מצב גווני אפור</li>
              <li>הדגשת קישורים</li>
              <li>עצירת אנימציות</li>
              <li>ניווט מקלדת מוגבר</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">מגבלות ידועות</h2>
            <p>
              חלק מתכני הוידאו עשויים שלא לכלול כתוביות. אנו עובדים על תיקון זה. תוכן המסומן כ"מסווג"
              עשוי להיות מוגבל בטבעו.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">דיווח על בעיות נגישות</h2>
            <p>
              נתקלת בבעיית נגישות? נשמח לשמוע ולתקן:
            </p>
            <div className="mt-3 space-y-1">
              <p>📧 <a href="mailto:nevet@proto-model.com" className="text-indigo-600 hover:underline">nevet@proto-model.com</a></p>
              <p className="text-sm text-slate-500">נטפל בפנייה תוך 5 ימי עבודה.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">תאריך הצהרה זו</h2>
            <p>הצהרה זו הוכנה בחודש מרץ 2026 ותעודכן בהתאם לשינויים באתר.</p>
          </section>

        </div>
      </article>
      <Footer />
    </main>
  );
}
