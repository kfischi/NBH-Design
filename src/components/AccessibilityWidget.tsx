"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";

type Settings = {
  largeText: boolean;
  highContrast: boolean;
  grayscale: boolean;
  highlightLinks: boolean;
  stopAnimations: boolean;
  keyboardNav: boolean;
};

const defaultSettings: Settings = {
  largeText: false,
  highContrast: false,
  grayscale: false,
  highlightLinks: false,
  stopAnimations: false,
  keyboardNav: false,
};

const options: { key: keyof Settings; label: string; icon: string }[] = [
  { key: "largeText",      label: "הגדלת טקסט",       icon: "A+" },
  { key: "highContrast",   label: "ניגודיות גבוהה",    icon: "◑"  },
  { key: "grayscale",      label: "גווני אפור",         icon: "◐"  },
  { key: "highlightLinks", label: "הדגשת קישורים",     icon: "🔗" },
  { key: "stopAnimations", label: "עצירת אנימציות",    icon: "⏸"  },
  { key: "keyboardNav",    label: "ניווט מקלדת",        icon: "⌨"  },
];

function applySettings(s: Settings) {
  const root = document.documentElement;
  root.classList.toggle("acc-large-text",      s.largeText);
  root.classList.toggle("acc-high-contrast",   s.highContrast);
  root.classList.toggle("acc-grayscale",       s.grayscale);
  root.classList.toggle("acc-highlight-links", s.highlightLinks);
  root.classList.toggle("acc-stop-animations", s.stopAnimations);
  root.classList.toggle("acc-keyboard-nav",    s.keyboardNav);
}

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nbh-accessibility");
      if (saved) {
        const parsed = JSON.parse(saved) as Settings;
        setSettings(parsed);
        applySettings(parsed);
      }
    } catch {}
  }, []);

  const toggle = (key: keyof Settings) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    applySettings(next);
    try { localStorage.setItem("nbh-accessibility", JSON.stringify(next)); } catch {}
  };

  const reset = () => {
    setSettings(defaultSettings);
    applySettings(defaultSettings);
    try { localStorage.removeItem("nbh-accessibility"); } catch {}
  };

  const anyActive = Object.values(settings).some(Boolean);

  return (
    <>
      {/* CSS for accessibility classes */}
      <style>{`
        .acc-large-text      { font-size: 120% !important; }
        .acc-high-contrast * { filter: contrast(1.6) !important; }
        .acc-grayscale *     { filter: grayscale(1) !important; }
        .acc-highlight-links a {
          outline: 3px solid #6366f1 !important;
          outline-offset: 2px !important;
          text-decoration: underline !important;
        }
        .acc-stop-animations *, .acc-stop-animations *::before, .acc-stop-animations *::after {
          animation-duration: 0.001ms !important;
          transition-duration: 0.001ms !important;
        }
        .acc-keyboard-nav *:focus {
          outline: 3px solid #6366f1 !important;
          outline-offset: 3px !important;
        }
      `}</style>

      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        aria-label="פתח תפריט נגישות"
        aria-expanded={open}
        className="fixed bottom-6 left-6 z-[9999] w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xl shadow-indigo-500/40 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        {/* Accessibility icon */}
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="4" r="2" />
          <path d="M19 9h-6l-1-3H8L7 9H1v2h6l1 3v7h2v-6h4v6h2v-7l1-3h6z" />
        </svg>
        {anyActive && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="dialog"
            aria-label="הגדרות נגישות"
            className="fixed bottom-24 left-6 z-[9999] w-72 bg-white rounded-3xl shadow-2xl shadow-slate-900/20 border border-slate-100 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-indigo-600 text-white">
              <button
                onClick={() => setOpen(false)}
                aria-label="סגור תפריט נגישות"
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <h2 className="text-sm font-bold">הגדרות נגישות</h2>
            </div>

            {/* Options */}
            <div className="p-4 space-y-2">
              {options.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => toggle(opt.key)}
                  aria-pressed={settings[opt.key]}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                    settings[opt.key]
                      ? "bg-indigo-50 border-2 border-indigo-300 text-indigo-800"
                      : "bg-slate-50 border-2 border-transparent text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-base ${
                    settings[opt.key] ? "bg-indigo-600 text-white" : "bg-white text-slate-500 border border-slate-200"
                  }`}>
                    {opt.icon}
                  </span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 pb-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <Link
                href="/accessibility"
                className="text-xs text-indigo-600 hover:underline"
                onClick={() => setOpen(false)}
              >
                הצהרת נגישות
              </Link>
              {anyActive && (
                <button
                  onClick={reset}
                  className="text-xs text-rose-500 hover:text-rose-700 font-medium"
                >
                  איפוס הכל
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
