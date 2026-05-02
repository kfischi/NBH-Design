"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Box,
  Cpu,
  Settings2,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

const services = [
  {
    icon: Box,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    gradFrom: "from-indigo-500",
    gradTo: "to-indigo-400",
    accent: "border-indigo-100 hover:border-indigo-200",
    badge: "מכניקה",
    badgeBg: "bg-indigo-50 text-indigo-700",
    title: "מכניקה ותכנון פיזי",
    description:
      "תכנון מכני מלא מהרעיון ועד האב-טיפוס. בניית מכלולים מורכבים, מארזים מדויקים וחלקים פרטניים.",
    features: [
      "תכנון CAD מלא (SolidWorks / Fusion360)",
      "הדפסות תלת-ממד (FDM, SLA, SLS)",
      "אב-טיפוס מהיר ובדיקות אינטגרציה",
      "תכנון עבור ייצור (DFM)",
    ],
    cta: "קרא עוד",
  },
  {
    icon: Cpu,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    gradFrom: "from-violet-500",
    gradTo: "to-purple-500",
    accent: "border-violet-100 hover:border-violet-200",
    badge: "אלקטרוניקה",
    badgeBg: "bg-violet-50 text-violet-700",
    title: "אלקטרוניקה ומעגלים",
    description:
      "פיתוח מעגלים אלקטרוניים מורכבים – מאפיון ועד מוצר גמור. מומחיות ב-RF, תקשורת אלחוטית ו-IoT.",
    features: [
      "תכנון PCB מרובה שכבות",
      "פיתוח RFID, NFC ו-BLE",
      "מעגלי IoT מבוססי LoRa / Zigbee",
      "Firmware & Embedded C/C++",
    ],
    cta: "קרא עוד",
    featured: true,
  },
  {
    icon: Settings2,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    gradFrom: "from-cyan-500",
    gradTo: "to-teal-500",
    accent: "border-cyan-100 hover:border-cyan-200",
    badge: "מערכת",
    badgeBg: "bg-cyan-50 text-cyan-700",
    title: "מיכון ואוטומציה",
    description:
      "תכנון מערכות אוטומציה מלאות – מהגדרת הדרישות ועד ה-commissioning. סנכרון מושלם בין תוכנה לחומרה.",
    features: [
      "תכנון PLC ו-SCADA",
      "מערכות Servo ו-Motion Control",
      "סנכרון תוכנה-חומרה מלא",
      "אינטגרציה עם ERP / MES",
    ],
    cta: "קרא עוד",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" as const } },
};

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="services" className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-full mb-4">
            שלושת עמודי התווך
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            מומחיות רב-תחומית{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              בגג אחד
            </span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            במקום לעבוד עם ספקים שונים שלא מדברים ביניהם – תקבל פתרון אינטגרטיבי שלם מגורם
            אחד.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
        >
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.title}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`relative bg-white rounded-3xl border ${svc.accent} p-7 shadow-sm hover:shadow-xl hover:shadow-slate-900/8 transition-all duration-300 flex flex-col ${
                  svc.featured ? "ring-2 ring-violet-200" : ""
                }`}
              >
                {svc.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-lg shadow-violet-500/30">
                      הכי מבוקש ⭐
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl ${svc.iconBg} flex items-center justify-center mb-5 shadow-sm`}
                >
                  <Icon className={`w-7 h-7 ${svc.iconColor}`} strokeWidth={1.75} />
                </div>

                {/* Badge */}
                <span
                  className={`inline-block px-3 py-1 text-xs font-bold rounded-lg mb-3 ${svc.badgeBg}`}
                >
                  {svc.badge}
                </span>

                <h3 className="text-xl font-bold text-slate-900 mb-3">{svc.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-5">{svc.description}</p>

                {/* Features */}
                <ul className="space-y-2.5 mb-6 flex-1">
                  {svc.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button className={`flex items-center gap-2 text-sm font-semibold mt-auto ${
                  svc.featured ? "text-violet-600" : "text-slate-700"
                } hover:gap-3 transition-all`}>
                  {svc.cta}
                  <ArrowLeft className="w-4 h-4" />
                </button>

                {/* Decorative gradient bar */}
                <div
                  className={`absolute bottom-0 inset-x-0 h-1 rounded-b-3xl bg-gradient-to-r ${svc.gradFrom} ${svc.gradTo} opacity-0 hover:opacity-100 transition-opacity duration-300`}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-400 text-sm">
            כל הפתרונות כוללים תיעוד מלא, הדרכה ותמיכה לאחר הגעה לייצור
          </p>
        </motion.div>
      </div>
    </section>
  );
}
