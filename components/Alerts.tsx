"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Megaphone,
  Car,
  Loader2,
  Filter,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

interface UnifiedAlert {
  id: string;
  source: "public" | "cascade" | "incident";
  title: string;
  message: string;
  severity: "critical" | "high" | "medium" | "low";
  timestamp: string;
  status: string;
  raw: any;
}

export default function Alerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<UnifiedAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("active");

  useEffect(() => {
    fetchUnifiedAlerts();
    const interval = setInterval(fetchUnifiedAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnifiedAlerts = async () => {
    try {
      const [publicRes, cascadeRes, incidentRes] = await Promise.all([
        fetch("/api/public-alerts"),
        fetch("/api/alerts"),
        fetch("/api/incidents"),
      ]);

      const publicData = await publicRes.json();
      const cascadeData = await cascadeRes.json();
      const incidentData = await incidentRes.json();

      const unified: UnifiedAlert[] = [];

      // Process Public Alerts
      if (publicData.alerts) {
        publicData.alerts.forEach((a: any) => {
          unified.push({
            id: a.id,
            source: "public",
            title: `Public Alert (${a.type})`,
            message: a.message,
            severity: (a.priority || "medium").toLowerCase(),
            timestamp: a.timestamp,
            status: a.status, // sent/delivered/failed
            raw: a,
          });
        });
      }

      // Process Cascade Risks
      if (cascadeData.alerts) {
        cascadeData.alerts.forEach((a: any) => {
          unified.push({
            id: a.id,
            source: "cascade",
            title: "Cascade Risk Detected",
            message: `${a.segment}: ${a.trigger}`,
            severity: (a.risk_level || "medium").toLowerCase(),
            timestamp: a.timestamp,
            status: a.acknowledged ? "resolved" : "active",
            raw: a,
          });
        });
      }

      // Process Incidents
      if (incidentData.incidents) {
        incidentData.incidents.forEach((a: any) => {
          unified.push({
            id: a.id,
            source: "incident",
            title: `Incident Reported: ${a.type}`,
            message: `${a.location?.address || "Unknown Location"} - ${
              a.description
            }`,
            severity: "high", // Defaulting incidents to high for now
            timestamp: a.timestamp,
            status: a.status === "cleared" ? "resolved" : "active",
            raw: a,
          });
        });
      }

      // Sort by timestamp desc
      unified.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      setAlerts(unified);
    } catch (error) {
      console.error("Failed to fetch unified alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (alert: UnifiedAlert) => {
    try {
      if (alert.source === "cascade") {
        await fetch("/api/alerts", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: alert.id, acknowledged: true }),
        });
      } else if (alert.source === "incident") {
        await fetch("/api/incidents", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: alert.id, status: "cleared" }),
        });
      }
      fetchUnifiedAlerts(); // Refresh
    } catch (error) {
      console.error("Failed to acknowledge alert:", error);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filter === "all") return true;
    if (filter === "active")
      return (
        a.status === "active" || a.status === "sent" || a.status === "delivered"
      );
    // For public alerts, 'sent'/'delivered' are effectively 'active' or history?
    // User probably wants to see them.
    // Let's treat Public Alerts as always visible in Active unless very old?
    // Actually, distinct status mapping:
    // Cascade: active / resolved
    // Incident: active / resolved
    // Public: sent / delivered / failed (Always show in history? Or active?)
    // Let's assume Public are "Active" for display purposes if recent?
    // Or just show them in "All".
    // Better logic:
    // Active Tab: Cascade(active), Incident(active), Public(recent < 24h?)
    if (filter === "resolved")
      return (
        a.status === "resolved" ||
        a.status === "cleared" ||
        a.status === "acknowledged"
      );
    return true;
  });

  const getIcon = (source: string, severity: string) => {
    if (source === "public")
      return <Megaphone className="w-6 h-6 text-blue-400" />;
    if (source === "incident") return <Car className="w-6 h-6 text-red-500" />;
    // Cascade
    return (
      <AlertTriangle
        className={`w-6 h-6 ${
          severity === "critical"
            ? "text-red-500"
            : severity === "high"
              ? "text-orange-500"
              : "text-yellow-500"
        }`}
      />
    );
  };

  const getBorderColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500/50 hover:border-red-500";
      case "high":
        return "border-orange-500/50 hover:border-orange-500";
      case "medium":
        return "border-yellow-500/50 hover:border-yellow-500";
      case "low":
        return "border-blue-500/50 hover:border-blue-500";
      default:
        return "border-slate-700 hover:border-slate-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-space-grotesk">
            Unified Alert Feed
          </h1>
          <p className="text-slate-400">
            Real-time monitoring of all system events and hazards
          </p>
        </div>

        <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === "active"
                ? "bg-violet-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Active Issues
          </button>
          <button
            onClick={() => setFilter("resolved")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === "resolved"
                ? "bg-green-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Resolved
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === "all"
                ? "bg-slate-700 text-white shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All History
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-10 h-10 text-violet-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Syncing alert streams...</p>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            No Alerts Found
          </h2>
          <p className="text-slate-400">
            System is clear. No active alerts matching your filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-slate-900/80 backdrop-blur-sm rounded-xl border p-5 transition-all duration-300 ${getBorderColor(
                alert.severity,
              )}`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-800 rounded-lg">
                  {getIcon(alert.source, alert.severity)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wider font-bold text-slate-500">
                        {alert.source}
                      </span>
                      <span className="text-slate-600">•</span>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                        alert.status === "active" ||
                        alert.status === "sent" ||
                        alert.status === "delivered"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {alert.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {alert.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {alert.message}
                  </p>

                  {/* Detailed Metrics if Cascade */}
                  {alert.source === "cascade" && (
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-slate-800 p-2 rounded">
                        <span className="text-slate-500 block">Score</span>
                        <span className="text-white font-mono">
                          {alert.raw.score || "N/A"}
                        </span>
                      </div>
                      <div className="bg-slate-800 p-2 rounded">
                        <span className="text-slate-500 block">
                          Time to Impact
                        </span>
                        <span className="text-red-400 font-mono">
                          {alert.raw.time_to_collapse || "N/A"}
                        </span>
                      </div>
                      <div className="bg-slate-800 p-2 rounded">
                        <span className="text-slate-500 block">Confidence</span>
                        <span className="text-cyan-400 font-mono">
                          {alert.raw.confidence || 0}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {user?.role === "admin" &&
                    (alert.status === "active" || alert.status === "sent") && // Allow acknowledging active items
                    alert.source !== "public" && ( // Public alerts don't need ack here usually
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => acknowledgeAlert(alert)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/40 text-green-400 border border-green-600/50 rounded-lg text-sm font-medium transition"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>
                            {alert.source === "incident"
                              ? "Mark Resolved"
                              : "Acknowledge Risk"}
                          </span>
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
