"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import Dashboard from "@/components/Dashboard";
import Alerts from "@/components/Alerts";

import Simulator from "@/components/Simulator";
import Analytics from "@/components/Analytics";
import IncidentImpact from "@/components/IncidentImpact";
import PublicAlerts from "@/components/PublicAlerts";

import Forecasting from "@/components/Forecasting";
import SignalControl from "@/components/SignalControl";
import Emergency from "@/components/Emergency";
import WeatherImpact from "@/components/WeatherImpact";
import Corporate from "@/components/Corporate";
import Settings from "@/components/Settings";

import ActivityLog from "@/components/ActivityLog";
import Navigation from "@/components/Navigation";
import Header from "@/components/Header";
import LoginPage from "@/components/LoginPage";
import { LogOut, User } from "lucide-react";

export default function DashboardPage() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <Header />

      {/* User Info Bar */}
      <div className="bg-[#0f0f28]/60 backdrop-blur-md border-b border-violet-500/15">
        <div className="container mx-auto px-3 sm:px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-400 min-w-0">
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">
              Welcome,{" "}
              <span className="text-white font-semibold">{user?.name}</span>
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-violet-400 hidden sm:inline">
              {user?.role}
            </span>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-violet-500/15 hover:bg-violet-500/25 text-white rounded-lg transition text-xs sm:text-sm border border-violet-500/20 flex-shrink-0"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="container mx-auto px-4 py-6">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "activity" && <ActivityLog />}
        {activeTab === "incidents" && <IncidentImpact />}
        {activeTab === "alerts" && <Alerts />}

        {activeTab === "forecasting" && <Forecasting />}
        {activeTab === "signals" && <SignalControl />}
        {activeTab === "emergency" && <Emergency />}
        {activeTab === "weather" && <WeatherImpact />}
        {activeTab === "corporate" && <Corporate />}
        {activeTab === "public-alerts" && <PublicAlerts />}

        {activeTab === "simulator" && <Simulator />}
        {activeTab === "analytics" && <Analytics />}

        {activeTab === "settings" && <Settings />}
      </main>
    </div>
  );
}
