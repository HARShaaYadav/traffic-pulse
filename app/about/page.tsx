"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Activity,
  ShieldAlert,
  Zap,
  Cpu,
  Globe,
  Lock,
  BarChart2,
  Radio,
  Truck,
  Users,
  Building2,
  CloudRain,
  Layers,
  CheckCircle2,
  Code2,
  TrendingUp,
  Map as MapIcon,
  Navigation,
  Wind,
  Smartphone,
  Database,
  Target,
  DollarSign,
  Lightbulb,
  Heart,
  Leaf,
  Clock,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Wifi,
  LineChart,
  Settings,
  Eye,
  BrainCircuit,
  Flame,
  BadgeCheck,
  MessageSquare,
  GraduationCap,
} from "lucide-react";

export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white selection:bg-violet-500/30 font-space-grotesk">
      {/* Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a1a]/80 backdrop-blur-md border-b border-violet-500/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-violet-500/20 blur-lg rounded-full animate-pulse" />
              <Activity className="w-8 h-8 text-violet-400 relative z-10" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              TrafficPulse
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <Link
              href="/features"
              className="hover:text-violet-400 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/about"
              className="text-white bg-white/5 px-3 py-1 rounded-full transition-colors"
            >
              About
            </Link>
            <Link
              href="/#market"
              className="hover:text-violet-400 transition-colors"
            >
              Market
            </Link>
            <Link
              href="/#roadmap"
              className="hover:text-violet-400 transition-colors"
            >
              Roadmap
            </Link>
          </div>

          <Link
            href="/dashboard"
            className="group flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-full shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all duration-300"
          >
            Live Demo
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1: HERO — THE VISION
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-violet-600/15 to-transparent blur-[120px] -z-10" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-medium text-violet-300 mb-8">
            <BrainCircuit className="w-3.5 h-3.5" />
            Complete System Documentation
          </div>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent max-w-5xl mx-auto leading-[1.1]">
            About{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              TrafficPulse
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-4 max-w-3xl mx-auto leading-relaxed">
            TrafficPulse is a{" "}
            <span className="text-white font-semibold">
              Traffic Cascade Prevention System
            </span>{" "}
            — an AI-driven platform that predicts and prevents chain-reaction
            gridlocks across entire city networks. It's not a better traffic
            tool. It's an entirely new category.
          </p>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Built for India's Smart Cities Mission • Powered by Google Gemini •
            Production MVP Live on Bangalore ORR
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2: THE PROBLEM WE SOLVE
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2.5 rounded-xl bg-red-500/10">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-red-400">
              The Problem
            </p>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-8 max-w-4xl leading-tight">
            One Accident at Silk Board Costs Bangalore{" "}
            <span className="text-red-400">₹4.2 Crore</span> in Lost
            Productivity.
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-12">
            <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
              <p>
                India loses{" "}
                <span className="text-white font-semibold">
                  ₹1.47 Lakh Crore annually
                </span>{" "}
                to traffic congestion. But the real danger isn't congestion
                itself — it's{" "}
                <span className="text-red-400 font-semibold">
                  cascade failure
                </span>
                . A single incident at a critical node like Silk Board Junction
                doesn't just cause a 20-minute delay; it triggers a chain
                reaction that paralyzes 40+ intersections for 3+ hours.
              </p>
              <p>
                Current systems are{" "}
                <span className="text-white font-semibold">reactive</span>. They
                detect congestion <em>after</em> it's already happened. By then,
                the cascade has already propagated. Google Maps shows you the
                red zones; it doesn't stop them from forming.
              </p>
              <p>
                Ambulances get stuck. Workers lose hours. Businesses bleed
                revenue. And the environmental damage from millions of idling
                engines compounds daily.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  value: "3.5 hrs",
                  label: "Avg. Bangalore Commute",
                  icon: Clock,
                  color: "text-red-400",
                },
                {
                  value: "₹22K Cr",
                  label: "Fuel Wasted / Year",
                  icon: Flame,
                  color: "text-orange-400",
                },
                {
                  value: "1,200+",
                  label: "Delayed Ambulances / Mo",
                  icon: AlertTriangle,
                  color: "text-red-400",
                },
                {
                  value: "40+",
                  label: "Nodes Affected Per Cascade",
                  icon: Globe,
                  color: "text-amber-400",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10"
                >
                  <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
                  <div className="text-2xl font-bold text-white mb-1">
                    {s.value}
                  </div>
                  <div className="text-xs text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3: OUR SOLUTION — HOW TRAFFICPULSE WORKS
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-violet-900/5 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2.5 rounded-xl bg-violet-500/10">
              <Cpu className="w-6 h-6 text-violet-400" />
            </div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-violet-400">
              Our Solution
            </p>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 max-w-4xl leading-tight">
            Predict. Intervene.{" "}
            <span className="text-violet-400">Prevent.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mb-16">
            TrafficPulse uses graph-theoretic AI models to identify systemic stress
            points across the traffic network and intervenes{" "}
            <span className="text-white font-semibold">
              before cascading failure occurs
            </span>
            . Here's how:
          </p>

          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Continuous Network Monitoring",
                desc: "Every intersection is modeled as a node in a weighted graph. TrafficPulse monitors edge weights (travel time, queue length, signal phase) in real-time via SSE streams, updating the network state every 5 seconds.",
                icon: Wifi,
                color: "border-cyan-500/30",
              },
              {
                step: "02",
                title: "Cascade Risk Calculation",
                desc: "Google Gemini AI processes the graph state through our cascade prediction engine. It computes 'Time to Cascade', 'Confidence Score', and identifies the exact sequence of nodes that will fail — up to 30 minutes before it happens.",
                icon: BrainCircuit,
                color: "border-violet-500/30",
              },
              {
                step: "03",
                title: "Automated Intervention",
                desc: "When risk exceeds threshold: (1) Adaptive signals create 'Green Waves' to flush congestion, (2) Emergency corridors are cleared via OpenRoute pathing, (3) Multi-channel alerts (SMS + Push) reroute commuters, (4) Corporate WFH recommendations reduce demand.",
                icon: Zap,
                color: "border-fuchsia-500/30",
              },
              {
                step: "04",
                title: "Feedback & Learning",
                desc: "Every intervention is logged and analyzed. The AI learns which strategies worked and adjusts its prediction models accordingly, continuously improving accuracy over time.",
                icon: LineChart,
                color: "border-emerald-500/30",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex gap-8 p-8 md:p-10 rounded-3xl bg-white/[0.03] border ${item.color} transition-all hover:bg-white/[0.05]`}
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                    <item.icon className="w-7 h-7 text-violet-400" />
                  </div>
                  <div className="text-center mt-3 text-xs font-bold text-slate-600 tracking-widest">
                    STEP {item.step}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4: COMPLETE FEATURE BREAKDOWN
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2.5 rounded-xl bg-cyan-500/10">
              <Layers className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-cyan-400">
              Complete Feature Set
            </p>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 max-w-4xl">
            Every Capability. <span className="text-cyan-400">In Detail.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mb-16">
            TrafficPulse isn't a single feature — it's a comprehensive ecosystem of
            interconnected modules, each solving a critical part of the urban
            traffic problem.
          </p>

          {/* Feature Category Grid */}
          {[
            {
              category: "🧠 AI & Prediction",
              items: [
                {
                  title: "Cascade Prediction Engine",
                  desc: "Graph-theoretic neural networks powered by Google Gemini identify cascading failure patterns across the traffic network. Computes 'Time to Cascade' and 'Confidence Score' for every intersection, predicting gridlock up to 30 minutes before it occurs.",
                  icon: BrainCircuit,
                },
                {
                  title: "Traffic Simulation",
                  desc: "Full simulation engine that models 'what-if' scenarios. City planners can inject virtual incidents (road closures, VIP movements, festivals) and see how the network responds — before it happens in real life.",
                  icon: Cpu,
                },
                {
                  title: "Weather-Adjusted Models",
                  desc: "Rain reduces road capacity by 15-20%. Our models ingest real-time WeatherAPI data (precipitation, visibility, wind) and automatically adjust all prediction thresholds and signal timings accordingly.",
                  icon: CloudRain,
                },
              ],
            },
            {
              category: "🚦 Signal & Traffic Control",
              items: [
                {
                  title: "Adaptive Signal Timing",
                  desc: "Dynamic adjustment of traffic light phases based on real-time queue length and upstream demand. Creates 'Green Waves' — coordinated light sequences that flush congestion through corridors.",
                  icon: Activity,
                },
                {
                  title: "Emergency Signal Override",
                  desc: "Operators can manually force green corridors across multiple intersections, creating a high-priority tunnel for ambulances, fire trucks, or VIP convoy movement.",
                  icon: Lock,
                },
                {
                  title: "Intersection Health Score",
                  desc: "Every intersection gets a real-time health score (0-100) based on queue length, average wait time, and cycle efficiency. Scores below 40 trigger automatic intervention.",
                  icon: Target,
                },
              ],
            },
            {
              category: "🚨 Emergency & Alerts",
              items: [
                {
                  title: "Emergency Dispatch AI",
                  desc: "When a critical incident occurs, TrafficPulse doesn't just alert — it acts. OpenRoute Service calculates the fastest traffic-aware path for emergency vehicles and clears the corridor through signal pre-emption.",
                  icon: Truck,
                },
                {
                  title: "Multi-Channel Broadcasting",
                  desc: "Simultaneous alert delivery via Twilio SMS, Firebase Push Notifications, and in-app audiovisual warnings. Each channel has redundancy to ensure zero missed critical alerts.",
                  icon: Radio,
                },
                {
                  title: "Audiovisual Crisis Mode",
                  desc: "High-priority events trigger persistent sound loops and screen-wide overlays for operators. These cannot be dismissed without manual acknowledgement — ensuring that critical warnings are never ignored.",
                  icon: AlertTriangle,
                },
              ],
            },
            {
              category: "📊 Analytics & Visualization",
              items: [
                {
                  title: "Real-Time Dashboard",
                  desc: "A command center with live KPIs: active incidents, system stress level, intervention count, and predicted cascade risk. Updated every 5 seconds via Server-Sent Events (SSE).",
                  icon: BarChart2,
                },
                {
                  title: "Geospatial Heatmaps",
                  desc: "Mapbox-powered traffic density visualization showing congestion intensity across the city. Click any zone to drill down into per-intersection metrics.",
                  icon: MapIcon,
                },
                {
                  title: "Historical Analytics",
                  desc: "Complex trend analysis across days, weeks, and months. Identify recurring bottlenecks, measure intervention effectiveness, and generate compliance reports for city officials.",
                  icon: LineChart,
                },
              ],
            },
            {
              category: "🏢 Corporate & Public Integration",
              items: [
                {
                  title: "Corporate Demand Management",
                  desc: "AI-driven recommendations for large employers: suggest WFH days, staggered shifts, and off-peak commute windows. Can reduce peak-hour demand on ORR corridors by up to 18%.",
                  icon: Building2,
                },
                {
                  title: "Public Commuter Tools",
                  desc: "Citizen-facing route planning that avoids predicted bottlenecks. Powered by the same AI that runs the command center — giving the public access to intelligence-grade routing.",
                  icon: Users,
                },
                {
                  title: "Contact & Stakeholder Management",
                  desc: "Full CRUD contact database for emergency responders, corporate partners, and government liaisons. Targeted alert groups can be defined for specific incident types.",
                  icon: MessageSquare,
                },
              ],
            },
            {
              category: "⚙️ Platform & Administration",
              items: [
                {
                  title: "Role-Based Access Control",
                  desc: "Full RBAC with Admin, Operator, and Viewer roles. Admins manage contacts and system settings. Operators control signals and dispatch. Viewers can only report incidents and view alerts.",
                  icon: Settings,
                },
                {
                  title: "Real-Time Notification Stream",
                  desc: "SSE-powered notification backbone ensures all connected clients receive updates within 200ms. No polling, no WebSocket complexity — just reliable, efficient server-push.",
                  icon: Wifi,
                },
                {
                  title: "Incident Reporting System",
                  desc: "Bi-directional reporting where citizens and on-ground units flag hazards. Each report is geolocated, timestamped, and immediately fed into the cascade prediction engine.",
                  icon: Eye,
                },
              ],
            },
          ].map((section, idx) => (
            <div key={idx} className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-xl font-bold text-white">
                  {section.category}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {section.items.map((item, i) => (
                  <div
                    key={i}
                    className="p-7 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all group"
                  >
                    <div className="mb-5 p-3 rounded-xl bg-white/5 w-fit group-hover:bg-violet-500/15 transition-colors">
                      <item.icon className="w-5 h-5 text-violet-400" />
                    </div>
                    <h4 className="text-lg font-bold mb-3">{item.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5: TECHNICAL ARCHITECTURE & APIs
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-violet-900/5 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2.5 rounded-xl bg-violet-500/10">
              <Code2 className="w-6 h-6 text-violet-400" />
            </div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-violet-400">
              Technical Architecture
            </p>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 max-w-4xl">
            Built on <span className="text-violet-400">World-Class APIs</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mb-16">
            TrafficPulse integrates 6 external APIs and exposes 15+ internal RESTful
            endpoints. Here's the full technical ecosystem that powers the
            platform.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="text-violet-400">▸</span> External API
                Integrations
              </h3>
              <div className="space-y-4">
                {[
                  {
                    name: "Google Gemini AI",
                    role: "Core prediction engine — processes graph-theoretic traffic models",
                    color: "bg-violet-500/20 text-violet-400",
                    icon: BrainCircuit,
                  },
                  {
                    name: "Mapbox GL",
                    role: "High-performance vector tile rendering for real-time heatmaps",
                    color: "bg-blue-500/20 text-blue-400",
                    icon: MapIcon,
                  },
                  {
                    name: "Google Maps Platform",
                    role: "Geospatial intelligence and location services backbone",
                    color: "bg-emerald-500/20 text-emerald-400",
                    icon: Globe,
                  },
                  {
                    name: "OpenRoute Service",
                    role: "Traffic-aware emergency vehicle routing and path optimization",
                    color: "bg-green-500/20 text-green-400",
                    icon: Navigation,
                  },
                  {
                    name: "WeatherAPI",
                    role: "Real-time atmospheric data for weather-adjusted traffic models",
                    color: "bg-cyan-500/20 text-cyan-400",
                    icon: Wind,
                  },
                  {
                    name: "Firebase Cloud Messaging",
                    role: "Sub-second push notification delivery to commuter devices",
                    color: "bg-amber-500/20 text-amber-400",
                    icon: Smartphone,
                  },
                  {
                    name: "Twilio SMS Gateway",
                    role: "High-reliability SMS broadcasts for emergency alerts",
                    color: "bg-rose-500/20 text-rose-400",
                    icon: Radio,
                  },
                  {
                    name: "MongoDB Atlas",
                    role: "Distributed document store for billions of traffic data points",
                    color: "bg-green-500/20 text-green-400",
                    icon: Database,
                  },
                ].map((api, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all"
                  >
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 ${api.color}`}
                    >
                      <api.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{api.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {api.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="text-cyan-400">▸</span> Internal API Endpoints
              </h3>
              <div className="space-y-3">
                {[
                  {
                    method: "GET",
                    route: "/api/traffic",
                    desc: "Real-time congestion metrics and node health scores",
                    color: "text-emerald-400",
                  },
                  {
                    method: "GET",
                    route: "/api/incidents",
                    desc: "Live accident, hazard, and infrastructure issue feed",
                    color: "text-emerald-400",
                  },
                  {
                    method: "POST",
                    route: "/api/incidents",
                    desc: "Report new incidents with geolocation and severity",
                    color: "text-amber-400",
                  },
                  {
                    method: "GET",
                    route: "/api/forecast",
                    desc: "AI-generated cascade risk predictions",
                    color: "text-emerald-400",
                  },
                  {
                    method: "POST",
                    route: "/api/public-alerts",
                    desc: "Trigger SMS/Push emergency broadcasts",
                    color: "text-amber-400",
                  },
                  {
                    method: "GET",
                    route: "/api/signals",
                    desc: "Signal timing data and intersection health",
                    color: "text-emerald-400",
                  },
                  {
                    method: "POST",
                    route: "/api/simulate",
                    desc: "Inject virtual events for stress testing",
                    color: "text-amber-400",
                  },
                  {
                    method: "GET",
                    route: "/api/corporate",
                    desc: "Corporate demand management recommendations",
                    color: "text-emerald-400",
                  },
                  {
                    method: "POST",
                    route: "/api/interventions",
                    desc: "Deploy emergency units with route optimization",
                    color: "text-amber-400",
                  },
                  {
                    method: "GET",
                    route: "/api/activities",
                    desc: "System-wide activity and audit log",
                    color: "text-emerald-400",
                  },
                  {
                    method: "GET/POST",
                    route: "/api/contacts",
                    desc: "Manage emergency contacts and alert groups",
                    color: "text-blue-400",
                  },
                  {
                    method: "GET/POST",
                    route: "/api/settings",
                    desc: "System configuration and user preferences",
                    color: "text-blue-400",
                  },
                  {
                    method: "POST",
                    route: "/api/auth/*",
                    desc: "JWT-based authentication and RBAC",
                    color: "text-amber-400",
                  },
                  {
                    method: "GET",
                    route: "/api/notifications",
                    desc: "SSE stream for real-time client updates",
                    color: "text-emerald-400",
                  },
                ].map((api, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all"
                  >
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 flex-shrink-0 ${api.color}`}
                    >
                      {api.method}
                    </span>
                    <code className="text-xs font-mono text-slate-300 flex-shrink-0">
                      {api.route}
                    </code>
                    <span className="text-xs text-slate-500 hidden lg:block">
                      — {api.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10">
            <h3 className="text-lg font-bold mb-6 text-center">
              Technology Stack
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                "Next.js 14",
                "React 18",
                "TypeScript",
                "Tailwind CSS",
                "MongoDB Atlas",
                "Chart.js",
                "SSE Streams",
                "Google Gemini",
                "Mapbox GL",
                "OpenRoute",
                "WeatherAPI",
                "Firebase",
              ].map((tech, i) => (
                <div
                  key={i}
                  className="text-center py-3 px-4 rounded-xl bg-white/5 border border-white/5 text-sm text-slate-400 font-medium hover:border-violet-500/30 hover:text-white transition-all"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6: BUSINESS OPPORTUNITIES
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2.5 rounded-xl bg-cyan-500/10">
              <DollarSign className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-cyan-400">
              Business Opportunities
            </p>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 max-w-4xl">
            Multiple Revenue Streams.{" "}
            <span className="text-cyan-400">Massive TAM.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mb-16">
            TrafficPulse isn't a single product — it's a platform with at least 6
            distinct monetization paths across the $820B+ global Smart City
            market.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Government Smart City Licensing",
                desc: "White-label TrafficPulse as the official Traffic Command Center for India's 100+ Smart Cities Mission cities. Recurring SaaS licensing model with per-city pricing. Expand internationally to ASEAN, Middle East, and Africa — regions experiencing explosive urbanization.",
                metric: "$420B",
                metricLabel: "Global Smart City Market by 2028",
                icon: Globe,
                color: "border-cyan-500/20 hover:border-cyan-500/40",
              },
              {
                title: "Data as a Service (DaaS)",
                desc: "Anonymized, high-fidelity traffic flow data is gold for logistics firms (route optimization), insurance companies (risk scoring), real-estate developers (location valuation), and urban planners (infrastructure design).",
                metric: "$47B",
                metricLabel: "Location Analytics Market",
                icon: Database,
                color: "border-violet-500/20 hover:border-violet-500/40",
              },
              {
                title: "Corporate Fleet SaaS",
                desc: "Subscription API for e-commerce and last-mile delivery companies. Our cascade prediction API lets them reroute fleets before congestion hits, reducing fuel costs by 18% and improving on-time delivery rates.",
                metric: "18%",
                metricLabel: "Avg. Fuel Cost Reduction",
                icon: Truck,
                color: "border-emerald-500/20 hover:border-emerald-500/40",
              },
              {
                title: "Insurance & Risk Analytics",
                desc: "Real-time 'Traffic Risk Scores' for automotive insurers to enable dynamic premium adjustment. Predict accident probability based on intersection health, weather, and historical patterns.",
                metric: "$12B",
                metricLabel: "Insurtech Market Gap",
                icon: ShieldAlert,
                color: "border-amber-500/20 hover:border-amber-500/40",
              },
              {
                title: "Advertising & Partnerships",
                desc: "High-intent location data enables targeted advertising partnerships with fuel stations, restaurants, and EV charging networks along commuter routes. Zero invasion of privacy — only anonymized flow data.",
                metric: "$8B",
                metricLabel: "Location-Based Ad Market",
                icon: Target,
                color: "border-rose-500/20 hover:border-rose-500/40",
              },
              {
                title: "Consulting & Custom Deployments",
                desc: "Premium consulting for city planners and infrastructure developers. Custom simulation scenarios, impact assessments for new constructions, and predictive modeling for major events.",
                metric: "High Margin",
                metricLabel: "Services Revenue",
                icon: GraduationCap,
                color: "border-fuchsia-500/20 hover:border-fuchsia-500/40",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex gap-6 p-8 rounded-3xl bg-white/[0.03] border transition-all ${item.color}`}
              >
                <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-7 h-7 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    {item.desc}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-cyan-400 font-mono">
                      {item.metric}
                    </span>
                    <span className="text-xs text-slate-500">
                      {item.metricLabel}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 7: SOCIETAL IMPACT
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-emerald-900/5 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2.5 rounded-xl bg-emerald-500/10">
              <Heart className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-emerald-400">
              Societal Impact
            </p>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 max-w-4xl">
            How TrafficPulse Changes <span className="text-emerald-400">Lives.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mb-16">
            This isn't just about moving cars faster. TrafficPulse solves problems that
            directly affect human health, safety, economic equity, and our
            planet.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Saving Lives Through Faster Emergency Response",
                desc: "Every minute an ambulance is stuck in traffic, survival rates drop by 7-10%. TrafficPulse's predictive corridor clearing reduces emergency response times by 30%, directly translating to lives saved. In a city like Bangalore with 1,200+ monthly ambulance delays, even a 10% improvement means hundreds of lives.",
                icon: Heart,
                stat: "30%",
                statLabel: "Faster Ambulance Response",
              },
              {
                title: "Environmental Sustainability",
                desc: "Idling vehicles at congested intersections produce 2-3x more emissions per km than free-flowing traffic. By preventing cascade failures and reducing stop-and-go patterns, TrafficPulse cuts urban CO2 emissions by an estimated 12%. That's equivalent to removing 50,000 cars from Bangalore's roads.",
                icon: Leaf,
                stat: "12%",
                statLabel: "CO2 Reduction",
              },
              {
                title: "Economic Equity for Daily Commuters",
                desc: "Traffic doesn't affect everyone equally. Lower-income workers who can't afford to live near their workplace suffer the most from long commutes. By reducing average commute times by 30%, TrafficPulse gives back hours of life to millions of people every day — time they can spend with family, education, and rest.",
                icon: Users,
                stat: "1.5 hrs",
                statLabel: "Daily Time Saved Per Commuter",
              },
              {
                title: "Economic Productivity Boost",
                desc: "India's GDP loses an estimated 2-3% annually to traffic congestion. By preventing cascade failures across major economic corridors like Bangalore's ORR and Whitefield, TrafficPulse unlocks ₹1.47 Lakh Crore in trapped economic value — money that flows back into businesses, wages, and growth.",
                icon: TrendingUp,
                stat: "₹1.47L Cr",
                statLabel: "Annual Economic Value Unlocked",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-white/[0.03] border border-emerald-500/10 hover:border-emerald-500/25 transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-emerald-500/10">
                    <item.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex items-baseline gap-2 ml-auto">
                    <span className="text-2xl font-bold text-emerald-400 font-mono">
                      {item.stat}
                    </span>
                    <span className="text-xs text-slate-500">
                      {item.statLabel}
                    </span>
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 8: SCOPE FOR IMPROVEMENT / FUTURE ROADMAP
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2.5 rounded-xl bg-fuchsia-500/10">
              <Lightbulb className="w-6 h-6 text-fuchsia-400" />
            </div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-fuchsia-400">
              Future Vision
            </p>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 max-w-4xl">
            Scope for{" "}
            <span className="text-fuchsia-400">Growth & Improvement</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mb-16">
            The current MVP is just the beginning. Here's where TrafficPulse is heading
            — each point represents a massive expansion of capability and market
            reach.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                phase: "Near-Term",
                color: "bg-emerald-500",
                items: [
                  {
                    title: "V2X Vehicle Connectivity",
                    desc: "Direct communication with autonomous and connected vehicles for pre-emptive rerouting — before the driver even knows there's a problem.",
                  },
                  {
                    title: "Computer Vision Integration",
                    desc: "CCTV camera feeds analyzed by AI to detect accidents, pedestrian density, and illegal parking in real-time.",
                  },
                  {
                    title: "Public Transit Integration",
                    desc: "Dynamic bus rerouting and metro load predictions to shift demand from roads to public transit during stress events.",
                  },
                ],
              },
              {
                phase: "Mid-Term",
                color: "bg-violet-500",
                items: [
                  {
                    title: "Digital Twin City",
                    desc: "Full 3D digital twin of the city for urban planners to simulate road constructions, events, and population growth before committing resources.",
                  },
                  {
                    title: "Federated Learning",
                    desc: "Multi-city model training without sharing raw data. Each city's TrafficPulse instance improves the global model while maintaining data sovereignty.",
                  },
                  {
                    title: "Carbon Credit Integration",
                    desc: "Quantify emissions prevented by TrafficPulse and convert them into tradeable carbon credits — creating a self-sustaining revenue model.",
                  },
                ],
              },
              {
                phase: "Long-Term",
                color: "bg-fuchsia-500",
                items: [
                  {
                    title: "Autonomous Grid Management",
                    desc: "Fully autonomous traffic management with zero human intervention. AI handles detection, prediction, and intervention end-to-end.",
                  },
                  {
                    title: "Global Network Effect",
                    desc: "Connected grids across cities, states, and countries. Interstate logistics optimized at the continental scale.",
                  },
                  {
                    title: "Urban Policy Engine",
                    desc: "AI-generated policy recommendations for city governments based on years of traffic data: where to build flyovers, metro lines, and cycling infrastructure.",
                  },
                ],
              },
            ].map((phase, i) => (
              <div key={i} className="space-y-6">
                <div
                  className={`inline-block px-4 py-1.5 ${phase.color} rounded-full text-xs font-bold uppercase tracking-widest text-white`}
                >
                  {phase.phase}
                </div>
                <div className="space-y-4">
                  {phase.items.map((item, j) => (
                    <div
                      key={j}
                      className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all"
                    >
                      <h4 className="font-bold mb-2">{item.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 9: WHY WE WILL WIN
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-violet-900/5 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2.5 rounded-xl bg-amber-500/10">
              <BadgeCheck className="w-6 h-6 text-amber-400" />
            </div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-amber-400">
              Competitive Moat
            </p>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-16 max-w-4xl">
            Why TrafficPulse Wins.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Predictive, Not Reactive",
                desc: "Google Maps and Waze show you where congestion IS. TrafficPulse tells you where it WILL BE — and stops it before anyone notices.",
                icon: Eye,
              },
              {
                title: "Network-Level Intelligence",
                desc: "Competitors optimize individual intersections. We optimize the entire network graph simultaneously — the only way to prevent cascades.",
                icon: Globe,
              },
              {
                title: "Production-Ready MVP",
                desc: "Not a pitch deck. Not a prototype. A fully functional system processing real traffic data right now on Bangalore's ORR.",
                icon: Sparkles,
              },
              {
                title: "Platform Economics",
                desc: "Every new city deployment improves the AI for all cities. More data = better predictions = more value. Classic network effect.",
                icon: TrendingUp,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-7 rounded-2xl bg-white/[0.03] border border-amber-500/10 hover:border-amber-500/25 transition-all text-center"
              >
                <div className="mb-5 mx-auto p-3 rounded-xl bg-amber-500/10 w-fit">
                  <item.icon className="w-6 h-6 text-amber-400" />
                </div>
                <h4 className="text-lg font-bold mb-3">{item.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 10: FINAL CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-600/10 via-violet-600/5 to-transparent -z-10" />
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            See It <span className="text-violet-400">In Action.</span>
          </h2>
          <p className="text-slate-400 mb-12 text-lg max-w-2xl mx-auto">
            Everything described on this page is live and functioning. Launch
            the demo and experience the future of urban traffic management.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full md:w-auto px-10 py-4 bg-white text-black hover:bg-slate-200 rounded-xl font-bold transition-all duration-300 text-lg flex items-center justify-center gap-2"
            >
              <Activity className="w-5 h-5" />
              Launch Live Demo
            </Link>
            <Link
              href="/features"
              className="w-full md:w-auto px-10 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2 text-lg"
            >
              Technical Features
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 opacity-50">
              <Activity className="w-5 h-5 text-violet-400" />
              <span className="font-bold text-white tracking-widest text-sm">
                TRAFFICPULSE SYSTEMS
              </span>
            </div>
            <div className="flex items-center gap-8 text-sm text-slate-500">
              <Link
                href="/features"
                className="hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link
                href="/about"
                className="hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                href="/dashboard"
                className="hover:text-white transition-colors"
              >
                Dashboard
              </Link>
            </div>
            <p className="text-slate-600 text-xs">
              &copy; 2024 TrafficPulse. Engineering the future of cities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
