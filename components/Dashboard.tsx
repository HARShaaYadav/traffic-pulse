"use client";

import { useEffect, useState } from "react";
import { TrafficData } from "@/types/traffic";
import dynamic from "next/dynamic";
import StressTimeline from "./StressTimeline";
import NodeCards from "./NodeCards";
import WeatherWidget from "./WeatherWidget";
import AlertPanel from "./AlertPanel";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  Activity,
  AlertTriangle,
  Gauge,
  Zap,
  TrendingUp,
  TrendingDown,
  Clock,
  CloudRain,
  Sun,
  Cloud,
  Shield,
  Radio,
  RefreshCw,
  ArrowRight,
  CircleDot,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const TrafficMap = dynamic(() => import("./TrafficMap"), { ssr: false });

export default function Dashboard() {
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchTrafficData();
    const interval = setInterval(() => {
      fetchTrafficData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchTrafficData = async () => {
    try {
      const res = await fetch("/api/traffic");
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setTrafficData(data);
      setLastUpdated(new Date());
      setError(null);
      setIsLoading(false);
    } catch (err: any) {
      console.error("Failed to fetch traffic data:", err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">
            Initializing Command Center...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <button
            onClick={fetchTrafficData}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!trafficData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-slate-400">No data available</p>
      </div>
    );
  }

  // --- Computed Metrics ---
  const avgStress =
    trafficData.nodes.reduce((sum, n) => sum + n.stress, 0) /
    trafficData.nodes.length;
  const corridorHealth = Math.round(100 - avgStress);
  const avgSpeed = Math.round(
    trafficData.nodes.reduce((sum, n) => sum + n.speed, 0) /
      trafficData.nodes.length,
  );
  const avgNormalSpeed = Math.round(
    trafficData.nodes.reduce((sum, n) => sum + n.normal_speed, 0) /
      trafficData.nodes.length,
  );
  const speedDelta = avgSpeed - avgNormalSpeed;
  const highStressNodes = trafficData.nodes.filter((n) => n.stress > 70).length;
  const criticalAlerts = trafficData.cascade_alerts.filter(
    (a) => a.severity === "critical" || a.severity === "high",
  ).length;

  // --- Chart Data: Stress Trend Line ---
  const historyLength = trafficData.nodes[0]?.history?.length || 0;
  const timeLabels = Array.from({ length: historyLength }, (_, i) => {
    const minsAgo = (historyLength - 1 - i) * 0.5;
    return minsAgo === 0 ? "Now" : `-${minsAgo}m`;
  });

  const nodeColors = [
    { bg: "rgba(139, 92, 246, 0.15)", border: "rgb(139, 92, 246)" },
    { bg: "rgba(236, 72, 153, 0.15)", border: "rgb(236, 72, 153)" },
    { bg: "rgba(6, 182, 212, 0.15)", border: "rgb(6, 182, 212)" },
    { bg: "rgba(245, 158, 11, 0.15)", border: "rgb(245, 158, 11)" },
    { bg: "rgba(34, 197, 94, 0.15)", border: "rgb(34, 197, 94)" },
    { bg: "rgba(239, 68, 68, 0.15)", border: "rgb(239, 68, 68)" },
    { bg: "rgba(99, 102, 241, 0.15)", border: "rgb(99, 102, 241)" },
    { bg: "rgba(244, 114, 182, 0.15)", border: "rgb(244, 114, 182)" },
  ];

  const stressTrendData = {
    labels: timeLabels,
    datasets: trafficData.nodes.map((node, idx) => ({
      label: node.name.replace(" Junction", "").replace(" Bridge", ""),
      data: node.history,
      borderColor: nodeColors[idx % nodeColors.length].border,
      backgroundColor: nodeColors[idx % nodeColors.length].bg,
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4,
      fill: false,
    })),
  };

  const speedComparisonData = {
    labels: trafficData.nodes.map((n) =>
      n.name.replace(" Junction", "").replace(" Bridge", ""),
    ),
    datasets: [
      {
        label: "Current Speed",
        data: trafficData.nodes.map((n) => n.speed),
        backgroundColor: trafficData.nodes.map((n) =>
          n.stress > 70
            ? "rgba(239, 68, 68, 0.7)"
            : n.stress > 50
              ? "rgba(245, 158, 11, 0.7)"
              : "rgba(34, 197, 94, 0.7)",
        ),
        borderRadius: 6,
        barPercentage: 0.5,
      },
      {
        label: "Normal Speed",
        data: trafficData.nodes.map((n) => n.normal_speed),
        backgroundColor: "rgba(148, 163, 184, 0.25)",
        borderRadius: 6,
        barPercentage: 0.5,
      },
    ],
  };

  const getStressColor = (stress: number) => {
    if (stress > 80) return "from-red-500 to-red-600";
    if (stress > 60) return "from-orange-500 to-amber-500";
    if (stress > 40) return "from-yellow-500 to-amber-400";
    return "from-emerald-500 to-green-400";
  };

  const getStressBg = (stress: number) => {
    if (stress > 80) return "bg-red-500/15 border-red-500/30";
    if (stress > 60) return "bg-orange-500/15 border-orange-500/30";
    if (stress > 40) return "bg-yellow-500/15 border-yellow-500/30";
    return "bg-emerald-500/15 border-emerald-500/30";
  };

  const getStressLabel = (stress: number) => {
    if (stress > 80) return "Critical";
    if (stress > 60) return "High";
    if (stress > 40) return "Moderate";
    return "Normal";
  };

  const getWeatherIcon = () => {
    if (trafficData.weather.condition === "heavy_rain")
      return <CloudRain className="w-5 h-5 text-blue-400" />;
    if (trafficData.weather.condition === "light_rain")
      return <Cloud className="w-5 h-5 text-slate-400" />;
    return <Sun className="w-5 h-5 text-amber-400" />;
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* ── Status Bar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0f0f28]/60 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-3 border border-violet-500/15">
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
            <span className="text-xs sm:text-sm text-slate-400">
              Live updates (30s)
            </span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-slate-700"></div>
          <span className="text-xs sm:text-sm text-slate-400">
            {trafficData.isPeak ? (
              <span className="text-orange-400 font-semibold">⚠ Peak Hour</span>
            ) : (
              <span className="text-green-400">✓ Off-Peak</span>
            )}
          </span>
          <div className="hidden sm:block h-4 w-px bg-slate-700"></div>
          <div className="flex items-center space-x-2">
            {getWeatherIcon()}
            <span className="text-xs sm:text-sm text-slate-300 capitalize">
              {trafficData.weather.condition.replace("_", " ")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="hidden md:block">
            <WeatherWidget weather={trafficData.weather} />
          </div>
          <button
            onClick={fetchTrafficData}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 transition-all text-sm text-violet-300 ml-auto sm:ml-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* ── Hero KPI Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Corridor Health */}
        <div className="glass-card p-5 relative overflow-hidden group hover:border-violet-500/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <Shield className="w-6 h-6 text-violet-400" />
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  corridorHealth > 70
                    ? "bg-emerald-500/20 text-emerald-400"
                    : corridorHealth > 40
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-red-500/20 text-red-400"
                }`}
              >
                {corridorHealth > 70
                  ? "Healthy"
                  : corridorHealth > 40
                    ? "Stressed"
                    : "Critical"}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-space-grotesk">
              {corridorHealth}
              <span className="text-base sm:text-lg text-slate-400">%</span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-1">
              Corridor Health
            </p>
          </div>
        </div>

        {/* Average Speed */}
        <div className="glass-card p-5 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <Gauge className="w-6 h-6 text-cyan-400" />
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center space-x-1 ${
                  speedDelta >= 0
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {speedDelta >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{Math.abs(speedDelta)} km/h</span>
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-space-grotesk">
              {avgSpeed}
              <span className="text-base sm:text-lg text-slate-400"> km/h</span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-1">
              Avg Speed (normal: {avgNormalSpeed})
            </p>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="glass-card p-5 relative overflow-hidden group hover:border-red-500/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              {criticalAlerts > 0 && (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-space-grotesk">
              {trafficData.cascade_alerts.length}
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-1">
              Cascade Alerts ({criticalAlerts} critical)
            </p>
          </div>
        </div>

        {/* High-Stress Nodes */}
        <div className="glass-card p-5 relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <Activity className="w-6 h-6 text-orange-400" />
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#0a0a1a]/60 text-slate-400">
                of {trafficData.nodes.length}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-space-grotesk">
              {highStressNodes}
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-1">
              High-Stress Nodes
            </p>
          </div>
        </div>

        {/* Peak Status */}
        <div className="glass-card p-5 relative overflow-hidden group hover:border-fuchsia-500/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <Zap className="w-6 h-6 text-fuchsia-400" />
              {trafficData.isPeak && (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              )}
            </div>
            <div className="text-lg sm:text-xl font-bold text-white font-space-grotesk">
              {trafficData.isPeak ? "Peak Hour" : "Off-Peak"}
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-1">
              {trafficData.isPeak
                ? "High traffic volume expected"
                : "Normal traffic conditions"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Live Traffic Heatmap Strip ── */}
      <div className="glass-card p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <h2 className="text-base sm:text-lg font-bold text-white font-space-grotesk flex items-center space-x-2">
            <Radio className="w-4 sm:w-5 h-4 sm:h-5 text-violet-400" />
            <span>ORR Corridor — Live Node Status</span>
          </h2>
          <span className="text-[10px] sm:text-xs text-slate-500">
            Silk Board → KR Puram (8 nodes)
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:items-stretch gap-2 overflow-x-auto pb-1">
          {trafficData.nodes.map((node, idx) => (
            <div key={node.id} className="flex items-center">
              <div
                className={`flex-1 lg:flex-initial lg:w-36 p-2.5 sm:p-3 rounded-xl border transition-all duration-300 hover:scale-105 ${getStressBg(node.stress)} ${
                  node.stress > 80 ? "animate-pulse-ring" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-white truncate max-w-[80px]">
                    {node.name
                      .replace(" Junction", "")
                      .replace(" Bridge", "")
                      .replace(" Road", "")}
                  </span>
                  <CircleDot
                    className={`w-3 h-3 ${
                      node.stress > 80
                        ? "text-red-400"
                        : node.stress > 60
                          ? "text-orange-400"
                          : node.stress > 40
                            ? "text-yellow-400"
                            : "text-emerald-400"
                    }`}
                  />
                </div>
                {/* Stress bar */}
                <div className="w-full h-1.5 bg-[#0a0a1a]/60 rounded-full mb-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${getStressColor(node.stress)} transition-all duration-700`}
                    style={{ width: `${node.stress}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    {node.stress}% stress
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {node.speed} km/h
                  </span>
                </div>
                <div className="mt-1">
                  <span
                    className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                      node.stress > 80
                        ? "bg-red-500/20 text-red-300"
                        : node.stress > 60
                          ? "bg-orange-500/20 text-orange-300"
                          : node.stress > 40
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {getStressLabel(node.stress)}
                  </span>
                </div>
              </div>
              {/* Connector arrow between nodes — hidden on mobile grid */}
              {idx < trafficData.nodes.length - 1 && (
                <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0 mx-1 hidden lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Alerts Panel ── */}
      {trafficData.cascade_alerts.length > 0 && (
        <AlertPanel alerts={trafficData.cascade_alerts} />
      )}

      {/* ── Map + Node Cards Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <div className="glass-card p-4 sm:p-6 shadow-xl">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 font-space-grotesk">
              ORR Corridor Map
            </h2>
            <TrafficMap nodes={trafficData.nodes} />
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4 max-h-[400px] lg:max-h-none overflow-y-auto">
          <NodeCards nodes={trafficData.nodes} />
        </div>
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Stress Trend Line Chart */}
        <div className="glass-card p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 font-space-grotesk flex items-center space-x-2">
            <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 text-violet-400" />
            <span>Stress Trend (Last 12min)</span>
          </h3>
          <Line
            data={stressTrendData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              interaction: {
                mode: "index",
                intersect: false,
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: { color: "#64748b", font: { size: 11 } },
                  grid: { color: "rgba(148, 163, 184, 0.06)" },
                  title: {
                    display: true,
                    text: "Stress %",
                    color: "#94a3b8",
                    font: { size: 11 },
                  },
                },
                x: {
                  ticks: { color: "#64748b", font: { size: 11 } },
                  grid: { color: "rgba(148, 163, 184, 0.06)" },
                },
              },
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    color: "#94a3b8",
                    font: { size: 10 },
                    boxWidth: 12,
                    padding: 12,
                  },
                },
                tooltip: {
                  backgroundColor: "rgba(15, 15, 40, 0.95)",
                  titleColor: "#e2e8f0",
                  bodyColor: "#94a3b8",
                  borderColor: "rgba(139, 92, 246, 0.3)",
                  borderWidth: 1,
                  cornerRadius: 8,
                  padding: 12,
                },
              },
            }}
          />
        </div>

        {/* Speed Comparison Bar Chart */}
        <div className="glass-card p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 font-space-grotesk flex items-center space-x-2">
            <Gauge className="w-4 sm:w-5 h-4 sm:h-5 text-cyan-400" />
            <span>Speed — Current vs Normal</span>
          </h3>
          <Bar
            data={speedComparisonData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { color: "#64748b", font: { size: 11 } },
                  grid: { color: "rgba(148, 163, 184, 0.06)" },
                  title: {
                    display: true,
                    text: "km/h",
                    color: "#94a3b8",
                    font: { size: 11 },
                  },
                },
                x: {
                  ticks: {
                    color: "#64748b",
                    font: { size: 10 },
                    maxRotation: 45,
                  },
                  grid: { display: false },
                },
              },
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    color: "#94a3b8",
                    font: { size: 10 },
                    boxWidth: 12,
                    padding: 12,
                  },
                },
                tooltip: {
                  backgroundColor: "rgba(15, 15, 40, 0.95)",
                  titleColor: "#e2e8f0",
                  bodyColor: "#94a3b8",
                  borderColor: "rgba(139, 92, 246, 0.3)",
                  borderWidth: 1,
                  cornerRadius: 8,
                  padding: 12,
                },
              },
            }}
          />
        </div>
      </div>

      {/* ── Stress Timeline (original component) ── */}
      <StressTimeline nodes={trafficData.nodes} />

      {/* ── Cascade Alerts Feed + System Health ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Cascade Alerts */}
        <div className="lg:col-span-2 glass-card p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 font-space-grotesk flex items-center space-x-2">
            <AlertTriangle className="w-4 sm:w-5 h-4 sm:h-5 text-red-400" />
            <span>Recent Cascade Alerts</span>
          </h3>
          {trafficData.cascade_alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Shield className="w-12 h-12 text-emerald-500/40 mb-3" />
              <p className="text-slate-400 text-sm">No active cascade alerts</p>
              <p className="text-slate-500 text-xs mt-1">
                The corridor is operating within safe parameters
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {trafficData.cascade_alerts.map((alert, idx) => (
                <div
                  key={alert.id || idx}
                  className={`flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl border transition-all hover:border-opacity-50 ${
                    alert.severity === "critical"
                      ? "bg-red-500/5 border-red-500/20"
                      : alert.severity === "high"
                        ? "bg-orange-500/5 border-orange-500/20"
                        : "bg-yellow-500/5 border-yellow-500/20"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      alert.severity === "critical"
                        ? "bg-red-500/15"
                        : alert.severity === "high"
                          ? "bg-orange-500/15"
                          : "bg-yellow-500/15"
                    }`}
                  >
                    <AlertTriangle
                      className={`w-5 h-5 ${
                        alert.severity === "critical"
                          ? "text-red-400"
                          : alert.severity === "high"
                            ? "text-orange-400"
                            : "text-yellow-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                          alert.severity === "critical"
                            ? "bg-red-500/20 text-red-300"
                            : alert.severity === "high"
                              ? "bg-orange-500/20 text-orange-300"
                              : "bg-yellow-500/20 text-yellow-300"
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-xs text-slate-500">
                        Risk Score: {alert.score}
                      </span>
                    </div>
                    <p className="text-sm text-white font-medium truncate">
                      {alert.segment}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {alert.trigger}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-[10px] sm:text-xs text-slate-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Collapse in {alert.time_to_collapse}</span>
                      </span>
                      <span>Confidence: {alert.confidence}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Health */}
        <div className="glass-card p-4 sm:p-6">
          <h3 className="text-lg font-bold text-white mb-4 font-space-grotesk">
            System Health
          </h3>
          <div className="space-y-4">
            {/* Detection Engine */}
            <div className="flex items-center space-x-3 p-3 bg-[#0a0a1a]/40 rounded-xl border border-violet-500/10">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
              <div className="flex-1">
                <p className="text-sm text-white font-medium">
                  Detection Engine
                </p>
                <p className="text-xs text-slate-500">Online — Running</p>
              </div>
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>

            {/* Real-time Updates */}
            <div className="flex items-center space-x-3 p-3 bg-[#0a0a1a]/40 rounded-xl border border-violet-500/10">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
              <div className="flex-1">
                <p className="text-sm text-white font-medium">Data Feed</p>
                <p className="text-xs text-slate-500">30s refresh cycle</p>
              </div>
              <Radio className="w-4 h-4 text-violet-400" />
            </div>

            {/* Weather Monitoring */}
            <div className="flex items-center space-x-3 p-3 bg-[#0a0a1a]/40 rounded-xl border border-violet-500/10">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
              <div className="flex-1">
                <p className="text-sm text-white font-medium">
                  Weather Monitor
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {trafficData.weather.condition.replace("_", " ")} — Intensity{" "}
                  {trafficData.weather.intensity}/10
                </p>
              </div>
              {getWeatherIcon()}
            </div>

            {/* Cascade Prevention */}
            <div className="flex items-center space-x-3 p-3 bg-[#0a0a1a]/40 rounded-xl border border-violet-500/10">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
              <div className="flex-1">
                <p className="text-sm text-white font-medium">
                  Cascade Prevention
                </p>
                <p className="text-xs text-slate-500">
                  {trafficData.cascade_alerts.length} active alert
                  {trafficData.cascade_alerts.length !== 1 ? "s" : ""}
                </p>
              </div>
              <Zap className="w-4 h-4 text-fuchsia-400" />
            </div>

            {/* Last Updated */}
            <div className="mt-4 pt-4 border-t border-violet-500/10">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Last Updated</span>
                <span className="text-slate-400 font-mono">
                  {lastUpdated ? lastUpdated.toLocaleTimeString() : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                <span>Nodes Monitored</span>
                <span className="text-slate-400">
                  {trafficData.nodes.length} / 8
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                <span>Data Points</span>
                <span className="text-slate-400">{historyLength} samples</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
