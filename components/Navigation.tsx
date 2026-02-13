"use client";

import {
  LayoutDashboard,
  AlertTriangle,
  Settings as SettingsIcon,
  Activity,
  BarChart3,
  AlertOctagon,
  Radio,
  TrendingUp,
  TrendingDown,
  Signal,
  Ambulance,
  CloudRain,
  Building2,
  Code,
  Truck,
  History,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navigation({
  activeTab,
  setActiveTab,
}: NavigationProps) {
  const { user } = useAuth();

  const allTabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "corporation"],
    },
    { id: "activity", label: "Activity Log", icon: History, roles: ["admin"] },
    {
      id: "forecasting",
      label: "Forecasting",
      icon: TrendingDown,
      roles: ["admin"],
    },
    { id: "signals", label: "Signals", icon: Signal, roles: ["admin"] },
    { id: "emergency", label: "Emergency", icon: Ambulance, roles: ["admin"] },
    {
      id: "weather",
      label: "Weather",
      icon: CloudRain,
      roles: ["admin", "viewer", "corporation"],
    },
    {
      id: "incidents",
      label: "Incidents",
      icon: AlertOctagon,
      roles: ["admin", "viewer", "corporation"],
    },
    {
      id: "alerts",
      label: "Alerts",
      icon: AlertTriangle,
      roles: ["admin", "viewer", "corporation"],
    },

    {
      id: "corporate",
      label: "Corporate",
      icon: Truck,
      roles: ["corporation", "admin"],
    },
    {
      id: "public-alerts",
      label: "Public Alerts",
      icon: Radio,
      roles: ["admin"],
    },

    { id: "simulator", label: "Simulator", icon: Activity, roles: ["admin"] },
    { id: "analytics", label: "Analytics", icon: BarChart3, roles: ["admin"] },

    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
      roles: ["admin", "corporation"],
    },
  ];

  const tabs = allTabs.filter((tab) => {
    if (!user) return false;
    // Admin sees everything
    if (user.role === "admin") return true;
    // Others see only what's allowed
    return tab.roles.includes(user.role || "viewer");
  });

  return (
    <nav className="bg-[#0f0f28]/60 backdrop-blur-md border-b border-violet-500/15 overflow-x-auto scrollbar-hide">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex space-x-0.5 sm:space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                data-testid={`nav-${tab.id}-tab`}
                className={`flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-4 py-2.5 sm:py-3 font-medium transition-all relative whitespace-nowrap ${
                  isActive
                    ? "text-violet-300 bg-violet-500/15"
                    : "text-slate-400 hover:text-white hover:bg-violet-500/10"
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
