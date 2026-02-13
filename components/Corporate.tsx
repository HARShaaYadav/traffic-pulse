"use client";

import { useState, useEffect } from "react";
import {
  Truck,
  Utensils,
  Car,
  Bike,
  AlertTriangle,
  MapPin,
  TrendingUp,
  ShieldAlert,
  Zap,
  Box,
  ShoppingBag,
  Bus,
  Users,
  Building,
  Briefcase,
  Clock,
  Calendar,
  BarChart,
  PieChart,
  ArrowRight,
} from "lucide-react";

// --- Types ---

interface LogisticPartner {
  id: string;
  name: string;
  type: "food" | "ride" | "delivery";
  icon: any;
  color: string;
  activeFleet: number;
  avgDelay: number;
  surgeMultiplier: number;
  compliance: number;
  status: "normal" | "stressed" | "critical";
}

interface ZoneControl {
  id: string;
  name: string;
  stress: number;
  actions: {
    suspendDelivery: boolean;
    forceSurge: boolean;
    evOnly: boolean;
  };
}

interface Shuttle {
  id: string;
  route: string;
  company: string;
  status: "on_time" | "delayed" | "arrived";
  occupancy: number;
  eta: number;
}

interface ShiftData {
  name: string;
  time: string;
  employees: number;
  color: string;
}

// --- Main Component ---

