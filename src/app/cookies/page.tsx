import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "מדיניות עוגיות | NBH Engineering Solutions",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 text-right">
        <div className="mb-10">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">מסמך משפטי</span>
          <h1 className="text-4xl font-black text-slate-900 mt-2 mb-1">מדיניות עוגיות (Cookies)</h1>
          <p className="text-sm text-slate-400">עדכון אחרון: מרץ 2026</p>
        </div>

        <div className="space-y-8 text-slate-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">מה הן עוגיות?</h2>
            <p>
              עוגיות (Cookies) הן קבצי טקסט קטנים המאוחסנים בדפדפן שלך כאשר אתה מבקר באתר. הן מסייעות
              לאתר לזכור העדפות, לנתח תנועה ולשפר את חוויית המשתמש.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">סוגי העוגיות שאנו משתמשים בהן</h2>

            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0"></span>
                  <h3 className="font-bold text-slate-900">עוגיות הכרחיות</h3>
                  <span className="text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full font-semibold">תמיד פעילות</span>
                </div>
                <p className="text-sm">נדרשות לפעולה בסיסית של האתר — ניהול הפעלה, אבטחה. לא ניתן לבטל.</p>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                  <h3 className="font-bold text-slate-900">עוגיות ביצועים ואנליטיקס</h3>
                  <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-semibold">ניתן לבטל</span>
                </div>
                <p className="text-sm">
                  Google Analytics 4 — מאפשרות לנו להבין אילו דפים פופולריים ולשפר את האתר. המידע
                  מצטבר ואנונימי.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                  <h3 className="font-bold text-slate-900">עוגיות פונקציונליות</h3>
                  <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full font-semibold">ניתן לבטל</span>
                </div>
                <p className="text-sm">
                  זוכרות העדפות כמו שפה, מצב רכיב הנגישות והגדרות תצוגה שבחרת.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 flex-shrink-0"></span>
                  <h3 className="font-bold text-slate-900">עוגיות שיווק / Retargeting</h3>
                  <span className="text-xs bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full font-semibold">לא בשימוש כרגע</span>
                </div>
                <p className="text-sm">איננו משתמשים כרגע בעוגיות פרסומיות מסוג זה.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">ניהול העדפות עוגיות</h2>
            <p>
              ניתן לשנות את הגדרות העוגיות בכל עת דרך הגדרות הדפדפן שלך. שים לב כי ביטול עוגיות מסוימות
              עלול לפגוע בחלק מפונקציות האתר.
            </p>
            <ul className="list-disc list-inside space-y-1.5 mr-4 mt-3 text-sm">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Chrome</a></li>
              <li><a href="https://support.mozilla.org/he/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Firefox</a></li>
              <li><a href="https://support.apple.com/he-il/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Safari</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">יצירת קשר</h2>
            <p>
              שאלות לגבי מדיניות עוגיות זו:{" "}
              <a href="mailto:nevet@nbh-engineering.com" className="text-indigo-600 hover:underline">
                nevet@nbh-engineering.com
              </a>
            </p>
          </section>
        </div>
      </article>
      <Footer />
    </main>
  );
}
