import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getBaseTrafficNodes } from "@/lib/trafficGenerator";
import { calculateSimulatedMetrics } from "@/lib/routing";

interface ForecastParams {
  timeOffset: number; // minutes from now
}

function calculatePredictedStress(
  node: any,
  timeOffset: number,
  currentHour: number,
) {
  const futureHour = (currentHour + Math.floor(timeOffset / 60)) % 24;

  // Get the base stress for that future time using our consistent simulation model
  const { stress } = calculateSimulatedMetrics(node, futureHour);

  let predicted = stress;

  // Confidence decreases with time
  const confidence = Math.max(50, 95 - timeOffset / 2);
  const confidenceRange = 5 + timeOffset / 10;

  return {
    predicted,
    confidence,
    confidenceMin: Math.max(0, predicted - confidenceRange),
    confidenceMax: Math.min(100, predicted + confidenceRange),
  };
}

export async function POST(request: Request) {
  try {
    const { timeOffset = 30 } = await request.json();
    const currentHour = new Date().getHours();

    let nodes = [];

    // Fetch current state from DB
    try {
      const db = await getDb();
      const latestSnapshot = await db
        .collection("traffic_snapshots")
        .find()
        .sort({ createdAt: -1 })
        .limit(1)
        .toArray();

      if (latestSnapshot.length > 0) {
        nodes = latestSnapshot[0].nodes;
      } else {
        // Fallback if no DB data
        nodes = getBaseTrafficNodes();
      }
    } catch (e) {
      console.error("DB fetch failed for forecast, using fallback", e);
      nodes = getBaseTrafficNodes();
    }

    const forecast = nodes.map((node: any) => {
      const prediction = calculatePredictedStress(
        node,
        timeOffset,
        currentHour,
      );
      return {
        id: node.id,
        name: node.name,
        predictedStress: prediction.predicted,
        confidence: prediction.confidence,
        confidenceRange: [prediction.confidenceMin, prediction.confidenceMax],
        triggers: getTriggers(prediction.predicted, currentHour),
      };
    });

    // Calculate early warnings (only for actually high stress)
    const warnings = forecast
      .filter((f: any) => f.predictedStress > 70)
      .map((f: any) => ({
        nodeId: f.id,
        nodeName: f.name,
        predictedStress: f.predictedStress,
        timeToImpact: timeOffset,
        recommendedAction:
          f.predictedStress > 85
            ? "Deploy pre-emptive intervention NOW"
            : "Monitor closely and prepare resources",
      }));

    return NextResponse.json({
      forecast,
      warnings,
      timestamp: new Date().toISOString(),
      forecastTime: new Date(Date.now() + timeOffset * 60000).toISOString(),
      avgPredictedStress: Math.round(
        forecast.reduce((sum: any, f: any) => sum + f.predictedStress, 0) /
          forecast.length,
      ),
    });
  } catch (error) {
    console.error("Forecast error:", error);
    return NextResponse.json({ error: "Forecast failed" }, { status: 500 });
  }
}

function getTriggers(stress: number, currentHour: number): string[] {
  const triggers: string[] = [];

  if (
    (currentHour >= 8 && currentHour <= 11) ||
    (currentHour >= 17 && currentHour <= 20)
  ) {
    triggers.push("Peak hour");
  }

  if (stress > 80) triggers.push("High traffic volume");

  return triggers;
}
