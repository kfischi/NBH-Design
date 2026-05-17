"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import Link from "next/link";
import {
  Heart,
  Crosshair,
  Sprout,
  Sparkles,
  Layers,
  Cpu,
  ArrowUpRight,
  Zap,
  Film,
  type LucideIcon,
} from "lucide-react";
import { projects, type Project, type ProjectCategory } from "@/data/projects";

type CategoryFilter = "all" | ProjectCategory;

interface CategoryStyle {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  pillBg: string;
  pillText: string;
  gradient: string;
  accent: string;
}

const CATEGORY_STYLES: Record<ProjectCategory, CategoryStyle> = {
  medical: {
    icon: Heart,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    pillBg: "bg-rose-50",
    pillText: "text-rose-700",
    gradient: "from-rose-50 to-pink-50",
    accent: "rose",
  },
  defense: {
    icon: Crosshair,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-700",
    pillBg: "bg-slate-100",
    pillText: "text-slate-700",
    gradient: "from-slate-50 to-slate-100",
    accent: "slate",
  },
  agritech: {
    icon: Sprout,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    pillBg: "bg-emerald-50",
    pillText: "text-emerald-700",
    gradient: "from-emerald-50 to-teal-50",
    accent: "emerald",
  },
  innovation: {
    icon: Sparkles,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    pillBg: "bg-violet-50",
    pillText: "text-violet-700",
    gradient: "from-violet-50 to-indigo-50",
    accent: "violet",
  },
  design: {
    icon: Layers,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    pillBg: "bg-indigo-50",
    pillText: "text-indigo-700",
    gradient: "from-indigo-50 to-blue-50",
    accent: "indigo",
  },
  electronics: {
    icon: Cpu,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    pillBg: "bg-cyan-50",
    pillText: "text-cyan-700",
    gradient: "from-cyan-50 to-sky-50",
    accent: "cyan",
  },
};

const FILTERS: Array<{ key: CategoryFilter; label: string }> = [
  { key: "all", label: "כל הפרויקטים" },
  { key: "defense", label: "ביטחוני" },
  { key: "medical", label: "רפואי" },
  { key: "agritech", label: "חקלאות" },
  { key: "innovation", label: "חדשנות" },
  { key: "design", label: "עיצוב מוצר" },
];

function CaseCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const style = CATEGORY_STYLES[project.category];
  const Icon = style.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        ease: "easeOut" as const,
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative bg-white rounded-3xl border border-slate-100 hover:border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-900/8 transition-all duration-300 flex flex-col ${
        project.featured ? "md:col-span-2 md:row-span-1" : ""
      }`}
    >
      <div
        className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-${style.accent}-400 to-${style.accent}-600`}
      />

      <div
        className={`p-7 flex flex-col h-full ${
          project.featured ? "md:flex-row gap-8" : ""
        }`}
      >
        <div className={`flex flex-col ${project.featured ? "flex-1" : ""}`}>
          <div className="flex items-start justify-between mb-5">
            <div
              className={`w-12 h-12 rounded-2xl ${style.iconBg} flex items-center justify-center shadow-sm`}
            >
              <Icon
                className={`w-6 h-6 ${style.iconColor}`}
                strokeWidth={1.75}
              />
            </div>
            <span
              className={`px-3 py-1 text-xs font-bold rounded-lg ${style.pillBg} ${style.pillText}`}
            >
              {project.categoryLabel}
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-3">
            {project.title}
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-5">
            {project.problem}
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg"
              >
                {tag}
              </span>
            ))}
          </div>

          {(project.timeToPrototype || project.hasVideo) && (
            <div className="flex items-center gap-2 mb-5">
              {project.timeToPrototype && (
                <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg font-semibold">
                  <Zap className="w-3 h-3" strokeWidth={2.5} />
                  {project.timeToPrototype}
                </span>
              )}
              {project.hasVideo && (
                <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg font-medium">
                  <Film className="w-3 h-3" />
                  וידאו
                </span>
              )}
            </div>
          )}

          <Link
            href={`/projects/${project.slug}`}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-indigo-600 mt-auto transition-colors group-hover:gap-2.5"
          >
            קרא מקרה בוחן מלא
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {project.featured && (
          <div
            className={`flex flex-col justify-center min-w-[200px] rounded-2xl bg-gradient-to-br ${style.gradient} p-5`}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              חשיבה הנדסית
            </div>
            <p className="text-sm text-slate-700 leading-relaxed line-clamp-6">
              {project.thinking}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function FilterPill({
  filter,
  active,
  onClick,
}: {
  filter: (typeof FILTERS)[number];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
        active
          ? "text-white shadow-md shadow-indigo-500/25"
          : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700"
      }`}
    >
      {active && (
        <motion.span
          layoutId="case-filter-pill"
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600"
        />
      )}
      <span className="relative">{filter.label}</span>
    </button>
  );
}

export default function CaseStudies() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [filter, setFilter] = useState<CategoryFilter>("all");

  const visible = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((p) => p.category === filter),
    [filter],
  );

  return (
    <section id="case-studies" className="py-24 lg:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold rounded-full mb-4">
            עבודות נבחרות
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            מקרי בוחן{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12"
        >
          {FILTERS.map((f) => (
            <FilterPill
              key={f.key}
              filter={f}
              active={filter === f.key}
              onClick={() => setFilter(f.key)}
            />
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {visible.map((project, index) => (
            <CaseCard key={project.slug} project={project} index={index} />
          ))}
        </div>

        {visible.length === 0 && (
          <div className="text-center py-16 text-slate-400 text-sm">
            אין פרויקטים בקטגוריה זו עדיין.
          </div>
        )}
      </div>
    </section>
  );
}
