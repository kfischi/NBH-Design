"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "מנהל פיתוח מוצר",
    company: "סטארטאפ ביומד",
    text: "נבט הצליח לתרגם דרישות קליניות מורכבות לפתרון מכני-אלקטרוני מדויק. התוצאה עלתה על הציפיות.",
    stars: 5,
    avatar: "מ",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    name: "CTO",
    company: "חברת ביטחון",
    text: "עמד בדרישות סיווג מחמירות, לו\"ז הדוק ותקציב מוגדר. ספקים שלא ציפינו שימצאו פתרון — נבט מצא.",
    stars: 5,
    avatar: "ב",
    color: "bg-violet-100 text-violet-700",
  },
  {
    name: "מנהל ייצור",
    company: "חברה תעשייתית",
    text: "מערכת האוטומציה שפיתח חסכה לנו 40% בזמן מחזור הייצור. ההשקעה החזירה עצמה תוך 3 חודשים.",
    stars: 5,
    avatar: "י",
    color: "bg-cyan-100 text-cyan-700",
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            מה אומרים הלקוחות
          </h2>
          <p className="text-slate-500">ביצועים שמדברים בעד עצמם</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-lg hover:shadow-slate-900/5 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4 justify-end">
                {Array.from({ length: t.stars }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <div className="relative mb-5">
                <Quote className="w-8 h-8 text-slate-100 absolute -top-1 -right-1" />
                <p className="text-slate-600 text-sm leading-relaxed text-right relative z-10">
                  &quot;{t.text}&quot;
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="flex-1 text-right">
                  <p className="text-sm font-bold text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.company}</p>
                </div>
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${t.color}`}
                >
                  {t.avatar}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
