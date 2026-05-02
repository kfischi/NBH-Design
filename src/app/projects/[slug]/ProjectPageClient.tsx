"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  Cpu,
  Code2,
  Package,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Quote,
} from "lucide-react";
import type { ProjectData } from "@/lib/projects-data";

const STEP_ICONS = [Search, Cpu, Code2, Package, CheckCircle2];

function Section({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function ProjectPageClient({
  project,
}: {
  project: ProjectData;
}) {
  return (
    <main dir="rtl" className="bg-white min-h-screen">
      {/* ── BACK NAV ── */}
      <div className="absolute top-5 right-5 z-50">
        <Link
          href="/#case-studies"
          className="flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-md border border-white/20 text-white text-sm font-medium rounded-full hover:bg-black/40 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          חזרה לפרויקטים
        </Link>
      </div>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.heroImage}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

        <div className="relative h-full flex flex-col justify-end pb-16 px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-5"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold rounded-full backdrop-blur-sm uppercase tracking-wider">
              {project.heroTag}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 max-w-3xl"
          >
            {project.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center gap-3 text-sm text-slate-400"
          >
            <span className="font-semibold text-white">{project.client}</span>
            <span className="text-slate-600">·</span>
            <span>{project.year}</span>
            <span className="text-slate-600">·</span>
            <span>משך: {project.duration}</span>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          OVERVIEW — 3 cards
      ══════════════════════════════════════ */}
      <section className="bg-slate-950 py-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-4">
            {(
              [
                {
                  ...project.overview.challenge,
                  Icon: AlertCircle,
                  color: "text-rose-400",
                  bg: "bg-rose-500/10 border-rose-500/20",
                },
                {
                  ...project.overview.solution,
                  Icon: Cpu,
                  color: "text-indigo-400",
                  bg: "bg-indigo-500/10 border-indigo-500/20",
                },
                {
                  ...project.overview.result,
                  Icon: TrendingUp,
                  color: "text-emerald-400",
                  bg: "bg-emerald-500/10 border-emerald-500/20",
                },
              ] as const
            ).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.15 }}
                className={`rounded-2xl border p-6 ${item.bg}`}
              >
                <item.Icon className={`w-5 h-5 ${item.color} mb-3`} />
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {item.title}
                </div>
                <p className="text-slate-200 text-sm leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROBLEM
      ══════════════════════════════════════ */}
      <Section className="bg-white py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-4 block">
                הבעיה
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-7 leading-tight">
                {project.problem.title}
              </h2>
              <div className="space-y-4">
                {project.problem.paragraphs.map((p, i) => (
                  <p key={i} className="text-slate-600 leading-relaxed text-[15px]">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.problem.image}
                alt={project.problem.imageCaption}
                className="w-full h-80 lg:h-[420px] object-cover rounded-3xl shadow-2xl shadow-slate-900/15"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent rounded-b-3xl px-5 pb-4 pt-12">
                <p className="text-white/80 text-xs">
                  {project.problem.imageCaption}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════
          PROCESS TIMELINE
      ══════════════════════════════════════ */}
      <Section className="bg-slate-950 py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 block">
              תהליך העבודה
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white">
              מהבעיה לפתרון — שלב אחר שלב
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            {project.steps.map((step, i) => {
              const Icon = STEP_ICONS[i] ?? CheckCircle2;
              const isLast = i === project.steps.length - 1;
              return (
                <div key={i} className="flex gap-6">
                  {/* Connector */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center z-10 shadow-lg shadow-indigo-900/50">
                      <span className="text-white font-bold text-sm">
                        {step.number}
                      </span>
                    </div>
                    {!isLast && (
                      <div className="w-px flex-1 bg-gradient-to-b from-indigo-600/60 to-slate-700 my-1 min-h-[32px]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`${isLast ? "pb-0" : "pb-10"} pt-1.5`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      <h3 className="text-white font-bold">{step.title}</h3>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════
          GALLERY
      ══════════════════════════════════════ */}
      <Section className="bg-slate-50 py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">
              גלריה
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              מהלבורטוריה לשדה
            </h2>
          </div>

          {/* Bento grid: 3 cols × 2 rows */}
          <div className="grid grid-cols-3 gap-3" style={{ height: 480 }}>
            {/* Wide left */}
            <div className="col-span-2 row-span-1 overflow-hidden rounded-2xl relative group h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.gallery[0].src}
                alt={project.gallery[0].caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="absolute bottom-3 right-3 text-white text-xs bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                {project.gallery[0].caption}
              </p>
            </div>

            {/* Square top-right */}
            <div className="col-span-1 overflow-hidden rounded-2xl relative group h-[232px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.gallery[1].src}
                alt={project.gallery[1].caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Square bottom-right */}
            <div className="col-span-1 overflow-hidden rounded-2xl relative group h-[232px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.gallery[2].src}
                alt={project.gallery[2].caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Wide bottom */}
            <div className="col-span-2 overflow-hidden rounded-2xl relative group h-[232px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.gallery[3].src}
                alt={project.gallery[3].caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="absolute bottom-3 right-3 text-white text-xs bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                {project.gallery[3].caption}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════
          CHALLENGES
      ══════════════════════════════════════ */}
      <Section className="bg-white py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">
              אתגרים טכניים
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              מה שנראה פשוט — לא תמיד היה
            </h2>
          </div>

          <div className="space-y-4">
            {project.challenges.map((c, i) => (
              <div key={i} className="grid md:grid-cols-2 gap-3">
                <div className="flex items-start gap-4 p-5 bg-rose-50 border border-rose-100 rounded-2xl">
                  <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-rose-600 uppercase tracking-wide mb-1.5">
                      הבעיה
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {c.problem}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1.5">
                      הפתרון
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {c.solution}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════
          STATS
      ══════════════════════════════════════ */}
      {project.stats.length > 0 && (
        <Section className="bg-slate-950 py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-10">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 block">
                תוצאות
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                המספרים מדברים בעד עצמם
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {project.stats.map((s, i) => (
                <div
                  key={i}
                  className="text-center p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/30 transition-colors"
                >
                  <div className="text-4xl lg:text-5xl font-extrabold text-white leading-none mb-2">
                    {s.value}
                    <span className="text-emerald-400">{s.suffix}</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ══════════════════════════════════════
          QUOTE
      ══════════════════════════════════════ */}
      {project.quote.text && (
        <Section className="bg-white py-20 lg:py-24">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <Quote className="w-10 h-10 text-slate-200 mx-auto mb-6" />
            <blockquote className="text-2xl lg:text-3xl font-bold text-slate-900 leading-relaxed mb-8">
              &ldquo;{project.quote.text}&rdquo;
            </blockquote>
            {project.quote.author && (
              <div className="flex items-center justify-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold">
                    {project.quote.author[0]}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 text-sm">
                    {project.quote.author}
                  </div>
                  <div className="text-slate-500 text-xs">{project.quote.role}</div>
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* ══════════════════════════════════════
          TECH STACK
      ══════════════════════════════════════ */}
      <Section className="bg-slate-50 py-14">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              טכנולוגיות ששימשו בפרויקט
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl shadow-sm hover:border-indigo-300 hover:text-indigo-700 transition-colors"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════
          CTA
      ══════════════════════════════════════ */}
      <Section className="bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
            יש לך בעיה דומה?
          </h2>
          <p className="text-indigo-200 text-lg mb-10 leading-relaxed">
            נשמח לשמוע על הפרויקט שלך ולחשוב ביחד על הפתרון המתאים
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-indigo-700 font-bold rounded-full hover:bg-indigo-50 transition-colors shadow-lg"
            >
              פתח שיחה
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/#case-studies"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 border border-white/25 text-white font-medium rounded-full hover:bg-white/20 transition-colors"
            >
              פרויקטים נוספים
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
