import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clipboard,
  ExternalLink,
  FileText,
  Link2,
  LoaderCircle,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { AnalysisRecord } from "../../types";
import { useSecurity } from "../../context/SecurityContext";

type CheckMode = "message" | "link";

const appearance = {
  HIGH: {
    card: "border-rose-300/25 bg-rose-400/10",
    icon: "bg-rose-300/15 text-rose-100",
    badge: "border-rose-300/25 bg-rose-300/15 text-rose-100",
    title: "High risk — pause before you act",
  },
  SUSPICIOUS: {
    card: "border-amber-300/25 bg-amber-300/10",
    icon: "bg-amber-300/15 text-amber-100",
    badge: "border-amber-300/25 bg-amber-300/15 text-amber-100",
    title: "Something looks suspicious",
  },
  NEEDS_CAUTION: {
    card: "border-amber-300/25 bg-amber-300/10",
    icon: "bg-amber-300/15 text-amber-100",
    badge: "border-amber-300/25 bg-amber-300/15 text-amber-100",
    title: "Use caution",
  },
  SAFE: {
    card: "border-emerald-300/25 bg-emerald-300/10",
    icon: "bg-emerald-300/15 text-emerald-100",
    badge: "border-emerald-300/25 bg-emerald-300/15 text-emerald-100",
    title: "No common scam signals found",
  },
};

export const ScanTab: React.FC = () => {
  const { analyze, deleteRecord, setActiveTab } = useSecurity();
  const [mode, setMode] = useState<CheckMode>("message");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<AnalysisRecord | null>(null);

  const content = mode === "message" ? message : link;
  const helperText = useMemo(
    () =>
      mode === "message"
        ? "Paste the message exactly as you received it. Avoid adding your password, PIN, OTP, or card number."
        : "Paste a link or domain. Red Thread checks the text of the address without opening it.",
    [mode]
  );

  const runCheck = async () => {
    const value = content.trim();
    if (!value) return;

    setIsScanning(true);
    try {
      const nextResult = await analyze(value, "MANUAL", mode === "link" ? "Link check" : "Message check", false);
      setResult(nextResult);
    } finally {
      setIsScanning(false);
    }
  };

  const clearCheck = () => {
    setMessage("");
    setLink("");
    setResult(null);
  };

  const chooseExample = () => {
    setMode("message");
    setMessage("Your account will be blocked today. Verify your KYC now at http://bank-account-check.xyz to avoid legal action.");
    setResult(null);
  };

  const currentAppearance = result ? appearance[result.riskLevel] : null;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 pb-28 sm:px-6 sm:py-8">
      <header>
        <p className="text-sm font-semibold text-cyan-200">Check before you trust</p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">Message & link checker</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
          Get a plain-language read on common scam signals. This is a local check, not a replacement for contacting official support.
        </p>
      </header>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-4 shadow-xl shadow-black/10 sm:p-6">
        <div className="grid grid-cols-2 rounded-xl bg-slate-950/60 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("message");
              setResult(null);
            }}
            className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold transition ${
              mode === "message" ? "bg-slate-800 text-cyan-100 shadow" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <FileText className="h-4 w-4" /> Message
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("link");
              setResult(null);
            }}
            className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold transition ${
              mode === "link" ? "bg-slate-800 text-cyan-100 shadow" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <Link2 className="h-4 w-4" /> Link
          </button>
        </div>

        <div className="mt-5">
          <label htmlFor="scan-value" className="text-sm font-bold text-slate-200">
            {mode === "message" ? "Paste the message" : "Paste the link"}
          </label>
          {mode === "message" ? (
            <textarea
              id="scan-value"
              rows={7}
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                setResult(null);
              }}
              placeholder="For example: ‘Your parcel is held. Pay the fee now to release it…’"
              className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm leading-relaxed text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/10"
            />
          ) : (
            <input
              id="scan-value"
              value={link}
              onChange={(event) => {
                setLink(event.target.value);
                setResult(null);
              }}
              inputMode="url"
              placeholder="https://example.com or example.com/login"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/10"
            />
          )}
          <p className="mt-2 text-xs leading-relaxed text-slate-500">{helperText}</p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={chooseExample}
            className="inline-flex items-center gap-2 rounded-xl px-2 py-2 text-xs font-semibold text-slate-400 transition hover:text-cyan-200"
          >
            <Clipboard className="h-3.5 w-3.5" /> Try an example
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={clearCheck} className="rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-400 hover:text-slate-200">
              Clear
            </button>
            <button
              type="button"
              onClick={runCheck}
              disabled={!content.trim() || isScanning}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isScanning ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ScanSearch className="h-4 w-4" />}
              {isScanning ? "Checking…" : "Check now"}
            </button>
          </div>
        </div>
      </section>

      {result && currentAppearance && (
        <section className={`rounded-[1.75rem] border p-5 shadow-xl shadow-black/10 sm:p-6 ${currentAppearance.card}`}>
          <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${currentAppearance.icon}`}>
                {result.riskLevel === "SAFE" ? <ShieldCheck className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
              </span>
              <div>
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${currentAppearance.badge}`}>
                  {result.riskLevel.replace(/_/g, " ")}
                </span>
                <h3 className="mt-2 text-lg font-black text-white">{currentAppearance.title}</h3>
                <p className="mt-1 text-sm text-slate-300">{result.category.replace(/_/g, " ")} · {Math.round(result.confidence * 100)}% signal confidence</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                deleteRecord(result.id);
                setResult(null);
              }}
              className="inline-flex items-center gap-1.5 self-start rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-400 transition hover:bg-rose-300/10 hover:text-rose-100"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                <AlertTriangle className="h-3.5 w-3.5" /> What stood out
              </h4>
              {result.indicators.length ? (
                <ul className="mt-3 space-y-2">
                  {result.indicators.map((indicator) => (
                    <li key={`${indicator.type}-${indicator.description}`} className="rounded-xl bg-slate-950/30 px-3 py-2.5 text-xs leading-relaxed text-slate-200">
                      <strong className="block text-slate-100">{indicator.type.replace(/_/g, " ")}</strong>
                      <span className="mt-0.5 block text-slate-400">{indicator.description}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 rounded-xl bg-slate-950/30 px-3 py-2.5 text-xs leading-relaxed text-slate-300">No common high-risk patterns were found in this content.</p>
              )}
            </div>
            <div>
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5" /> Safer next steps
              </h4>
              <ol className="mt-3 space-y-2">
                {result.recommendedActions.map((action, index) => (
                  <li key={action} className="flex gap-2 rounded-xl bg-slate-950/30 px-3 py-2.5 text-xs leading-relaxed text-slate-200">
                    <span className="font-bold text-cyan-200">{index + 1}</span>
                    {action}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {result.urlFindings && result.urlFindings.length > 0 && (
            <div className="mt-5 border-t border-white/10 pt-5">
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300"><Link2 className="h-3.5 w-3.5" /> Link details</h4>
              <div className="mt-3 space-y-2">
                {result.urlFindings.map((finding) => (
                  <div key={finding.rawUrl} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-950/30 px-3 py-2.5 text-xs">
                    <span className="break-all text-slate-300">{finding.hostname || finding.rawUrl}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${appearance[finding.riskLevel].badge}`}>{finding.riskLevel}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <p className="max-w-xl text-[11px] leading-relaxed text-slate-400">Keep using official apps or websites to verify anything important. A scan is guidance, not proof that a sender is genuine.</p>
            <button type="button" onClick={() => setActiveTab("alerts")} className="inline-flex items-center gap-1 text-xs font-bold text-cyan-200 hover:text-cyan-100">
              View saved checks <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
