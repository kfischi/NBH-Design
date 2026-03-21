"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Play } from "lucide-react";

const VIDEO_URL =
  "https://res.cloudinary.com/dptyfvwyo/video/upload/q_auto,f_auto/v1774134044/0321_1_1_sxywcf.mp4";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

/* Open the chatbot from anywhere via a custom event */
function openChatbot() {
  window.dispatchEvent(new CustomEvent("nbh:open-chatbot"));
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* ── Full-screen video ── */}
      <video
        src={VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* ── Mobile overlay: uniform dark ── */}
      <div className="absolute inset-0 z-10 bg-black/60 lg:bg-transparent" />

      {/* ── Desktop overlay: directional — very dark right, transparent left ── */}
      <div className="absolute inset-0 z-10 hidden lg:block bg-gradient-to-l from-black/90 via-black/60 to-black/15" />

      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Subtle white grid */}
      <div
        className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-20 w-full pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 min-h-screen items-center py-24 lg:py-32">

            {/* Left col — intentionally empty so video shows */}
            <div className="hidden lg:block" />

            {/* Right col — text */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-right"
            >
              {/* Text content */}
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
                  <span
                    style={{
                      background:
                        "linear-gradient(135deg,#a5b4fc 0%,#c4b5fd 55%,#67e8f9 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 20px rgba(139,92,246,0.6))",
                    }}
                  >
                    רב-תחומית
                  </span>
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

                {/* CTAs — removed booking button, chatbot is the CTA */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-4 flex-wrap"
                >
                  <motion.button
                    onClick={openChatbot}
                    className="inline-flex items-center gap-2.5 px-7 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-full shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-500/70 transition-all duration-200 text-base"
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    דבר עם יועץ AI
                    <ArrowLeft className="w-4 h-4" />
                  </motion.button>

                  <motion.a
                    href="#case-studies"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .querySelector("#case-studies")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-2 px-6 py-4 bg-white/12 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/22 transition-all duration-200 text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
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
  );
}
