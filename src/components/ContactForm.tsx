"use client";

import { useRef, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Clock,
  Shield,
  Star,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Bot,
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
    value: "nevet@proto-model.com",
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
  window.dispatchEvent(new CustomEvent("proto-model:open-chatbot"));
}

type Mode = "form" | "chatbot";

interface FormState {
  name: string;
  phone: string;
  email: string;
  company: string;
  challenge: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  phone: "",
  email: "",
  company: "",
  challenge: "",
};

function FieldLabel({
  htmlFor,
  children,
  required,
  hint,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-baseline justify-between text-sm font-semibold text-slate-700 mb-2"
    >
      <span>
        {children}
        {required ? <span className="text-rose-500 mr-0.5">*</span> : null}
      </span>
      {hint ? <span className="text-xs text-slate-400 font-normal">{hint}</span> : null}
    </label>
  );
}

const inputClass =
  "w-full bg-white border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 text-sm placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all duration-200 hover:border-slate-300";

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="flex flex-col items-center text-center gap-5 py-10"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 240, damping: 18 }}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-500/30"
      >
        <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
      </motion.div>
      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">תודה — קיבלנו 🙏</h3>
        <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
          נבט יחזור אליך אישית תוך 24 שעות. אם נתת אימייל, אישור קבלה בדרך אליך כעת.
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="text-sm text-slate-500 hover:text-indigo-600 font-medium underline-offset-4 hover:underline transition-colors"
      >
        שלח פנייה נוספת
      </button>
    </motion.div>
  );
}

function LeadForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setForm(EMPTY_FORM);
    setError(null);
    setSuccess(false);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError("שם חובה");
    if (!form.phone.trim()) return setError("טלפון חובה");
    if (!form.challenge.trim()) return setError("ספר לנו על האתגר");
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      return setError("אימייל לא תקין");
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim() || undefined,
            company: form.company.trim() || undefined,
            challenge: form.challenge.trim(),
            source: "contact-form",
          }),
        });
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) {
          setError(data.error ?? "שגיאת שרת — נסה שוב");
          return;
        }
        setSuccess(true);
      } catch {
        setError("שגיאת רשת — בדוק את החיבור ונסה שוב");
      }
    });
  }

  if (success) return <SuccessState onReset={reset} />;

  return (
    <motion.form
      key="form"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      onSubmit={onSubmit}
      className="space-y-4"
      noValidate
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel htmlFor="cf-name" required>
            שם מלא
          </FieldLabel>
          <input
            id="cf-name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="ישראל ישראלי"
            className={inputClass}
            maxLength={120}
            required
          />
        </div>
        <div>
          <FieldLabel htmlFor="cf-phone" required>
            טלפון
          </FieldLabel>
          <input
            id="cf-phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="050-000-0000"
            className={inputClass}
            required
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel htmlFor="cf-email" hint="מומלץ — נשלח אישור">
            אימייל
          </FieldLabel>
          <input
            id="cf-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@company.com"
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel htmlFor="cf-company" hint="אופציונלי">
            חברה
          </FieldLabel>
          <input
            id="cf-company"
            type="text"
            autoComplete="organization"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="שם החברה / הסטארטאפ"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="cf-challenge" required>
          ספר לנו על האתגר
        </FieldLabel>
        <textarea
          id="cf-challenge"
          value={form.challenge}
          onChange={(e) => update("challenge", e.target.value)}
          placeholder="רוצים לבנות אב טיפוס לחיישן IoT לחקלאות, צריך תכנון PCB ותיק עם דירוג IP65, לוח זמנים — שלושה חודשים."
          className={`${inputClass} min-h-[140px] resize-none leading-relaxed`}
          maxLength={2000}
          required
        />
        <div className="text-xs text-slate-400 mt-1.5 text-left" dir="ltr">
          {form.challenge.length}/2000
        </div>
      </div>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            key={error}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="flex items-center justify-between gap-4 pt-2">
        <p className="text-xs text-slate-400 leading-relaxed">
          לחיצה על שליחה מסכימה ל
          <a href="/privacy" className="underline underline-offset-2 hover:text-indigo-600 mx-1">
            מדיניות הפרטיות
          </a>
          שלנו.
        </p>
        <motion.button
          type="submit"
          disabled={pending}
          whileHover={{ scale: pending ? 1 : 1.02, y: pending ? 0 : -1 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-full shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
        >
          {pending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              שולח…
            </>
          ) : (
            <>
              שלח פנייה
              <Send className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}

function ChatbotPanel() {
  return (
    <motion.div
      key="chatbot"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center text-center gap-6 py-6"
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
        <MessageSquare className="w-10 h-10 text-white" />
      </div>

      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          שוחח עם יועץ ה-AI
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
          תאר את הפרויקט בכמה משפטים. היועץ ינתח את הצרכים ויעביר לנבט סיכום מוכן.
        </p>
      </div>

      <motion.button
        onClick={openChatbot}
        className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-full shadow-xl shadow-indigo-500/35 hover:shadow-indigo-500/55 transition-all duration-200 text-sm"
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        פתח את הצ׳אטבוט
        <ArrowLeft className="w-4 h-4" />
      </motion.button>

      <p className="text-xs text-slate-400">תגובה מיידית · ללא צורך בהרשמה</p>
    </motion.div>
  );
}

function ModeSwitch({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div
      role="tablist"
      className="inline-flex p-1 bg-slate-100 rounded-full text-sm font-semibold mb-6"
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === "form"}
        onClick={() => onChange("form")}
        className={`relative px-5 py-2 rounded-full transition-colors ${
          mode === "form" ? "text-white" : "text-slate-600 hover:text-slate-900"
        }`}
      >
        {mode === "form" && (
          <motion.span
            layoutId="contact-mode-pill"
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md"
          />
        )}
        <span className="relative inline-flex items-center gap-1.5">
          <Send className="w-3.5 h-3.5" />
          טופס פנייה
        </span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "chatbot"}
        onClick={() => onChange("chatbot")}
        className={`relative px-5 py-2 rounded-full transition-colors ${
          mode === "chatbot" ? "text-white" : "text-slate-600 hover:text-slate-900"
        }`}
      >
        {mode === "chatbot" && (
          <motion.span
            layoutId="contact-mode-pill"
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md"
          />
        )}
        <span className="relative inline-flex items-center gap-1.5">
          <Bot className="w-3.5 h-3.5" />
          יועץ AI
        </span>
      </button>
    </div>
  );
}

export default function ContactForm() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [mode, setMode] = useState<Mode>("form");

  return (
    <section id="contact" className="py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-50/70 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-violet-50/50 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
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

          {/* Right: form / chatbot card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.65 }}
            className="lg:col-span-3"
          >
            {/* WhatsApp direct CTA — sits above the form/chatbot card */}
            <motion.a
              href="https://wa.me/972508373431?text=שלום%20נבט%2C%20אני%20מעוניין%20לשמוע%20על%20שירותייך"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-4 bg-[#25D366] hover:bg-[#22c55e] text-white font-bold rounded-2xl shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-200 mb-3"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              שלח הודעה ישירה ב-WhatsApp
            </motion.a>
            <p className="text-center text-xs text-slate-400 mb-5">
              או — ספר לנו על הפרויקט בטופס / בצ׳אט:
            </p>

            <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-900/5 p-6 sm:p-8 lg:p-10 min-h-[480px] flex flex-col">
              <ModeSwitch mode={mode} onChange={setMode} />
              <div className="flex-1 flex flex-col">
                <AnimatePresence mode="wait">
                  {mode === "form" ? <LeadForm /> : <ChatbotPanel />}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
