"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Award,
  BookOpen,
  Users,
  Globe,
  Shield,
  Cpu,
  Box,
  Settings2,
  Linkedin,
  Mail,
  CheckCircle,
} from "lucide-react";

const skills = [
  { name: "SolidWorks / CAD", pct: 95, color: "bg-indigo-500" },
  { name: "PCB Design", pct: 90, color: "bg-violet-500" },
  { name: "Embedded Systems", pct: 88, color: "bg-cyan-500" },
  { name: "PLC / Automation", pct: 85, color: "bg-emerald-500" },
  { name: "IoT / RF / RFID", pct: 92, color: "bg-orange-500" },
];

const highlights = [
  { icon: Shield, label: "פרויקטי ביטחון", value: "מסווג", color: "bg-slate-100 text-slate-600" },
  { icon: Globe, label: "לקוחות בינלאומיים", value: "10+", color: "bg-blue-50 text-blue-600" },
  { icon: BookOpen, label: "פטנטים", value: "3", color: "bg-amber-50 text-amber-600" },
  { icon: Users, label: "שנות ניסיון", value: "12+", color: "bg-emerald-50 text-emerald-600" },
];

const disciplines = [
  { icon: Box, label: "מכניקה", color: "text-indigo-600 bg-indigo-50" },
  { icon: Cpu, label: "אלקטרוניקה", color: "text-violet-600 bg-violet-50" },
  { icon: Settings2, label: "מערכת", color: "text-cyan-600 bg-cyan-50" },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute -left-64 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-50 blur-3xl opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-full mb-4">
            הארכיטקט מאחורי הפתרונות
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            אודות{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              נבט בן חיים
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.65, ease: "easeOut" as const }}
            className="space-y-6"
          >
            {/* Main profile card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-7 shadow-sm">
              <div className="flex items-start gap-5 mb-6">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
                    <span className="text-3xl font-bold text-white">נ</span>
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>

                <div className="flex-1 text-right">
                  <h3 className="text-xl font-bold text-slate-900">נבט בן חיים</h3>
                  <p className="text-sm text-indigo-600 font-medium mb-1">Multidisciplinary Product Architect</p>
                  <p className="text-xs text-slate-500">
                    מנכ&quot;ל ומייסד | NBH Engineering Solutions
                  </p>
                  <div className="flex gap-2 mt-3 justify-end">
                    {disciplines.map((d) => {
                      const DIcon = d.icon;
                      return (
                        <span
                          key={d.label}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${d.color}`}
                        >
                          <DIcon className="w-3 h-3" />
                          {d.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed text-sm mb-5 text-right">
                נבט הוא מהנדס מוצר רב-תחומי עם ניסיון של מעל 12 שנה בפיתוח פתרונות הנדסיים
                מורכבים לחברות הייטק, ביטחון ותעשייה. מה שמייחד אותו הוא היכולת{" "}
                <strong className="text-slate-800">לחבר את המארז המכני עם המוח האלקטרוני</strong> —
                ולסנכרן את הכל תחת ארכיטקטורת מערכת אחת קוהרנטית.
              </p>

              <div className="flex gap-3 justify-end">
                <motion.a
                  href="mailto:nevet@nbh-engineering.com"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <Mail className="w-4 h-4" />
                  אימייל
                </motion.a>
                <motion.a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-xl transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </motion.a>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {highlights.map((h, i) => {
                const HIcon = h.icon;
                return (
                  <motion.div
                    key={h.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                    className="bg-white rounded-2xl border border-slate-100 p-4 text-right shadow-sm"
                  >
                    <div className={`w-9 h-9 rounded-xl ${h.color} flex items-center justify-center mb-3 mr-auto`}>
                      <HIcon className="w-4.5 h-4.5" strokeWidth={1.75} />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{h.value}</div>
                    <div className="text-xs text-slate-500">{h.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right: Skills & Value prop */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.65, ease: "easeOut" as const }}
            className="space-y-6"
          >
            {/* Unique value card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-7 text-white shadow-xl shadow-indigo-500/25">
              <Award className="w-8 h-8 text-indigo-200 mb-4" />
              <h4 className="text-xl font-bold mb-3">הערך הייחודי</h4>
              <p className="text-indigo-100 leading-relaxed text-sm mb-5">
                רוב חברות ההנדסה מתמחות בתחום אחד. ב-NBH תקבל מענה מלא על כל רכיבי המוצר
                שלך — מהתכנון המכני ועד הפרמוור, כולל ה-PCB שמחבר ביניהם.
              </p>
              <div className="space-y-3">
                {[
                  "ספק אחד לכל הצרכים ההנדסיים",
                  "תקשורת ישירה עם המנהל הטכני",
                  "אחריות מלאה על כל מחזור הפיתוח",
                  "ניסיון עם דרישות ביטחוניות מחמירות",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle className="w-4 h-4 text-indigo-300 flex-shrink-0" />
                    <span className="text-indigo-100">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-7 shadow-sm">
              <h4 className="text-base font-bold text-slate-900 mb-5 text-right">רמת מיומנות</h4>
              <div className="space-y-4">
                {skills.map((skill, i) => (
                  <div key={skill.name} className="text-right">
                    <div className="flex justify-between text-sm font-medium text-slate-600 mb-1.5">
                      <span className="text-slate-400">{skill.pct}%</span>
                      <span>{skill.name}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${skill.color}`}
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${skill.pct}%` } : {}}
                        transition={{
                          delay: 0.5 + i * 0.1,
                          duration: 0.8,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education/Cert note */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-right flex-1">
                <p className="text-xs font-bold text-amber-800">הכשרה והסמכות</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  הנדסת אלקטרוניקה B.Sc. · Certified PLC Engineer · Certified PCB Designer
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
