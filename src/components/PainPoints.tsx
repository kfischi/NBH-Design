"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { X, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";

const POINTS = [
  {
    pain: "שלחת עיצוב ל-3 ספקים שונים. אחד שינה את המארז, אחד שינה את הלוח. עכשיו הם לא מתאימים.",
    fix: "ספק אחד מתכנן את המארז, הלוח והקוד — שלושתם בסנכרון מלא מהיום הראשון.",
  },
  {
    pain: "אב-טיפוס הגיע אחרי 5 חודשים. לא עמד בדרישות הבסיסיות. נאמר לך שזה 'אופייני לשלב זה'.",
    fix: "תהליך 5 שלבים עם תוצרים מוגדרים בכל שלב. אב-טיפוס ביד תוך 6–8 שבועות.",
  },
  {
    pain: "שילמת לשלושה ספקים. כשמשהו לא עבד — כל אחד הצביע על האחר. אחריות? אין.",
    fix: "נקודת מגע אחת, אחריות מלאה על כל מחזור הפיתוח. כשמשהו לא עובד — נבט עוסק בזה.",
  },
  {
    pain: "ספק המכניקה לא מדבר עם ספק האלקטרוניקה. גילית את זה בשלב הרכבה. עלה לך 3 חודשים.",
    fix: "מהנדס אחד שרואה את כל המוצר. כשמתכנן את המארז — כבר חושב על ה-PCB בפנים.",
  },
];

export default function PainPoints() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 bg-white relative overflow-hidden">
      {/* Subtle decorative lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute -right-40 top-1/3 w-[500px] h-[500px] bg-rose-50/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-40 bottom-1/3 w-[400px] h-[400px] bg-emerald-50/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-full mb-5">
            מכירים את הסיפור?
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-5 leading-tight">
            כך נראה פיתוח{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ללא ספק אחד
            </span>
            .
            <br />
            <span className="text-slate-400 font-light">
              וכך נראה עם Proto-Model.
            </span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            לא מדמיינים. אלה הסיטואציות שלקוחות תיארו לפני שבאו אלינו.
          </p>
        </motion.div>

        {/* Column headers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="hidden md:grid md:grid-cols-2 gap-5 mb-4"
        >
          <div className="flex items-center gap-2.5 px-5 py-2.5 bg-rose-50 border border-rose-100 rounded-2xl">
            <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center flex-shrink-0">
              <X className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold text-rose-700">בלי ספק מוביל — כך זה נראה</span>
          </div>
          <div className="flex items-center gap-2.5 px-5 py-2.5 bg-emerald-50 border border-emerald-100 rounded-2xl">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold text-emerald-700">עם Proto-Model — כך זה עובד</span>
          </div>
        </motion.div>

        {/* Rows */}
        <div className="space-y-4">
          {POINTS.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25 + i * 0.1, duration: 0.55, ease: "easeOut" }}
              className="grid md:grid-cols-2 gap-4"
            >
              {/* Pain */}
              <div className="group relative bg-rose-50 border border-rose-100 rounded-2xl p-5 hover:border-rose-200 transition-all duration-200">
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center flex-shrink-0 mt-0.5 md:hidden">
                    <X className="w-3 h-3 text-rose-500" strokeWidth={2.5} />
                  </div>
                  <p className="text-sm text-rose-900 leading-relaxed text-right flex-1 font-medium">
                    &ldquo;{point.pain}&rdquo;
                  </p>
                </div>
              </div>

              {/* Fix */}
              <div className="relative bg-emerald-50 border border-emerald-100 rounded-2xl p-5 hover:border-emerald-200 transition-all duration-200">
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5 md:hidden">
                    <Check className="w-3 h-3 text-emerald-600" strokeWidth={2.5} />
                  </div>
                  <p className="text-sm text-emerald-900 leading-relaxed text-right flex-1 font-medium">
                    {point.fix}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-14 text-center"
        >
          <p className="text-slate-400 text-sm mb-5">
            כל אחת מהסיטואציות האלה עלתה ללקוח זמן וכסף. Proto-Model נולד כדי לסגור אותן.
          </p>
          <Link href="/contact">
            <motion.span
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-full shadow-xl shadow-indigo-500/30 cursor-pointer text-base"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              ספר לי על הפרויקט שלך
              <ArrowLeft className="w-4 h-4" />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
