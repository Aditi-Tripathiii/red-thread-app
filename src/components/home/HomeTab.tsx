import React from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileSearch,
  Link2,
  LockKeyhole,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSecurity } from "../../context/SecurityContext";

const riskStyle = {
  HIGH: "border-rose-300/20 bg-rose-300/10 text-rose-200",
  SUSPICIOUS: "border-amber-300/20 bg-amber-300/10 text-amber-100",
  NEEDS_CAUTION: "border-amber-300/20 bg-amber-300/10 text-amber-100",
  SAFE: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
};

export const HomeTab: React.FC = () => {
  const { user } = useAuth();
  const { history, setActiveTab } = useSecurity();
  const firstName = user?.name.split(" ")[0] || "there";
  const recentScans = history.slice(0, 3);
  const concerningScans = history.filter((item) => item.riskLevel !== "SAFE").length;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 pb-28 sm:px-6 sm:py-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-cyan-200/10 bg-gradient-to-br from-[#0d2d43] via-[#10243c] to-[#101a35] p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="text-sm font-semibold text-cyan-200">Hi, {firstName}</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Unsure about a message or link?
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Paste it here before you reply, click, or pay. Red Thread checks common scam signals locally and explains what stood out.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab("scan")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
          >
            <ScanSearch className="h-4 w-4" />
            Check a message or link
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200">
            <FileSearch className="h-4 w-4" />
          </div>
          <h3 className="mt-3 text-sm font-bold">Paste a message</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">Check SMS, chat messages, emails, or payment requests.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-300/10 text-blue-200">
            <Link2 className="h-4 w-4" />
          </div>
          <h3 className="mt-3 text-sm font-bold">Inspect a link</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">See risky domains and link tricks without opening the page.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-300/10 text-emerald-200">
            <LockKeyhole className="h-4 w-4" />
          </div>
          <h3 className="mt-3 text-sm font-bold">Stay in control</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">Your scan history lives locally and can be exported or cleared anytime.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-cyan-200" />
              <h3 className="text-base font-bold">Your recent checks</h3>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {history.length === 0
                ? "Nothing saved yet. Your first check will appear here."
                : `${history.length} saved ${history.length === 1 ? "check" : "checks"}${concerningScans ? ` · ${concerningScans} need attention` : ""}.`}
            </p>
          </div>
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("alerts")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-200 hover:text-cyan-100"
            >
              View history <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {recentScans.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-slate-950/20 px-4 py-8 text-center">
            <ShieldCheck className="mx-auto h-7 w-7 text-emerald-300" />
            <p className="mt-3 text-sm font-semibold text-slate-200">Start with something that feels off</p>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-400">We’ll point out urgency, credential requests, suspicious links, and clear next steps.</p>
          </div>
        ) : (
          <div className="mt-5 space-y-2.5">
            {recentScans.map((scan) => (
              <button
                key={scan.id}
                type="button"
                onClick={() => setActiveTab("alerts")}
                className="flex w-full items-start gap-3 rounded-xl border border-white/10 bg-slate-950/30 p-3 text-left transition hover:border-cyan-200/25 hover:bg-white/[0.04]"
              >
                <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border ${riskStyle[scan.riskLevel]}`}>
                  {scan.riskLevel === "SAFE" ? <CheckCircle2 className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-100">{scan.category.replace(/_/g, " ")}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${riskStyle[scan.riskLevel]}`}>{scan.riskLevel.replace(/_/g, " ")}</span>
                  </span>
                  <span className="mt-1 block truncate text-xs text-slate-400">{scan.originalContentSnippet}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
