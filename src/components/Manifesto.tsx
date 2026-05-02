"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const BELIEFS = [
  {
    number: "01",
    claim: "הנדסה טובה לא נמדדת בציורים יפים.",
    emphasis: "היא נמדדת כשהמוצר עובד בשדה, בתנאים שלא תוכננו.",
    detail:
      "כל אב-טיפוס שמסרתי עבר בדיקות תנאים קיצוניים. לא כי הלקוח ביקש — כי זה הסטנדרט.",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    number: "02",
    claim: "תאמין לנו — מהנדס אחד שרואה את כל המוצר שווה יותר משלושה שרואים כל אחד חלק.",
    emphasis: "הפרצות נמצאות בממשקים. בין המכניקה לאלקטרוניקה. בין החומרה לפריווייר.",
    detail:
      "כשאני מתכנן את המארז — אני כבר חושב על הDFM, על נתיבי הנחת הכבלים, על מיקום הLED.",
    gradient: "from-violet-500 to-cyan-500",
  },
  {
    number: "03",
    claim: "כל שלב שמיקרתם לספק חיצוני — הוא שלב שאיבדתם שליטה עליו.",
    emphasis: "תיאום בין ספקים הוא מקצוע בפני עצמו. ורוב לקוחות לא שכרו מישהו לעשות אותו.",
    detail:
      "לכן אני לא מקרן. אם לקחתי על עצמי פרויקט — כל שלב נמצא אצלי, עד המסירה.",
    gradient: "from-cyan-500 to-emerald-500",
  },
];

export default function Manifesto() {
  const containerRef = useRef(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <section
      ref={containerRef}
      className="relative py-28 lg:py-36 overflow-hidden bg-slate-950"
    >
      {/* Parallax backdrop */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </motion.div>

      {/* Glow orbs */}
      <div className="absolute -top-40 left-1/4 w-[700px] h-[400px] bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-[600px] h-[350px] bg-violet-900/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/8 border border-white/15 text-slate-400 text-xs font-bold tracking-wider uppercase rounded-full mb-6">
            מה אנחנו מאמינים
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            המניפסט של
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 40%, #67e8f9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              NBH Engineering
            </span>
          </h2>
        </motion.div>

        {/* Beliefs */}
        <div className="space-y-0">
          {BELIEFS.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? 40 : -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.18, duration: 0.7, ease: "easeOut" }}
              className={`relative py-12 border-b border-white/8 last:border-0 ${
                i % 2 !== 0 ? "text-right" : "text-right"
              }`}
            >
              {/* Number */}
              <div
                className={`text-[120px] sm:text-[160px] font-black leading-none absolute top-4 pointer-events-none select-none opacity-[0.04] ${
                  i % 2 === 0 ? "-right-4" : "-left-4"
                }`}
                style={{
                  background: `linear-gradient(135deg, white, transparent)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {b.number}
              </div>

              <div className="relative">
                {/* Gradient accent line */}
                <div
                  className={`h-0.5 w-12 bg-gradient-to-r ${b.gradient} mb-6 ml-auto`}
                />

                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug mb-4 max-w-3xl ml-auto">
                  {b.claim}
                </p>

                <p
                  className={`text-base sm:text-lg font-semibold mb-4 max-w-2xl ml-auto bg-gradient-to-r ${b.gradient} bg-clip-text text-transparent`}
                >
                  {b.emphasis}
                </p>

                <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-xl ml-auto">
                  {b.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing statement */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 text-center"
        >
          <p className="text-slate-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-8 font-medium">
            אם גם אתה מאמין שהנדסה צריכה להיות{" "}
            <span className="text-white font-bold">אחראית, מלאה ושקופה</span>{" "}
            — אנחנו כנראה נסתדר מצוין.
          </p>
          <Link href="/contact">
            <motion.span
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-slate-900 font-bold rounded-full shadow-2xl shadow-black/30 cursor-pointer text-base"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              בוא נדבר
              <ArrowLeft className="w-4 h-4" />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
