"use client";

import { useState, useEffect } from "react";
import {
  Signal,
  Zap,
  Clock,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Shield,
  SlidersHorizontal,
  History,
  XCircle,
  ArrowUpRight,
  Gauge,
} from "lucide-react";

interface SignalData {
  id: string;
  name: string;
  greenTime: number;
  baseGreenTime: number;
  yellowTime: number;
  redTime: number;
  cycleTime: number;
  queueLength: number;
  currentPhase: string;
  countdown: number;
  stress: number;
  adaptiveMode: string;
  hasOverride: boolean;
  status: string;
}

interface SignalPlan {
  id: string;
  name: string;
  description: string;
  modifier: { green: number; red: number };
}

interface HistoryEntry {
  id: string;
  type: string;
  plan?: string;
  signalId?: string;
  signalName?: string;
  detail: string;
  timestamp: string;
}

export default function SignalControl() {
  const [signals, setSignals] = useState<SignalData[]>([]);
  const [plans, setPlans] = useState<SignalPlan[]>([]);
  const [activePlan, setActivePlan] = useState("office_hours");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSignal, setSelectedSignal] = useState<string | null>(null);
  const [manualGreenTime, setManualGreenTime] = useState(60);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const fetchSignals = async () => {
    try {
      const res = await fetch("/api/signals");
      const data = await res.json();
      setSignals(data.signals);
      setPlans(data.plans);
      setActivePlan(data.activePlan);
      setHistory(data.history || []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch signals:", error);
    }
  };

  const activatePlan = async (planId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/signals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "activate_plan", plan: planId }),
      });
      const result = await res.json();
      if (result.success) {
        setActivePlan(planId);
        setStatusMessage({ text: result.message, type: "success" });
        fetchSignals();
      }
    } catch (error) {
      setStatusMessage({ text: "Failed to activate plan", type: "error" });
    }
    setActionLoading(false);
  };

  const adjustSignal = async () => {
    if (!selectedSignal) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/signals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "adjust_timing",
          signalId: selectedSignal,
          greenTime: manualGreenTime,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setStatusMessage({ text: result.message, type: "success" });
        setSelectedSignal(null);
        fetchSignals();
      }
    } catch (error) {
      setStatusMessage({ text: "Failed to adjust signal", type: "error" });
    }
    setActionLoading(false);
  };

  const clearOverride = async (signalId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/signals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear_override", signalId }),
      });
      const result = await res.json();
      if (result.success) {
        setStatusMessage({ text: result.message, type: "success" });
        fetchSignals();
      }
    } catch (error) {
      setStatusMessage({ text: "Failed to clear override", type: "error" });
    }
    setActionLoading(false);
  };

  const getAdaptiveModeLabel = (mode: string) => {
    switch (mode) {
      case "flush":
        return "Flush (Critical)";
      case "extend":
        return "Extended Green";
      case "reduce":
        return "Reduced Cycle";
      case "manual_override":
        return "Manual Override";
      default:
        return "Baseline";
    }
  };

  const getAdaptiveModeStyle = (mode: string) => {
    switch (mode) {
      case "flush":
        return "bg-red-500/15 text-red-400 border-red-500/30";
      case "extend":
        return "bg-orange-500/15 text-orange-400 border-orange-500/30";
      case "reduce":
        return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
      case "manual_override":
        return "bg-violet-500/15 text-violet-400 border-violet-500/30";
      default:
        return "bg-slate-500/15 text-slate-400 border-slate-500/30";
    }
  };

  const getPhaseBadge = (phase: string) => {
    switch (phase) {
      case "green":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 font-mono uppercase tracking-wider">
            ● GREEN
          </span>
        );
      case "yellow":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono uppercase tracking-wider">
            ● AMBER
          </span>
        );
      case "red":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 font-mono uppercase tracking-wider">
            ● RED
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  const selectedSig = signals.find((s) => s.id === selectedSignal);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-space-grotesk flex items-center gap-3">
            <Signal className="w-7 h-7 text-violet-400" />
            Signal Management Console
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Adaptive signal control with real-time traffic-aware optimization
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-[#0a0a1a]/60 px-3 py-2 rounded-lg border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>System Online</span>
            <span className="text-slate-700">|</span>
            <span className="font-mono">{signals.length} junctions</span>
          </div>
          <button
            onClick={fetchSignals}
            className="p-2 rounded-lg bg-[#0a0a1a]/60 border border-slate-800 text-slate-400 hover:text-white hover:border-violet-500/30 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Status Toast ── */}
      {statusMessage && (
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium animate-fade-in ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          {statusMessage.text}
        </div>
      )}

      {/* ── Protocol Definitions ── */}
      <div className="bg-[#0f0f28]/40 backdrop-blur-sm rounded-xl border border-slate-800 p-5">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-violet-400" />
          Signal Protocols
          <span className="text-xs text-slate-600 font-normal ml-2">
            Select to activate
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {plans.map((plan) => {
            const isActive = activePlan === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => !actionLoading && activatePlan(plan.id)}
                disabled={actionLoading}
                className={`p-4 rounded-xl border text-left transition-all duration-200 group disabled:opacity-60 ${
                  isActive
                    ? "border-violet-500/40 bg-violet-500/10"
                    : "border-slate-800 bg-[#0a0a1a]/40 hover:border-slate-600"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3
                    className={`text-sm font-bold ${isActive ? "text-violet-300" : "text-white"}`}
                  >
                    {plan.name}
                  </h3>
                  {isActive && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30 uppercase tracking-wider">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  {plan.description}
                </p>
                <div className="flex gap-3 text-[11px]">
                  <div className="bg-[#0a0a1a]/60 px-2 py-1 rounded border border-slate-800">
                    <span className="text-slate-500">Green:</span>{" "}
                    <span className="text-green-400 font-mono font-bold">
                      {plan.modifier.green}x
                    </span>
                  </div>
                  <div className="bg-[#0a0a1a]/60 px-2 py-1 rounded border border-slate-800">
                    <span className="text-slate-500">Red:</span>{" "}
                    <span className="text-red-400 font-mono font-bold">
                      {plan.modifier.red}x
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Signal Status Table ── */}
      <div className="bg-[#0f0f28]/40 backdrop-blur-sm rounded-xl border border-slate-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Gauge className="w-4 h-4 text-cyan-400" />
            Junction Signal Status
          </h2>
          <span className="text-xs text-slate-600 font-mono">
            Updated every 3s
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-800/50">
                <th className="text-left px-5 py-3 font-semibold">Junction</th>
                <th className="text-center px-3 py-3 font-semibold">Phase</th>
                <th className="text-center px-3 py-3 font-semibold">
                  Countdown
                </th>
                <th className="text-center px-3 py-3 font-semibold">
                  <span className="text-green-500">G</span>/
                  <span className="text-amber-500">Y</span>/
                  <span className="text-red-500">R</span>
                </th>
                <th className="text-center px-3 py-3 font-semibold">Cycle</th>
                <th className="text-center px-3 py-3 font-semibold">Queue</th>
                <th className="text-center px-3 py-3 font-semibold">Stress</th>
                <th className="text-center px-3 py-3 font-semibold">Mode</th>
                <th className="text-center px-3 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {signals.map((sig) => (
                <tr
                  key={sig.id}
                  className={`border-b border-slate-800/30 transition-all hover:bg-violet-500/5 ${
                    selectedSignal === sig.id ? "bg-violet-500/10" : ""
                  }`}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-8 rounded-full ${
                          sig.stress > 70
                            ? "bg-red-500"
                            : sig.stress > 40
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                        }`}
                      ></div>
                      <div>
                        <p className="text-white font-semibold text-sm">
                          {sig.name}
                        </p>
                        <p className="text-[10px] text-slate-600 font-mono">
                          {sig.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center">
                    {getPhaseBadge(sig.currentPhase)}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="font-mono font-bold text-lg text-white">
                      {sig.countdown}
                    </span>
                    <span className="text-slate-600 text-xs">s</span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="font-mono text-xs">
                      <span className="text-green-400">{sig.greenTime}</span>
                      <span className="text-slate-700">/</span>
                      <span className="text-amber-400">{sig.yellowTime}</span>
                      <span className="text-slate-700">/</span>
                      <span className="text-red-400">{sig.redTime}</span>
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="font-mono text-slate-300 text-xs">
                      {sig.cycleTime}s
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`font-mono text-xs font-bold ${
                        sig.queueLength > 25
                          ? "text-red-400"
                          : sig.queueLength > 15
                            ? "text-amber-400"
                            : "text-slate-300"
                      }`}
                    >
                      {sig.queueLength}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          sig.stress > 70
                            ? "bg-red-500"
                            : sig.stress > 40
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                        }`}
                        style={{ width: `${sig.stress}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {sig.stress}%
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${getAdaptiveModeStyle(sig.adaptiveMode)}`}
                    >
                      {getAdaptiveModeLabel(sig.adaptiveMode)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <button
                        onClick={() => {
                          setSelectedSignal(
                            sig.id === selectedSignal ? null : sig.id,
                          );
                          setManualGreenTime(sig.greenTime);
                        }}
                        className="p-1.5 rounded-md bg-slate-800 hover:bg-violet-500/20 text-slate-400 hover:text-violet-400 transition border border-slate-700 hover:border-violet-500/30"
                        title="Adjust timing"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                      </button>
                      {sig.hasOverride && (
                        <button
                          onClick={() => clearOverride(sig.id)}
                          className="p-1.5 rounded-md bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition border border-slate-700 hover:border-red-500/30"
                          title="Clear override"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Manual Override Panel ── */}
      {selectedSignal && selectedSig && (
        <div className="bg-[#0f0f28]/40 backdrop-blur-sm rounded-xl border border-violet-500/20 p-5">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-violet-400" />
            Manual Override — {selectedSig.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Input */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Green Time (seconds)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={15}
                  max={120}
                  value={manualGreenTime}
                  onChange={(e) =>
                    setManualGreenTime(
                      Math.max(
                        15,
                        Math.min(120, parseInt(e.target.value) || 15),
                      ),
                    )
                  }
                  className="w-24 bg-[#0a0a1a] border border-slate-700 rounded-lg px-4 py-2.5 text-white font-mono text-lg font-bold focus:outline-none focus:border-violet-500 text-center"
                />
                <input
                  type="range"
                  min={15}
                  max={120}
                  value={manualGreenTime}
                  onChange={(e) => setManualGreenTime(parseInt(e.target.value))}
                  className="flex-1 accent-violet-500"
                />
              </div>
            </div>

            {/* Comparison */}
            <div className="bg-[#0a0a1a]/60 rounded-lg p-4 border border-slate-800">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Before → After
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Base Green:</span>
                  <span className="text-slate-400 font-mono">
                    {selectedSig.baseGreenTime}s
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Current Green:</span>
                  <span className="text-slate-300 font-mono">
                    {selectedSig.greenTime}s
                  </span>
                </div>
                <div className="flex justify-between text-sm border-t border-slate-800 pt-2 mt-2">
                  <span className="text-violet-400 font-bold">New Green:</span>
                  <span className="text-violet-300 font-mono font-bold">
                    {manualGreenTime}s
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Δ Change:</span>
                  <span
                    className={`font-mono font-bold ${manualGreenTime > selectedSig.greenTime ? "text-green-400" : manualGreenTime < selectedSig.greenTime ? "text-red-400" : "text-slate-400"}`}
                  >
                    {manualGreenTime > selectedSig.greenTime ? "+" : ""}
                    {manualGreenTime - selectedSig.greenTime}s
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col justify-center gap-3">
              <button
                onClick={adjustSignal}
                disabled={actionLoading}
                className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-semibold transition text-sm flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Apply Override
              </button>
              <button
                onClick={() => setSelectedSignal(null)}
                className="bg-[#0a0a1a] hover:bg-slate-800 border border-slate-700 text-slate-400 px-6 py-2.5 rounded-lg font-semibold transition text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Change History ── */}
      <div className="bg-[#0f0f28]/40 backdrop-blur-sm rounded-xl border border-slate-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" />
            Change Audit Log
            <span className="text-xs text-slate-600 font-normal ml-2">
              Persisted to database
            </span>
          </h2>
        </div>
        {history.length === 0 ? (
          <div className="px-5 py-10 text-center text-slate-600 text-sm">
            No changes recorded yet. Activate a protocol or adjust a signal to
            see entries here.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50 max-h-[280px] overflow-y-auto">
            {history.map((entry) => (
              <div
                key={String(entry.id)}
                className="flex items-center gap-4 px-5 py-3 hover:bg-violet-500/5 transition"
              >
                <div
                  className={`p-2 rounded-lg ${
                    entry.type === "plan_change"
                      ? "bg-violet-500/10 text-violet-400"
                      : entry.type === "timing_override"
                        ? "bg-cyan-500/10 text-cyan-400"
                        : "bg-slate-500/10 text-slate-400"
                  }`}
                >
                  {entry.type === "plan_change" ? (
                    <Shield className="w-4 h-4" />
                  ) : entry.type === "timing_override" ? (
                    <SlidersHorizontal className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">
                    {entry.detail}
                  </p>
                  <p className="text-xs text-slate-600">
                    {entry.type === "timing_override"
                      ? `Junction: ${entry.signalName}`
                      : entry.plan
                        ? `Protocol: ${entry.plan}`
                        : ""}
                  </p>
                </div>
                <div className="text-xs text-slate-600 font-mono">
                  {entry.timestamp
                    ? new Date(entry.timestamp).toLocaleString()
                    : "—"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
