"use client";

import { useState, useEffect } from "react";
import {
  Ambulance,
  Flame,
  ShieldAlert,
  Crown,
  CheckCircle,
  Clock,
  ArrowRight,
  Loader2,
  History,
  Siren,
  Activity,
  MapPin,
  AlertOctagon,
  Zap,
  Radio,
  Timer,
  Shield,
  Phone,
  XCircle,
  ArrowUpRight,
} from "lucide-react";

interface Corridor {
  id: string;
  type: string;
  from: string;
  to: string;
  priority: string;
  status: string;
  eta: string;
  timeSaved: string;
  signalsCleared: number;
  trafficHeld: number;
  activatedAt: string;
  deactivatedAt?: string;
}

interface Stats {
  totalActivations: number;
  avgTimeSaved: number;
  activeCount: number;
  totalSignalsCleared: number;
}

// Live countdown hook
function useCountdown(activatedAt: string, etaMinutes: number) {
  const [remaining, setRemaining] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalMs = etaMinutes * 60 * 1000;
    const startTime = new Date(activatedAt).getTime();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const left = Math.max(0, totalMs - elapsed);
      const mins = Math.floor(left / 60000);
      const secs = Math.floor((left % 60000) / 1000);
      setRemaining(`${mins}:${secs.toString().padStart(2, "0")}`);
      setProgress(Math.min(100, (elapsed / totalMs) * 100));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [activatedAt, etaMinutes]);

  return { remaining, progress };
}

