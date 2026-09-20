import React from "react";
import { History, House, ScanSearch, Settings } from "lucide-react";
import { useSecurity } from "../../context/SecurityContext";

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, history } = useSecurity();
  const needsReview = history.filter((item) => item.riskLevel !== "SAFE" && !item.reviewed).length;
  const items = [
    { id: "home" as const, label: "Home", icon: House },
    { id: "scan" as const, label: "Check", icon: ScanSearch },
    { id: "alerts" as const, label: "History", icon: History, badge: needsReview },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  return (
    <nav className="sticky bottom-0 z-30 border-t border-white/10 bg-[#07111f]/95 px-3 py-2 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              data-tab={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex min-w-16 flex-col items-center rounded-xl px-3 py-1.5 text-[11px] font-semibold transition ${
                active ? "text-cyan-200" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <span className={`relative grid h-7 w-8 place-items-center rounded-lg ${active ? "bg-cyan-300/10" : ""}`}>
                <Icon className="h-4 w-4" />
                {item.badge ? (
                  <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] text-white">
                    {item.badge}
                  </span>
                ) : null}
              </span>
              <span className="mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
