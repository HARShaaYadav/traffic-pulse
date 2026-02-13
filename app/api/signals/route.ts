import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const DEFAULT_SIGNALS = [
  {
    id: "sig_001",
    name: "Silk Board",
    baseGreenTime: 60,
    baseYellowTime: 3,
    baseRedTime: 45,
    queueLength: 25,
    type: "signal_definition",
  },
  {
    id: "sig_002",
    name: "Marathahalli",
    baseGreenTime: 55,
    baseYellowTime: 3,
    baseRedTime: 50,
    queueLength: 18,
    type: "signal_definition",
  },
  {
    id: "sig_003",
    name: "Brookefield",
    baseGreenTime: 45,
    baseYellowTime: 3,
    baseRedTime: 40,
    queueLength: 12,
    type: "signal_definition",
  },
  {
    id: "sig_004",
    name: "Bellandur",
    baseGreenTime: 65,
    baseYellowTime: 3,
    baseRedTime: 50,
    queueLength: 30,
    type: "signal_definition",
  },
  {
    id: "sig_005",
    name: "Ecospace",
    baseGreenTime: 60,
    baseYellowTime: 3,
    baseRedTime: 45,
    queueLength: 22,
    type: "signal_definition",
  },
  {
    id: "sig_006",
    name: "Whitefield",
    baseGreenTime: 50,
    baseYellowTime: 3,
    baseRedTime: 45,
    queueLength: 15,
    type: "signal_definition",
  },
  {
    id: "sig_007",
    name: "Sarjapur",
    baseGreenTime: 55,
    baseYellowTime: 3,
    baseRedTime: 40,
    queueLength: 20,
    type: "signal_definition",
  },
  {
    id: "sig_008",
    name: "KR Puram",
    baseGreenTime: 48,
    baseYellowTime: 3,
    baseRedTime: 42,
    queueLength: 16,
    type: "signal_definition",
  },
];

