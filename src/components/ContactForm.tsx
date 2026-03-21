"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import {
  Send,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  CheckCircle,
  Loader2,
  Clock,
  Shield,
  Star,
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
  { icon: CheckCircle, text: "NDA זמין לחתימה מיידית" },
];

export default function ContactForm() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    challenge: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const validate = () => {
    const newErrors: Partial<typeof form> = {};
    if (!form.name.trim()) newErrors.name = "שדה חובה";
    if (!form.phone.trim()) newErrors.phone = "שדה חובה";
    if (!form.challenge.trim()) newErrors.challenge = "אנא תאר את האתגר שלך";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1800));
    setStatus("success");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof form]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

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
            פגישת האפיון הראשונה היא בחינם. בוא נבין יחד איך נוכל לעזור לך לבנות את המוצר
            שלך.
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

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.65 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-900/5 p-8">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" as const }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">תודה רבה!</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    קיבלנו את פנייתך. נבט יחזור אליך תוך 24 שעות לתיאום פגישת האפיון.
                  </p>
                  <button
                    onClick={() => { setStatus("idle"); setForm({ name: "", company: "", phone: "", challenge: "" }); }}
                    className="mt-6 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm transition-colors"
                  >
                    שלח פנייה נוספת
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-slate-700 text-right">
                        שם מלא <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="ישראל ישראלי"
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-right text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100 transition-all ${
                          errors.name ? "border-red-300 bg-red-50" : "border-slate-200"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 text-right">{errors.name}</p>
                      )}
                    </div>

                    {/* Company */}
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-slate-700 text-right">
                        חברה / ארגון
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="שם החברה"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-right text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100 transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700 text-right">
                      טלפון <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="050-000-0000"
                      dir="ltr"
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-right text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100 transition-all ${
                        errors.phone ? "border-red-300 bg-red-50" : "border-slate-200"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 text-right">{errors.phone}</p>
                    )}
                  </div>

                  {/* Challenge */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700 text-right">
                      ספר לנו על האתגר ההנדסי שלך <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="challenge"
                      value={form.challenge}
                      onChange={handleChange}
                      rows={5}
                      placeholder="תאר את הפרויקט, האתגרים העיקריים, לוחות הזמנים ומה אתה מחפש בשותף הנדסי..."
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-right text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100 transition-all resize-none leading-relaxed ${
                        errors.challenge ? "border-red-300 bg-red-50" : "border-slate-200"
                      }`}
                    />
                    {errors.challenge && (
                      <p className="text-xs text-red-500 text-right">{errors.challenge}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2.5 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-70 disabled:cursor-not-allowed transition-all text-sm"
                    whileHover={{ scale: status === "idle" ? 1.02 : 1, y: status === "idle" ? -1 : 0 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        שולח...
                      </>
                    ) : (
                      <>
                        שלח פנייה
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>

                  <p className="text-center text-xs text-slate-400">
                    פגישת האפיון הראשונה ללא עלות · פרטיך מאובטחים ולא יועברו לצד ג&apos;
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
