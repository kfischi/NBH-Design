"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Clock,
  Shield,
  Star,
  ArrowLeft,
} from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    label: "טלפון",
    value: "+972-50-XXX-XXXX",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Mail,
    label: "אימייל",
    value: "nevet@nbh-engineering.com",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: MapPin,
    label: "מיקום",
    value: "מרכז הארץ, ישראל",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Clock,
    label: "זמן תגובה",
    value: "עד 24 שעות",
    color: "bg-amber-50 text-amber-600",
  },
];

const trustBadges = [
  { icon: Shield, text: "פרוייקטים סודיים מוזמנים" },
  { icon: Star, text: "5 כוכבים בכל הפרויקטים" },
];

function openChatbot() {
  window.dispatchEvent(new CustomEvent("nbh:open-chatbot"));
}

export default function ContactForm() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" className="py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-50/70 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-violet-50/50 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-full mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            נשמע לשמוע ממך
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            ספר לנו על{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              האתגר שלך
            </span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            בוא נבין יחד איך נוכל לעזור לך לבנות את המוצר שלך.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Left: Contact info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.65 }}
            className="lg:col-span-2 space-y-5"
          >
            {/* Contact details */}
            <div className="bg-slate-50 rounded-3xl border border-slate-100 p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 text-right mb-4">
                פרטי התקשרות
              </h3>
              {contactInfo.map((item) => {
                const CIcon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color.split(" ")[0]}`}
                    >
                      <CIcon className={`w-4.5 h-4.5 ${item.color.split(" ")[1]}`} />
                    </div>
                    <div className="text-right flex-1">
                      <p className="text-xs text-slate-500">{item.label}</p>
                      <p className="text-sm font-semibold text-slate-800">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trust badges */}
            <div className="space-y-3">
              {trustBadges.map((badge) => {
                const BIcon = badge.icon;
                return (
                  <div
                    key={badge.text}
                    className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-4 py-3"
                  >
                    <BIcon className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-700">{badge.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Availability indicator */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-bold">זמין לפרויקטים חדשים</span>
              </div>
              <p className="text-indigo-200 text-xs leading-relaxed">
                נותרו 2 פתחים בקיו הפרויקטים לרבעון הנוכחי. צור קשר עכשיו להבטחת מקום.
              </p>
            </div>
          </motion.div>

          {/* Right: Chatbot CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.65 }}
            className="lg:col-span-3"
          >
            <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-900/5 p-10 flex flex-col items-center text-center gap-7 h-full justify-center min-h-[420px]">
              {/* Icon */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
                <MessageSquare className="w-12 h-12 text-white" />
              </div>

              {/* Text */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                  שוחח עם יועץ ה-AI שלנו
                </h3>
                <p className="text-slate-500 text-base leading-relaxed max-w-sm mx-auto">
                  תאר את הפרויקט שלך בכמה משפטים. היועץ ינתח את הצרכים ויעביר לנבט סיכום מוכן — ללא צורך בהשארת פרטים.
                </p>
              </div>

              {/* CTA Button */}
              <motion.button
                onClick={openChatbot}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-full shadow-xl shadow-indigo-500/35 hover:shadow-indigo-500/55 transition-all duration-200 text-base"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                פתח את הצ׳אטבוט
                <ArrowLeft className="w-5 h-5" />
              </motion.button>

              <p className="text-xs text-slate-400">תגובה מיידית · ללא צורך בהרשמה</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
