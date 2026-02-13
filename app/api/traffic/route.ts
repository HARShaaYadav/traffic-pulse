import { NextResponse } from "next/server";
import { getInitialTrafficState } from "@/lib/trafficGenerator";
import { getDb } from "@/lib/mongodb";
import { getRealWeather } from "@/lib/weather";
import { updateNodesWithRealTraffic } from "@/lib/routing";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const snapshotsCollection = db.collection("traffic_snapshots");

    // 1. Fetch latest snapshot
    const latestSnapshot = await snapshotsCollection
      .find()
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();

    let data: any;
    let shouldCreateNewSnapshot = false;

    if (latestSnapshot.length > 0) {
      data = latestSnapshot[0];

      // Check if data is stale (> 30 seconds old) — short interval to build history quickly
      const lastUpdate = new Date(data.createdAt).getTime();
      const now = Date.now();
      const diffSeconds = (now - lastUpdate) / 1000;
      // const diffSeconds = 100; // FORCE UPDATE

      if (diffSeconds > 30) {
        console.log(
          `Data is stale (${Math.round(diffSeconds)}s old). Fetching fresh real-world data...`,
        );
        shouldCreateNewSnapshot = true;
      } else {
        // Data is fresh enough, return it
        delete (data as any)._id;
        return NextResponse.json(data);
      }
    } else {
      console.log("No traffic data found. Initializing...");
      data = getInitialTrafficState();
      shouldCreateNewSnapshot = true;
    }

    if (shouldCreateNewSnapshot) {
      // A. Weather
      const weather = await getRealWeather();

      // B. Traffic Speed
      const updatedNodes = await updateNodesWithRealTraffic(data.nodes);

      // --- INTERVENTION LOGIC START ---
      // Fetch active signal interventions
      const signalsCollection = db.collection("signals");
      const signalConfig = await signalsCollection.findOne({
        key: "signal_config",
      });
      const activePlan = signalConfig?.activePlan || "office_hours";

      // Fetch recent dispatch interventions (last 20 mins)
      const logsCollection = db.collection("logs");
      const recentDispatches = await logsCollection
        .find({
          type: "dispatch",
          timestamp: { $gt: new Date(Date.now() - 20 * 60 * 1000) },
        })
        .toArray();

      // Apply effects to nodes
      const interventionNodes = updatedNodes.map((node) => {
        let stressModifier = 1.0; // Multiplier (1.0 = no change, 0.5 = 50% stress)

        // 1. Signal Plan Effects
        if (activePlan === "emergency") {
          // Emergency plan clears major corridors
          stressModifier *= 0.6;
        } else if (
          activePlan === "rain_protocol" &&
          weather.condition.includes("rain")
        ) {
          // Rain protocol mitigates rain stress slightly
          stressModifier *= 0.8;
        }

        // 2. Dispatch Effects
        // Check if any dispatch targeted this node location
        const hasDispatch = recentDispatches.some((d: any) => {
          if (!d.location) return false;
          const loc = d.location.toLowerCase();
          const name = node.name.toLowerCase();
          return loc.includes(name) || name.includes(loc);
        });

        if (hasDispatch) {
          // Dispatch (Tow/Police) dramatically clears specific bottlenecks
          stressModifier *= 0.4;
        }

        const newStress = Math.round(node.stress * stressModifier);
        const newSpeed = Math.min(
          80,
          Math.round(node.speed / (stressModifier * 0.8 || 0.1)),
        ); // Rough inverse

        return {
          ...node,
          stress: newStress,
          stress_score: newStress, // maintain consistency
          current_speed: newSpeed, // boost speed if stress drops
          speed: newSpeed,
        };
      });
      // --- INTERVENTION LOGIC END ---

      // C. Accumulate history — carry forward previous history + append new stress
      const nodesWithHistory = interventionNodes.map(
        (node: any, idx: number) => {
          const prevHistory = data.nodes[idx]?.history || [];
          // Sliding window of 24 data points
          const newHistory = [...prevHistory, node.stress].slice(-24);
          return { ...node, history: newHistory };
        },
      );

      // D. Calculate isPeak based on current hour
      const currentHour = new Date().getHours();
      const isPeak =
        (currentHour >= 8 && currentHour <= 11) ||
        (currentHour >= 17 && currentHour <= 20);

      // E. Cascade alert detection based on real stress
      const cascadeAlerts: any[] = [];
      for (let i = 0; i < nodesWithHistory.length - 1; i++) {
        const curr = nodesWithHistory[i];
        const next = nodesWithHistory[i + 1];
        if (curr.stress > 70 && next.stress > 50) {
          const score = Math.round((curr.stress + next.stress) / 2);
          const severity =
            score > 85 ? "critical" : score > 70 ? "high" : "medium";
          cascadeAlerts.push({
            id: `cascade_${curr.id}_${next.id}_${Date.now()}`,
            risk_level: severity,
            severity,
            score,
            segment: `${curr.name} → ${next.name}`,
            time_to_collapse: score > 85 ? "8-12 min" : "15-25 min",
            trigger: `Stress propagation: ${curr.name} (${curr.stress}%) → ${next.name} (${next.stress}%)`,
            message: `Cascade risk detected between ${curr.name} and ${next.name}`,
            confidence: Math.min(95, 60 + score / 3),
            timestamp: new Date().toISOString(),
            acknowledged: false,
          });
        }
      }

      // Build new snapshot
      const newSnapshot = {
        timestamp: new Date().toISOString(),
        nodes: nodesWithHistory,
        weather,
        cascade_alerts: cascadeAlerts,
        isPeak,
        createdAt: new Date(),
      };

      // Remove old _id if carrying over from previous snapshot
      delete (newSnapshot as any)._id;

      // Save to DB
      await snapshotsCollection.insertOne(newSnapshot);

      data = newSnapshot;

      // Prune old snapshots (keep last 50)
      const count = await snapshotsCollection.countDocuments();
      if (count > 50) {
        const oldest = await snapshotsCollection
          .find()
          .sort({ createdAt: 1 })
          .limit(count - 50)
          .toArray();
        const ids = oldest.map((d: any) => d._id);
        await snapshotsCollection.deleteMany({ _id: { $in: ids } });
      }
    }

    // Remove _id before returning
    if ((data as any)._id) delete (data as any)._id;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Traffic API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch traffic data" },
      { status: 500 },
    );
  }
}
