"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Header from "@/components/Header";
import CaseStudies from "@/components/CaseStudies";
import Footer from "@/components/Footer";
import { ArrowLeft, TrendingUp, Clock, DollarSign, Award } from "lucide-react";
import Link from "next/link";

const industries = [
  { label: "ביטחון ובטחון פנים", color: "bg-slate-800 text-white" },
  { label: "חקלאות חכמה",        color: "bg-emerald-600 text-white" },
  { label: "ביומד",              color: "bg-rose-600 text-white" },
  { label: "תעשייה ומיכון",      color: "bg-indigo-600 text-white" },
  { label: "IoT / בית חכם",      color: "bg-cyan-600 text-white" },
  { label: "מוצרי צרכנות",       color: "bg-amber-600 text-white" },
  { label: "רכב ותחבורה",        color: "bg-violet-600 text-white" },
  { label: "אנרגיה מתחדשת",      color: "bg-teal-600 text-white" },
];

const impactMetrics = [
  { icon: Clock,       value: "50%",       label: "קיצור זמן פיתוח",      sub: "בממוצע לעומת ספק בודד-תחום" },
  { icon: DollarSign,  value: "×3",        label: "ROI ממוצע",             sub: "תוך 12 חודשים מסיום הפרויקט" },
  { icon: TrendingUp,  value: "40%",       label: "ייעול תהליכי ייצור",    sub: "בפרויקטי אוטומציה" },
  { icon: Award,       value: "100%",      label: "שביעות רצון לקוחות",   sub: "בכל הפרויקטים שנמסרו" },
];

function PageHero() {
  return (
    <section className="relative pt-32 pb-20 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute -top-40 right-1/4 w-[600px] h-[400px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 text-emerald-300 text-xs font-semibold rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            עבודות נבחרות
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            פתרונות שבנינו,
            <br />
            <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              בעיות שפתרנו
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
            כל פרויקט כאן התחיל מאתגר הנדסי אמיתי — מחוסר פתרון קיים בשוק ועד תקלה
            שעלתה כסף. ראו איך הגענו ממצב האתגר לפתרון עובד בשטח.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {impactMetrics.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl p-5 text-center"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-4.5 h-4.5 text-emerald-300" />
                  </div>
                  <div className="text-2xl font-black text-white mb-0.5">{m.value}</div>
                  <div className="text-xs text-emerald-300 font-semibold mb-1">{m.label}</div>
                  <div className="text-[10px] text-slate-500 leading-tight">{m.sub}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function IndustriesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
            תעשיות ותחומים
          </h2>
          <p className="text-slate-500">
            ניסיון רחב פורש על פני תחומים מגוונים — מביטחון ועד חקלאות חכמה
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3">
          {industries.map((ind, i) => (
            <motion.span
              key={ind.label}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold ${ind.color} shadow-sm`}
            >
              {ind.label}
            </motion.span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-8 text-white text-center shadow-xl shadow-indigo-500/25"
        >
          <h3 className="text-xl font-bold mb-2">יש לך פרויקט דומה?</h3>
          <p className="text-indigo-200 text-sm mb-5 max-w-md mx-auto">
            ספר לנו על האתגר שלך ונעריך יחד כיצד ניתן לגשת אליו.
          </p>
          <Link href="/contact">
            <motion.span
              className="inline-flex items-center gap-2 px-7 py-3 bg-white text-indigo-600 font-bold rounded-full shadow-lg cursor-pointer text-sm"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              דבר איתנו
              <ArrowLeft className="w-4 h-4" />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <PageHero />
      <CaseStudies />
      <IndustriesSection />
      <Footer />
    </main>
  );
}
