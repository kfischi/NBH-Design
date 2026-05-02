"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Play } from "lucide-react";
import { WebGLShader } from "@/components/ui/web-gl-shader";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

function openChatbot() {
  window.dispatchEvent(new CustomEvent("nbh:open-chatbot"));
}

export default function Hero() {
  return (
    <>
      {/* ── Hero section ── */}
      <section className="relative h-[58vh] lg:min-h-screen flex items-center overflow-hidden">

        {/* WebGL shader background */}
        <WebGLShader fixed={false} />

        {/* Dark overlay — light enough to keep the shader vivid */}
        <div className="absolute inset-0 z-10 bg-black/40" />

        {/* Desktop overlay: directional gradient */}
        <div className="absolute inset-0 z-10 hidden lg:block bg-gradient-to-l from-black/65 via-black/20 to-transparent" />

        {/* Bottom vignette */}
        <div className="absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Subtle white grid */}
        <div
          className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* ── Desktop content ── */}
        <div className="hidden lg:block relative z-20 w-full pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 min-h-screen items-center py-24 lg:py-32">

              {/* Left col — intentionally empty so shader shows */}
              <div />

              {/* Right col — text */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-right"
              >
                <div className="rounded-3xl p-8 lg:p-10">

                  {/* Badge */}
                  <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-7">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-md border border-white/30 text-white text-xs font-semibold rounded-full">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full inline-block animate-pulse" />
                      הנדסה · תכנון · הדפסה תלת-מימד
                    </span>
                  </motion.div>

                  {/* Headline */}
                  <motion.h1
                    variants={itemVariants}
                    className="text-5xl sm:text-6xl lg:text-[4rem] xl:text-[4.5rem] font-black text-white leading-[1.04] tracking-tight mb-6"
                    style={{ textShadow: "0 2px 24px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.8)" }}
                  >
                    הנדסה{" "}
                    <span className="text-white">רב-תחומית</span>
                    <br />
                    לפתרונות מורכבים
                  </motion.h1>

                  {/* Sub-headline */}
                  <motion.p
                    variants={itemVariants}
                    className="text-lg sm:text-xl text-white leading-relaxed mb-10 max-w-lg"
                    style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
                  >
                    מהרעיון ועד לאב-טיפוס ביד — תכנון הנדסי מלא בשילוב{" "}
                    <strong className="text-white font-bold">הדפסת תלת-מימד מקצועית</strong>.
                    פתרונות פשוטים לבעיות מורכבות.
                  </motion.p>

                  {/* CTAs */}
                  <motion.div variants={itemVariants} className="flex items-center gap-4 flex-wrap">
                    <LiquidButton
                      className="text-white border border-white/30 rounded-full"
                      size="xl"
                      onClick={openChatbot}
                    >
                      <span className="flex items-center gap-2.5">
                        דבר עם יועץ AI
                        <ArrowLeft className="w-4 h-4" />
                      </span>
                    </LiquidButton>

                    <motion.a
                      href="#case-studies"
                      onClick={(e) => {
                        e.preventDefault();
                        document.querySelector("#case-studies")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="inline-flex items-center gap-2 px-6 py-4 bg-white/12 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/22 transition-all duration-200 text-base"
                    >
                      <Play className="w-4 h-4 fill-white/70" />
                      צפה במקרי בוחן
                    </motion.a>
                  </motion.div>

                  {/* Stats */}
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-8 mt-10 pt-8 border-t border-white/20"
                  >
                    {[
                      { num: "50+",  label: "פרויקטים הושלמו" },
                      { num: "12+",  label: "שנות ניסיון" },
                      { num: "100%", label: "שביעות רצון" },
                    ].map((stat) => (
                      <div key={stat.num} className="text-right">
                        <div
                          className="text-2xl font-extrabold text-white"
                          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
                        >
                          {stat.num}
                        </div>
                        <div className="text-xs text-white">{stat.label}</div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Mobile content inside hero ── */}
        <div className="lg:hidden relative z-20 w-full px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-md border border-white/30 text-white text-xs font-semibold rounded-full mb-5">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full inline-block animate-pulse" />
            הנדסה · תכנון · הדפסה תלת-מימד
          </span>
          <h1 className="text-4xl font-black text-white leading-tight tracking-tight mb-3"
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}>
            הנדסה רב-תחומית<br />לפתרונות מורכבים
          </h1>
          <p className="text-sm text-white/80 mb-4"
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}>
            מהרעיון ועד לאב-טיפוס — תכנון מלא עם הדפסת תלת-מימד
          </p>
        </div>

        {/* Scroll indicator — desktop only */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.6 }}
          className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-2"
        >
          <span className="text-[11px] text-white font-medium tracking-wide">גלול למטה</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 bg-white/35 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Mobile CTA bar (below hero) ── */}
      <div className="lg:hidden bg-slate-900 px-6 py-6 flex flex-col items-center gap-3">
        <button
          onClick={openChatbot}
          className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-full shadow-lg text-base"
        >
          דבר עם יועץ AI
          <ArrowLeft className="w-4 h-4" />
        </button>
        <a
          href="#case-studies"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector("#case-studies")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 text-white font-semibold rounded-full border border-white/20 text-base"
        >
          <Play className="w-4 h-4 fill-white/70" />
          צפה במקרי בוחן
        </a>
      </div>
    </>
  );
}
