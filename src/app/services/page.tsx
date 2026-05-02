"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Header from "@/components/Header";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import {
  CheckCircle, ArrowLeft, X,
  Zap, Clock, Shield, Users,
  Box, Cpu, Settings2,
} from "lucide-react";
import Link from "next/link";

const comparisons = [
  { feature: "כיסוי מלא מכניקה + אלקטרוניקה + תוכנה", proto: true, others: false },
  { feature: "ספק יחיד לכל מחזור הפיתוח",              proto: true, others: false },
  { feature: "תקשורת ישירה עם המהנדס המבצע",           proto: true, others: false },
  { feature: "ניסיון בפרויקטי ביטחון מסווגים",         proto: true, others: false },
  { feature: "אב-טיפוס מהיר בתלת-מימד On-site",        proto: true, others: false },
  { feature: "אחריות מלאה על אינטגרציה בין תחומים",    proto: true, others: false },
];

const technologies = [
  { label: "SolidWorks",  color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  { label: "Fusion 360",  color: "bg-blue-50 text-blue-700 border-blue-100" },
  { label: "KiCad / Altium", color: "bg-violet-50 text-violet-700 border-violet-100" },
  { label: "STM32 / ESP32", color: "bg-cyan-50 text-cyan-700 border-cyan-100" },
  { label: "FDM / SLA / SLS", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { label: "LoRa / BLE / RFID", color: "bg-amber-50 text-amber-700 border-amber-100" },
  { label: "Siemens PLC / SCADA", color: "bg-rose-50 text-rose-700 border-rose-100" },
  { label: "Embedded C/C++", color: "bg-slate-100 text-slate-700 border-slate-200" },
  { label: "MATLAB / Simulink", color: "bg-orange-50 text-orange-700 border-orange-100" },
  { label: "Python / ROS", color: "bg-teal-50 text-teal-700 border-teal-100" },
];

const disciplines = [
  {
    icon: Box,
    color: "from-indigo-500 to-indigo-600",
    glow: "shadow-indigo-500/25",
    title: "מכניקה ועיצוב פיזי",
    items: ["תכנון CAD מלא", "DFM לייצור המוני", "בחירת חומרים", "הדפסות תלת-מימד מתקדמות"],
  },
  {
    icon: Cpu,
    color: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/25",
    title: "אלקטרוניקה ופריווייר",
    items: ["תכנון PCB רב-שכבות", "Embedded C/C++", "RF & תקשורת אלחוטית", "IoT מבוסס LoRa/BLE"],
  },
  {
    icon: Settings2,
    color: "from-cyan-500 to-teal-500",
    glow: "shadow-cyan-500/25",
    title: "מיכון ואוטומציה",
    items: ["תכנון PLC ו-SCADA", "Motion Control", "אינטגרציה עם ERP", "Commissioning מלא"],
  },
];

function PageHero() {
  return (
    <section className="relative pt-32 pb-20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute -top-40 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 text-indigo-300 text-xs font-semibold rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
            שלושת עמודי התווך
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            השירותים שלנו —
            <br />
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              הנדסה מלאה תחת קורת גג אחת
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            בניגוד לספקים שמתמחים בתחום בודד, Proto-Model מציעה מענה אינטגרטיבי — מהרעיון הראשוני ועד
            לאב-הטיפוס הסופי, ללא נקודות עיוורות ביניים.
          </p>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {[
              { icon: Zap, label: "זמן פיתוח מהיר", value: "50% חיסכון" },
              { icon: Shield, label: "אחריות מלאה", value: "מקצה לקצה" },
              { icon: Clock, label: "ניסיון", value: "12+ שנה" },
              { icon: Users, label: "פרויקטים", value: "50+ הושלמו" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="text-center">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-5 h-5 text-indigo-300" />
                  </div>
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-slate-500">{s.label}</div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DisciplinesDeep() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-50/60 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-full mb-4">
            עומק טכני
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            מה בדיוק כולל כל תחום?
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            כל תחום מבוסס על כלים מקצועיים, ניסיון מעשי ותהליכי עבודה מוכחים
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {disciplines.map((d, i) => {
            const Icon = d.icon;
            return (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="bg-white rounded-3xl border border-slate-100 hover:border-slate-200 p-7 shadow-sm hover:shadow-xl hover:shadow-slate-900/8 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${d.color} flex items-center justify-center shadow-lg ${d.glow} mb-5`}>
                  <Icon className="w-7 h-7 text-white" strokeWidth={1.6} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">{d.title}</h3>
                <ul className="space-y-3">
                  {d.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Tech stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16"
        >
          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">
            טכנולוגיות וכלים
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {technologies.map((t) => (
              <span
                key={t.label}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border ${t.color}`}
              >
                {t.label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-full mb-4">
            למה Proto-Model?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Proto-Model מול ספקים רגילים
          </h2>
          <p className="text-slate-500">
            ההבדל הוא לא רק ביכולות — הוא בחיסכון הזמן, הסיכון והכסף שתשלם כשתצטרך לתאם בין ספקים
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden"
        >
          {/* Header row */}
          <div className="grid grid-cols-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold">
            <div className="p-4 text-right">יכולת</div>
            <div className="p-4 text-center border-r border-l border-white/20">
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-[10px] font-black">N</span>
                </div>
                Proto-Model
              </div>
            </div>
            <div className="p-4 text-center">ספקים רגילים</div>
          </div>

          {comparisons.map((row, i) => (
            <motion.div
              key={row.feature}
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.4 }}
              className={`grid grid-cols-3 border-b border-slate-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`}
            >
              <div className="p-4 text-sm text-slate-700 text-right">{row.feature}</div>
              <div className="p-4 flex justify-center items-center border-r border-l border-slate-100">
                {row.proto ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <X className="w-5 h-5 text-red-400" />
                )}
              </div>
              <div className="p-4 flex justify-center items-center">
                {row.others ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <X className="w-5 h-5 text-red-400" />
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ServicesCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 to-indigo-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />
      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5">
            מוכן להתחיל?
          </h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            שתף אותנו בפרויקט שלך — נשיב תוך 24 שעות עם הערכת היתכנות ראשונית, בחינם.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <motion.span
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-full shadow-2xl shadow-indigo-500/40 cursor-pointer"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                שוחח עם יועץ
                <ArrowLeft className="w-4 h-4" />
              </motion.span>
            </Link>
            <Link href="/case-studies">
              <motion.span
                className="inline-flex items-center gap-2 px-7 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full cursor-pointer hover:bg-white/15 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                ראה פרויקטים קודמים
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <PageHero />
      <Services />
      <DisciplinesDeep />
      <ComparisonSection />
      <ServicesCTA />
      <Footer />
    </main>
  );
}
