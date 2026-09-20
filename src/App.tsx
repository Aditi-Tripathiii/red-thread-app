import React from "react";
import { ShieldCheck } from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SecurityProvider, useSecurity } from "./context/SecurityContext";
import { Header } from "./components/common/Header";
import { BottomNav } from "./components/common/BottomNav";
import { HomeTab } from "./components/home/HomeTab";
import { ScanTab } from "./components/scan/ScanTab";
import { AlertsTab } from "./components/alerts/AlertsTab";
import { SettingsTab } from "./components/settings/SettingsTab";
import { AuthScreen } from "./components/auth/AuthScreen";

const AppContent: React.FC = () => {
  const { isReady, user } = useAuth();
  const { activeTab } = useSecurity();

  if (!isReady) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#07111f] text-slate-100">
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <ShieldCheck className="h-5 w-5 animate-pulse text-cyan-300" />
          Preparing your private workspace…
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#07111f] text-slate-100">
      <Header />
      <main className="flex-1">
        {activeTab === "home" && <HomeTab />}
        {activeTab === "scan" && <ScanTab />}
        {activeTab === "alerts" && <AlertsTab />}
        {activeTab === "settings" && <SettingsTab />}
      </main>
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SecurityProvider>
        <AppContent />
      </SecurityProvider>
    </AuthProvider>
  );
}
