"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { MessageSquare, ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "כמה עולה פרויקט הנדסי?",
    a: "המחיר תלוי בהיקף — פרויקטים קצרים (שיחזור חלק, אב-טיפוס בסיסי) מתחילים בכמה אלפי שקלים, בעוד פרויקטים מורכבים הכוללים PCB + מכניקה + פריווייר יכולים להגיע לעשרות אלפים. בכל מקרה, תקבל הצעה מחיר מפורטת לאחר שיחת האפיון.",
  },
  {
    q: "כמה זמן לוקח לפתח אב-טיפוס?",
    a: "פרויקט מכני בסיסי עם הדפסת תלת-מימד — 1-3 שבועות. פרויקט אלקטרוניקה עם PCB — 4-6 שבועות. פרויקט רב-תחומי מלא — 6-12 שבועות. לוחות הזמנים תמיד מוסכמים מראש.",
  },
  {
    q: "האם אפשר לעבוד מרחוק?",
    a: "לחלוטין. רוב שלבי התכנון, האפיון וסקירות הביניים נעשים דיגיטלית. פגישות פיזיות מתקיימות בעיקר בשלב קבלת אב-הטיפוס, ובהתאם לנדרש.",
  },
  {
    q: "האם אתה עובד על פרויקטים מסווגים?",
    a: "כן. יש לי ניסיון עם פרויקטי ביטחון הכוללים דרישות NDA מחמירות. כל פרויקט מוגן בהסכם סודיות מלא.",
  },
  {
    q: "מה אם הפרויקט דורש שינויים באמצע?",
    a: "שינויים הם חלק טבעי מהתהליך. כל שינוי מהותי מוסכם בכתב ומתומחר בנפרד, ללא הפתעות. תמיד תדע מה קורה.",
  },
  {
    q: "האם יש תמיכה לאחר מסירת הפרויקט?",
    a: "כן — 3 חודשי תמיכה כלולים בכל פרויקט: תיקון באגים, הסברים ועדכונים קלים. מעבר לכך, יש אפשרות להסכם תחזוקה חודשי.",
  },
];

function PageHero() {
  return (
    <section className="relative pt-32 pb-20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 text-indigo-300 text-xs font-semibold rounded-full mb-6">
            <MessageSquare className="w-3.5 h-3.5" />
            נשמח לשמוע ממך
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            יש לך רעיון?
            <br />
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              בוא נהפוך אותו למציאות
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
            שתף אותנו בפרויקט שלך — בין אם זה רעיון ראשוני, בעיה קיימת שצריך לפתור,
            או מוצר שרוצים לשפר. נשיב תוך 24 שעות.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              "ללא עלות לשיחת האפיון",
              "תגובה תוך 24 שעות",
              "NDA זמין לבקשה",
            ].map((b) => (
              <span key={b} className="flex items-center gap-1.5 px-4 py-2 bg-white/8 border border-white/15 text-slate-300 text-sm font-medium rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                {b}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FaqSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute -left-40 bottom-0 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-full mb-4">
            שאלות נפוצות
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
            שאלות שכדאי לדעת
          </h2>
          <p className="text-slate-500">תשובות לשאלות שלקוחות שואלים לפני שמתחילים</p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-right"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                />
                <span className="text-sm font-semibold text-slate-900 flex-1 text-right pr-3">
                  {faq.q}
                </span>
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-5 text-sm text-slate-600 leading-relaxed text-right">
                  {faq.a}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <PageHero />
      <ContactForm />
      <FaqSection />
      <Footer />
    </main>
  );
}
