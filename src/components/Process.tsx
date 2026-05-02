"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Lightbulb,
  ClipboardList,
  Ruler,
  Layers,
  Package,
  ArrowLeft,
} from "lucide-react";

/* ── Steps ──────────────────────────────────────────────────────── */

const STEPS = [
  {
    num: "01",
    icon: Lightbulb,
    label: "רעיון",
    desc: "הבנת הצורך וגיבוש הרעיון הראשוני",
    gradient: "from-amber-400 to-orange-500",
    glow: "shadow-amber-500/30",
    ring: "ring-amber-200",
  },
  {
    num: "02",
    icon: ClipboardList,
    label: "איפיון הנדסי",
    desc: "מפרט טכני, בחירת חומרים ואילוצים",
    gradient: "from-indigo-500 to-indigo-600",
    glow: "shadow-indigo-500/30",
    ring: "ring-indigo-200",
  },
  {
    num: "03",
    icon: Ruler,
    label: "תכנון הנדסי",
    desc: "מודלים CAD, ציורי עבודה וסימולציות",
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/30",
    ring: "ring-violet-200",
  },
  {
    num: "04",
    icon: Layers,
    label: "הדפסת תלת-מימד",
    desc: "FDM · SLA · SLS — בהתאם לדרישות",
    gradient: "from-cyan-500 to-teal-500",
    glow: "shadow-cyan-500/30",
    ring: "ring-cyan-200",
  },
  {
    num: "05",
    icon: Package,
    label: "אב-טיפוס",
    desc: "מוצר מוכן לבדיקה, אישור וייצור",
    gradient: "from-emerald-500 to-green-600",
    glow: "shadow-emerald-500/30",
    ring: "ring-emerald-200",
  },
];

/* ── Capability chips ───────────────────────────────────────────── */

const CAPABILITIES = [
  { label: "מתקני עזר לייצור",   c: "indigo" },
  { label: "שיחזור חלקים",       c: "violet" },
  { label: "מתקני ייצור",        c: "cyan"   },
  { label: "מחזיקי מפתחות",      c: "amber"  },
  { label: "צעצועים ומשחקים",    c: "emerald"},
  { label: "פתרונות לבית",       c: "indigo" },
  { label: "שכפול חלקים",        c: "violet" },
  { label: "סיוע לסטארטאפים",    c: "cyan"   },
  { label: "פתרונות טכנולוגיים", c: "amber"  },
  { label: "ייעוץ הנדסי",        c: "emerald"},
  { label: "DFM לייצור המוני",   c: "indigo" },
  { label: "אב-טיפוס מהיר",      c: "violet" },
] as const;

const C: Record<string, string> = {
  indigo:  "bg-indigo-50  border-indigo-100  text-indigo-700",
  violet:  "bg-violet-50  border-violet-100  text-violet-700",
  cyan:    "bg-cyan-50    border-cyan-100    text-cyan-700",
  amber:   "bg-amber-50   border-amber-100   text-amber-700",
  emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
};

/* ── Component ──────────────────────────────────────────────────── */

export default function Process() {
  const ref     = useRef(null);
  const lineRef = useRef(null);
  const inView  = useInView(ref,     { once: true, margin: "-80px"  });
  const lineIn  = useInView(lineRef, { once: true, margin: "-100px" });

  return (
    <section
      id="process"
      className="py-24 lg:py-36 bg-white relative overflow-hidden"
    >
      {/* Blueprint grid */}
      <div
        className="absolute inset-0 opacity-[0.022] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#6366f1 1px,transparent 1px),linear-gradient(90deg,#6366f1 1px,transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute -top-32 -right-32 w-[520px] h-[520px] bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-violet-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-50/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-full mb-5">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            תהליך העבודה
          </span>

          <h2 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-slate-900 leading-tight tracking-tight mb-5">
            פתרונות{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg,#f59e0b 0%,#6366f1 50%,#8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              פשוטים
            </span>{" "}
            לבעיות מורכבות
          </h2>

          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            מהרעיון ועד לאב-טיפוס — תהליך מובנה, מוכח וממוקד בשילוב{" "}
            <strong className="text-slate-700 font-semibold">
              הדפסת תלת-מימד מקצועית
            </strong>
            .
          </p>
        </motion.div>

        {/* ── Steps ── */}
        <div className="relative" ref={lineRef}>

          {/* Background rail */}
          <div className="absolute top-10 left-[8%] right-[8%] h-px bg-slate-100 hidden lg:block" />

          {/* Animated fill line */}
          <motion.div
            className="absolute top-10 left-[8%] right-[8%] h-px hidden lg:block origin-left"
            style={{
              background:
                "linear-gradient(to right, #f59e0b, #6366f1, #8b5cf6, #06b6d4, #10b981)",
            }}
            initial={{ scaleX: 0 }}
            animate={lineIn ? { scaleX: 1 } : {}}
            transition={{ duration: 1.4, delay: 0.4, ease: "easeInOut" }}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-12 gap-x-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 32, scale: 0.94 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{
                    duration: 0.55,
                    delay: 0.3 + i * 0.12,
                    ease: "easeOut",
                  }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Icon circle */}
                  <div className="relative mb-5">
                    <div
                      className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl ${step.glow} ring-4 ${step.ring} ring-offset-2 ring-offset-white`}
                    >
                      <Icon className="w-8 h-8 text-white" strokeWidth={1.6} />
                    </div>

                    {/* Step number badge */}
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                      <span className="text-[9px] font-bold text-slate-500 leading-none">
                        {step.num}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                    {step.label}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[120px]">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Divider ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.0 }}
          className="my-16 flex items-center gap-4"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-200" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-2">
            יכולות ותחומי יישום
          </span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-200" />
        </motion.div>

        {/* ── Capability chips ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2.5"
        >
          {CAPABILITIES.map((cap, i) => (
            <motion.span
              key={cap.label}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.15 + i * 0.045, duration: 0.3 }}
              className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold border ${C[cap.c]}`}
            >
              {cap.label}
            </motion.span>
          ))}
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.6, duration: 0.5 }}
          className="mt-16 text-center"
        >
          {/* Quote card */}
          <div className="relative inline-block max-w-2xl mx-auto mb-8">
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl px-8 py-7 shadow-2xl shadow-slate-900/20 overflow-hidden">
              {/* Blobs inside card */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-indigo-600/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-violet-600/20 rounded-full blur-2xl" />

              <p className="relative text-base sm:text-lg font-medium text-white leading-relaxed" dir="rtl">
                יש לך אתגר טכנולוגי שצריך פתרון הנדסי?{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #a5b4fc, #c4b5fd)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  פנה אליי ואהפוך לך כל רעיון למציאות.
                </span>
              </p>

              <p className="relative text-xs text-slate-400 mt-2 text-right">
                — נבט בן חיים, מהנדס ומעצב מוצר
              </p>
            </div>
          </div>

          <motion.a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-full shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-200 text-base"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            תאם פגישת אפיון חינם
            <ArrowLeft className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
