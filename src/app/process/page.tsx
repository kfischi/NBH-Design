"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Header from "@/components/Header";
import Process from "@/components/Process";
import Footer from "@/components/Footer";
import { ArrowLeft, CheckCircle, FileText, Video, Package, Layers, MessageCircle } from "lucide-react";
import Link from "next/link";

const phases = [
  {
    phase: "שלב א'",
    title: "פגישת אפיון ראשונית",
    duration: "שבוע 1",
    color: "border-amber-400",
    dot: "bg-amber-400",
    deliverables: ["מסמך דרישות (SRS)", "הצעת מחיר מפורטת", "לוח זמנים ראשוני"],
    desc: "נשמע על הצורך, נבין את האילוצים (תקציב, זמן, שוק יעד) ונגדיר יחד את הגדרת ההצלחה של הפרויקט.",
  },
  {
    phase: "שלב ב'",
    title: "תכנון הנדסי",
    duration: "שבועות 2–4",
    color: "border-indigo-500",
    dot: "bg-indigo-500",
    deliverables: ["מודלים CAD / סכמות PCB", "ציורי עבודה מלאים", "BOM ראשוני"],
    desc: "תכנון CAD מלא, ציורי עבודה, בחירת רכיבים. כל שינוי מתואם עמך לפני ביצוע.",
  },
  {
    phase: "שלב ג'",
    title: "אב-טיפוס ראשוני",
    duration: "שבועות 3–6",
    color: "border-violet-500",
    dot: "bg-violet-500",
    deliverables: ["אב-טיפוס פיזי מלא", "בדיקות פונקציונליות", "דוח ממצאים"],
    desc: "הדפסה, הלחמה, תיכנות. מוצר ביד שאפשר לגעת בו, לבדוק ולאשר לפני ייצור.",
  },
  {
    phase: "שלב ד'",
    title: "חזרות ואופטימיזציה",
    duration: "שבועות 5–8",
    color: "border-cyan-500",
    dot: "bg-cyan-500",
    deliverables: ["גרסאות משופרות", "בדיקות עמידות", "תיעוד שינויים"],
    desc: "בדיקות שדה, תיקונים, שיפורים. חוזרים על הלולאה עד שהמוצר עומד בכל הדרישות.",
  },
  {
    phase: "שלב ה'",
    title: "מסירה ותמיכה",
    duration: "שבוע 8+",
    color: "border-emerald-500",
    dot: "bg-emerald-500",
    deliverables: ["חבילת קבצי ייצור מלאה", "הדרכה טכנית", "תמיכה 3 חודשים"],
    desc: "מסרים את כל קבצי הייצור, נעביר ידע ונהיה זמינים לתמיכה בשלב הייצור.",
  },
];

const deliverableTypes = [
  { icon: FileText, label: "תיעוד מלא", desc: "BOM, ציורי עבודה, מפרטים טכניים" },
  { icon: Video, label: "הדרכה", desc: "וידאו-קול ופגישה חיה עם הצוות שלך" },
  { icon: Package, label: "קבצי ייצור", desc: "Gerbers, STEP, STL — מוכן לייצור" },
  { icon: Layers, label: "קוד מקור", desc: "Firmware מתועד ומוכן להרחבה" },
  { icon: MessageCircle, label: "תמיכה שוטפת", desc: "3 חודשים אחרי המסירה, ללא עלות" },
];

function PageHero() {
  return (
    <section className="relative pt-32 pb-20 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 text-violet-300 text-xs font-semibold rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
            איך זה עובד
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            תהליך עבודה שקוף
            <br />
            <span className="bg-gradient-to-r from-violet-300 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              ללא הפתעות בדרך
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            כל שלב מוגדר מראש עם תוצרים ברורים, לוחות זמנים ריאליסטיים ותקשורת
            ישירה לאורך כל הדרך.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function DetailedPhases() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute -bottom-40 right-0 w-[500px] h-[500px] bg-violet-50/50 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold rounded-full mb-4">
            5 שלבים
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            פירוט השלבים
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            לכל שלב יש תוצרים מוגדרים — אתה יודע בדיוק מה מתקבל ומתי
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute right-[18px] top-6 bottom-6 w-0.5 bg-slate-100 hidden sm:block" />

          <div className="space-y-6">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                className={`relative sm:pr-12 bg-white border-r-4 ${phase.color} rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300`}
              >
                {/* Timeline dot */}
                <div className={`absolute right-[-1.35rem] top-6 w-3 h-3 rounded-full ${phase.dot} ring-4 ring-white hidden sm:block`} />

                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      {phase.phase} · {phase.duration}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{phase.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {phase.deliverables.map((d) => (
                      <span key={d} className="text-[11px] px-2.5 py-1 bg-slate-100 text-slate-600 font-medium rounded-lg">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed text-right">{phase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DeliverablesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            מה אתה מקבל בסוף?
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            לא רק מוצר — אלא חבילה מלאה שמאפשרת לך להמשיך הלאה בלי תלות
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {deliverableTypes.map((d, i) => {
            const Icon = d.icon;
            return (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl border border-slate-100 p-5 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-indigo-600" strokeWidth={1.5} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{d.label}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{d.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-16 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white text-center shadow-2xl shadow-indigo-500/25"
        >
          <h3 className="text-2xl font-bold mb-3">רוצה לדעת מה ידרוש הפרויקט שלך?</h3>
          <p className="text-indigo-200 mb-6 max-w-lg mx-auto">
            פגישת אפיון ראשונית היא ללא עלות, ולאחריה תקבל הצעה מפורטת עם שלבים וסעיפי תמחור.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <motion.span
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-indigo-600 font-bold rounded-full shadow-lg cursor-pointer"
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                תאם פגישת אפיון חינם
                <ArrowLeft className="w-4 h-4" />
              </motion.span>
            </Link>
            <Link href="/services">
              <motion.span
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/15 border border-white/30 text-white font-semibold rounded-full cursor-pointer hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                ראה את כל השירותים
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function ProcessPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <PageHero />
      <Process />
      <DetailedPhases />
      <DeliverablesSection />
      <Footer />
    </main>
  );
}
