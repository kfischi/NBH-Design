/**
 * Admin: Outbound Drafts review queue.
 *
 * Server component — reads from Notion on every request (force-dynamic).
 * Auth is handled upstream by src/middleware.ts (HTTP Basic Auth on /admin/*).
 */

import Link from "next/link";
import {
  Inbox,
  Send,
  CheckCircle2,
  Reply,
  ExternalLink,
  Sparkles,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import {
  listRecentDrafts,
  type DraftSummary,
  type DraftStatus,
} from "@/lib/notion-client";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Outbound · Proto-Model Admin",
  robots: { index: false, follow: false },
};

const STATUS_CONFIG: Record<
  DraftStatus,
  { label: string; pillBg: string; pillText: string; dot: string }
> = {
  draft: {
    label: "טיוטה — ממתינה לאישור",
    pillBg: "bg-amber-50",
    pillText: "text-amber-700",
    dot: "bg-amber-500",
  },
  approved: {
    label: "מאושר — מוכן לשליחה",
    pillBg: "bg-indigo-50",
    pillText: "text-indigo-700",
    dot: "bg-indigo-500",
  },
  sent: {
    label: "נשלח",
    pillBg: "bg-slate-100",
    pillText: "text-slate-700",
    dot: "bg-slate-500",
  },
  replied: {
    label: "התקבלה תשובה",
    pillBg: "bg-emerald-50",
    pillText: "text-emerald-700",
    dot: "bg-emerald-500",
  },
};

const CHANNEL_LABEL: Record<DraftSummary["channel"], string> = {
  linkedin_dm: "LinkedIn DM",
  linkedin_inmail: "LinkedIn InMail",
  email: "Email",
};

function formatDateHe(iso?: string): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("he-IL", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return iso;
  }
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof Inbox;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}
      >
        <Icon className="w-5 h-5" strokeWidth={2} />
      </div>
      <div>
        <div className="text-2xl font-extrabold text-slate-900 leading-none">{value}</div>
        <div className="text-xs text-slate-500 mt-1.5">{label}</div>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6" dir="rtl">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-rose-100 shadow-xl shadow-rose-900/5 p-8 text-right">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-rose-600" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">לא הצלחנו לטעון את התור</h1>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          ייתכן ש-Notion לא מוגדר נכון או שהאינטגרציה לא חוברה לדאטאבייס. הפרטים הטכניים:
        </p>
        <pre
          className="text-xs bg-slate-50 border border-slate-100 rounded-xl p-3 overflow-x-auto text-slate-700"
          dir="ltr"
        >
          {message}
        </pre>
        <p className="text-xs text-slate-500 mt-4">
          ראה את <code className="bg-slate-100 px-1.5 py-0.5 rounded">INTEGRATIONS.md</code> §
          8 — Outbound LinkedIn pipeline, להגדרת ה-DBs.
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center mx-auto mb-5">
        <Sparkles className="w-8 h-8 text-indigo-500" strokeWidth={1.75} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">אין כרגע טיוטות בתור</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
        הקרון היומי ירוץ ב-09:00 (זמן ישראל) ויטען טיוטות חדשות אם יש יעדים בסטטוס
        <code className="mx-1 bg-slate-100 px-1.5 py-0.5 rounded text-xs">ready_for_outreach</code>.
      </p>
    </div>
  );
}

function DraftCard({ draft }: { draft: DraftSummary }) {
  const status = STATUS_CONFIG[draft.status];
  const targetLine = [draft.targetName, draft.targetCompany].filter(Boolean).join(" · ");

  return (
    <article className="group bg-white rounded-3xl border border-slate-100 hover:border-indigo-100 shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300 overflow-hidden">
      <div className="p-7">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.pillBg} ${status.pillText}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
              <span className="text-xs font-medium text-slate-400">
                {CHANNEL_LABEL[draft.channel]} · touch {draft.touchNumber}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 truncate">
              {targetLine || draft.subject || "ללא יעד"}
            </h3>
            {draft.subject && targetLine ? (
              <p className="text-xs text-slate-400 mt-0.5 truncate">{draft.subject}</p>
            ) : null}
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1 flex-shrink-0">
            <Calendar className="w-3.5 h-3.5" />
            {formatDateHe(draft.generatedAt)}
          </div>
        </div>

        <div
          className="rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 p-5 mb-4"
          dir="rtl"
        >
          <p className="text-[15px] leading-[1.85] text-slate-700 whitespace-pre-wrap">
            {draft.body || "(ללא טקסט)"}
          </p>
        </div>

        {draft.notes ? (
          <div className="text-xs text-slate-500 mb-4 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-700 font-semibold">נימוק התאמה:</strong>{" "}
              {draft.notes}
            </span>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            {draft.targetUrl ? (
              <a
                href={draft.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-indigo-600 transition-colors"
              >
                LinkedIn
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : null}
          </div>
          <Link
            href={draft.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            פתח ב-Notion ואשר
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default async function AdminOutboundPage() {
  let drafts: DraftSummary[] = [];
  let loadError: string | null = null;

  try {
    drafts = await listRecentDrafts(50);
  } catch (err) {
    loadError = err instanceof Error ? err.message : String(err);
  }

  if (loadError) return <ErrorState message={loadError} />;

  const counts = {
    total: drafts.length,
    draft: drafts.filter((d) => d.status === "draft").length,
    approved: drafts.filter((d) => d.status === "approved").length,
    sent: drafts.filter((d) => d.status === "sent").length,
    replied: drafts.filter((d) => d.status === "replied").length,
  };

  const refreshedAt = formatDateHe(new Date().toISOString());

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Brand header */}
      <header
        className="relative overflow-hidden text-white"
        style={{
          background:
            "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 120%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(900px 400px at 90% -10%, rgba(255,255,255,0.25), transparent 60%), radial-gradient(700px 300px at 0% 110%, rgba(255,255,255,0.18), transparent 55%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur rounded-full text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Proto-Model · Outbound
              </span>
              <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">
                תור הטיוטות
              </h1>
              <p className="mt-2 text-indigo-100/90 text-sm max-w-xl">
                כל הודעת LinkedIn שה-AI ניסח עבורך מופיעה כאן. אשר ב-Notion ואז ייצא לכלי
                האוטומציה.
              </p>
            </div>
            <div className="text-xs text-indigo-100/80">
              עודכן ב-{refreshedAt}
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard
            label="סה״כ בתור"
            value={counts.total}
            icon={Inbox}
            accent="bg-slate-900/5 text-slate-700"
          />
          <StatCard
            label="ממתינות לאישור"
            value={counts.draft}
            icon={Sparkles}
            accent="bg-amber-50 text-amber-600"
          />
          <StatCard
            label="מאושרות"
            value={counts.approved}
            icon={CheckCircle2}
            accent="bg-indigo-50 text-indigo-600"
          />
          <StatCard
            label="נשלחו"
            value={counts.sent}
            icon={Send}
            accent="bg-slate-100 text-slate-600"
          />
          <StatCard
            label="עם תשובה"
            value={counts.replied}
            icon={Reply}
            accent="bg-emerald-50 text-emerald-600"
          />
        </div>
      </section>

      {/* Drafts */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {drafts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {drafts.map((d) => (
              <DraftCard key={d.id} draft={d} />
            ))}
          </div>
        )}
      </main>

      <footer className="max-w-6xl mx-auto px-6 pb-12 text-xs text-slate-400 text-center">
        טיוטה ≠ נשלח. כל הודעה דורשת אישור ידני שלך ב-Notion לפני ייצוא לכלי השליחה.
      </footer>
    </div>
  );
}
