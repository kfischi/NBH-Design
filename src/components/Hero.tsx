"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Cpu,
  Layers,
  GitBranch,
  Wifi,
  BarChart2,
  CheckCircle2,
  Zap,
  Settings,
} from "lucide-react";

/* ── Floating UI Widgets ──────────────────────────────────────────── */
function FloatingWidget({
  className,
  delay = 0,
  children,
}: {
  className?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: delay + 0.8, duration: 0.6, ease: "easeOut" as const }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Mini stat widget ─────────────────────────────────────────────── */
function StatWidget({
  value,
  label,
  icon,
  color,
  delay,
  posClass,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  delay: number;
  posClass: string;
}) {
  return (
    <FloatingWidget
      delay={delay}
      className={`absolute bg-white rounded-2xl shadow-xl shadow-slate-900/8 border border-slate-100 p-3.5 flex items-center gap-3 min-w-[160px] ${posClass}`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
      >
        {icon}
      </div>
      <div>
        <div className="text-xl font-bold text-slate-900 leading-none">{value}</div>
        <div className="text-xs text-slate-500 mt-0.5">{label}</div>
      </div>
    </FloatingWidget>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" as const } },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-50 pt-16">
      {/* Gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-indigo-100/60 blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-violet-100/40 blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-50/60 blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center py-20 lg:py-28">
          {/* Text side */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-right"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full inline-block animate-pulse" />
                פתרונות הנדסיים מתקדמים
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6"
            >
              הנדסה{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                רב-תחומית
              </span>{" "}
              לפתרונות מורכבים
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-slate-500 leading-relaxed mb-10 max-w-xl"
            >
              מתכננים ומפתחים פתרונות קצה לקצה לחברות הייטק, תעשייה וביטחון.
              שילוב מנצח של{" "}
              <strong className="text-slate-700 font-semibold">מכניקה</strong>,{" "}
              <strong className="text-slate-700 font-semibold">אלקטרוניקה</strong> ו
              <strong className="text-slate-700 font-semibold">מערכת</strong>.
            </motion.p>

            {/* CTA buttons */}
            <motion.div variants={itemVariants} className="flex items-center gap-4 flex-wrap">
              <motion.a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-full shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-200 text-base"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                תאם פגישת אפיון
                <ArrowLeft className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="#case-studies"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#case-studies")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-slate-700 font-semibold rounded-full border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 shadow-sm transition-all duration-200 text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                צפה במקרי בוחן
              </motion.a>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6 mt-10 pt-8 border-t border-slate-200"
            >
              {[
                { num: "50+", label: "פרויקטים הושלמו" },
                { num: "12+", label: "שנות ניסיון" },
                { num: "100%", label: "שביעות רצון לקוחות" },
              ].map((stat) => (
                <div key={stat.num} className="text-right">
                  <div className="text-2xl font-bold text-slate-900">{stat.num}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual side - floating widgets */}
          <div className="relative hidden lg:flex justify-center items-center">
            {/* Central card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" as const }}
              className="relative w-[340px] h-[380px]"
            >
              {/* Main central widget */}
              <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-100 p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">project_dashboard.nbh</span>
                </div>

                {/* System status rows */}
                {[
                  { label: "מכניקה", pct: 92, color: "bg-indigo-500" },
                  { label: "אלקטרוניקה", pct: 87, color: "bg-violet-500" },
                  { label: "מערכת", pct: 95, color: "bg-cyan-500" },
                ].map((row, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium text-slate-600">
                      <span>{row.pct}%</span>
                      <span>{row.label}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${row.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${row.pct}%` }}
                        transition={{ delay: 1 + i * 0.15, duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}

                {/* Mini chart */}
                <div className="mt-2 pt-3 border-t border-slate-100">
                  <div className="flex items-end gap-1.5 h-16 justify-between px-2">
                    {[40, 65, 45, 80, 60, 90, 75, 95, 70, 88].map((h, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-t-sm"
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 1.2 + i * 0.04, duration: 0.5, ease: "easeOut" }}
                      />
                    ))}
                  </div>
                  <div className="text-center text-xs text-slate-400 mt-2">ביצועי פרויקטים</div>
                </div>

                <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2 mt-1">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-green-700">כל המערכות פעילות ✓</span>
                </div>
              </div>

              {/* Floating stat: top-right */}
              <StatWidget
                value="50+"
                label="פרויקטים"
                icon={<BarChart2 className="w-4.5 h-4.5 text-indigo-600" />}
                color="bg-indigo-50"
                delay={0}
                posClass="top-[-24px] right-[-20px]"
              />

              {/* Floating badge: bottom-left */}
              <FloatingWidget
                delay={0.2}
                className="absolute bottom-[-20px] left-[-24px] bg-white rounded-2xl shadow-xl shadow-slate-900/8 border border-slate-100 p-3 flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Wifi className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">IoT Connected</div>
                  <div className="text-[10px] text-slate-500">LoRa · RFID · NFC</div>
                </div>
              </FloatingWidget>

              {/* Floating badge: top-left */}
              <FloatingWidget
                delay={0.4}
                className="absolute top-[60px] left-[-70px] bg-white rounded-2xl shadow-xl shadow-slate-900/8 border border-slate-100 p-3 flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-50 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-cyan-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Full Stack HW</div>
                  <div className="text-[10px] text-slate-500">מחומרה לתוכנה</div>
                </div>
              </FloatingWidget>

              {/* Floating badge: bottom-right */}
              <FloatingWidget
                delay={0.6}
                className="absolute bottom-[60px] right-[-60px] bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl shadow-xl shadow-indigo-500/30 p-3 flex items-center gap-2.5"
              >
                <Zap className="w-4 h-4 text-white flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">אב-טיפוס מהיר</div>
                  <div className="text-[10px] text-indigo-200">72hrs turnaround</div>
                </div>
              </FloatingWidget>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-slate-400 font-medium">גלול למטה</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 border-2 border-slate-300 rounded-full flex justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-slate-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
