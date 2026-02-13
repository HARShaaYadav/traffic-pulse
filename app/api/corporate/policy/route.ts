import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();

    // In a real app, this would be fetched from a 'policies' collection
    // For now, we can mock the initial state or store a single document
    const policyDoc = await db
      .collection("corporate_policies")
      .findOne({ id: "global_policy" });

    // Fetch the latest traffic snapshot to get real stress levels
    const latestSnapshot = await db
      .collection("traffic_snapshots")
      .find()
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();

    let trafficStress = 0;

    if (latestSnapshot.length > 0) {
      // Calculate average stress of all nodes from real data
      const nodes = latestSnapshot[0].nodes;
      const totalStress = nodes.reduce(
        (acc: number, node: any) => acc + node.stress,
        0,
      );
      trafficStress = Math.round(totalStress / nodes.length);
    } else {
      // Fallback if no data exists (e.g. system just started)
      trafficStress = 45; // Moderate start
    }

    return NextResponse.json({
      policy: policyDoc?.wfhPolicy || "hybrid",
      highTrafficAlert: policyDoc?.highTrafficAlert || false,
      trafficStress,
    });
  } catch (error) {
    console.error("Policy API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch policy data" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { wfhPolicy, highTrafficAlert } = await request.json();
    const db = await getDb();

    const updateData: any = {};
    if (wfhPolicy) updateData.wfhPolicy = wfhPolicy;
    if (highTrafficAlert !== undefined)
      updateData.highTrafficAlert = highTrafficAlert;

    // Upsert the global policy document
    await db
      .collection("corporate_policies")
      .updateOne(
        { id: "global_policy" },
        { $set: updateData },
        { upsert: true },
      );

    return NextResponse.json({ success: true, updated: updateData });
  } catch (error) {
    console.error("Policy Update Error:", error);
    return NextResponse.json(
      { error: "Failed to update policy" },
      { status: 500 },
    );
  }
}
