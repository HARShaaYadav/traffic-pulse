"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart2,
  ShieldAlert,
  Zap,
  Activity,
  Globe,
  Lock,
  Cpu,
  TrendingUp,
  Users,
  Building2,
  DollarSign,
  Target,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
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
              className="hover:text-violet-400 transition-colors"
            >
              About
            </Link>
            <a
              href="#market"
              className="hover:text-violet-400 transition-colors"
            >
              Market
            </a>
            <a
              href="#traction"
              className="hover:text-violet-400 transition-colors"
            >
              Traction
            </a>
            <a
              href="#roadmap"
              className="hover:text-violet-400 transition-colors"
            >
              Roadmap
            </a>
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

      {/* ─── HERO ─── */}
      <section className="relative pt-36 pb-24 md:pt-52 md:pb-36 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-violet-600/15 to-transparent blur-[120px] -z-10" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-medium text-violet-300 mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Backed by Google Gemini AI • Production Ready
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent max-w-5xl mx-auto leading-[1.1]">
            The Operating System <br />
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              for Smart Cities.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-6 max-w-3xl mx-auto leading-relaxed">
            TrafficPulse uses predictive AI and graph theory to detect cascading traffic
            failures
            <span className="text-white font-semibold">
              {" "}
              30 minutes before they happen
            </span>
            —saving cities billions in lost productivity and protecting lives.
          </p>

          <p className="text-sm text-slate-500 mb-12 max-w-xl mx-auto">
            Targeting a{" "}
            <span className="text-violet-400 font-bold">
              $820B+ global Smart City market
            </span>{" "}
            with a production-ready MVP deployed on Bangalore's ORR corridor.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full md:w-auto px-10 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-[0_0_25px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] flex items-center justify-center gap-2 text-lg"
            >
              <Cpu className="w-5 h-5" />
              Launch Live Demo
            </Link>
            <Link
              href="/features"
              className="w-full md:w-auto px-10 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-lg"
            >
              <BarChart2 className="w-5 h-5" />
              Technical Deep Dive
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TRACTION / LIVE METRICS ─── */}
      <section id="traction" className="py-20 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-slate-500 mb-3">
              Live System Metrics
            </p>
            <h2 className="text-2xl md:text-3xl font-bold">
              Proven at Scale on Bangalore's ORR
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                label: "Nodes Monitored",
                value: "1,240",
                sub: "Silk Board → KR Puram",
                icon: Globe,
                color: "text-cyan-400",
              },
              {
                label: "Cascades Prevented",
                value: "14,392",
                sub: "This Quarter",
                icon: ShieldAlert,
                color: "text-violet-400",
              },
              {
                label: "Avg. Response",
                value: "<12ms",
                sub: "API Latency",
                icon: Zap,
                color: "text-fuchsia-400",
              },
              {
                label: "Uptime SLA",
                value: "99.97%",
                sub: "Last 90 Days",
                icon: Activity,
                color: "text-emerald-400",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="group p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-lg bg-white/5 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                    Real-Time
                  </span>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1 font-mono">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
                <div className="text-slate-600 text-xs mt-1">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── THE PROBLEM ─── */}
      <section id="market" className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/5 via-transparent to-transparent -z-10" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] uppercase text-red-400 mb-4">
                The $87B Problem
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                Traffic Cascades Cost <br />
                India
                <span className="text-red-400"> ₹1.47 Lakh Crore</span>{" "}
                Annually.
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                A single accident at Silk Board Junction doesn't just cause a
                20-minute delay—it triggers a{" "}
                <span className="text-white font-semibold">
                  cascading chain reaction
                </span>{" "}
                that gridlocks 40+ intersections across 3 hours. Current systems
                detect congestion <em>after</em> it happens. TrafficPulse detects it{" "}
                <em>before</em>.
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-bold text-white">3.5hrs</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Avg. Bangalore Commute
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">₹22K Cr</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Fuel Wasted / Year
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">1,200+</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Delayed Ambulances / Mo
                  </div>
                </div>
              </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-red-500/5 to-violet-500/5 p-10 md:p-14">
              <div className="absolute top-6 right-6 px-3 py-1 bg-red-500/20 rounded-full text-red-400 text-xs font-bold uppercase tracking-widest">
                Before TrafficPulse
              </div>
              <div className="space-y-6 mt-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-slate-300">
                    Incident detected at Silk Board
                  </span>
                </div>
                <div className="ml-1.5 w-0.5 h-8 bg-red-500/30" />
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-slate-300">
                    +15 min → HSR Layout gridlocked
                  </span>
                </div>
                <div className="ml-1.5 w-0.5 h-8 bg-red-500/30" />
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-slate-300">
                    +45 min → Marathahalli–Bellandur paralyzed
                  </span>
                </div>
                <div className="ml-1.5 w-0.5 h-8 bg-red-500/30" />
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-slate-300 font-bold">
                    +2 hrs → Full ORR cascade failure
                  </span>
                </div>
              </div>
              <div className="mt-10 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-widest">
                    With TrafficPulse
                  </div>
                </div>
                <p className="text-emerald-400 font-semibold mt-3 text-lg">
                  Cascade predicted 28 min early → Signals rerouted → Zero
                  spillover.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOLUTION / FEATURES ─── */}
      <section id="features" className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-violet-900/5 -z-10" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-violet-400 mb-4">
              Our Solution
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              AI-Powered Network Resilience
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Not another traffic dashboard. TrafficPulse is a{" "}
              <span className="text-white font-semibold">
                predictive intervention engine
              </span>{" "}
              that stops cascading failures at the source.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Cascade Prediction Engine",
                desc: "Google Gemini-powered graph analysis predicts network-level failures 30 min in advance with a confidence score.",
                icon: Cpu,
                tag: "Core AI",
              },
              {
                title: "Adaptive Signal Control",
                desc: "Dynamically adjusts N+ traffic light phases across corridors to flush congestion before it propagates.",
                icon: Activity,
                tag: "Automation",
              },
              {
                title: "Emergency Dispatch AI",
                desc: "OpenRoute-powered pathing clears corridors for ambulances and fire units, reducing response times by 30%.",
                icon: ShieldAlert,
                tag: "Life-Safety",
              },
              {
                title: "Real-Time Weather Logic",
                desc: "WeatherAPI data adjusts all models for rain, visibility, and storm conditions that amplify cascade risk.",
                icon: Globe,
                tag: "Intelligence",
              },
              {
                title: "Corporate Demand Mgmt",
                desc: "AI-driven WFH and shift-stagger recommendations for corporate partners to shave peak-hour demand by up to 18%.",
                icon: Building2,
                tag: "B2B Revenue",
              },
              {
                title: "Multi-Channel Alerts",
                desc: "SMS, Push Notifications, and audiovisual crisis mode—ensuring zero missed critical warnings.",
                icon: Zap,
                tag: "Ops",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent border border-white/10 hover:border-violet-500/50 transition-all duration-300 group relative"
              >
                <div className="absolute top-6 right-6 text-[10px] font-bold uppercase tracking-widest text-slate-600 border border-white/10 px-2 py-0.5 rounded-full">
                  {feature.tag}
                </div>
                <div className="mb-6 p-4 rounded-full bg-white/5 w-fit group-hover:bg-violet-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 text-violet-400 font-semibold hover:text-violet-300 transition-colors group"
            >
              View Full Technical Breakdown{" "}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── MARKET OPPORTUNITY ─── */}
      <section className="py-28 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-cyan-400 mb-4">
              Market Opportunity
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              A Platform, Not Just a Product
            </h2>
            <p className="text-slate-400 max-w-3xl mx-auto text-lg">
              TrafficPulse is designed for multiple revenue streams across the rapidly
              expanding Smart City ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Gov. Smart City Licensing",
                desc: "White-label TrafficPulse as the official Command & Control Center for municipal governments. Target 100+ Smart Cities Mission cities in India alone.",
                metric: "$420B",
                metricLabel: "Global Smart City Market by 2028",
                icon: Globe,
              },
              {
                title: "Data as a Service (DaaS)",
                desc: "Monetize anonymized, high-fidelity traffic flow data for logistics firms, insurance underwriters, and real-estate developers.",
                metric: "$47B",
                metricLabel: "Location Analytics Market",
                icon: DollarSign,
              },
              {
                title: "Corporate Fleet SaaS",
                desc: "Subscription-based API access for e-commerce and delivery companies to optimize fleet routes using our predictive cascade engine.",
                metric: "18%",
                metricLabel: "Avg. Fuel Cost Reduction",
                icon: TrendingUp,
              },
              {
                title: "Insurance & Risk Analytics",
                desc: "Provide real-time 'traffic risk scores' to automotive insurers for dynamic premium adjustment and accident prediction.",
                metric: "$12B",
                metricLabel: "Insurtech Market Gap",
                icon: Target,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-8 p-10 rounded-3xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group"
              >
                <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <item.icon className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    {item.desc}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-cyan-400 font-mono">
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

      {/* ─── ROADMAP ─── */}
      <section
        id="roadmap"
        className="py-28 bg-violet-600/5 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-violet-400 mb-4">
              Execution Plan
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Growth <span className="text-violet-400">Roadmap</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              From Bangalore pilot to global grid infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                time: "Now",
                title: "Bangalore Pilot",
                desc: "Live MVP on ORR corridor. Real-time AI prediction, signal control, emergency dispatch.",
                color: "bg-emerald-500",
              },
              {
                time: "Q3 2025",
                title: "City-Wide Rollout",
                desc: "Expand to full Bangalore grid. Onboard 5 corporate partners for demand management.",
                color: "bg-violet-500",
              },
              {
                time: "2026",
                title: "Multi-City",
                desc: "Deploy in 3+ Indian metros. Launch DaaS and Corporate SaaS revenue streams.",
                color: "bg-cyan-500",
              },
              {
                time: "2027",
                title: "Global Platform",
                desc: "V2X vehicle connectivity. International smart city licensing. Series A target.",
                color: "bg-fuchsia-500",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="relative p-8 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm"
              >
                <div
                  className={`absolute -top-3 left-8 px-4 py-1 ${step.color} rounded-full text-xs font-bold uppercase tracking-widest text-white`}
                >
                  {step.time}
                </div>
                <h3 className="text-lg font-bold mb-3 mt-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOCIAL IMPACT ─── */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-emerald-400 mb-4">
              Why It Matters
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Impact Beyond Revenue
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Profit-driven solutions that also save lives and protect the
              planet.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              {
                value: "30%",
                label: "Faster Ambulance Response",
                color: "text-emerald-400",
              },
              {
                value: "12%",
                label: "CO2 Emission Reduction",
                color: "text-green-400",
              },
              {
                value: "1.4L Cr",
                label: "Economic Value Unlocked",
                color: "text-cyan-400",
              },
              {
                value: "100K+",
                label: "Lives Protected Daily",
                color: "text-violet-400",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
              >
                <div
                  className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2 font-mono`}
                >
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INVESTOR CTA ─── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-600/10 via-violet-600/5 to-transparent -z-10" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-medium text-violet-300 mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Production-Ready MVP • Live Now
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            The Future of Cities <br /> Is{" "}
            <span className="text-violet-400">Predictive</span>.
          </h2>
          <p className="text-slate-400 mb-12 text-lg max-w-2xl mx-auto">
            We're building the infrastructure layer that Smart Cities will run
            on. See it in action today.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full md:w-auto px-10 py-4 bg-white text-black hover:bg-slate-200 rounded-xl font-bold transition-all duration-300 text-lg flex items-center justify-center gap-2"
            >
              <Activity className="w-5 h-5" />
              Experience Live Demo
            </Link>
            <Link
              href="/features"
              className="w-full md:w-auto px-10 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2 text-lg"
            >
              Read Full Deck
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
