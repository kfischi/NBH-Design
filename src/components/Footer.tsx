"use client";

import { motion } from "framer-motion";
import { Zap, Mail, Phone, Linkedin, ArrowUp, ArrowLeft } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  {
    title: "שירותים",
    links: [
      { label: "מכניקה ותכנון פיזי",  href: "/services" },
      { label: "אלקטרוניקה ומעגלים", href: "/services" },
      { label: "מיכון ואוטומציה",     href: "/services" },
      { label: "אב-טיפוס מהיר",       href: "/process"  },
    ],
  },
  {
    title: "חברה",
    links: [
      { label: "אודות נבט",   href: "/about"        },
      { label: "מקרי בוחן",   href: "/case-studies" },
      { label: "תהליך עבודה", href: "/process"      },
      { label: "צור קשר",     href: "/contact"      },
    ],
  },
];

const WHATSAPP_NUMBER = "972500000000";

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Top CTA strip */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-right">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                מוכן להתחיל?
              </h3>
              <p className="text-slate-400 max-w-md">
                פגישת האפיון הראשונה חינם — נבין יחד את הפרויקט ונחזור עם הצעה מפורטת תוך 24 שעות.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/contact">
                <motion.span
                  className="flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-full shadow-lg shadow-indigo-500/25 whitespace-nowrap cursor-pointer"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  תאם פגישת אפיון
                  <ArrowLeft className="w-4 h-4" />
                </motion.span>
              </Link>
              <motion.a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=שלום, אני מעוניין לשמוע עוד על שירותי ה-Proto-Model`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3.5 bg-[#25D366]/15 border border-[#25D366]/30 text-[#4ade80] font-semibold rounded-full whitespace-nowrap"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                וואטסאפ
              </motion.a>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="md:col-span-2 text-right">
            <div className="flex items-center gap-2.5 justify-end mb-5">
              <div className="flex flex-col leading-none">
                <span className="font-bold text-white text-lg tracking-tight">Proto-Model</span>
                <span className="text-[10px] font-medium text-slate-500 tracking-wider">מחלום למציאות</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Zap className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs mr-auto">
              פתרונות הנדסיים רב-תחומיים קצה לקצה — מכניקה, אלקטרוניקה ומערכת תחת גג אחד.
              12+ שנות ניסיון, 50+ פרויקטים מוצלחים.
            </p>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-2 justify-end mb-5">
              {["50+ פרויקטים", "12+ שנה", "100% שביעות רצון"].map((t) => (
                <span key={t} className="text-[11px] px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex gap-3 justify-end">
              <a
                href="mailto:nevet@proto-model.com"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-colors"
                title="אימייל"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="tel:+972-50-000-0000"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-green-600 flex items-center justify-center transition-colors"
                title="טלפון"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links columns */}
          {footerLinks.map((col) => (
            <div key={col.title} className="text-right">
              <h4 className="text-white font-semibold text-sm mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={scrollToTop}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
            title="חזרה למעלה"
          >
            <ArrowUp className="w-4 h-4 text-slate-400" />
          </button>

          {/* Legal links */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <Link href="/privacy"       className="hover:text-slate-300 transition-colors">מדיניות פרטיות</Link>
            <span className="text-slate-700">·</span>
            <Link href="/cookies"       className="hover:text-slate-300 transition-colors">מדיניות עוגיות</Link>
            <span className="text-slate-700">·</span>
            <Link href="/accessibility" className="hover:text-slate-300 transition-colors">הצהרת נגישות</Link>
          </div>

          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Proto-Model
          </p>
        </div>
      </div>
    </footer>
  );
}
