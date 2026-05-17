"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Header from "@/components/Header";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { ArrowLeft, Briefcase, Award, Rocket, Shield, CheckCircle } from "lucide-react";
import Link from "next/link";

const timeline = [
  {
    year: "2011",
    title: "לימודי הנדסת אלקטרוניקה",
    desc: "B.Sc. בהנדסת אלקטרוניקה עם התמחות במערכות משובצות ו-PCB.",
    color: "bg-amber-400",
    icon: Award,
  },
  {
    year: "2013",
    title: "כניסה לתעשיית הביטחון",
    desc: "עבודה על מערכות ביטחוניות מסווגות — פיתוח חומרה בתנאי שדה מחמירים.",
    color: "bg-rose-500",
    icon: Shield,
  },
  {
    year: "2016",
    title: "הרחבה למכניקה ותכנון פיזי",
    desc: "הסמכה ב-SolidWorks ופיתוח יכולת רב-תחומית — מכניקה + אלקטרוניקה תחת קורת גג אחת.",
    color: "bg-indigo-500",
    icon: Briefcase,
  },
  {
    year: "2019",
    title: "התמחות ב-IoT ומיכון",
    desc: "פרויקטי LoRa, RFID ואוטומציה תעשייתית עם PLC ו-SCADA לחברות תעשייה.",
    color: "bg-cyan-500",
    icon: Rocket,
  },
  {
    year: "2022",
    title: "הקמת Proto-Model",
    desc: "ייסוד חברה עצמאית עם חזון ברור: פתרונות הנדסיים מלאים ממקור אחד אחראי.",
    color: "bg-violet-600",
    icon: Rocket,
  },
  {
    year: "2024",
    title: "50+ פרויקטים מוצלחים",
    desc: "לקוחות מביומד, ביטחון, חקלאות חכמה ותעשייה — עם 100% שביעות רצון.",
    color: "bg-emerald-500",
    icon: CheckCircle,
  },
];

const values = [
  {
    title: "שקיפות מוחלטת",
    desc: "מחיר ברור מראש. לוח זמנים ריאלי. ללא הפתעות.",
    color: "bg-indigo-50 border-indigo-100",
    iconColor: "text-indigo-600 bg-indigo-100",
  },
  {
    title: "אחריות מלאה",
    desc: "ספק אחד, נקודת מגע אחת, אחריות על כל הפרויקט.",
    color: "bg-violet-50 border-violet-100",
    iconColor: "text-violet-600 bg-violet-100",
  },
  {
    title: "הנדסה אמיתית",
    desc: "פתרונות שעומדים בפני מציאות השדה — לא רק ב-demo.",
    color: "bg-cyan-50 border-cyan-100",
    iconColor: "text-cyan-600 bg-cyan-100",
  },
  {
    title: "מהירות ללא פשרות",
    desc: "אב-טיפוס תוך שבועות, לא חודשים — בלי לוותר על איכות.",
    color: "bg-emerald-50 border-emerald-100",
    iconColor: "text-emerald-600 bg-emerald-100",
  },
];

function PageHero() {
  return (
    <section className="relative pt-32 pb-20 bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 text-indigo-300 text-xs font-semibold rounded-full mb-6">
            הארכיטקט מאחורי הפתרונות
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            מהנדס שמבין את
            <br />
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              כל צד של המוצר שלך
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            נבט בן חיים — מהנדס מוצר רב-תחומי עם ניסיון של 12+ שנה. מכיר מכניקה,
            מבין אלקטרוניקה, כותב קוד. הכל בספק אחד.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {["12+ שנות ניסיון", "50+ פרויקטים", "3 פטנטים", "לקוחות בינלאומיים"].map((b) => (
              <span key={b} className="px-4 py-2 bg-white/10 border border-white/20 text-white text-sm font-semibold rounded-full">
                {b}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ValuesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
            הערכים שמנחים כל פרויקט
          </h2>
          <p className="text-slate-500">לא רק מה שנבנה — אלא איך נבנה</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              className={`rounded-2xl border p-5 ${v.color} hover:shadow-md transition-shadow`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${v.iconColor}`}>
                <CheckCircle className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">{v.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CareerTimeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-full mb-4">
            מסלול מקצועי
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            מסע של 12 שנה
          </h2>
          <p className="text-slate-500">
            מהנדס שבנה את הניסיון שלו שכבה על שכבה — כל תחום מחזק את האחר
          </p>
        </motion.div>

        <div className="relative">
          {/* Center line */}
          <div className="absolute right-[50%] top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-300 via-indigo-400 to-emerald-500 hidden sm:block" />

          <div className="space-y-8">
            {timeline.map((item, i) => {
              const Icon = item.icon;
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: isLeft ? 30 : -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.12, duration: 0.55 }}
                  className={`flex items-start gap-4 sm:gap-8 ${isLeft ? "sm:flex-row-reverse" : "sm:flex-row"} flex-row-reverse`}
                >
                  {/* Content */}
                  <div className={`flex-1 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow text-right`}>
                    <div className="flex items-center gap-2 justify-end mb-2">
                      <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                      <span className="text-xs font-bold text-white px-2 py-0.5 rounded-lg" style={{ background: item.color.replace("bg-", "") }}>
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>

                  {/* Center node */}
                  <div className="relative flex-shrink-0 flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center shadow-lg ring-4 ring-white z-10`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 mt-1">{item.year}</span>
                  </div>

                  <div className="flex-1 hidden sm:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 to-indigo-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />
      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5">
            רוצה לעבוד יחד?
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            שתף אותי באתגר שלך — אקדיש לו את אותה תשומת לב שהקדשתי לכל פרויקט קודם.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <motion.span
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-full shadow-2xl shadow-indigo-500/40 cursor-pointer"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                פנה אליי
                <ArrowLeft className="w-4 h-4" />
              </motion.span>
            </Link>
            <Link href="/case-studies">
              <motion.span
                className="inline-flex items-center gap-2 px-7 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full cursor-pointer hover:bg-white/15 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                ראה פרויקטים קודמים
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <PageHero />
      <ValuesSection />
      <About />
      <CareerTimeline />
      <Testimonials />
      <AboutCTA />
      <Footer />
    </main>
  );
}
