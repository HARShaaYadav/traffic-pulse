"use client";

import { useState, useEffect } from "react";
import {
  Send,
  MessageSquare,
  Radio,
  Bell,
  CheckCircle,
  Loader2,
} from "lucide-react";

interface Alert {
  id: string;
  type: "sms" | "push" | "vms";
  message: string;
  timestamp: string;
  status: "sent" | "delivered" | "failed";
  recipients: number;
  priority?: string;
}

interface Stats {
  smsSent: number;
  pushSent: number;
  vmsActive: number;
}

export default function PublicAlertSystem() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState<Stats>({
    smsSent: 0,
    pushSent: 0,
    vmsActive: 0,
  });
  const [newType, setNewType] = useState("sms");
  const [newPriority, setNewPriority] = useState("high");
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");

  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedDriver, setSelectedDriver] = useState("");

  useEffect(() => {
    fetchAlerts();
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contacts");
      const data = await res.json();
      // Filter for drivers if role exists, or just show all
      const drivers =
        data.contacts?.filter(
          (c: any) => c.role === "driver" || c.role === "Driver",
        ) || [];
      // If no drivers found, maybe show all for demo purposes or empty
      setContacts(drivers.length > 0 ? drivers : data.contacts || []);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await fetch("/api/public-alerts");
      const data = await res.json();
      setAlerts(data.alerts || []);
      setStats(
        data.stats || {
          smsSent: 0,
          pushSent: 0,
          vmsActive: 0,
        },
      );
    } catch (error) {
      console.error("Failed to fetch public alerts:", error);
    }
  };

  const sendAlert = async () => {
    if (!newMessage.trim()) return;
    if (newType === "sms" && !selectedDriver) {
      alert("Please select a driver for SMS alert");
      return;
    }

    setSending(true);
    setSuccess("");
    try {
      const res = await fetch("/api/public-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: newType,
          message: newMessage,
          priority: newPriority,
          contactId: newType === "sms" ? selectedDriver : undefined,
          senderId: localStorage.getItem("trafficpulse_client_id") || "unknown",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(`Alert sent successfully!`);
        setNewMessage("");
        fetchAlerts(); // Refresh the list
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      console.error("Failed to send alert:", error);
    }
    setSending(false);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "sms":
        return <MessageSquare className="w-5 h-5" />;
      case "push":
        return <Bell className="w-5 h-5" />;
      default:
        return <Send className="w-5 h-5" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "sms":
        return "border-green-500 bg-green-500/10";
      case "push":
        return "border-blue-500 bg-blue-500/10";
      default:
        return "border-slate-500 bg-slate-500/10";
    }
  };

  const formatNumber = (n: number) => {
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white font-space-grotesk mb-2">
          Public Alert System
        </h1>
        <p className="text-slate-400">
          Multi-channel communication for real-time traffic alerts and
          recommendations
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="w-6 h-6 text-green-400" />
            <span className="text-2xl font-bold text-white">
              {formatNumber(stats.smsSent)}
            </span>
          </div>
          <div className="text-slate-400 text-sm">SMS Sent Today</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <Bell className="w-6 h-6 text-blue-400" />
            <span className="text-2xl font-bold text-white">
              {formatNumber(stats.pushSent)}
            </span>
          </div>
          <div className="text-slate-400 text-sm">Push Notifications</div>
        </div>
      </div>

      {/* Create New Alert */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Create New Alert</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2">
                Alert Type
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
              >
                <option value="sms">SMS to Driver</option>
                <option value="push">App Notification</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2">
                Priority
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {newType === "sms" && (
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2">
                Select Driver
              </label>
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
              >
                <option value="">Select a driver...</option>
                {contacts.length > 0 ? (
                  contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone || c.email})
                    </option>
                  ))
                ) : (
                  <option disabled>No drivers available</option>
                )}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">
              Message{" "}
              <span className="text-slate-600">({newMessage.length}/280)</span>
            </label>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500 h-24"
              placeholder="Enter alert message..."
              maxLength={280}
            />
          </div>

          {success && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>{success}</span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <button
              onClick={sendAlert}
              disabled={!newMessage.trim() || sending}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition flex items-center space-x-2 disabled:opacity-50"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{sending ? "Sending..." : "Send Alert"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alert History */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Recent Alerts ({alerts.length})
        </h2>
        {alerts.length === 0 ? (
          <p className="text-slate-400 text-center py-8">
            No alerts sent yet. Create your first alert above!
          </p>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-lg border-2 p-4 ${getAlertColor(alert.type)} animate-slide-up`}
                data-testid={`alert-${alert.id}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getAlertIcon(alert.type)}
                    <span className="text-white font-semibold uppercase text-sm">
                      {alert.type}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-400">
                      {alert.status}
                    </span>
                  </div>
                </div>
                <p className="text-slate-200 text-sm mb-2">{alert.message}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Recipients: {alert.recipients.toLocaleString()}</span>
                  <span>ID: {alert.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
