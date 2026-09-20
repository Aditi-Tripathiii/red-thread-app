import React from "react";
import {
  CheckCircle2,
  Database,
  Download,
  LockKeyhole,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSecurity } from "../../context/SecurityContext";

export const SettingsTab: React.FC = () => {
  const { user } = useAuth();
  const { consent, updateConsent, deleteAllHistory, exportPrivacyReport, history } = useSecurity();
  const keepsHistory = consent.dataRetention !== "NONE";

  const clearHistory = () => {
    if (window.confirm("Delete all saved checks from this device? This cannot be undone.")) {
      deleteAllHistory();
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 pb-28 sm:px-6 sm:py-8">
      <header>
        <p className="text-sm font-semibold text-cyan-200">Your choices</p>
        <h2 className="mt-1 flex items-center gap-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
          <SlidersHorizontal className="h-6 w-6 text-cyan-200" /> Settings
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">Manage what this app keeps on this device. There are no connected inboxes or background monitors in this version.</p>
      </header>

      <section className="rounded-[1.75rem] border border-cyan-200/10 bg-gradient-to-br from-cyan-300/10 to-blue-500/5 p-5 sm:p-6">
        <div className="flex gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-cyan-300/15 text-cyan-100"><ShieldCheck className="h-5 w-5" /></span>
          <div>
            <h3 className="text-base font-bold text-slate-100">What Red Thread does today</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-300">It checks text and links you choose to paste into the app. It does not read your SMS, notifications, calls, installed apps, email, or screenshots automatically.</p>
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-300/10 text-emerald-100"><LockKeyhole className="h-5 w-5" /></span>
          <div>
            <h3 className="text-base font-bold">Local processing</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-400">The standard check runs on this device. Your pasted content is not sent to a cloud AI service from this interface.</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
              <CheckCircle2 className="h-3.5 w-3.5" /> Local scanner enabled
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-blue-300/10 text-blue-100"><Database className="h-5 w-5" /></span>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold">Saved check history</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-400">{history.length} {history.length === 1 ? "check is" : "checks are"} currently stored in this app installation.</p>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-300">
            <span className="hidden sm:inline">Keep history</span>
            <input
              type="checkbox"
              checked={keepsHistory}
              onChange={(event) => updateConsent("dataRetention", event.target.checked ? "MANUAL" : "NONE")}
              className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-cyan-300 focus:ring-cyan-300"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={exportPrivacyReport}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/40 px-3.5 py-2.5 text-xs font-bold text-slate-200 transition hover:bg-white/10"
          >
            <Download className="h-3.5 w-3.5 text-cyan-200" /> Export summary
          </button>
          <button
            type="button"
            onClick={clearHistory}
            disabled={history.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-300/20 bg-rose-300/10 px-3.5 py-2.5 text-xs font-bold text-rose-100 transition hover:bg-rose-300/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete all checks
          </button>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
        <h3 className="text-base font-bold">Your local profile</h3>
        <dl className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10 bg-slate-950/25 px-4">
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-xs text-slate-400">Name</dt>
            <dd className="text-xs font-semibold text-slate-200">{user?.name}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-xs text-slate-400">Email</dt>
            <dd className="max-w-[60%] truncate text-xs font-semibold text-slate-200">{user?.email}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-xs text-slate-400">Storage</dt>
            <dd className="text-xs font-semibold text-cyan-200">This device only</dd>
          </div>
        </dl>
      </section>
    </div>
  );
};
