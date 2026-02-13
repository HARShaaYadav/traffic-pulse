"use client";

import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  CheckCircle,
  Users,
  Trash2,
  Plus,
  Phone,
  Mail,
  Shield,
} from "lucide-react";

interface SettingsData {
  alertThreshold: number;
  criticalThreshold: number;
  refreshInterval: number;
  autoIntervene: boolean;
  maxConcurrentInterventions: number;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    sound: boolean;
  };
  mapStyle: string;
  showHeatmap: boolean;
  showIncidents: boolean;
  weatherIntegration: boolean;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  type: string;
}

const defaultSettings: SettingsData = {
  alertThreshold: 65,
  criticalThreshold: 85,
  refreshInterval: 30,
  autoIntervene: false,
  maxConcurrentInterventions: 3,
  notifications: {
    email: true,
    sms: false,
    push: true,
    sound: true,
  },
  mapStyle: "dark",
  showHeatmap: true,
  showIncidents: true,
  weatherIntegration: true,
};

export default function Settings() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    role: "stakeholder",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
    fetchContacts();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.settings) {
        setSettings({ ...defaultSettings, ...data.settings });
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
    setLoading(false);
  };

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contacts");
      const data = await res.json();
      if (data.contacts) setContacts(data.contacts);
    } catch (error) {
      console.error("Failed to fetch contacts", error);
    }
  };

  const addContact = async () => {
    if (!newContact.name || (!newContact.phone && !newContact.email))
      return alert("Name and Phone or Email required");
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContact),
      });
      const data = await res.json();
      if (data.success) {
        setContacts([...contacts, data.contact]);
        setNewContact({ name: "", phone: "", email: "", role: "stakeholder" });
      }
    } catch (error) {
      console.error("Failed to add contact", error);
    }
  };

  const deleteContact = async (id: string) => {
    // Optimistic update for better UX
    const originalContacts = [...contacts];
    setContacts(contacts.filter((c) => c.id !== id));

    try {
      const res = await fetch(`/api/contacts?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      console.error("Failed to delete contact", error);
      // Revert changes if API fails
      setContacts(originalContacts);
      // Optional: Add a toast notification here if you have a toast component
      alert("Failed to delete contact. Please try again.");
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
    setSaving(false);
  };

  const resetDefaults = async () => {
    setSettings(defaultSettings);
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defaultSettings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to reset settings:", error);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 mx-auto mb-4"></div>
        <p className="text-slate-400">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-space-grotesk mb-2">
            System Settings
          </h1>
          <p className="text-slate-400">
            Configure thresholds, notifications, and emergency contacts
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={resetDefaults}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-6 py-2 rounded-lg font-semibold transition flex items-center space-x-2 disabled:opacity-50"
          >
            {saved ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>
              {saved ? "Saved!" : saving ? "Saving..." : "Save Settings"}
            </span>
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Emergency Contacts Section */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Users className="w-5 h-5 text-cyan-400" />
          <span>Emergency & Alert Contacts</span>
        </h2>
        <div className="space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
              <div>
                <label className="text-xs text-slate-400">Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                  value={newContact.name}
                  onChange={(e) =>
                    setNewContact({ ...newContact, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Phone</label>
                <input
                  type="text"
                  placeholder="+91..."
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                  value={newContact.phone}
                  onChange={(e) =>
                    setNewContact({ ...newContact, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Email</label>
                <input
                  type="text"
                  placeholder="email@org.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                  value={newContact.email}
                  onChange={(e) =>
                    setNewContact({ ...newContact, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Role</label>
                <select
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                  value={newContact.role}
                  onChange={(e) =>
                    setNewContact({ ...newContact, role: e.target.value })
                  }
                >
                  <option value="stakeholder">Stakeholder</option>
                  <option value="fleet_manager">Fleet Manager</option>
                  <option value="driver">Driver</option>
                  <option value="transport_admin">Transport Admin</option>
                  <option value="emergency_services">Emergency Services</option>
                </select>
              </div>
              <button
                onClick={addContact}
                className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Contact</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-500">
                      No contacts added yet.
                    </td>
                  </tr>
                ) : (
                  contacts.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30"
                    >
                      <td className="py-3 font-medium text-white">{c.name}</td>
                      <td className="py-3 space-y-1">
                        {c.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-cyan-400" />{" "}
                            {c.phone}
                          </div>
                        )}
                        {c.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-violet-400" />{" "}
                            {c.email}
                          </div>
                        )}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-1 bg-slate-800 rounded text-xs capitalize text-slate-300 border border-slate-700">
                          {c.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => deleteContact(c.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Alert Thresholds */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <SettingsIcon className="w-5 h-5 text-violet-400" />
          <span>Alert Thresholds</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">
              Warning Threshold:{" "}
              <span className="text-yellow-400">
                {settings.alertThreshold}%
              </span>
            </label>
            <input
              type="range"
              min="30"
              max="90"
              value={settings.alertThreshold}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  alertThreshold: parseInt(e.target.value),
                })
              }
              className="w-full accent-yellow-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>30%</span>
              <span>90%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">
              Critical Threshold:{" "}
              <span className="text-red-400">
                {settings.criticalThreshold}%
              </span>
            </label>
            <input
              type="range"
              min="50"
              max="95"
              value={settings.criticalThreshold}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  criticalThreshold: parseInt(e.target.value),
                })
              }
              className="w-full accent-red-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>50%</span>
              <span>95%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">
              Refresh Interval:{" "}
              <span className="text-cyan-400">{settings.refreshInterval}s</span>
            </label>
            <input
              type="range"
              min="10"
              max="120"
              step="5"
              value={settings.refreshInterval}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  refreshInterval: parseInt(e.target.value),
                })
              }
              className="w-full accent-cyan-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>10s</span>
              <span>120s</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">
              Max Concurrent Interventions:{" "}
              <span className="text-violet-400">
                {settings.maxConcurrentInterventions}
              </span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={settings.maxConcurrentInterventions}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maxConcurrentInterventions: parseInt(e.target.value),
                })
              }
              className="w-full accent-violet-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Notifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-slate-800 rounded-lg"
            >
              <span className="text-white capitalize">{key}</span>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, [key]: !value },
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  value ? "bg-green-600" : "bg-slate-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    value ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Map Settings */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Map Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">
              Map Style
            </label>
            <select
              value={settings.mapStyle}
              onChange={(e) =>
                setSettings({ ...settings, mapStyle: e.target.value })
              }
              className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-violet-500"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="satellite">Satellite</option>
            </select>
          </div>
          <div className="space-y-3">
            {[
              { key: "showHeatmap", label: "Show Heatmap" },
              { key: "showIncidents", label: "Show Incidents" },
              { key: "weatherIntegration", label: "Weather Integration" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between p-2">
                <span className="text-slate-300 text-sm">{label}</span>
                <button
                  onClick={() =>
                    setSettings({ ...settings, [key]: !(settings as any)[key] })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    (settings as any)[key] ? "bg-green-600" : "bg-slate-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      (settings as any)[key] ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