// Active corridor card with live countdown
function ActiveCorridorCard({
  corridor,
  typeConfig,
  onDeactivate,
}: {
  corridor: Corridor;
  typeConfig: any;
  onDeactivate: (id: string) => void;
}) {
  const etaNum = parseInt(corridor.eta) || 10;
  const { remaining, progress } = useCountdown(corridor.activatedAt, etaNum);

  return (
    <div
      className={`relative bg-[#0f0f28]/40 backdrop-blur-sm rounded-xl border border-${typeConfig.accent}-500/30 overflow-hidden`}
    >
      {/* Animated top progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800/50">
        <div
          className={`h-full bg-${typeConfig.accent}-500 transition-all duration-1000 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-lg bg-${typeConfig.accent}-500/10 border border-${typeConfig.accent}-500/20`}
            >
              <typeConfig.icon
                className={`w-6 h-6 text-${typeConfig.accent}-400`}
              />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h4 className="text-lg font-bold text-white font-space-grotesk">
                  {typeConfig.label}
                </h4>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span className="bg-red-500/10 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/20 uppercase tracking-wider">
                  LIVE OPS
                </span>
              </div>
              <div className="flex items-center text-slate-400 text-sm font-medium mt-1">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                <span className="text-slate-300">{corridor.from}</span>
                <ArrowRight className="w-4 h-4 mx-2 text-slate-600" />
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-red-500" />
                <span className="text-slate-300">{corridor.to}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="grid grid-cols-4 gap-px bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700/50">
              {/* Countdown */}
              <div className="bg-[#0a0a1a]/40 p-3 text-center min-w-[80px]">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1 flex items-center justify-center gap-1">
                  <Timer className="w-3 h-3" /> ETA
                </div>
                <div className="text-xl font-bold text-white font-mono tabular-nums">
                  {remaining}
                </div>
              </div>

              {/* Time Saved */}
              <div className="bg-[#0a0a1a]/40 p-3 text-center min-w-[80px]">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1 flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3" /> Saved
                </div>
                <div className="text-xl font-bold text-green-400 font-mono">
                  {corridor.timeSaved}
                </div>
              </div>

              {/* Signals Cleared */}
              <div className="bg-[#0a0a1a]/40 p-3 text-center min-w-[80px]">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1 flex items-center justify-center gap-1">
                  <Radio className="w-3 h-3" /> Signals
                </div>
                <div className="text-xl font-bold text-cyan-400 font-mono">
                  {corridor.signalsCleared}
                </div>
              </div>

              {/* Vehicles Held */}
              <div className="bg-[#0a0a1a]/40 p-3 text-center min-w-[80px]">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1 flex items-center justify-center gap-1">
                  <LayoutGrid className="w-3 h-3" /> Held
                </div>
                <div className="text-xl font-bold text-amber-400 font-mono">
                  {corridor.trafficHeld}
                </div>
              </div>
            </div>

            <button
              onClick={() => onDeactivate(corridor.id)}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50 px-4 py-2 rounded-lg transition-all font-semibold text-sm h-full"
            >
              Deactivate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { LayoutGrid } from "lucide-react";

export default function Emergency() {
  const [corridors, setCorrridors] = useState<{
    active: Corridor[];
    past: Corridor[];
  }>({ active: [], past: [] });
  const [stats, setStats] = useState<Stats>({
    totalActivations: 0,
    avgTimeSaved: 0,
    activeCount: 0,
    totalSignalsCleared: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedFrom, setSelectedFrom] = useState("Silk Board");
  const [selectedTo, setSelectedTo] = useState("St. Johns Hospital");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchCorridors();
  }, []);

  const fetchCorridors = async () => {
    try {
      const res = await fetch("/api/emergency");
      const data = await res.json();
      const active = data.active || [];
      const past = data.past || [];
      setCorrridors({ active, past });

      // Calculate stats from actual data
      const all = [...active, ...past];
      const totalSaved = all.reduce((acc: number, c: any) => {
        return acc + (parseInt(c.timeSaved) || 0);
      }, 0);
      const totalSignals = all.reduce(
        (acc: number, c: any) => acc + (c.signalsCleared || 0),
        0,
      );

      setStats({
        totalActivations: all.length,
        avgTimeSaved: all.length > 0 ? Math.round(totalSaved / all.length) : 0,
        activeCount: active.length,
        totalSignalsCleared: totalSignals,
      });
    } catch (error) {
      console.error("Failed to fetch corridors:", error);
    }
    setLoading(false);
  };

  const activateCorridor = async () => {
    if (!selectedType) return;
    setActivating(true);
    try {
      const res = await fetch("/api/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          from: selectedFrom,
          to: selectedTo,
          priority: "critical",
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Send SMS notification to emergency contacts
        try {
          await fetch("/api/interventions/dispatch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              incidentId: data.corridor?.id || "emergency",
              action: "alert",
              location: `${selectedFrom} → ${selectedTo}`,
              incidentType: `Emergency: ${selectedType}`,
            }),
          });
          console.log("[Emergency] SMS dispatched to contacts");
        } catch (smsErr) {
          console.warn("[Emergency] SMS dispatch failed:", smsErr);
        }

        fetchCorridors();
        setSuccessMsg(`${selectedType.toUpperCase()} CORRIDOR ACTIVATED`);
        setTimeout(() => setSuccessMsg(""), 6000);
        setSelectedType(null);
      }
    } catch (error) {
      console.error("Failed to activate corridor:", error);
    }
    setActivating(false);
  };

  const deactivateCorridor = async (id: string) => {
    try {
      await fetch("/api/emergency", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchCorridors();
    } catch (error) {
      console.error("Failed to deactivate corridor:", error);
    }
  };

  const resetCorridors = async () => {
    if (!confirm("Reset all emergency data? This is for demo purposes."))
      return;
    try {
      for (const c of corridors.active) {
        await deactivateCorridor(c.id);
      }
      alert("System Reset Complete");
    } catch (e) {
      console.error(e);
    }
  };

  const emergencyTypes = [
    {
      id: "ambulance",
      label: "Medical Emergency",
      icon: Ambulance,
      accent: "red",
      desc: "Create Green Corridor for Ambulance",
      stat: "< 8 min avg response",
    },
    {
      id: "fire",
      label: "Fire Response",
      icon: Flame,
      accent: "orange",
      desc: "Priority Routing for Fire Engines",
      stat: "< 12 min avg response",
    },
    {
      id: "police",
      label: "Police Pursuit / Ops",
      icon: ShieldAlert,
      accent: "blue",
      desc: "Clear path for Law Enforcement",
      stat: "< 5 min avg response",
    },
    {
      id: "vip",
      label: "High Priority Transit",
      icon: Crown,
      accent: "purple", // Using violet/purple theme
      desc: "Secure Corridor for VIP Movement",
      stat: "< 15 min avg response",
    },
  ];

  const locations = [
    "Silk Board Junction",
    "Marathahalli Bridge",
    "Bellandur Junction",
    "Whitefield",
    "KR Puram",
    "Ecospace",
    "Brookefield",
    "Sarjapur Road",
  ];

  const hospitals = [
    "St. Johns Hospital",
    "Manipal Hospital",
    "Apollo Hospital",
    "Narayana Health",
    "Columbia Asia",
    "Fortis Hospital",
  ];

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  const hasActiveEmergency = corridors.active.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Success Toast */}
      {successMsg && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-emerald-500/10 backdrop-blur-md text-emerald-400 px-6 py-3 rounded-lg border border-emerald-500/30 shadow-lg flex items-center space-x-3">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium text-sm">{successMsg}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-space-grotesk flex items-center gap-3">
            <Siren
              className={`w-7 h-7 ${hasActiveEmergency ? "text-red-500 animate-pulse" : "text-slate-400"}`}
            />
            Emergency Command Center
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Rapid response traffic control interface
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border transition-all ${
              hasActiveEmergency
                ? "bg-red-500/10 border-red-500/30 text-red-400"
                : "bg-[#0a0a1a]/60 border-slate-800 text-slate-500"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${hasActiveEmergency ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`}
            ></div>
            <span className="font-bold uppercase tracking-wider">
              {hasActiveEmergency ? "CRITICAL ALERT" : "SYSTEM STANDBY"}
            </span>
          </div>
          <button
            onClick={resetCorridors}
            className="p-2 rounded-lg bg-[#0a0a1a]/60 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-all text-xs"
          >
            RESET
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Activations",
            value: stats.totalActivations,
            icon: Zap,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10 border-cyan-500/20",
          },
          {
            label: "Avg Time Saved",
            value: `${stats.avgTimeSaved} min`,
            icon: Clock,
            color: "text-green-400",
            bg: "bg-green-500/10 border-green-500/20",
          },
          {
            label: "Active Corridors",
            value: stats.activeCount,
            icon: Activity,
            color: hasActiveEmergency ? "text-red-400" : "text-slate-400",
            bg: hasActiveEmergency
              ? "bg-red-500/10 border-red-500/20"
              : "bg-slate-800/50 border-slate-700/30",
          },
          {
            label: "Signals Cleared",
            value: stats.totalSignalsCleared,
            icon: Radio,
            color: "text-amber-400",
            bg: "bg-amber-500/10 border-amber-500/20",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`${stat.bg} border rounded-xl p-4 backdrop-blur-sm relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                {stat.label}
              </span>
              <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Main Action Grid */}
      {!selectedType && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {emergencyTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`group relative overflow-hidden rounded-xl p-5 text-left transition-all duration-200 border bg-[#0f0f28]/40 backdrop-blur-sm hover:translate-y-[-2px]
                ${
                  type.accent === "red"
                    ? "border-red-500/20 hover:border-red-500/40 hover:bg-red-500/5"
                    : type.accent === "orange"
                      ? "border-orange-500/20 hover:border-orange-500/40 hover:bg-orange-500/5"
                      : type.accent === "blue"
                        ? "border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/5"
                        : "border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/5"
                }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors
                  ${
                    type.accent === "red"
                      ? "bg-red-500/10 text-red-500 group-hover:bg-red-500/20"
                      : type.accent === "orange"
                        ? "bg-orange-500/10 text-orange-500 group-hover:bg-orange-500/20"
                        : type.accent === "blue"
                          ? "bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20"
                          : "bg-purple-500/10 text-purple-500 group-hover:bg-purple-500/20"
                  }`}
              >
                <type.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1 font-space-grotesk">
                {type.label}
              </h3>
              <p className="text-slate-400 text-xs mb-3 line-clamp-2">
                {type.desc}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-[10px] text-slate-600 font-mono bg-[#0a0a1a]/40 px-2 py-1 rounded border border-slate-800">
                  {type.stat}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Activation Panel */}
      {selectedType && (
        <div className="bg-[#0f0f28]/40 backdrop-blur-sm border border-slate-800 rounded-xl p-6 relative animate-in zoom-in-95 fade-in duration-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-lg bg-${emergencyTypes.find((t) => t.id === selectedType)?.accent}-500/10`}
              >
                {(() => {
                  const Icon =
                    emergencyTypes.find((t) => t.id === selectedType)?.icon ||
                    Activity;
                  return (
                    <Icon
                      className={`w-5 h-5 text-${emergencyTypes.find((t) => t.id === selectedType)?.accent}-500`}
                    />
                  );
                })()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-space-grotesk">
                  Activate{" "}
                  {emergencyTypes.find((t) => t.id === selectedType)?.label}
                </h2>
                <p className="text-slate-400 text-xs">
                  Authorize immediate green corridor dispatch
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedType(null)}
              className="text-slate-400 hover:text-white transition bg-[#0a0a1a]/60 hover:bg-slate-800 px-3 py-1.5 rounded-lg text-xs"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Origin Point
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                <select
                  value={selectedFrom}
                  onChange={(e) => setSelectedFrom(e.target.value)}
                  className="w-full bg-[#0a0a1a]/60 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:border-emerald-500 focus:outline-none transition appearance-none cursor-pointer hover:border-slate-600"
                >
                  {locations.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Destination
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                <select
                  value={selectedTo}
                  onChange={(e) => setSelectedTo(e.target.value)}
                  className="w-full bg-[#0a0a1a]/60 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:border-red-500 focus:outline-none transition appearance-none cursor-pointer hover:border-slate-600"
                >
                  {hospitals.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full bg-blue-500/5 border border-blue-500/10 rounded-lg p-3 flex items-start gap-3">
              <Phone className="w-4 h-4 text-blue-400 mt-0.5" />
              <div>
                <p className="text-blue-200 text-xs font-semibold">
                  SMS Alerts Active
                </p>
                <p className="text-blue-400/70 text-[10px]">
                  Contacts will be notified instantly.
                </p>
              </div>
            </div>

            <button
              onClick={activateCorridor}
              disabled={activating}
              className={`w-full md:w-auto px-8 py-3 rounded-lg font-bold text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2
                ${
                  activating
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : `bg-${emergencyTypes.find((t) => t.id === selectedType)?.accent}-600 hover:brightness-110 text-white shadow-lg shadow-${emergencyTypes.find((t) => t.id === selectedType)?.accent}-500/20`
                }`}
            >
              {activating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Siren className="w-4 h-4" />
                  <span>Confirm Dispatch</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Live Operations Section */}
      {corridors.active.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/50 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Active Operations
            </h3>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
              Live Metrics
            </span>
          </div>

          <div className="grid gap-4">
            {corridors.active.map((corridor) => {
              const typeConfig =
                emergencyTypes.find((t) => t.id === corridor.type) ||
                emergencyTypes[0];
              return (
                <ActiveCorridorCard
                  key={corridor.id}
                  corridor={corridor}
                  typeConfig={typeConfig}
                  onDeactivate={deactivateCorridor}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Past History */}
      {corridors.past.length > 0 && (
        <div className="bg-[#0f0f28]/40 backdrop-blur-sm rounded-xl border border-slate-800 overflow-hidden mt-8">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-bold text-white">Operation Log</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-800/50 font-semibold bg-[#0a0a1a]/20">
                  <th className="text-left px-5 py-3">Incident Type</th>
                  <th className="text-left px-3 py-3">Route</th>
                  <th className="text-center px-3 py-3">Time Saved</th>
                  <th className="text-center px-3 py-3">Signals</th>
                  <th className="text-right px-5 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {corridors.past.map((corridor) => {
                  const typeConfig =
                    emergencyTypes.find((t) => t.id === corridor.type) ||
                    emergencyTypes[0];
                  return (
                    <tr
                      key={corridor.id}
                      className="hover:bg-slate-800/20 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <typeConfig.icon
                            className={`w-4 h-4 text-${typeConfig.accent}-400`}
                          />
                          <span className="text-slate-300 font-medium">
                            {typeConfig.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <span>{corridor.from}</span>
                          <ArrowRight className="w-3 h-3 text-slate-600" />
                          <span>{corridor.to}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="font-mono text-green-400 font-bold">
                          {corridor.timeSaved}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="font-mono text-cyan-400 font-bold">
                          {corridor.signalsCleared}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className="text-slate-500 text-xs font-mono">
                          {new Date(corridor.activatedAt).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
