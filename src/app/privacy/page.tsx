import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "מדיניות פרטיות | NBH Engineering Solutions",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 text-right">
        <div className="mb-10">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">מסמך משפטי</span>
          <h1 className="text-4xl font-black text-slate-900 mt-2 mb-1">מדיניות פרטיות</h1>
          <p className="text-sm text-slate-400">עדכון אחרון: מרץ 2026</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. כללי</h2>
            <p>
              NBH Engineering Solutions (להלן: "החברה", "אנחנו") מחויבת לשמירה על פרטיות המשתמשים באתר{" "}
              <strong>nbh-engineering.com</strong> (להלן: "האתר"). מדיניות פרטיות זו מסבירה אילו מידע אנו
              אוספים, כיצד אנו משתמשים בו, ומהן זכויותיך.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. מידע שאנו אוספים</h2>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li><strong>פרטי יצירת קשר:</strong> שם, אימייל, מספר טלפון — כאשר מוסרים מרצון.</li>
              <li><strong>תוכן פניות:</strong> תיאור הפרויקט ושאלות שנשלחות דרך הצ׳אטבוט או טפסי האתר.</li>
              <li><strong>נתוני גלישה:</strong> כתובת IP, סוג דפדפן, דפים שנצפו — לצורכי אנליטיקס בלבד.</li>
              <li><strong>קובצי Cookie:</strong> ראו מדיניות עוגיות נפרדת.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. שימוש במידע</h2>
            <p>המידע שנאסף משמש אך ורק למטרות הבאות:</p>
            <ul className="list-disc list-inside space-y-2 mr-4 mt-2">
              <li>מענה לפניות ויצירת קשר</li>
              <li>ניהול תהליכי הצעות מחיר ופרויקטים</li>
              <li>שיפור האתר וחוויית המשתמש</li>
              <li>עמידה בדרישות חוקיות</li>
            </ul>
            <p className="mt-3">
              <strong>לא נמכור, נשאיל או נעביר פרטים אישיים לצדדים שלישיים</strong>, למעט ספקי שירות
              הכרחיים (אחסון ענן, שירות אימייל) תחת הסכמי סודיות מחמירים.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. אבטחת מידע</h2>
            <p>
              אנו נוקטים אמצעי אבטחה תקניים לשמירה על המידע, כולל הצפנת HTTPS, גישה מוגבלת לבסיסי נתונים
              ועדכוני אבטחה שוטפים. עם זאת, אין אבטחה מוחלטת ברשת האינטרנט.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. שמירת מידע</h2>
            <p>
              מידע הקשור לפרויקטים ייאצר כל עוד הוא נדרש לצורכי תפעול ועמידה בדרישות חוקיות — ולא יותר
              מ-7 שנים לאחר סיום ההתקשרות. פניות שלא הבשילו לפרויקט יימחקו תוך שנה.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. זכויותיך</h2>
            <p>בהתאם לחוק הגנת הפרטיות הישראלי ותקנות GDPR (לגולשים מאירופה), יש לך זכות:</p>
            <ul className="list-disc list-inside space-y-2 mr-4 mt-2">
              <li>לעיין במידע שנאסף עליך</li>
              <li>לבקש תיקון מידע שגוי</li>
              <li>לבקש מחיקת המידע ("הזכות להישכח")</li>
              <li>להתנגד לעיבוד המידע</li>
            </ul>
            <p className="mt-3">
              לפניות: <a href="mailto:nevet@nbh-engineering.com" className="text-indigo-600 hover:underline">nevet@nbh-engineering.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. עדכונים למדיניות</h2>
            <p>
              מדיניות זו עשויה להתעדכן מעת לעת. שינויים מהותיים יפורסמו באתר. המשך השימוש באתר לאחר
              פרסום שינויים מהווה הסכמה אליהם.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. יצירת קשר</h2>
            <p>
              לכל שאלה בנוגע למדיניות פרטיות זו:{" "}
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
