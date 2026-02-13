import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const { trigger, location, intervention, timeHorizon } =
      await request.json();

    if (!trigger || !location) {
      return NextResponse.json(
        { error: "Trigger and location are required" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const simulationsCollection = db.collection("simulations");

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    let result;

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY not found. Using fallback simulation.");
      // Fallback static logic (keep existing simple logic for safety)
      const baseStress = 0.5;
      const triggerImpact =
        trigger === "Heavy Rain"
          ? 0.3
          : trigger === "Major Accident"
            ? 0.4
            : 0.2;
      const interventionEffect =
        intervention === "signal_timing"
          ? 0.15
          : intervention === "route_diversion"
            ? 0.2
            : 0;

      const nodes = [
        {
          name: "Silk Board",
          stress: Math.min(
            0.95,
            baseStress + triggerImpact - interventionEffect * 0.5,
          ),
        },
        {
          name: "Marathahalli",
          stress: Math.min(
            0.95,
            baseStress + triggerImpact * 0.8 - interventionEffect * 0.6,
          ),
        },
        {
          name: "Brookefield",
          stress: Math.min(
            0.95,
            baseStress + triggerImpact * 0.6 - interventionEffect * 0.7,
          ),
        },
        {
          name: "Bellandur",
          stress: Math.min(
            0.95,
            baseStress + triggerImpact * 0.5 - interventionEffect * 0.8,
          ),
        },
        {
          name: "Ecospace",
          stress: Math.min(
            0.95,
            baseStress + triggerImpact * 0.4 - interventionEffect * 0.9,
          ),
        },
        {
          name: "Whitefield",
          stress: Math.min(
            0.95,
            baseStress + triggerImpact * 0.3 - interventionEffect,
          ),
        },
        {
          name: "Sarjapur Road",
          stress: Math.min(
            0.95,
            baseStress + triggerImpact * 0.7 - interventionEffect * 0.6,
          ),
        },
        {
          name: "KR Puram",
          stress: Math.min(
            0.95,
            baseStress + triggerImpact * 0.35 - interventionEffect * 0.85,
          ),
        },
      ];

      result = {
        without: { nodes, totalDelay: 45, affectedNodes: 6 },
        with: {
          nodes: nodes.map((n) => ({
            ...n,
            stress: Math.max(0.2, n.stress - interventionEffect),
          })),
          totalDelay: Math.max(5, 45 - interventionEffect * 80),
          affectedNodes: Math.max(2, 6 - Math.floor(interventionEffect * 10)),
        },
        recommendation:
          intervention !== "none"
            ? `Applying ${intervention.replace("_", " ")} can reduce delays by ${Math.round(interventionEffect * 80)} minutes`
            : "Consider applying signal timing adjustments or route diversions",
        trigger,
        location,
        intervention,
        timeHorizon,
        timestamp: new Date(),
        isAiGenerated: false,
      };
    } else {
      // Gemini Simulation
      const prompt = `
        Simulate a traffic scenario in Bangalore Outer Ring Road (ORR).
        Trigger Event: ${trigger}
        Location: ${location}
        Intervention Applied: ${intervention}
        Time Horizon: ${timeHorizon}

        Nodes: Silk Board, Marathahalli, Brookefield, Bellandur, Ecospace, Whitefield, Sarjapur Road, KR Puram.

        Generate a JSON response with the following structure:
        {
          "without": {
            "nodes": [{"name": "Node Name", "stress": 0.0 to 1.0}],
            "totalDelay": number (minutes),
            "affectedNodes": number
          },
          "with": {
            "nodes": [{"name": "Node Name", "stress": 0.0 to 1.0}],
            "totalDelay": number (minutes),
            "affectedNodes": number
          },
          "recommendation": "string describing the impact and advice"
        }
        Ensure the 'with' values show improvement if the intervention is effective.
        Stress > 0.8 is high traffic.
        Response must be valid JSON only.
      `;

      const aiResult = await model.generateContent(prompt);
      const response = await aiResult.response;
      const text = response.text();
      // Clean up markdown code blocks if present
      const jsonStr = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const data = JSON.parse(jsonStr);

      result = {
        ...data,
        trigger,
        location,
        intervention,
        timeHorizon,
        timestamp: new Date(),
        isAiGenerated: true,
      };
    }

    // Store simulation in database
    await simulationsCollection.insertOne(result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Simulation error:", error);
    return NextResponse.json(
      { error: "Failed to run simulation" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const simulationsCollection = db.collection("simulations");

    // Get last 10 simulations
    const simulations = await simulationsCollection
      .find()
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({ simulations });
  } catch (error) {
    console.error("Error fetching simulations:", error);
    return NextResponse.json(
      { error: "Failed to fetch simulations" },
      { status: 500 },
    );
  }
}
