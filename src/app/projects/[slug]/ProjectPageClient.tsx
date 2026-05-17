"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Zap,
  Film,
  ChevronRight,
  AlertTriangle,
  Lightbulb,
  Wrench,
  Trophy,
  Sparkles,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/seo";
import type { Project, ProjectCategory } from "@/data/projects";

const CATEGORY_GRADIENT: Record<ProjectCategory, string> = {
  medical: "from-rose-600 via-rose-500 to-pink-500",
  defense: "from-slate-800 via-slate-700 to-slate-900",
  agritech: "from-emerald-600 via-emerald-500 to-teal-500",
  innovation: "from-violet-600 via-indigo-600 to-purple-600",
  design: "from-indigo-600 via-violet-600 to-cyan-500",
  electronics: "from-cyan-600 via-sky-500 to-blue-600",
};

interface SectionProps {
  icon: typeof AlertTriangle;
  title: string;
  text: string;
  accent: "rose" | "amber" | "indigo" | "emerald";
}

const ACCENT_STYLES = {
  rose: {
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    border: "border-rose-100",
  },
  amber: {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    border: "border-amber-100",
  },
  indigo: {
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    border: "border-indigo-100",
  },
  emerald: {
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    border: "border-emerald-100",
  },
};

function StorySection({ icon: Icon, title, text, accent }: SectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const style = ACCENT_STYLES[accent];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`bg-white rounded-3xl border ${style.border} shadow-sm p-7 lg:p-9`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className={`w-12 h-12 rounded-2xl ${style.iconBg} flex items-center justify-center flex-shrink-0`}
        >
          <Icon className={`w-6 h-6 ${style.iconColor}`} strokeWidth={1.75} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">{title}</h2>
      </div>
      <p className="text-slate-700 text-base lg:text-lg leading-relaxed">
        {text}
      </p>
    </motion.div>
  );
}

export default function ProjectPageClient({ project }: { project: Project }) {
  const gradient = CATEGORY_GRADIENT[project.category];

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ראשי", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "פרויקטים",
        item: `${SITE_URL}/case-studies`,
      },
      { "@type": "ListItem", position: 3, name: project.title },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumb} />
      <main className="min-h-screen bg-slate-50">
        <Header />

        {/* Hero */}
        <section className={`relative bg-gradient-to-br ${gradient} text-white pt-28 pb-20 overflow-hidden`}>
          <div
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(900px 400px at 90% -10%, rgba(255,255,255,0.25), transparent 60%), radial-gradient(700px 300px at 0% 110%, rgba(255,255,255,0.18), transparent 55%)",
            }}
          />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-8" aria-label="breadcrumb">
              <Link href="/" className="hover:text-white transition-colors">
                ראשי
              </Link>
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
              <Link href="/case-studies" className="hover:text-white transition-colors">
                פרויקטים
              </Link>
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
              <span className="text-white">{project.title}</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur border border-white/25 rounded-full text-xs font-bold tracking-wider uppercase mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  {project.categoryLabel}
                </span>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-6">
                  {project.title}
                </h1>

                <p className="text-lg text-white/90 leading-relaxed max-w-xl mb-8">
                  {project.problem}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  {project.timeToPrototype && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur border border-white/25 rounded-full text-sm font-semibold">
                      <Zap className="w-4 h-4" strokeWidth={2.5} />
                      אב-טיפוס תוך {project.timeToPrototype}
                    </span>
                  )}
                  {project.hasVideo && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur border border-white/25 rounded-full text-sm font-semibold">
                      <Film className="w-4 h-4" />
                      וידאו עבודה
                    </span>
                  )}
                </div>
              </div>

              {/* Hero visual */}
              <div className="relative">
                {project.coverPhoto ? (
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-black/30 border border-white/20">
                    <Image
                      src={`/projects/photos/${project.coverPhoto}`}
                      alt={project.altText ?? project.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white/10 backdrop-blur border border-white/20 shadow-2xl shadow-black/30 flex items-center justify-center">
                    <div className="text-center px-6">
                      <Sparkles className="w-12 h-12 text-white/60 mx-auto mb-3" />
                      <p className="text-sm text-white/70">תמונת מוצר תיווסף בקרוב</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Story sections — Problem / Thinking / Solution / Result */}
        <section className="py-20 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <StorySection
              icon={AlertTriangle}
              title="הבעיה"
              text={project.problem}
              accent="rose"
            />
            <StorySection
              icon={Lightbulb}
              title="החשיבה ההנדסית"
              text={project.thinking}
              accent="amber"
            />
            <StorySection
              icon={Wrench}
              title="הפתרון"
              text={project.solution}
              accent="indigo"
            />
            <StorySection
              icon={Trophy}
              title="התוצאה"
              text={project.result}
              accent="emerald"
            />
          </div>
        </section>

        {/* Tags */}
        <section className="pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 text-center mb-5">
              טכנולוגיות וכלים בפרויקט
            </div>
            <div className="flex flex-wrap justify-center gap-2.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl shadow-sm hover:border-indigo-300 hover:text-indigo-700 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-600 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl sm:text-4xl font-extrabold mb-4">
              יש לך פרויקט דומה?
            </h3>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              נבט יחזור אליך עם הצעת אפיון תוך 24 שעות — בלי התחייבות.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-slate-900 font-bold rounded-full shadow-2xl shadow-black/30 hover:scale-[1.03] transition-transform"
            >
              ספר לנו על האתגר שלך
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
