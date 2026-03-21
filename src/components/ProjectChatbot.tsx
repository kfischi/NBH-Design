"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Loader2,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Bot,
} from "lucide-react";

/* ── Types ──────────────────────────────────────────────────────── */

interface Message {
  role: "user" | "assistant";
  content: string;
}

/* ── Greeting ───────────────────────────────────────────────────── */

const GREETING: Message = {
  role: "assistant",
  content:
    "שלום! אני יועץ הפרויקטים של NBH Engineering 🏗️\nאשמח לעזור לך להתחיל את הפרויקט.\n\nספר לי — מה שמך ועם איזו חברה אתה עובד?",
};

/* ── Progress steps ─────────────────────────────────────────────── */

const STEPS = ["פרטים", "פרויקט", "לוחות זמנים", "תקציב", "סיכום"];

function getProgress(messages: Message[]): number {
  const userCount = messages.filter((m) => m.role === "user").length;
  return Math.min(userCount, STEPS.length);
}

/* ── Message bubble ─────────────────────────────────────────────── */

function Bubble({ msg, streaming }: { msg: Message; streaming?: boolean }) {
  const isUser = msg.role === "user";
  const text = msg.content.replace("[INTAKE_COMPLETE]", "").trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-start" : "justify-end"} mb-3`}
      dir="rtl"
    >
      {/* Bot avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center ml-2 mt-0.5 shadow-sm shadow-indigo-500/30">
          <Bot className="w-3.5 h-3.5 text-white" />
        </div>
      )}

      <div
        className={`
          max-w-[78%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap
          ${
            isUser
              ? "bg-slate-100 text-slate-800 rounded-2xl rounded-tr-sm"
              : "bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl rounded-tl-sm shadow-md shadow-indigo-500/25"
          }
        `}
      >
        {text}
        {streaming && (
          <span className="inline-block w-1.5 h-3.5 bg-white/60 rounded-sm ml-1 animate-pulse" />
        )}
      </div>
    </motion.div>
  );
}

/* ── Typing dots ────────────────────────────────────────────────── */

function TypingDots() {
  return (
    <div className="flex justify-end mb-3" dir="rtl">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center ml-2 mt-0.5 shadow-sm shadow-indigo-500/30 flex-shrink-0">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center shadow-md shadow-indigo-500/25">
        {[0, 0.18, 0.36].map((d) => (
          <span
            key={d}
            className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce"
            style={{ animationDelay: `${d}s` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */

export default function ProjectChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [intakeComplete, setIntakeComplete] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [unread, setUnread] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const progress = getProgress(messages);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  useEffect(() => {
    if (open) {
      setUnread(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open]);

  /* ── Send ──────────────────────────────────────────────────────── */

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || intakeComplete) return;

    setInput("");
    const userMsg: Message = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);
    setStreamingContent("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setStreamingContent(full);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: full }]);
      setStreamingContent("");
      if (full.includes("[INTAKE_COMPLETE]")) setIntakeComplete(true);
      if (!open) setUnread(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "מצטערים, אירעה שגיאה זמנית. אנא נסה שוב." },
      ]);
    } finally {
      setLoading(false);
      setStreamingContent("");
    }
  }, [input, loading, messages, open, intakeComplete]);

  /* ── Submit ────────────────────────────────────────────────────── */

  const submitIntake = async () => {
    setSubmitting(true);
    try {
      await fetch("/api/chat/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      setSubmitted(true);
    } catch {
      alert("אירעה שגיאה. אנא נסה שוב.");
    } finally {
      setSubmitting(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  /* ── Render ─────────────────────────────────────────────────────── */

  return (
    <>
      {/* ── Floating trigger button ── */}
      <div className="fixed bottom-6 left-6 z-50">
        <AnimatePresence>
          {!open && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setOpen(true)}
              className="relative flex items-center gap-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white pl-5 pr-4 py-3 rounded-full shadow-xl shadow-indigo-500/35 transition-all duration-200"
              aria-label="פתח יועץ פרויקטים"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span className="text-sm font-semibold tracking-tight">
                התחל פרויקט
              </span>

              {/* Unread dot */}
              {unread && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
              )}

              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-full ring-2 ring-indigo-400/60 animate-ping pointer-events-none" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Chat window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="fixed bottom-6 left-6 z-50 flex flex-col w-[385px] max-w-[calc(100vw-2rem)] rounded-3xl border border-slate-100 shadow-2xl shadow-slate-900/12 bg-white overflow-hidden"
            style={{ height: 540 }}
          >
            {/* ── Header ── */}
            <div className="relative flex-shrink-0 overflow-hidden rounded-t-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700">
              {/* Decorative blobs inside header */}
              <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -bottom-4 left-8 w-20 h-20 bg-violet-400/20 rounded-full blur-lg pointer-events-none" />

              <div className="relative px-4 pt-4 pb-3">
                {/* Top row: avatar + title + close */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3" dir="rtl">
                    {/* Avatar */}
                    <div className="relative w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-inner">
                      <Sparkles className="w-5 h-5 text-white" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-indigo-700" />
                    </div>
                    <div dir="rtl">
                      <p className="text-sm font-semibold text-white leading-tight">
                        יועץ פרויקטים AI
                      </p>
                      <p className="text-[11px] text-indigo-200 font-medium">
                        NBH Engineering · זמין עכשיו
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-white/15 text-white/70 hover:text-white transition-colors"
                    aria-label="סגור"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress bar */}
                {!submitted && (
                  <div dir="rtl">
                    <div className="flex justify-between mb-1.5">
                      {STEPS.map((step, i) => (
                        <span
                          key={step}
                          className={`text-[10px] font-medium transition-colors ${
                            i < progress ? "text-white" : "text-indigo-300"
                          }`}
                        >
                          {step}
                        </span>
                      ))}
                    </div>
                    <div className="h-1 bg-white/15 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white rounded-full"
                        animate={{ width: `${(progress / STEPS.length) * 100}%` }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Messages ── */}
            <div className="relative flex-1 overflow-y-auto px-4 py-4 bg-gradient-to-b from-slate-50/80 to-white">
              {/* Decorative blob */}
              <div className="absolute top-4 left-0 w-48 h-48 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-4 right-0 w-32 h-32 bg-violet-50/60 rounded-full blur-2xl pointer-events-none" />

              <div className="relative">
                {messages.map((msg, i) => (
                  <Bubble key={i} msg={msg} />
                ))}

                {streamingContent && (
                  <Bubble
                    msg={{ role: "assistant", content: streamingContent }}
                    streaming
                  />
                )}

                {loading && !streamingContent && <TypingDots />}

                {/* Intake complete — submit CTA */}
                {intakeComplete && !submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4"
                    dir="rtl"
                  >
                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 h-px bg-gradient-to-r from-indigo-200 to-transparent" />
                      <span className="text-[11px] font-semibold text-indigo-500 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
                        הפרויקט מוכן לשליחה ✨
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-l from-violet-200 to-transparent" />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={submitIntake}
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white text-sm font-semibold py-3 rounded-2xl shadow-lg shadow-indigo-500/30 transition-all duration-200"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          שולח סיכום לנבט...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          שלח סיכום לנבט בווטסאפ
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                )}

                {/* Success */}
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 340, damping: 24 }}
                    className="mt-4 relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-5 text-center"
                    dir="rtl"
                  >
                    {/* bg blobs */}
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-indigo-100/60 rounded-full blur-xl pointer-events-none" />
                    <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-violet-100/60 rounded-full blur-xl pointer-events-none" />

                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/30">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm font-bold text-slate-900 mb-1">
                        הסיכום נשלח לנבט! 🎉
                      </p>
                      <p className="text-xs text-slate-500">
                        נחזור אליך תוך 24 שעות עם הצעת מחיר מפורטת
                      </p>
                    </div>
                  </motion.div>
                )}

                <div ref={bottomRef} />
              </div>
            </div>

            {/* ── Input ── */}
            {!submitted && (
              <div
                className="flex-shrink-0 px-3 py-3 border-t border-slate-100 bg-white"
                dir="rtl"
              >
                {intakeComplete ? (
                  <p className="text-center text-xs text-slate-400 py-1">
                    לחץ על הכפתור למעלה לשליחת הסיכום
                  </p>
                ) : (
                  <div className="flex items-end gap-2">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={onKeyDown}
                      placeholder="כתוב הודעה..."
                      rows={1}
                      disabled={loading}
                      className="flex-1 resize-none text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all max-h-24 disabled:opacity-50 leading-snug"
                      style={{ direction: "rtl" }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={send}
                      disabled={!input.trim() || loading}
                      className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl shadow-md shadow-indigo-500/30 transition-all duration-150"
                      aria-label="שלח"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </motion.button>
                  </div>
                )}

                {/* Footer */}
                <p className="text-[10px] text-slate-300 text-center mt-2 tracking-wide">
                  מופעל על ידי Claude AI · NBH Engineering
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Minimised badge (when chat has history and is closed) ── */}
      <AnimatePresence>
        {!open && messages.length > 1 && (
          <motion.button
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-[68px] left-6 z-40 flex items-center gap-2 bg-white border border-slate-200 shadow-lg shadow-slate-900/8 rounded-full px-3 py-1.5 text-xs text-slate-600 font-medium"
            dir="rtl"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            שיחה בתהליך
            <X
              className="w-3 h-3 text-slate-400 hover:text-slate-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setMessages([GREETING]);
                setIntakeComplete(false);
                setSubmitted(false);
                setUnread(false);
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
