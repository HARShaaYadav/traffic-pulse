"use client";

import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { TrafficData } from "@/types/traffic";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

export default function Analytics() {
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();

    // Refresh every 60 seconds (not continuous)
    const interval = setInterval(fetchData, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchData = async () => {
    try {
      const [trafficRes, incidentsRes] = await Promise.all([
        fetch("/api/traffic"),
        fetch("/api/incidents"),
      ]);

      if (!trafficRes.ok)
        throw new Error(`Traffic API error: ${trafficRes.status}`);

      const trafficData = await trafficRes.json();
      setTrafficData(trafficData);

      if (incidentsRes.ok) {
        const incidentsData = await incidentsRes.json();
        processIncidentData(incidentsData.incidents || []);
      }

      setError(null);
      setLoading(false);
    } catch (error: any) {
      console.error("Failed to fetch data:", error);
      setError(error.message || "Failed to load data");
      setLoading(false);
    }
  };

  const [incidentStats, setIncidentStats] = useState({
    active: 0,
    resolved: 0,
    monitoring: 0,
  });

  const processIncidentData = (incidents: any[]) => {
    const active = incidents.filter((i: any) => i.status === "active").length;
    const resolved = incidents.filter(
      (i: any) => i.status === "cleared",
    ).length;
    const monitoring = incidents.filter(
      (i: any) => i.status === "clearing",
    ).length;
    setIncidentStats({ active, resolved, monitoring });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <button
            onClick={fetchData}
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
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400">No data available</p>
      </div>
    );
  }

  const stressData = {
    labels: trafficData.nodes.map((n) => n.name),
    datasets: [
      {
        label: "Current Stress Level",
        data: trafficData.nodes.map((n) => n.stress),
        backgroundColor: trafficData.nodes.map((n) =>
          n.stress > 80
            ? "rgba(239, 68, 68, 0.8)"
            : n.stress > 60
              ? "rgba(251, 146, 60, 0.8)"
              : "rgba(34, 197, 94, 0.8)",
        ),
      },
    ],
  };

  const incidentData = {
    labels: ["Active", "Resolved", "Monitoring"],
    datasets: [
      {
        data: [
          incidentStats.active,
          incidentStats.resolved,
          incidentStats.monitoring,
        ],
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 146, 60, 0.8)",
        ],
      },
    ],
  };

  const highStressNodes = trafficData.nodes.filter((n) => n.stress > 70).length;
  const activeAlerts = trafficData.cascade_alerts.filter(
    (a) => a.severity === "critical" || a.severity === "high",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-slate-400">
            Real-time traffic analysis and insights
          </p>
        </div>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-500/20"
        >
          Refresh Data
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0f0f28]/60 backdrop-blur-sm rounded-xl p-6 border border-violet-500/15">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 text-violet-400" />
            <span className="text-sm text-slate-400">Total Nodes</span>
          </div>
          <div className="text-3xl font-bold text-white">
            {trafficData.nodes.length}
          </div>
          <p className="text-sm text-slate-400 mt-1">Monitored</p>
        </div>

        <div className="bg-[#0f0f28]/60 backdrop-blur-sm rounded-xl p-6 border border-violet-500/15">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <span className="text-sm text-slate-400">High Stress</span>
          </div>
          <div className="text-3xl font-bold text-white">{highStressNodes}</div>
          <p className="text-sm text-red-400 mt-1">Critical Areas</p>
        </div>

        <div className="bg-[#0f0f28]/60 backdrop-blur-sm rounded-xl p-6 border border-violet-500/15">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-orange-400" />
            <span className="text-sm text-slate-400">Active Alerts</span>
          </div>
          <div className="text-3xl font-bold text-white">{activeAlerts}</div>
          <p className="text-sm text-orange-400 mt-1">Requires Action</p>
        </div>

        <div className="bg-[#0f0f28]/60 backdrop-blur-sm rounded-xl p-6 border border-violet-500/15">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <span className="text-sm text-slate-400">Avg Speed</span>
          </div>
          <div className="text-3xl font-bold text-white">
            {Math.round(
              trafficData.nodes.reduce((sum, n) => sum + n.speed, 0) /
                trafficData.nodes.length,
            )}
          </div>
          <p className="text-sm text-green-400 mt-1">km/h</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0f0f28]/60 backdrop-blur-sm rounded-xl p-6 border border-violet-500/15">
          <h3 className="text-xl font-bold text-white mb-4">
            Stress Levels by Node
          </h3>
          <Bar
            data={stressData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: { color: "#94a3b8" },
                  grid: { color: "rgba(148, 163, 184, 0.1)" },
                },
                x: {
                  ticks: { color: "#94a3b8" },
                  grid: { color: "rgba(148, 163, 184, 0.1)" },
                },
              },
              plugins: {
                legend: { labels: { color: "#94a3b8" } },
              },
            }}
          />
        </div>

        <div className="bg-[#0f0f28]/60 backdrop-blur-sm rounded-xl p-6 border border-violet-500/15">
          <h3 className="text-xl font-bold text-white mb-4">
            Incident Distribution
          </h3>
          <div className="flex justify-center">
            <div style={{ maxWidth: "300px" }}>
              <Doughnut
                data={incidentData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: { color: "#94a3b8" },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0f0f28]/60 backdrop-blur-sm rounded-xl p-6 border border-violet-500/15">
          <h3 className="text-xl font-bold text-white mb-4">Recent Alerts</h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {trafficData.cascade_alerts.slice(0, 10).map((alert, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-[#0a0a1a]/60 rounded-xl border border-violet-500/10"
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle
                    className={`w-5 h-5 ${
                      alert.severity === "critical"
                        ? "text-red-500"
                        : alert.severity === "high"
                          ? "text-orange-500"
                          : "text-yellow-500"
                    }`}
                  />
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {alert.message}
                    </p>
                    <p className="text-xs text-slate-400">
                      Severity: {alert.severity}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-500">Now</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0f0f28]/60 backdrop-blur-sm rounded-xl p-6 border border-violet-500/15">
          <h3 className="text-xl font-bold text-white mb-4">
            System Activity Log
          </h3>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}

function ActivityFeed() {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch("/api/activities");
      const data = await res.json();
      if (data.success) {
        setActivities(data.activities);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (activities.length === 0) {
    return (
      <p className="text-slate-500 text-center py-8">
        No recent activity recorded.
      </p>
    );
  }

  return (
    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
      {activities.map((act) => (
        <div
          key={act.id}
          className="flex items-start space-x-3 p-3 bg-[#0a0a1a]/60 rounded-xl border border-slate-700/50"
        >
          <div
            className={`mt-1 p-1.5 rounded-full ${act.type === "decision" ? (act.action === "accepted" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500") : "bg-blue-500/20 text-blue-500"}`}
          >
            {act.type === "decision" ? (
              act.action === "accepted" ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <TrendingUp className="w-4 h-4 rotate-180" />
              )
            ) : (
              <BarChart3 className="w-4 h-4" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <p className="text-white font-semibold text-sm">{act.title}</p>
              <span className="text-xs text-slate-500 font-mono">
                {new Date(act.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 capitalize">
              Action:{" "}
              <span
                className={
                  act.action === "accepted" || act.action === "sent"
                    ? "text-green-400"
                    : "text-slate-400"
                }
              >
                {act.action}
              </span>{" "}
              • {act.details}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
