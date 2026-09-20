import React, { useState } from "react";
import { ChevronDown, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const initial = user?.name.trim().charAt(0).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07111f]/90 px-4 py-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 shadow-lg shadow-cyan-950/30">
            <ShieldCheck className="h-5 w-5 text-slate-950" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold tracking-tight text-slate-100 sm:text-base">Red Thread</h1>
            <p className="truncate text-[11px] text-slate-400">Local message and link checks</p>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu((open) => !open)}
            aria-expanded={showMenu}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-2.5 text-left transition hover:bg-white/10"
          >
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-cyan-300/15 text-xs font-bold text-cyan-200">
              {initial}
            </span>
            <span className="hidden max-w-28 truncate text-xs font-semibold text-slate-200 sm:block">{user?.name}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-11 w-60 rounded-2xl border border-white/10 bg-[#0d1b2e] p-2 shadow-2xl shadow-black/30">
              <div className="border-b border-white/10 px-3 py-2.5">
                <p className="text-xs font-semibold text-slate-100">{user?.name}</p>
                <p className="mt-0.5 truncate text-[11px] text-slate-400">{user?.email}</p>
                <p className="mt-1 text-[10px] text-cyan-300">Local profile on this device</p>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-rose-400/10 hover:text-rose-200"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
