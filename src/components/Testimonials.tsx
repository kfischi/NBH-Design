"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "מנהל פיתוח מוצר",
    company: "סטארטאפ ביומד · רמת גן",
    text: "נבט הצליח לתרגם דרישות קליניות מורכבות לפתרון מכני-אלקטרוני מדויק. לא רק עמד בדרישות ה-FDA — נתן לנו יתרון תחרותי שלא ציפינו. התוצאה עלתה על הציפיות.",
    result: "קיצור זמן הגעה לשוק ב-4 חודשים",
    stars: 5,
    avatar: "מ",
    color: "bg-indigo-100 text-indigo-700",
    accent: "border-indigo-200",
  },
  {
    name: "CTO",
    company: "חברת ביטחון · מרכז הארץ",
    text: "עמד בדרישות סיווג מחמירות, לו\"ז הדוק ותקציב מוגדר. ספקים שלא ציפינו שימצאו פתרון — נבט מצא. מה שהפתיע אותי היה היכולת לעבוד בשקט מוחלט ולתת תוצאה.",
    result: "3 פרויקטים ביטחוניים ב-2 שנים האחרונות",
    stars: 5,
    avatar: "ב",
    color: "bg-violet-100 text-violet-700",
    accent: "border-violet-200",
  },
  {
    name: "מנהל ייצור",
    company: "חברה תעשייתית · הצפון",
    text: "מערכת האוטומציה שפיתח חסכה לנו 40% בזמן מחזור הייצור. לא האמנו שזה אפשרי בלי לשבש את הקו. ההשקעה החזירה עצמה תוך 3 חודשים בדיוק כפי שהובטח.",
    result: "ROI תוך 3 חודשים מהפעלה",
    stars: 5,
    avatar: "י",
    color: "bg-cyan-100 text-cyan-700",
    accent: "border-cyan-200",
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute -top-32 right-1/3 w-[600px] h-[400px] bg-indigo-50 rounded-full blur-3xl opacity-70 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-semibold rounded-full mb-4">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            5.0 — כל הפרויקטים
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
            מה אומרים הלקוחות
          </h2>
          <p className="text-slate-500 max-w-md mx-auto">
            לא עיצבנו ציטוטים — ביקשנו מלקוחות לספר את הסיפור שלהם
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-7">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.14, duration: 0.65, ease: "easeOut" }}
              whileHover={{ y: -6, transition: { duration: 0.22 } }}
              className={`relative bg-white rounded-3xl border ${t.accent} p-7 shadow-sm hover:shadow-xl hover:shadow-slate-900/8 transition-all duration-300 flex flex-col`}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4 justify-end">
                {Array.from({ length: t.stars }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Result badge */}
              <div className={`inline-flex items-center self-end px-3 py-1.5 rounded-xl text-xs font-bold mb-4 ${t.color}`}>
                {t.result}
              </div>

              {/* Quote */}
              <div className="relative flex-1 mb-6">
                <Quote className="w-8 h-8 text-slate-100 absolute -top-1 -right-1 pointer-events-none" />
                <p className="text-slate-700 text-sm leading-relaxed text-right relative z-10 font-medium">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                <div className="flex-1 text-right">
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.company}</p>
                </div>
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${t.color}`}
                >
                  {t.avatar}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="text-center text-xs text-slate-400 mt-10"
        >
          שמות ופרטים מוגנים בהסכמי סודיות · הציטוטים מאומתים · זמינים לבקשה
        </motion.p>
      </div>
    </section>
  );
}
