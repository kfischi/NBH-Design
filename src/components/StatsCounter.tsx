"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { motion } from "framer-motion";

const STATS = [
  {
    value: 52,
    suffix: "+",
    label: "פרויקטים הושלמו",
    sub: "מביטחון ועד IoT חקלאי",
    color: "from-indigo-400 to-violet-400",
  },
  {
    value: 12,
    suffix: "+",
    label: "שנות ניסיון",
    sub: "פיתוח בתעשיות מחמירות",
    color: "from-violet-400 to-cyan-400",
  },
  {
    value: 3,
    suffix: "",
    label: "פטנטים רשומים",
    sub: "פתרונות מקוריים שאין אחרים",
    color: "from-cyan-400 to-emerald-400",
  },
  {
    value: 100,
    suffix: "%",
    label: "שביעות רצון לקוחות",
    sub: "אף פרויקט לא ירד מ-5 כוכבים",
    color: "from-emerald-400 to-amber-400",
  },
];

function AnimatedNumber({ value, suffix, color }: { value: number; suffix: string; color: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();
    const duration = 2000;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(value);
    };

    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span ref={ref}>
      <span
        className={`bg-gradient-to-r ${color} bg-clip-text text-transparent tabular-nums`}
      >
        {count}
      </span>
      <span className={`bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
        {suffix}
      </span>
    </span>
  );
}

export default function StatsCounter() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-20 bg-slate-900 relative overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />
      {/* Glow orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[250px] bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500 mb-2">
            בנאמר — בנוכח
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            המספרים שעומדים מאחורינו
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-800 rounded-3xl overflow-hidden">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="bg-slate-900 p-8 sm:p-10 text-center relative group hover:bg-slate-800/60 transition-colors duration-300"
            >
              {/* Hover glow */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b ${s.color.replace("from-", "from-").replace("to-", "to-")}/5 to-transparent pointer-events-none`} />

              <div className="text-5xl sm:text-6xl font-black tracking-tight mb-3">
                <AnimatedNumber value={s.value} suffix={s.suffix} color={s.color} />
              </div>
              <div className="text-sm font-bold text-white mb-1">{s.label}</div>
              <div className="text-xs text-slate-500 leading-relaxed">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
