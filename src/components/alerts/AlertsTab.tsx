import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { AnalysisRecord } from "../../types";
import { useSecurity } from "../../context/SecurityContext";

type Filter = "all" | "attention" | "safe";

const riskTone = {
  HIGH: "border-rose-300/25 bg-rose-300/10 text-rose-100",
  SUSPICIOUS: "border-amber-300/25 bg-amber-300/10 text-amber-100",
  NEEDS_CAUTION: "border-amber-300/25 bg-amber-300/10 text-amber-100",
  SAFE: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
};

export const AlertsTab: React.FC = () => {
  const { history, deleteRecord, markAlertReviewed, setActiveTab } = useSecurity();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<AnalysisRecord | null>(null);

  const records = useMemo(
    () =>
      history.filter((record) => {
        const matchesFilter =
          filter === "all" ||
          (filter === "safe" ? record.riskLevel === "SAFE" : record.riskLevel !== "SAFE");
        const needle = query.trim().toLowerCase();
        const matchesQuery =
          !needle ||
          record.originalContentSnippet.toLowerCase().includes(needle) ||
          record.category.toLowerCase().includes(needle);
        return matchesFilter && matchesQuery;
      }),
    [filter, history, query]
  );

  const openRecord = (record: AnalysisRecord) => {
    setSelected(record);
    if (!record.reviewed) markAlertReviewed(record.id);
  };

  if (selected) {
    const tone = riskTone[selected.riskLevel];
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6 pb-28 sm:px-6 sm:py-8">
        <button type="button" onClick={() => setSelected(null)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-200">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to history
        </button>
        <section className="mt-4 rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex gap-3">
              <span className={`grid h-11 w-11 place-items-center rounded-2xl border ${tone}`}>
                {selected.riskLevel === "SAFE" ? <ShieldCheck className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
              </span>
              <div>
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${tone}`}>{selected.riskLevel.replace(/_/g, " ")}</span>
                <h2 className="mt-2 text-xl font-black text-white">{selected.category.replace(/_/g, " ")}</h2>
                <p className="mt-1 text-xs text-slate-400">Checked {new Date(selected.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                deleteRecord(selected.id);
                setSelected(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-rose-300/10 hover:text-rose-100"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>

          <div className="mt-5 space-y-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">What you checked</h3>
              <p className="mt-2 rounded-xl bg-slate-950/40 p-3 text-sm leading-relaxed text-slate-300">{selected.redactedContent}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Why it was flagged</h3>
              {selected.indicators.length ? (
                <div className="mt-2 space-y-2">
                  {selected.indicators.map((indicator) => (
                    <div key={`${indicator.type}-${indicator.description}`} className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
                      <p className="text-xs font-bold text-slate-200">{indicator.type.replace(/_/g, " ")}</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">{indicator.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 rounded-xl border border-white/10 bg-white/[0.025] p-3 text-xs text-slate-400">No high-risk patterns were detected by the local rules.</p>
              )}
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">What to do next</h3>
              <ol className="mt-2 space-y-2">
                {selected.recommendedActions.map((action, index) => (
                  <li key={action} className="flex gap-2 rounded-xl bg-cyan-300/5 p-3 text-xs leading-relaxed text-slate-300">
                    <span className="font-bold text-cyan-200">{index + 1}</span>{action}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 pb-28 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-cyan-200">Saved locally</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">Check history</h2>
          <p className="mt-2 text-sm text-slate-400">Review or remove the checks stored on this device.</p>
        </div>
        <button type="button" onClick={() => setActiveTab("scan")} className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-300 px-3.5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-200">
          New check <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </header>

      <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a message or result"
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-2.5 pl-10 pr-3 text-xs text-slate-100 outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          {([
            ["all", "All checks"],
            ["attention", "Needs attention"],
            ["safe", "No red flags"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${filter === value ? "bg-cyan-300 text-slate-950" : "bg-slate-950/50 text-slate-400 hover:text-slate-200"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {records.length === 0 ? (
        <section className="rounded-[1.75rem] border border-dashed border-white/10 bg-white/[0.025] px-5 py-12 text-center">
          <ClipboardList className="mx-auto h-9 w-9 text-cyan-200" />
          <h3 className="mt-3 text-base font-bold text-slate-200">No checks to show</h3>
          <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-400">Run a message or link check and the result will be saved here on this device.</p>
        </section>
      ) : (
        <section className="space-y-2.5">
          {records.map((record) => {
            const tone = riskTone[record.riskLevel];
            return (
              <button
                key={record.id}
                type="button"
                onClick={() => openRecord(record)}
                className="flex w-full items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left transition hover:border-cyan-200/25 hover:bg-white/[0.055]"
              >
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${tone}`}>
                  {record.riskLevel === "SAFE" ? <CheckCircle2 className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-100">{record.category.replace(/_/g, " ")}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${tone}`}>{record.riskLevel.replace(/_/g, " ")}</span>
                    {!record.reviewed && record.riskLevel !== "SAFE" && <span className="text-[10px] font-semibold text-cyan-200">New</span>}
                  </span>
                  <span className="mt-1 block truncate text-xs text-slate-400">{record.originalContentSnippet}</span>
                  <span className="mt-1 block text-[10px] text-slate-500">{new Date(record.createdAt).toLocaleString()}</span>
                </span>
                <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-slate-500" />
              </button>
            );
          })}
        </section>
      )}
    </div>
  );
};
