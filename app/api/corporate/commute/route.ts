import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { seedCorporateData } from "@/lib/corporateData";

export async function GET() {
  try {
    const db = await getDb();

    // Ensure seeding
    await seedCorporateData();

    const shuttles = await db.collection("corporate_shuttles").find().toArray();

    // Calculate dynamic stats based on actual shuttle data
    const totalOccupancy = shuttles.reduce(
      (acc, s) => acc + (s.occupancy || 0),
      0,
    );
    const activeShuttles = shuttles.filter(
      (s) => s.status === "on_time" || s.status === "delayed",
    ).length;

    const carpoolStats = {
      active: totalOccupancy * 12, // Avg 12 people per % occupancy point across fleet (simulation logic)
      savedTrips: Math.floor(totalOccupancy * 8.5), // ~0.7 cars off road per person
      co2Saved: parseFloat((totalOccupancy * 0.04).toFixed(1)), // kg CO2 saved
    };

    return NextResponse.json({
      shuttles: shuttles.map((s) => ({ ...s, id: s.id || s._id })),
      carpoolStats,
    });
  } catch (error) {
    console.error("Commute API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch commute data" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { shuttleId, status, eta } = await request.json();

    if (!shuttleId) {
      return NextResponse.json(
        { error: "Missing shuttle ID" },
        { status: 400 },
      );
    }

    const db = await getDb();

    const updateData: any = {};
    if (status) updateData.status = status;
    if (eta !== undefined) updateData.eta = eta;

    const result = await db
      .collection("corporate_shuttles")
      .updateOne({ id: shuttleId }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Shuttle not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      updated: { shuttleId, ...updateData },
    });
  } catch (error) {
    console.error("Shuttle Update Error:", error);
    return NextResponse.json(
      { error: "Failed to update shuttle" },
      { status: 500 },
    );
  }
}
