"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Crosshair,
  Sprout,
  ArrowUpRight,
  Tag,
  Zap,
  Wifi,
  Clock,
} from "lucide-react";

const cases = [
  {
    id: 1,
    icon: ShoppingCart,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    category: "מכניקה",
    categoryColor: "bg-indigo-50 text-indigo-700",
    title: "מחבר עגלות תאומות",
    subtitle: "פתרון מכני חכם ויעיל",
    description:
      "תכנון ופיתוח מנגנון חיבור חכם לעגלות תאומות. הפתרון כולל מנגנון נעילה פטנטי המאפשר חיבור ושחרור בפעולה אחת פשוטה, עם חוזק מרבי ובטיחות מלאה.",
    tags: ["CAD", "3D Print", "פיתוח מוצר"],
    stats: [
      { icon: Clock, label: "זמן פיתוח", value: "6 שבועות" },
      { icon: Zap, label: "שיפור ביעילות", value: "3x" },
    ],
    size: "large",
    gradient: "from-indigo-50 to-blue-50",
    accentColor: "indigo",
  },
  {
    id: 2,
    icon: Crosshair,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    category: "אלקטרוניקה",
    categoryColor: "bg-rose-50 text-rose-700",
    title: "כרטיסים לבקרת ירי",
    subtitle: "פיתוח מעגלים מורכבים",
    description:
      "פיתוח מעגלי PCB מתקדמים לבקרת מערכות ירי. הכרטיסים כוללים עיבוד אות מהיר, תקשורת מוצפנת ועמידות בתנאי שדה קשים.",
    tags: ["PCB Design", "FPGA", "Military Grade"],
    stats: [
      { icon: Zap, label: "זמן תגובה", value: "<1ms" },
      { icon: Tag, label: "שכבות PCB", value: "8 Layer" },
    ],
    size: "medium",
    gradient: "from-rose-50 to-orange-50",
    accentColor: "rose",
  },
  {
    id: 3,
    icon: Sprout,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    category: "IoT",
    categoryColor: "bg-emerald-50 text-emerald-700",
    title: "מערכות IoT חקלאי",
    subtitle: "חיישני שדה מבוססי LoRa",
    description:
      "רשת חיישנים חקלאיים רחבת טווח לניטור קרקע, לחות ותנאי מזג אוויר. שידור נתונים בזמן אמת לדשבורד ענן עם התראות חכמות.",
    tags: ["LoRa", "IoT", "Cloud Dashboard"],
    stats: [
      { icon: Wifi, label: "טווח שידור", value: "15km" },
      { icon: Clock, label: "סוללה", value: "2 שנים" },
    ],
    size: "medium",
    gradient: "from-emerald-50 to-teal-50",
    accentColor: "emerald",
    slug: "greenhouse-iot",
  },
];

type Case = typeof cases[0] & { slug?: string };

function CaseCard({ project, index }: { project: Case; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = project.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.65, ease: "easeOut" as const }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative bg-white rounded-3xl border border-slate-100 hover:border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-900/8 transition-all duration-300 flex flex-col ${
        project.size === "large" ? "md:col-span-2 md:row-span-1" : ""
      }`}
    >
      {/* Top gradient strip */}
      <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-${project.accentColor}-400 to-${project.accentColor}-600`} />

      <div className={`p-7 flex flex-col h-full ${project.size === "large" ? "md:flex-row gap-8" : ""}`}>
        {/* Left/Top content */}
        <div className={`flex flex-col ${project.size === "large" ? "flex-1" : ""}`}>
          <div className="flex items-start justify-between mb-5">
            <div className={`w-12 h-12 rounded-2xl ${project.iconBg} flex items-center justify-center shadow-sm`}>
              <Icon className={`w-6 h-6 ${project.iconColor}`} strokeWidth={1.75} />
            </div>
            <span className={`px-3 py-1 text-xs font-bold rounded-lg ${project.categoryColor}`}>
              {project.category}
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-1">{project.title}</h3>
          <p className="text-sm font-medium text-slate-500 mb-4">{project.subtitle}</p>
          <p className="text-slate-600 text-sm leading-relaxed mb-5">{project.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg"
              >
                {tag}
              </span>
            ))}
          </div>

          {project.slug ? (
            <Link
              href={`/projects/${project.slug}`}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-indigo-600 mt-auto transition-colors group-hover:gap-2.5"
            >
              קרא מקרה בוחן מלא
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          ) : (
            <button className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-indigo-600 mt-auto transition-colors group-hover:gap-2.5">
              קרא מקרה בוחן מלא
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Stats panel */}
        <div className={`flex ${project.size === "large" ? "flex-col justify-center gap-4 min-w-[200px]" : "flex-row gap-3 mt-auto pt-5 border-t border-slate-100"}`}>
          {project.stats.map((stat) => {
            const StatIcon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`flex items-center gap-3 ${
                  project.size === "large"
                    ? `bg-gradient-to-br ${project.gradient} rounded-2xl p-4`
                    : "flex-1"
                }`}
              >
                <div className={`w-8 h-8 rounded-xl ${project.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <StatIcon className={`w-4 h-4 ${project.iconColor}`} />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900 leading-none">{stat.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default function CaseStudies() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="case-studies" className="py-24 lg:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold rounded-full mb-4">
            עבודות נבחרות
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            מקרי בוחן{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              אמיתיים
            </span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            פתרונות שתכננו, בנינו וסיפקנו — מהגדרת הבעיה ועד מוצר עובד בשדה
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {cases.map((project, index) => (
            <CaseCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="text-center mt-12"
        >
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-full transition-colors text-sm">
            צפה בכל הפרויקטים
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
