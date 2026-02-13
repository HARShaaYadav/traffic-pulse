"use client";

import { useEffect, useState } from "react";
import {
  AlertOctagon,
  Waves,
  Clock,
  MapPin,
  TrendingDown,
  Plus,
  Truck,
  Radio,
  Split,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

interface Incident {
  id: string;
  type:
    | "accident_minor"
    | "accident_major"
    | "flooding"
    | "breakdown"
    | "construction";
  location: string;
  timestamp: string;
  affectedNodes: string[];
  estimatedClearance: string;
  impactRadius: number;
  delayIncrease: number;
  status: "active" | "clearing" | "cleared";
  interventions?: string[];
  driver?: {
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
  };
}

export default function IncidentImpactAnalyzer() {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [newIncidentType, setNewIncidentType] = useState("");
  const [newIncidentLocation, setNewIncidentLocation] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      const res = await fetch("/api/incidents");
      const data = await res.json();
      if (data.incidents) {
        setIncidents(data.incidents);
      }
    } catch (error) {
      console.error("Failed to load incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateIncidentStatus = async (id: string, status: string) => {
    try {
      setProcessing(id);
      await fetch("/api/incidents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      setIncidents(
        incidents.map((inc) =>
          inc.id === id ? { ...inc, status: status as any } : inc,
        ),
      );
    } catch (error) {
      console.error("Failed to update incident:", error);
    } finally {
      setProcessing(null);
    }
  };

  const handleIntervention = async (id: string, action: string) => {
    const incident = incidents.find((i) => i.id === id);
    if (!incident) return;

    try {
      setProcessing(id);
      let dispatchedDriver = null;

      // Call the dispatch API for notifications (Email/SMS)
      if (action === "tow" || action === "alert") {
        const res = await fetch("/api/interventions/dispatch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            incidentId: id,
            action,
            location: incident.location,
            incidentType: incident.type,
          }),
        });
        const data = await res.json();
        if (data.driver) {
          dispatchedDriver = data.driver;
        }
      }

      // Call signals API for diversion
      if (action === "diversion") {
        await fetch("/api/signals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "activate_plan", plan: "emergency" }),
        });

        // Also notify authorities about diversion
        await fetch("/api/interventions/dispatch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            incidentId: id,
            action: "diversion",
            location: incident.location,
            incidentType: incident.type,
          }),
        });
      }

      // Persist interventions and driver to DB
      const updatedInterventions = [...(incident.interventions || [])];
      if (!updatedInterventions.includes(action)) {
        updatedInterventions.push(action);
      }

      const driverToSave = dispatchedDriver || incident.driver;

      await fetch("/api/incidents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: incident.status,
          interventions: updatedInterventions,
          driver: driverToSave,
        }),
      });

      // Update local state to show the driver card
      setIncidents(
        incidents.map((inc) =>
          inc.id === id
            ? {
                ...inc,
                interventions: updatedInterventions,
                driver: driverToSave,
              }
            : inc,
        ),
      );

      alert(
        `${
          action === "tow"
            ? "Tow truck dispatched (Email/SMS sent)"
            : action === "alert"
              ? "Nearby vehicles alerted via Broadcast"
              : "Diversion plan activated & authorities notified"
        } successfully`,
      );
    } catch (error) {
      console.error("Intervention failed:", error);
      alert("Failed to execute intervention. check logs.");
    } finally {
      setProcessing(null);
    }
  };

  const reportNewIncident = async () => {
    if (!newIncidentType || !newIncidentLocation) {
      alert("Please select incident type and enter location");
      return;
    }

    try {
      setProcessing("new");
      const newIncident = {
        type: newIncidentType,
        location: newIncidentLocation,
        affectedNodes: ["Silk Board", "Marathahalli"], // In real app, calculate based on location
        estimatedClearance: newIncidentType.includes("major")
          ? "45-60 min"
          : "20-30 min",
        impactRadius: newIncidentType.includes("major") ? 3.5 : 1.5,
        delayIncrease: newIncidentType.includes("major") ? 25 : 10,
        status: "active",
      };

      await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIncident),
      });

      setNewIncidentType("");
      setNewIncidentLocation("");
      await loadIncidents();
    } catch (error) {
      console.error("Failed to report incident:", error);
    } finally {
      setProcessing(null);
    }
  };

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case "accident_major":
      case "accident_minor":
        return <AlertOctagon className="w-6 h-6" />;
      case "flooding":
        return <Waves className="w-6 h-6" />;
      default:
        return <AlertOctagon className="w-6 h-6" />;
    }
  };

  const getIncidentColor = (type: string) => {
    switch (type) {
      case "accident_major":
        return "border-red-500 bg-red-500/10 text-red-400";
      case "accident_minor":
        return "border-yellow-500 bg-yellow-500/10 text-yellow-400";
      case "flooding":
        return "border-blue-500 bg-blue-500/10 text-blue-400";
      default:
        return "border-orange-500 bg-orange-500/10 text-orange-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-500";
      case "clearing":
        return "bg-yellow-500";
      case "cleared":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white font-space-grotesk mb-2">
          Incident Impact Analyzer
        </h1>
        <p className="text-slate-400">
          Real-time incident tracking with automated impact assessment
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {incidents.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 rounded-xl border border-slate-800">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white">All Clear</h3>
            <p className="text-slate-400">
              No active incidents reported on the corridor
            </p>
          </div>
        ) : (
          incidents.map((incident) => (
            <div
              key={incident.id}
              className={`rounded-xl border-2 p-6 ${getIncidentColor(incident.type)} animate-slide-up`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getIncidentIcon(incident.type)}
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-xl font-bold text-white capitalize">
                        {incident.type.replace("_", " ")}
                      </h3>
                      <span
                        className={`w-2 h-2 rounded-full animate-pulse ${getStatusColor(incident.status)}`}
                      ></span>
                      <span className="text-sm text-slate-400 capitalize">
                        {incident.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-300">
                      <MapPin className="w-4 h-4" />
                      <span className="font-semibold">{incident.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(incident.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-slate-400 text-xs mb-1">
                    Affected Nodes
                  </div>
                  <div className="text-white font-bold text-lg">
                    {incident.affectedNodes.length}
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-slate-400 text-xs mb-1">
                    Delay Impact
                  </div>
                  <div className="text-red-400 font-bold text-lg flex items-center">
                    <TrendingDown className="w-4 h-4 mr-1" />+
                    {incident.delayIncrease} min
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-slate-400 text-xs mb-1">Clearance</div>
                  <div className="text-yellow-400 font-bold text-sm">
                    {incident.estimatedClearance}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {user?.role === "admin" && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleIntervention(incident.id, "tow")}
                    disabled={!!processing}
                    className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
                  >
                    <Truck className="w-4 h-4" /> Deploy Tow Truck
                  </button>
                  <button
                    onClick={() => handleIntervention(incident.id, "alert")}
                    disabled={!!processing}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
                  >
                    <Radio className="w-4 h-4" /> Alert Drivers
                  </button>
                  <button
                    onClick={() => handleIntervention(incident.id, "diversion")}
                    disabled={!!processing}
                    className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
                  >
                    <Split className="w-4 h-4" /> Activate Diversion
                  </button>

                  {incident.status !== "cleared" && (
                    <button
                      onClick={() =>
                        updateIncidentStatus(
                          incident.id,
                          incident.status === "active" ? "clearing" : "cleared",
                        )
                      }
                      disabled={!!processing}
                      className="ml-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
                    >
                      {incident.status === "active"
                        ? "Mark Clearing"
                        : "Mark Cleared"}
                    </button>
                  )}
                </div>
              )}

              {/* Driver Details Card */}
              {incident.interventions?.includes("tow") && incident.driver && (
                <div className="mt-4 bg-slate-800/60 rounded-lg p-3 border border-cyan-500/30 flex items-center justify-between animate-fade-in-up">
                  <div className="flex items-center space-x-3">
                    <div className="bg-cyan-500/20 p-2 rounded-full">
                      <Truck className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-cyan-400 text-xs font-bold uppercase tracking-wider">
                        Dispatched Unit
                      </div>
                      <div className="text-white font-semibold">
                        {incident.driver.name}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {incident.driver.vehicle} • ⭐{" "}
                        {incident.driver.rating || "4.8"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">5 min</div>
                    <div className="text-slate-500 text-xs">ETA</div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* New Incident Form */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Report New Incident
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={newIncidentType}
            onChange={(e) => setNewIncidentType(e.target.value)}
            className="bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="">Select Type</option>
            <option value="accident_minor">Accident (Minor)</option>
            <option value="accident_major">Accident (Major)</option>
            <option value="flooding">Flooding</option>
            <option value="breakdown">Breakdown</option>
            <option value="construction">Construction</option>
          </select>
          <input
            type="text"
            value={newIncidentLocation}
            onChange={(e) => setNewIncidentLocation(e.target.value)}
            placeholder="Location"
            className="bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={reportNewIncident}
            disabled={!!processing}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {processing === "new" ? "Reporting..." : "Report Incident"}
          </button>
        </div>
      </div>
    </div>
  );
}