export default function CorporateCommandCenter() {
  const [activeSection, setActiveSection] = useState<
    "logistics" | "commute" | "policy" | "shifts"
  >("logistics");
  const [loading, setLoading] = useState(true);

  // -- Logistics State --
  const [partners, setPartners] = useState<LogisticPartner[]>([]);
  const [zones, setZones] = useState<ZoneControl[]>([]);

  // -- Commute State --
  const [shuttles, setShuttles] = useState<Shuttle[]>([]);
  const [carpoolStats, setCarpoolStats] = useState({
    active: 1240,
    savedTrips: 850,
    co2Saved: 2.4,
  });

  // -- Policy State --
  const [trafficStress, setTrafficStress] = useState(78); // Mock global stress
  const [wfhPolicy, setWfhPolicy] = useState<"hybrid" | "remote" | "office">(
    "hybrid",
  );
  const [highTrafficAlert, setHighTrafficAlert] = useState(false);

  // -- Shift State --
  const [shifts, setShifts] = useState<ShiftData[]>([
    {
      name: "Early Bird",
      time: "07:00 - 15:00",
      employees: 1200,
      color: "bg-blue-500",
    },
    {
      name: "Regular",
      time: "09:00 - 17:00",
      employees: 3500,
      color: "bg-purple-500",
    },
    {
      name: "Late Start",
      time: "11:00 - 19:00",
      employees: 1800,
      color: "bg-orange-500",
    },
  ]);

  useEffect(() => {
    // Simulate real-time data fetch
    const timer = setTimeout(() => {
      // Logistics Data
      setPartners([
        {
          id: "swiggy",
          name: "Swiggy",
          type: "food",
          icon: Utensils,
          color: "text-orange-500",
          activeFleet: 2450,
          avgDelay: 12,
          surgeMultiplier: 1.2,
          compliance: 94,
          status: "normal",
        },
        {
          id: "zomato",
          name: "Zomato",
          type: "food",
          icon: Utensils,
          color: "text-red-500",
          activeFleet: 2100,
          avgDelay: 15,
          surgeMultiplier: 1.4,
          compliance: 91,
          status: "stressed",
        },
        {
          id: "uber",
          name: "Uber",
          type: "ride",
          icon: Car,
          color: "text-white",
          activeFleet: 1800,
          avgDelay: 8,
          surgeMultiplier: 2.1,
          compliance: 88,
          status: "critical",
        },
        {
          id: "ola",
          name: "Ola",
          type: "ride",
          icon: Car,
          color: "text-yellow-400",
          activeFleet: 1650,
          avgDelay: 10,
          surgeMultiplier: 1.8,
          compliance: 85,
          status: "stressed",
        },
        {
          id: "porter",
          name: "Porter",
          type: "delivery",
          icon: Truck,
          color: "text-blue-400",
          activeFleet: 450,
          avgDelay: 5,
          surgeMultiplier: 1.0,
          compliance: 98,
          status: "normal",
        },
        {
          id: "zepto",
          name: "Zepto",
          type: "delivery",
          icon: ShoppingBag,
          color: "text-purple-400",
          activeFleet: 800,
          avgDelay: 2,
          surgeMultiplier: 1.1,
          compliance: 96,
          status: "normal",
        },
      ]);

      setZones([
        {
          id: "bellandur",
          name: "Bellandur - ORR",
          stress: 85,
          actions: { suspendDelivery: false, forceSurge: true, evOnly: false },
        },
        {
          id: "marathahalli",
          name: "Marathahalli Bridge",
          stress: 92,
          actions: { suspendDelivery: true, forceSurge: true, evOnly: true },
        },
        {
          id: "silkboard",
          name: "Silk Board Junction",
          stress: 78,
          actions: { suspendDelivery: false, forceSurge: true, evOnly: false },
        },
        {
          id: "whitefield",
          name: "Whitefield Main Rd",
          stress: 45,
          actions: { suspendDelivery: false, forceSurge: false, evOnly: false },
        },
      ]);

      // Commute Data
      setShuttles([
        {
          id: "S-101",
          route: "Silk Board -> Ecospace",
          company: "Intel",
          status: "delayed",
          occupancy: 85,
          eta: 15,
        },
        {
          id: "S-104",
          route: "Marathahalli -> Prestige",
          company: "Cisco",
          status: "on_time",
          occupancy: 92,
          eta: 5,
        },
        {
          id: "S-202",
          route: "Koramangala -> Embasy",
          company: "Wells Fargo",
          status: "arrived",
          occupancy: 0,
          eta: 0,
        },
        {
          id: "S-305",
          route: "Indiranagar -> Bagmane",
          company: "Google",
          status: "on_time",
          occupancy: 60,
          eta: 8,
        },
      ]);

      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleZoneAction = (
    zoneId: string,
    action: keyof ZoneControl["actions"],
  ) => {
    setZones(
      zones.map((z) =>
        z.id === zoneId
          ? { ...z, actions: { ...z.actions, [action]: !z.actions[action] } }
          : z,
      ),
    );
  };

  const handlePolicyChange = (policy: "hybrid" | "remote" | "office") => {
    setWfhPolicy(policy);
    // In real app, this would trigger an API call to notify HR systems
    alert(
      `Protocol Initiated: ${policy.toUpperCase()} Work Policy applied to variable workforce.`,
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500" />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-space-grotesk mb-2">
            Corporate Command Center
          </h1>
          <p className="text-slate-400">
            Integrated traffic management for Logistics, Fleets, and Employee
            Commute.
          </p>
        </div>
        <div className="flex bg-slate-800/50 p-1 rounded-lg">
          {(["logistics", "commute", "policy", "shifts"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveSection(tab)}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition capitalize ${
                  activeSection === tab
                    ? "bg-cyan-500 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ),
          )}
        </div>
      </div>

      {/* --- LOGISTICS TAB --- */}
      {activeSection === "logistics" && (
        <div className="space-y-6 animate-fade-in">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-slate-400 text-sm">Active Fleet</h3>
                <Bike className="text-cyan-400 w-5 h-5" />
              </div>
              <div className="text-3xl font-bold text-white">
                {partners
                  .reduce((s, p) => s + p.activeFleet, 0)
                  .toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-slate-400 text-sm">Avg Surge</h3>
                <TrendingUp className="text-orange-400 w-5 h-5" />
              </div>
              <div className="text-3xl font-bold text-white">
                {(
                  partners.reduce((s, p) => s + p.surgeMultiplier, 0) /
                  partners.length
                ).toFixed(1)}
                x
              </div>
            </div>
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-slate-400 text-sm">Zone Limits</h3>
                <ShieldAlert className="text-red-400 w-5 h-5" />
              </div>
              <div className="text-3xl font-bold text-white">
                {
                  zones.filter(
                    (z) => z.actions.suspendDelivery || z.actions.evOnly,
                  ).length
                }
              </div>
            </div>
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-slate-400 text-sm">Compliance</h3>
                <Zap className="text-green-400 w-5 h-5" />
              </div>
              <div className="text-3xl font-bold text-white">92%</div>
            </div>
          </div>

          {/* Partner Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {partners.map((p) => (
              <div
                key={p.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-cyan-500/50 transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-lg bg-slate-800 ${p.color}`}>
                      <p.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{p.name}</h3>
                      <span className="text-xs text-slate-400 capitalize">
                        {p.type}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${p.status === "normal" ? "bg-green-500/20 text-green-400" : p.status === "stressed" ? "bg-orange-500/20 text-orange-400" : "bg-red-500/20 text-red-400"}`}
                  >
                    {p.status.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="bg-slate-800 rounded p-2">
                    <div className="text-slate-400 text-xs">Fleet</div>
                    <div className="font-bold text-white">{p.activeFleet}</div>
                  </div>
                  <div className="bg-slate-800 rounded p-2">
                    <div className="text-slate-400 text-xs">Surge</div>
                    <div className="font-bold text-orange-400">
                      {p.surgeMultiplier}x
                    </div>
                  </div>
                  <div className="bg-slate-800 rounded p-2">
                    <div className="text-slate-400 text-xs">Delay</div>
                    <div className="font-bold text-red-400">+{p.avgDelay}m</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Zone Controls */}
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <MapPin className="text-cyan-400" /> Zone Controls
            </h2>
            <div className="space-y-3">
              {zones.map((z) => (
                <div
                  key={z.id}
                  className="bg-slate-800/50 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white">{z.name}</h3>
                      <span
                        className={`text-xs px-2 rounded ${z.stress > 80 ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
                      >
                        {z.stress}% Stress
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleZoneAction(z.id, "suspendDelivery")}
                      className={`px-3 py-1.5 rounded text-sm font-semibold transition ${z.actions.suspendDelivery ? "bg-red-500 text-white" : "bg-slate-700 text-slate-300"}`}
                    >
                      Suspend Orders
                    </button>
                    <button
                      onClick={() => toggleZoneAction(z.id, "forceSurge")}
                      className={`px-3 py-1.5 rounded text-sm font-semibold transition ${z.actions.forceSurge ? "bg-orange-500 text-white" : "bg-slate-700 text-slate-300"}`}
                    >
                      Force Surge
                    </button>
                    <button
                      onClick={() => toggleZoneAction(z.id, "evOnly")}
                      className={`px-3 py-1.5 rounded text-sm font-semibold transition ${z.actions.evOnly ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"}`}
                    >
                      EV Only
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- COMMUTE TAB --- */}
      {activeSection === "commute" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h3 className="text-slate-400 text-sm mb-1">Active Shuttles</h3>
              <div className="text-3xl font-bold text-white flex items-center gap-2">
                <Bus className="text-cyan-400" /> {shuttles.length}
              </div>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h3 className="text-slate-400 text-sm mb-1">
                Carpool Active Users
              </h3>
              <div className="text-3xl font-bold text-white flex items-center gap-2">
                <Users className="text-green-400" /> {carpoolStats.active}
              </div>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h3 className="text-slate-400 text-sm mb-1">CO2 Saved Today</h3>
              <div className="text-3xl font-bold text-white flex items-center gap-2">
                <Building className="text-emerald-400" />{" "}
                {carpoolStats.co2Saved}T
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Shuttle Status
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-700">
                    <th className="pb-3 pl-2">Shuttle ID</th>
                    <th className="pb-3">Route</th>
                    <th className="pb-3">Company</th>
                    <th className="pb-3">Occupancy</th>
                    <th className="pb-3">ETA</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {shuttles.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-slate-800 hover:bg-slate-800/50"
                    >
                      <td className="py-3 pl-2 font-mono text-cyan-400">
                        {s.id}
                      </td>
                      <td className="py-3">{s.route}</td>
                      <td className="py-3 font-semibold text-white">
                        {s.company}
                      </td>
                      <td className="py-3">
                        <div className="w-24 bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full ${s.occupancy > 90 ? "bg-red-500" : "bg-green-500"}`}
                            style={{ width: `${s.occupancy}%` }}
                          />
                        </div>
                        <span className="text-xs ml-1">{s.occupancy}%</span>
                      </td>
                      <td className="py-3 font-mono">
                        {s.eta > 0 ? `${s.eta} min` : "Arrived"}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${s.status === "delayed" ? "bg-red-500/20 text-red-400" : s.status === "on_time" ? "bg-green-500/20 text-green-400" : "bg-slate-600"}`}
                        >
                          {s.status.replace("_", " ").toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- POLICY TAB --- */}
      {activeSection === "policy" && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-red-900/50 to-slate-900 p-8 rounded-xl border border-red-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <ShieldAlert className="text-red-400" /> Current Traffic Stress
              </h2>
              <p className="text-slate-300">
                Real-time aggregate stress across the ORR corridor.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-1">
                {trafficStress}%
              </div>
              <div className="text-red-400 font-semibold">CRITICAL LEVEL</div>
            </div>
            <div className="w-full md:w-1/3">
              <div className="text-xs text-slate-400 mb-1 flex justify-between">
                <span>Normal</span>
                <span>Critical</span>
              </div>
              <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                  style={{ width: `${trafficStress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h2 className="text-xl font-bold text-white mb-6">
              Remote Work Protocols
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  id: "office",
                  title: "Office Mandatory",
                  desc: "Standard operations. All employees expected in office.",
                  color: "bg-green-500",
                },
                {
                  id: "hybrid",
                  title: "Flexible / Hybrid",
                  desc: "Optional WFH encouraged for non-essential staff.",
                  color: "bg-yellow-500",
                },
                {
                  id: "remote",
                  title: "Mandatory Remote",
                  desc: "CRITICAL: Full remote work declared to reduce load.",
                  color: "bg-red-500",
                },
              ].map((policy) => (
                <button
                  key={policy.id}
                  onClick={() => handlePolicyChange(policy.id as any)}
                  className={`p-6 rounded-xl border-2 text-left transition relative overflow-hidden group ${
                    wfhPolicy === policy.id
                      ? `${policy.color} border-transparent`
                      : "border-slate-700 hover:border-slate-500 bg-slate-800/50"
                  }`}
                >
                  <div className="relative z-10">
                    <h3
                      className={`font-bold text-lg mb-2 ${wfhPolicy === policy.id ? "text-white" : "text-slate-200"}`}
                    >
                      {policy.title}
                    </h3>
                    <p
                      className={`text-sm ${wfhPolicy === policy.id ? "text-white/90" : "text-slate-400"}`}
                    >
                      {policy.desc}
                    </p>
                  </div>
                  {wfhPolicy === policy.id && (
                    <div className="absolute right-4 top-4 bg-white/20 p-2 rounded-full">
                      <Briefcase className="text-white w-6 h-6" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">
                Declare High Traffic Day
              </h3>
              <p className="text-slate-400 text-sm">
                Sends emergency alerts to all HR admins and Transport Managers.
              </p>
            </div>
            <button
              onClick={() => {
                setHighTrafficAlert(!highTrafficAlert);
                alert(
                  highTrafficAlert
                    ? "Alert Cancelled"
                    : "High Traffic Alert Broadcasted!",
                );
              }}
              className={`px-6 py-3 rounded-lg font-bold text-white transition flex items-center gap-2 ${highTrafficAlert ? "bg-red-600 animate-pulse" : "bg-slate-700 hover:bg-slate-600"}`}
            >
              <AlertTriangle className="w-5 h-5" />
              {highTrafficAlert ? "BROADCASTING ALERT" : "Broadcast H.T. Alert"}
            </button>
          </div>
        </div>
      )}

      {/* --- SHIFTS TAB --- */}
      {activeSection === "shifts" && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h2 className="text-xl font-bold text-white mb-6">
              Shift Distribution Analysis
            </h2>
            <div className="space-y-6">
              {shifts.map((shift, i) => (
                <div key={i} className="relative">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <h4 className="font-bold text-white text-lg">
                        {shift.name}
                      </h4>
                      <span className="text-slate-400 text-sm font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {shift.time}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        {shift.employees.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500">Employees</div>
                    </div>
                  </div>
                  <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${shift.color}`}
                      style={{ width: `${(shift.employees / 6500) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 p-8 rounded-xl border border-indigo-500/30">
            <h3 className="text-xl font-bold text-white mb-2">
              Recommendation Engine
            </h3>
            <p className="text-slate-300 mb-6">
              AI analysis suggests staggering the "Regular" shift by 30 minutes
              to reduce peak bottleneck at 09:00 AM.
            </p>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <span className="text-xs text-slate-500 uppercase font-bold">
                  Current Peak Load
                </span>
                <div className="text-3xl font-bold text-red-400 mt-1">
                  4,200{" "}
                  <span className="text-sm text-slate-400">vehicles/hr</span>
                </div>
              </div>
              <div className="flex items-center justify-center text-slate-500">
                <ArrowRight className="w-6 h-6" />
              </div>
              <div className="flex-1 bg-green-900/20 p-4 rounded-lg border border-green-500/30">
                <span className="text-xs text-green-400 uppercase font-bold">
                  Predicted Load
                </span>
                <div className="text-3xl font-bold text-green-400 mt-1">
                  3,650{" "}
                  <span className="text-sm text-green-400/70">vehicles/hr</span>
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                alert("Shift adjustments sent to HR systems for approval.")
              }
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition"
            >
              Apply Recommended Schedule
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
