"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  CheckCircle2,
  ChevronDown,
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

/* ── Message bubble ─────────────────────────────────────────────── */

function Bubble({
  msg,
  streaming,
}: {
  msg: Message;
  streaming?: boolean;
}) {
  const isUser = msg.role === "user";

  // Strip the INTAKE_COMPLETE token from displayed text
  const text = msg.content.replace("[INTAKE_COMPLETE]", "").trim();

  return (
    <div
      className={`flex ${isUser ? "justify-start" : "justify-end"} mb-3`}
      dir="rtl"
    >
      <div
        className={`
          max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
          ${
            isUser
              ? "bg-slate-100 text-slate-800 rounded-br-sm"
              : "bg-blue-600 text-white rounded-bl-sm shadow-md shadow-blue-900/20"
          }
        `}
      >
        {text}
        {streaming && (
          <span className="inline-block w-1.5 h-3.5 bg-white/70 rounded-sm ml-1 animate-pulse" />
        )}
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
  const abortRef = useRef<AbortController | null>(null);

  /* ── Scroll to bottom on new messages */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  /* ── Focus input when chat opens */
  useEffect(() => {
    if (open) {
      setUnread(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  /* ── Send message ──────────────────────────────────────────────── */

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    const userMsg: Message = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);
    setStreamingContent("");

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setStreamingContent(full);
      }

      const assistantMsg: Message = { role: "assistant", content: full };
      setMessages((prev) => [...prev, assistantMsg]);
      setStreamingContent("");

      if (full.includes("[INTAKE_COMPLETE]")) {
        setIntakeComplete(true);
      }

      if (!open) setUnread(true);
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "מצטערים, אירעה שגיאה זמנית. אנא נסה שוב.",
          },
        ]);
      }
    } finally {
      setLoading(false);
      setStreamingContent("");
    }
  }, [input, loading, messages, open]);

  /* ── Submit intake ──────────────────────────────────────────────── */

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

  /* ── Textarea: Enter = send, Shift+Enter = newline */
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  /* ── Render ─────────────────────────────────────────────────────── */

  return (
    <>
      {/* ── Floating button ── */}
      <div className="fixed bottom-6 left-6 z-50" dir="ltr">
        <AnimatePresence>
          {!open && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => setOpen(true)}
              className="relative flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white pl-5 pr-4 py-3 rounded-full shadow-xl shadow-blue-900/30 transition-colors group"
              aria-label="פתח צ'אטבוט פרויקטים"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">התחל פרויקט</span>

              {/* Unread badge */}
              {unread && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
              )}

              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-full ring-2 ring-blue-400 animate-ping opacity-30 pointer-events-none" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Chat window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="fixed bottom-6 left-6 z-50 w-[370px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl shadow-2xl shadow-slate-900/25 border border-slate-200/80 bg-white overflow-hidden"
            style={{ height: "520px" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-l from-blue-700 to-blue-600 text-white flex-shrink-0">
              <div className="flex items-center gap-2.5" dir="rtl">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                    N
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight">
                    יועץ פרויקטים AI
                  </p>
                  <p className="text-[11px] text-blue-100">
                    NBH Engineering · זמין עכשיו
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/15 transition-colors"
                aria-label="סגור"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 bg-slate-50/50">
              {messages.map((msg, i) => (
                <Bubble key={i} msg={msg} />
              ))}

              {/* Streaming bubble */}
              {streamingContent && (
                <Bubble
                  msg={{ role: "assistant", content: streamingContent }}
                  streaming
                />
              )}

              {/* Typing indicator */}
              {loading && !streamingContent && (
                <div className="flex justify-end mb-3">
                  <div className="bg-blue-600 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                    {[0, 0.2, 0.4].map((d) => (
                      <span
                        key={d}
                        className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce"
                        style={{ animationDelay: `${d}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Submit button — appears when intake is complete */}
              {intakeComplete && !submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 mb-1"
                  dir="rtl"
                >
                  <button
                    onClick={submitIntake}
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold py-3 rounded-xl shadow-md shadow-emerald-900/20 transition-colors"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        שולח סיכום...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        שלח סיכום לנבט בווטסאפ ✅
                      </>
                    )}
                  </button>
                </motion.div>
              )}

              {/* Success state */}
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center"
                  dir="rtl"
                >
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-emerald-800">
                    הסיכום נשלח לנבט!
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">
                    נחזור אליך תוך 24 שעות 🙌
                  </p>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            {!submitted && (
              <div
                className="flex items-end gap-2 px-3 py-3 border-t border-slate-200 bg-white flex-shrink-0"
                dir="rtl"
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="כתוב הודעה..."
                  rows={1}
                  disabled={loading || intakeComplete}
                  className="flex-1 resize-none text-sm text-slate-800 placeholder:text-slate-400 bg-slate-100 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition-all max-h-24 disabled:opacity-50 leading-snug"
                  style={{ direction: "rtl" }}
                />
                <button
                  onClick={send}
                  disabled={!input.trim() || loading || intakeComplete}
                  className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                  aria-label="שלח"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed indicator when window is closed and chat has messages */}
      <AnimatePresence>
        {!open && messages.length > 1 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-[72px] left-6 z-40 bg-white border border-slate-200 shadow-lg rounded-full px-3 py-1 text-xs text-slate-600 flex items-center gap-1.5"
            dir="rtl"
          >
            <X
              className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600"
              onClick={(e) => {
                e.stopPropagation();
                setMessages([GREETING]);
                setIntakeComplete(false);
                setSubmitted(false);
                setUnread(false);
              }}
            />
            שיחה בתהליך
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
