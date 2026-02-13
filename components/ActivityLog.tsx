"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Search,
  Filter,
  ArrowRight,
  Clock,
  User,
  Shield,
  Zap,
  Radio,
  Siren,
  AlertOctagon,
} from "lucide-react";

export default function ActivityLog() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 10000);
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
    setLoading(false);
  };

  const filteredActivities = activities.filter((act) => {
    const matchesFilter = filter === "all" || act.type === filter;
    const matchesSearch =
      act.title.toLowerCase().includes(search.toLowerCase()) ||
      act.details.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-space-grotesk mb-2 flex items-center">
            <Activity className="w-8 h-8 mr-3 text-violet-500" />
            System Activity Log
          </h1>
          <p className="text-slate-400">
            Comprehensive timeline of all automated and manual interventions
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4 bg-[#0f0f28]/60 p-2 rounded-xl border border-violet-500/15">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#0a0a1a]/80 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500 w-64 transition-colors"
            />
          </div>
          <div className="h-6 w-px bg-slate-700"></div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#0a0a1a]/80 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
          >
            <option value="all">All Activities</option>
            <option value="dispatch">Dispatches</option>
            <option value="decision">Interventions</option>
            <option value="signal">Signals</option>
            <option value="emergency">Emergency</option>
            <option value="incident">Incidents</option>
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="grid grid-cols-1 gap-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((act) => (
            <div
              key={act.id}
              className="group relative bg-[#0f0f28]/40 backdrop-blur-sm rounded-xl p-6 border border-violet-500/10 hover:border-violet-500/30 transition-all duration-300 hover:bg-[#0f0f28]/60"
            >
              <div className="flex items-start gap-4">
                {/* Icon Column */}
                <div className="relative">
                  <div
                    className={`p-3 rounded-xl ${
                      act.type === "decision"
                        ? act.action === "accepted"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                        : act.type === "signal"
                          ? "bg-amber-500/10 text-amber-500"
                          : act.type === "emergency"
                            ? "bg-red-500/10 text-red-500"
                            : act.type === "incident"
                              ? "bg-orange-500/10 text-orange-500"
                              : "bg-blue-500/10 text-blue-500"
                    }`}
                  >
                    {act.type === "decision" ? (
                      act.action === "accepted" ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <TrendingUp className="w-6 h-6 rotate-180" />
                      )
                    ) : act.type === "signal" ? (
                      <Radio className="w-6 h-6" />
                    ) : act.type === "emergency" ? (
                      <Siren className="w-6 h-6" />
                    ) : act.type === "incident" ? (
                      <AlertOctagon className="w-6 h-6" />
                    ) : (
                      <Zap className="w-6 h-6" />
                    )}
                  </div>
                  {/* Connector Line */}
                  <div className="absolute top-14 left-1/2 -translate-x-1/2 bottom-[-24px] w-px bg-slate-800 group-last:hidden"></div>
                </div>

                {/* Content Column */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white font-space-grotesk">
                      {act.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(act.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#0a0a1a]/50 rounded-lg p-3 border border-slate-800">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">
                        Details
                      </p>
                      <p className="text-slate-300 text-sm">{act.details}</p>
                    </div>
                    <div className="bg-[#0a0a1a]/50 rounded-lg p-3 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">
                          Status
                        </p>
                        <span
                          className={`text-sm font-bold capitalize ${
                            act.action === "accepted" ||
                            act.action === "sent" ||
                            act.action === "completed" ||
                            act.action === "cleared"
                              ? "text-green-400"
                              : act.action === "failed" ||
                                  act.action === "rejected" ||
                                  act.action === "active" ||
                                  act.action === "override"
                                ? "text-red-400"
                                : act.action === "plan_change"
                                  ? "text-amber-400"
                                  : "text-slate-400"
                          }`}
                        >
                          {act.action}
                        </span>
                      </div>
                      {act.type === "dispatch" && (
                        <div className="text-right">
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">
                            Channel
                          </p>
                          <span className="text-sm font-bold text-blue-400 flex items-center justify-end gap-1">
                            <Shield className="w-3 h-3" /> SMS / System
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User / Actor Info (Mock for now, could be real user later) */}
                  <div className="mt-3 flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center">
                      <User className="w-3 h-3 text-slate-400" />
                    </div>
                    <span className="text-xs text-slate-500">
                      Action performed by System/Operator
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-[#0f0f28]/40 border border-slate-800 rounded-xl">
            <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">
              No activities found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
