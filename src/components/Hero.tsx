"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Layers, BarChart2, Zap } from "lucide-react";

const VIDEO_URL =
  "https://res.cloudinary.com/dptyfvwyo/video/upload/q_auto,f_auto/v1774130054/0321_1_dzidnt.mp4";

/* ── Floating badge wrapper ───────────────────────────────────────── */
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
      initial={{ opacity: 0, y: 14, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: delay + 0.9, duration: 0.55, ease: "easeOut" as const }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Animation variants ───────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" as const } },
};

/* ── Component ────────────────────────────────────────────────────── */
export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-50 pt-16">

      {/* Gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-indigo-100/60 blur-3xl animate-pulse-slow" />
        <div
          className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-violet-100/40 blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-50/60 blur-3xl" />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#6366f1 1px,transparent 1px),linear-gradient(90deg,#6366f1 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-20 lg:py-28">

          {/* ── Text side ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-right order-1"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full inline-block animate-pulse" />
                הנדסה · תכנון · הדפסה תלת-מימד
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
                  background: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#06b6d4 100%)",
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
              מהרעיון ועד לאב-טיפוס ביד — תכנון הנדסי מלא בשילוב{" "}
              <strong className="text-slate-700 font-semibold">הדפסת תלת-מימד מקצועית</strong>.
              פתרונות פשוטים לבעיות מורכבות, לסטארטאפים, יצרנים וממציאים.
            </motion.p>

            {/* CTAs */}
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

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6 mt-10 pt-8 border-t border-slate-200"
            >
              {[
                { num: "50+",  label: "פרויקטים הושלמו" },
                { num: "12+",  label: "שנות ניסיון" },
                { num: "100%", label: "שביעות רצון לקוחות" },
              ].map((stat) => (
                <div key={stat.num} className="text-right">
                  <div className="text-2xl font-bold text-slate-900">{stat.num}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Video side ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" as const }}
            className="relative flex justify-center items-center order-2"
          >
            {/* Glow halo */}
            <div className="absolute -inset-5 bg-gradient-to-br from-indigo-400/20 via-violet-400/12 to-cyan-300/15 rounded-[44px] blur-2xl pointer-events-none" />

            {/* Video frame */}
            <div className="relative w-full max-w-[460px] rounded-[22px] overflow-hidden shadow-2xl shadow-slate-900/25 ring-1 ring-black/6 bg-slate-900">

              <video
                src={VIDEO_URL}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full block"
                style={{ maxHeight: "520px", objectFit: "cover" }}
              />

              {/* Top vignette */}
              <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

              {/* Bottom vignette */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent pointer-events-none" />

              {/* Brand pill */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1.5 shadow-md border border-white/50">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-slate-800 tracking-tight">
                  NBH Engineering
                </span>
              </div>
            </div>

            {/* Floating badge — top right */}
            <FloatingWidget
              delay={0}
              className="absolute top-[-18px] right-[-10px] sm:right-[-18px] bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 p-3 flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                <BarChart2 className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <div className="text-base font-bold text-slate-900 leading-none">50+</div>
                <div className="text-[10px] text-slate-500 mt-0.5">פרויקטים</div>
              </div>
            </FloatingWidget>

            {/* Floating badge — bottom left */}
            <FloatingWidget
              delay={0.2}
              className="absolute bottom-[-18px] left-[-10px] sm:left-[-20px] bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 p-3 flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                <Layers className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">3D Printing</div>
                <div className="text-[10px] text-slate-500">FDM · SLA · SLS</div>
              </div>
            </FloatingWidget>

            {/* Floating badge — left side, desktop only */}
            <FloatingWidget
              delay={0.5}
              className="absolute top-[38%] left-[-82px] hidden lg:flex bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl shadow-xl shadow-indigo-500/30 p-3 items-center gap-2.5"
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