const SIGNAL_PLANS = [
  {
    id: "office_hours",
    name: "Office Hours Plan",
    description: "Extended green time on arterial roads during peak hours",
    modifier: { green: 1.2, red: 0.9 },
  },
  {
    id: "rain_protocol",
    name: "Rain Protocol",
    description: "Longer cycles for safety during wet conditions",
    modifier: { green: 1.1, red: 1.1 },
  },
  {
    id: "emergency",
    name: "Emergency Corridor",
    description: "Clear path for emergency vehicles",
    modifier: { green: 2.0, red: 0.3 },
  },
  {
    id: "night_mode",
    name: "Night Mode",
    description: "Reduced cycle times for low traffic",
    modifier: { green: 0.7, red: 0.7 },
  },
];

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection("signals");

    // 1. Seed signals if they don't exist
    const signalCount = await collection.countDocuments({
      type: "signal_definition",
    });
    if (signalCount === 0) {
      await collection.insertMany(DEFAULT_SIGNALS);
    }

    // 2. Fetch signals
    const rawSignals = await collection
      .find({ type: "signal_definition" })
      .toArray();

    // 3. Get stored active plan
    const config = await collection.findOne({ key: "signal_config" });
    const activePlan = config?.activePlan || "office_hours";

    // 4. Get stored signal overrides
    const overrides = await collection
      .find({ key: "signal_override" })
      .toArray();
    const overrideMap: Record<string, any> = {};
    overrides.forEach((o: any) => {
      overrideMap[o.signalId] = o;
    });

    // 5. Fetch current traffic state for adaptive logic
    const latestTraffic = await db
      .collection("traffic_snapshots")
      .find()
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();

    const trafficNodes = latestTraffic.length > 0 ? latestTraffic[0].nodes : [];
    const trafficMap: Record<string, any> = {};
    trafficNodes.forEach((node: any) => {
      trafficMap[node.id] = node;
    });

    const signalToNodeMap: Record<string, string> = {
      sig_001: "silk_board",
      sig_002: "marathahalli",
      sig_003: "brookefield",
      sig_004: "bellandur",
      sig_005: "ecospace",
      sig_006: "whitefield",
      sig_007: "sarjapur",
      sig_008: "kr_puram",
    };

    // 6. Generate deterministic phase based on time
    const signals = rawSignals.map((sig: any) => {
      const override = overrideMap[sig.id];
      const linkedNodeId = signalToNodeMap[sig.id];
      const linkedNode = trafficMap[linkedNodeId];
      const stress = linkedNode?.stress || linkedNode?.stress_score || 0;

      let finalGreen = sig.baseGreenTime;
      const baseYellow = sig.baseYellowTime;
      const baseRed = sig.baseRedTime;

      let adaptiveMode = "base";

      if (!override && linkedNode) {
        if (stress > 80) {
          finalGreen = Math.round(finalGreen * 1.3);
          adaptiveMode = "flush";
        } else if (stress > 50) {
          finalGreen = Math.round(finalGreen * 1.15);
          adaptiveMode = "extend";
        } else if (stress < 20) {
          finalGreen = Math.max(20, Math.round(finalGreen * 0.9));
          adaptiveMode = "reduce";
        }
      }

      if (override) {
        finalGreen = override.greenTime;
        adaptiveMode = "manual_override";
      }

      const cycleTime = finalGreen + baseYellow + baseRed;
      const now = Math.floor(Date.now() / 1000);
      const timeInCycle = now % cycleTime;

      let currentPhase: "green" | "yellow" | "red" = "green";
      let countdown = 0;

      if (timeInCycle < finalGreen) {
        currentPhase = "green";
        countdown = finalGreen - timeInCycle;
      } else if (timeInCycle < finalGreen + baseYellow) {
        currentPhase = "yellow";
        countdown = finalGreen + baseYellow - timeInCycle;
      } else {
        currentPhase = "red";
        countdown = cycleTime - timeInCycle;
      }

      return {
        id: sig.id,
        name: sig.name,
        greenTime: finalGreen,
        baseGreenTime: sig.baseGreenTime,
        yellowTime: baseYellow,
        redTime: baseRed,
        cycleTime,
        queueLength: sig.queueLength,
        currentPhase,
        countdown,
        stress,
        adaptiveMode,
        hasOverride: !!override,
        status: "operational",
      };
    });

    // 7. Fetch change history
    const history = await collection
      .find({ key: "signal_plan_log" })
      .sort({ activatedAt: -1 })
      .limit(15)
      .toArray();

    return NextResponse.json({
      signals,
      plans: SIGNAL_PLANS,
      activePlan,
      history: history.map((h: any) => ({
        id: h._id,
        type: h.logType || "plan_change",
        plan: h.plan,
        signalId: h.signalId,
        signalName: h.signalName,
        detail: h.detail,
        timestamp: h.activatedAt,
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Signal API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch signals" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, signalId, greenTime, plan } = await request.json();
    const db = await getDb();
    const collection = db.collection("signals");

    if (action === "adjust_timing") {
      // Find signal name for logging
      const sig = await collection.findOne({
        id: signalId,
        type: "signal_definition",
      });
      const signalName = sig?.name || signalId;

      // Persist signal timing override
      await collection.updateOne(
        { key: "signal_override", signalId },
        {
          $set: {
            key: "signal_override",
            signalId,
            greenTime,
            updatedAt: new Date(),
          },
        },
        { upsert: true },
      );

      // Log the adjustment
      await collection.insertOne({
        key: "signal_plan_log",
        logType: "timing_override",
        signalId,
        signalName,
        detail: `Green time set to ${greenTime}s`,
        activatedAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        message: `Signal ${signalName} green time adjusted to ${greenTime}s`,
        predictedImpact: {
          stressReduction: Math.round(Math.random() * 15 + 5),
          delayReduction: Math.round(Math.random() * 8 + 2),
        },
      });
    }

    if (action === "clear_override") {
      const sig = await collection.findOne({
        id: signalId,
        type: "signal_definition",
      });
      const signalName = sig?.name || signalId;

      await collection.deleteOne({ key: "signal_override", signalId });

      await collection.insertOne({
        key: "signal_plan_log",
        logType: "override_cleared",
        signalId,
        signalName,
        detail: "Manual override removed, reverted to adaptive control",
        activatedAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        message: `Override cleared for ${signalName}`,
      });
    }

    if (action === "activate_plan") {
      const planDef = SIGNAL_PLANS.find((p) => p.id === plan);

      await collection.updateOne(
        { key: "signal_config" },
        {
          $set: {
            key: "signal_config",
            activePlan: plan,
            activatedAt: new Date(),
          },
        },
        { upsert: true },
      );

      await collection.insertOne({
        key: "signal_plan_log",
        logType: "plan_change",
        plan,
        detail: `Activated protocol: ${planDef?.name || plan}`,
        activatedAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        message: `${planDef?.name || plan} activated successfully`,
        affectedSignals: 8,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to control signal" },
      { status: 500 },
    );
  }
}
