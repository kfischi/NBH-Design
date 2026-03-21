"use client";

import { motion } from "framer-motion";
import { Zap, Mail, Phone, Linkedin, ArrowUp } from "lucide-react";

const footerLinks = [
  {
    title: "שירותים",
    links: [
      { label: "מכניקה ותכנון פיזי", href: "#services" },
      { label: "אלקטרוניקה ומעגלים", href: "#services" },
      { label: "מיכון ואוטומציה", href: "#services" },
      { label: "אב-טיפוס מהיר", href: "#services" },
    ],
  },
  {
    title: "חברה",
    links: [
      { label: "אודות נבט", href: "#about" },
      { label: "מקרי בוחן", href: "#case-studies" },
      { label: "צור קשר", href: "#contact" },
      { label: "בלוג הנדסי", href: "#" },
    ],
  },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Top CTA strip */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-right">
              <h3 className="text-2xl font-bold text-white mb-1">
                מוכן להתחיל?
              </h3>
              <p className="text-slate-400">
                פגישת האפיון הראשונה חינם. אין מחויבות.
              </p>
            </div>
            <motion.button
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-full shadow-lg shadow-indigo-500/25 whitespace-nowrap"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              תאם פגישת אפיון
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="md:col-span-2 text-right">
            <div className="flex items-center gap-2.5 justify-end mb-4">
              <div className="flex flex-col leading-none">
                <span className="font-bold text-white text-lg tracking-tight">NBH</span>
                <span className="text-[10px] font-medium text-slate-500 tracking-wider uppercase">Engineering Solutions</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Zap className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs mr-auto">
              פתרונות הנדסיים רב-תחומיים קצה לקצה — מכניקה, אלקטרוניקה ומערכת תחת גג אחד.
            </p>
            <div className="flex gap-3 justify-end">
              <a
                href="mailto:nevet@nbh-engineering.com"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="tel:+972-50-000-0000"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-green-600 flex items-center justify-center transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links columns */}
          {footerLinks.map((col) => (
            <div key={col.title} className="text-right">
              <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        if (link.href.startsWith("#")) {
                          e.preventDefault();
                          document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="text-slate-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <button
            onClick={scrollToTop}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <ArrowUp className="w-4 h-4 text-slate-400" />
          </button>
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} NBH Engineering Solutions · כל הזכויות שמורות
          </p>
        </div>
      </div>
    </footer>
  );
}
