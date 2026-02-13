"use client";

import { AlertCircle, CloudRain, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-[#0f0f28]/80 backdrop-blur-xl border-b border-violet-500/20 shadow-lg shadow-violet-500/5">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 p-2 sm:p-2.5 rounded-xl shadow-lg shadow-violet-500/30 flex-shrink-0">
              <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-white font-space-grotesk tracking-tight truncate">
                TrafficPulse
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 truncate">
                Bangalore ORR | Silk Board - KR Puram
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6 flex-shrink-0">
            <div className="hidden sm:flex items-center space-x-2 bg-[#0f0f28]/60 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-xl border border-violet-500/20">
              <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-violet-400" />
              <div>
                <div
                  className="text-sm sm:text-lg font-semibold text-white font-mono"
                  suppressHydrationWarning
                >
                  {mounted ? format(currentTime, "hh:mm:ss a") : "--:--:-- --"}
                </div>
                <div
                  className="text-[10px] sm:text-xs text-slate-400"
                  suppressHydrationWarning
                >
                  {mounted ? format(currentTime, "dd MMM yyyy") : "-- --- ----"}
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-2 bg-[#0f0f28]/60 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-xl border border-violet-500/20">
              <CloudRain className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-400" />
              <div>
                <div className="text-xs sm:text-sm font-semibold text-white">
                  Weather
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400">
                  Monitoring Active
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
              <span className="text-xs sm:text-sm text-slate-400 hidden sm:inline">
                System Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
