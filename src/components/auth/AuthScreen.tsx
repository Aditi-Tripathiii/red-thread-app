import React, { FormEvent, useState } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

type AuthMode = "signin" | "signup";

const benefits = [
  "Check a suspicious message or link before you act.",
  "Keep scan history on this device under your control.",
  "Use the local scanner without connecting email or SMS accounts.",
];

export const AuthScreen: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (mode === "signup" && !name.trim()) {
      setError("Please tell us what to call you.");
      return;
    }
    if (mode === "signup" && password.length < 8) {
      setError("Choose a password with at least 8 characters.");
      return;
    }
    if (mode === "signup" && password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "signup") {
        await signUp(name, email, password);
      } else {
        await signIn(email, password);
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "We could not start your local profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#07111f] text-slate-100 selection:bg-cyan-300/30">
      <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden border-r border-white/10 bg-[#0b1c31] px-10 py-12 lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-20 top-12 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
            <div className="absolute left-1/3 top-1/3 h-40 w-40 rounded-full border border-cyan-200/10" />
          </div>

          <div className="relative flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 shadow-lg shadow-cyan-900/40">
              <ShieldCheck className="h-6 w-6 text-slate-950" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">Red Thread</p>
              <p className="text-xs text-cyan-100/70">A calmer way to check suspicious messages</p>
            </div>
          </div>

          <div className="relative max-w-md space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/10 px-3 py-1 text-xs font-semibold text-cyan-100">
              <Sparkles className="h-3.5 w-3.5" /> Simple. Private. Clear.
            </span>
            <div>
              <h1 className="text-4xl font-black leading-tight tracking-tight xl:text-5xl">
                Pause before you click.
              </h1>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Red Thread helps you understand a message or link in plain language, so you can make a safer next move.
              </p>
            </div>
            <ul className="space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm text-slate-200">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <p className="relative max-w-sm text-xs leading-relaxed text-slate-400">
            This first version uses a local profile on this device. Your password is never sent to a Red Thread server.
          </p>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600">
                <ShieldCheck className="h-5 w-5 text-slate-950" />
              </div>
              <div>
                <p className="font-bold">Red Thread</p>
                <p className="text-xs text-slate-400">Check first. Act safely.</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/25 backdrop-blur sm:p-8">
              <div className="mb-7">
                <p className="text-sm font-semibold text-cyan-300">Your safety space</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight">
                  {mode === "signup" ? "Create your local profile" : "Welcome back"}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {mode === "signup"
                    ? "Set up a private profile to save scans on this device."
                    : "Sign in to view your saved scans and settings."}
                </p>
              </div>

              <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-950/70 p-1">
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    mode === "signup" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Sign up
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    mode === "signin" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Log in
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                {mode === "signup" && (
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-300">Your name</span>
                    <span className="relative block">
                      <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        autoComplete="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="e.g. Aditi"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-10 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/15"
                      />
                    </span>
                  </label>
                )}

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-300">Email address</span>
                  <span className="relative block">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      autoComplete="email"
                      inputMode="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-10 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/15"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-300">Password</span>
                  <span className="relative block">
                    <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-11 text-sm outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </span>
                </label>

                {mode === "signup" && (
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-300">Confirm password</span>
                    <span className="relative block">
                      <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        autoComplete="new-password"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Repeat your password"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-10 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/15"
                      />
                    </span>
                  </label>
                )}

                {error && (
                  <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-3 py-2.5 text-xs leading-relaxed text-rose-200">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  data-auth-submit
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Preparing your profile…" : mode === "signup" ? "Create profile" : "Log in"}
                  {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>

              <p className="mt-5 rounded-xl bg-slate-950/70 px-3 py-3 text-[11px] leading-relaxed text-slate-400">
                <strong className="text-slate-300">Local profile:</strong> this app keeps your profile and saved scans in this browser or app installation. It does not create a cloud account.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
