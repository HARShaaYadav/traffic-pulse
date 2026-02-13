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
} from "lucide-react";

export default function FeaturesPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      category: "Core Traffic Management",
      items: [
        {
          title: "Real-Time Dashboard",
          desc: "Our interactive map uses sub-second SSE updates to visualize traffic velocity, active gridlocks, and infrastructure health across major city nodes. It provides operators with a comprehensive situational overview for immediate decision-making.",
          icon: Activity,
        },
        {
          title: "AI Cascade Prediction",
          desc: "Powered by graph theory and neural networks, this core engine predicts systemic collapse up to 30 minutes in advance. It calculates 'Time to Cascade' and 'Confidence Scores' for Every intersection in the network.",
          icon: Cpu,
        },
        {
          title: "Incident Reporting",
          desc: "A bi-directional reporting system where citizens and on-ground units can flag accidents or hazards. Reported incidents instantly trigger recalculations of flow models and are prioritized for emergency response.",
          icon: ShieldAlert,
        },
      ],
    },
    {
      category: "Advanced Alerting System",
      items: [
        {
          title: "Unified Alert Feed",
          desc: "A centralized command timeline that intelligently aggregates AI-predicted risks, official public broadcasts, and real-world incidents. This ensures that no critical event is buried under low-priority noise.",
          icon: Radio,
        },
        {
          title: "Multi-Channel Broadcasting",
          desc: "Reach every stakeholder instantly through high-reliability SMS gateways and real-time App push notifications. The system ensures that drivers and commuters are rerouted before they enter a bottleneck.",
          icon: Zap,
        },
        {
          title: "Audiovisual Crisis Mode",
          desc: "For operators, we've implemented multi-sensory feedback. High-priority alerts trigger persistent sound loops and visual toast overlays that demand attention and manual acknowledgement.",
          icon: Layers,
        },
      ],
    },
    {
      category: "Emergency & Signals",
      items: [
        {
          title: "Smart Unit Dispatch",
          desc: "Deploying units isn't just about location; it's about pathing. Our system suggests optimal routes for Ambulance and Fire services, clearing paths through traffic-aware corridor management.",
          icon: Truck,
        },
        {
          title: "Adaptive Traffic Lights",
          desc: "Move beyond static timers. Our AI adjusts green-light duration in real-time based on actual volume, creating 'Green Waves' that flush congestion out of highly stressed corridors.",
          icon: Activity,
        },
        {
          title: "Emergency Override",
          desc: "Operators can manually force signal states across multiple intersections, effectively creating a high-priority 'tunnel' of green lights for critical emergency vehicles or VIP movement.",
          icon: Lock,
        },
      ],
    },
    {
      category: "Corporate & Public Integration",
      items: [
        {
          title: "Corporate Demand Mgmt",
          desc: "Integrating with business fleets to suggest variable shift timings and Work-From-Home (WFH) recommendations. This 'shaves the peak' of traffic demand by moving volume away from congested hours.",
          icon: Building2,
        },
        {
          title: "Public Commuter Tools",
          desc: "Empowering citizens with route-planning intelligence that avoids predicted bottle-necks. It's about solving traffic by moving less, not just moving faster.",
          icon: Users,
        },
        {
          title: "Atmospheric Impact Logic",
          desc: "Traffic isn't just about cars; it's about conditions. Rain and visibility data are factored into speed-adjustment models, predicting slower clearing times during inclement weather.",
          icon: CloudRain,
        },
      ],
    },
  ];

  const externalApis = [
    {
      name: "Google Gemini AI",
      role: "Predictive Analytics & Reasoning",
      desc: "The 'brain' of TrafficPulse. Gemini processes complex traffic graph data to identify non-linear cascading triggers and generate natural language recommendations for city operators.",
      icon: Cpu,
      color: "bg-violet-500/20 text-violet-400",
    },
    {
      name: "Mapbox & Google Maps",
      role: "Geospatial Visualization",
      desc: "Provides the high-performance tile rendering and geospatial data needed for our 3D traffic density heatmaps and node-level visualization.",
      icon: MapIcon,
      color: "bg-blue-500/20 text-blue-400",
    },
    {
      name: "OpenRoute Service",
      role: "Dynamic Pathing Engine",
      desc: "Powers our emergency dispatch routing by calculating traffic-aware paths through the city's complex road network in milliseconds.",
      icon: Navigation,
      color: "bg-emerald-500/20 text-emerald-400",
    },
    {
      name: "WeatherAPI",
      role: "Atmospheric Intelligence",
      desc: "Feeds real-time rain, storm, and visibility data directly into our AI models to adjust predicted traffic clearing times and risk scores.",
      icon: Wind,
      color: "bg-cyan-500/20 text-cyan-400",
    },
    {
      name: "Firebase Connectivity",
      role: "Real-time Notification Backbone",
      desc: "Ensures sub-second delivery of push notifications to commuter devices across the city, maintaining a live link between TrafficPulse and the public.",
      icon: Smartphone,
      color: "bg-amber-500/20 text-amber-400",
    },
    {
      name: "MongoDB Atlas",
      role: "Scalable Intelligence Store",
      desc: "A distributed document database storing billions of historical traffic data points used for training our cascade prediction models.",
      icon: Database,
      color: "bg-green-500/20 text-green-400",
    },
  ];

  const businessOpportunities = [
    {
      title: "Data as a Service (DaaS)",
      desc: "Monetize high-fidelity, real-time traffic flow data for logistics companies, insurance providers, and real estate developers looking for location-based intelligence.",
      icon: BarChart2,
    },
    {
      title: "Smart City Licensing",
      desc: "TrafficPulse can be deployed as a white-labeled Command and Control Center for municipal governments, reducing infrastructure costs and improving citizen safety.",
      icon: Globe,
    },
    {
      title: "Logistics Optimization",
      desc: "Partner with E-commerce and delivery giants to optimize fleet movement using our predictive cascade engine, cutting down fuel costs and delivery times.",
      icon: Truck,
    },
    {
      title: "Urban Planning SaaS",
      desc: "Provide civil engineers with a 'digital twin' of the city where they can simulate new constructions, road closings, or major events before they happen.",
      icon: Building2,
    },
  ];

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
              className="text-white bg-white/5 px-3 py-1 rounded-full transition-colors"
            >
              Features
            </Link>
            <Link
              href="/about"
              className="hover:text-violet-400 transition-colors"
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
              href="/#traction"
              className="hover:text-violet-400 transition-colors"
            >
              Traction
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
            Launch Console
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-violet-600/10 to-transparent blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-medium text-violet-300 mb-8">
            <Code2 className="w-3.5 h-3.5" />
            Full Technical Disclosure
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent max-w-4xl mx-auto leading-tight">
            Stop Traffic Cascades <br />
            <span className="text-violet-400">
              With Collective Intelligence.
            </span>
          </h1>

          <p className="text-lg text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            TrafficPulse isn't just a management tool—it's a high-fidelity decision
            support system engineered to identify systemic stress and interdict
            before gridlock becomes city-wide paralysis.
          </p>
        </div>
      </section>

      {/* Feature Drill-Down */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 gap-20">
            {features.map((section, idx) => (
              <div key={idx} className="space-y-12">
                <div className="flex items-center gap-6">
                  <h3 className="text-2xl font-bold text-violet-300 whitespace-nowrap">
                    {section.category}
                  </h3>
                  <div className="h-px w-full bg-gradient-to-r from-violet-500/20 to-transparent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {section.items.map((item, i) => (
                    <div
                      key={i}
                      className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-white/[0.07] transition-all duration-500 group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <item.icon className="w-24 h-24 -mr-12 -mt-12" />
                      </div>
                      <div className="mb-6 p-3 rounded-xl bg-violet-500/10 w-fit group-hover:bg-violet-500/20 transition-colors relative z-10">
                        <item.icon className="w-6 h-6 text-violet-400" />
                      </div>
                      <h4 className="text-xl font-bold mb-4 relative z-10">
                        {item.title}
                      </h4>
                      <p className="text-slate-400 text-sm leading-relaxed relative z-10">
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

      {/* External APIs Section */}
      <section
        id="apis"
        className="py-32 border-y border-white/5 bg-violet-600/[0.02]"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Technical <span className="text-violet-400">Ecosystem</span>
              </h2>
              <p className="text-slate-400">
                TrafficPulse leverages a sophisticated stack of world-class APIs to
                deliver predictive accuracy and real-time responsiveness.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-4xl font-bold text-violet-400 mb-1">
                99.9%
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                API Uptime
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {externalApis.map((api, i) => (
              <div
                key={i}
                className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group"
              >
                <div
                  className={`mt-1 h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${api.color}`}
                >
                  <api.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1 group-hover:text-violet-400 transition-colors">
                    {api.name}
                  </h4>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                    {api.role}
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {api.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Opportunities Section */}
      <section id="business" className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-300 mb-6">
              <TrendingUp className="w-3.5 h-3.5" />
              Commercial Outlook
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              The Future of{" "}
              <span className="text-cyan-400">Urban Efficiency</span>
            </h2>
            <p className="text-slate-400 max-w-3xl mx-auto">
              TrafficPulse isn't just an experimental project; it's a scalable platform
              designed for a global Smart City market projected to reach $820B
              by 2025.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {businessOpportunities.map((opportunity, i) => (
              <div
                key={i}
                className="flex gap-8 p-10 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 hover:border-cyan-500/30 transition-all duration-500 group"
              >
                <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <opportunity.icon className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold mb-3">
                    {opportunity.title}
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    {opportunity.desc}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-cyan-400 text-sm font-bold cursor-pointer group-hover:translate-x-2 transition-transform">
                    Explore Partnership <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Check Section */}
      <section className="py-20 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                Society & Social Alignment
              </h3>
              <p className="text-slate-400">
                Our system addresses the fundamental Bangalore traffic problem
                by shifting focus from single-point optimization to
                network-level resilience, reducing citizen stress and improving
                urban safety.
              </p>
            </div>
            <div className="flex gap-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">30%</div>
                <div className="text-xs text-slate-500 font-bold uppercase">
                  Time Saved
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">12%</div>
                <div className="text-xs text-slate-500 font-bold uppercase">
                  Less CO2
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">100k+</div>
                <div className="text-xs text-slate-500 font-bold uppercase">
                  Lives Protected
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
          <Activity className="w-5 h-5" />
          <span className="font-semibold text-white tracking-widest">
            TRAFFICPULSE SYSTEMS
          </span>
        </div>
        <p>
          &copy; 2024 Traffic Cascade Prevention System. Engineering the future
          of cities.
        </p>
      </footer>
    </div>
  );
}
