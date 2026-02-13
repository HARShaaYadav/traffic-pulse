import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { seedCorporateData } from "@/lib/corporateData";

export async function GET() {
  try {
    const db = await getDb();

    // Ensure seeding
    await seedCorporateData();

    const shifts = await db.collection("corporate_shifts").find().toArray();

    // Calculate recommendation based on traffic patterns
    // In a real app, this would be complex analysis.
    // For now, if "Regular" shift has > 3000 employees, suggest staggering.
    const regularShift = shifts.find((s) => s.name === "Regular");
    const recommendation =
      regularShift && regularShift.employees > 3000
        ? {
            action: "stagger",
            shiftName: "Regular",
            offset: 30, // minutes
            impact: "Reduces peak load by ~15%",
            currentLoad: 4200,
            predictedLoad: 3650,
          }
        : null;

    return NextResponse.json({
      shifts: shifts.map((s) => ({ ...s, id: s.id || s._id })),
      recommendation,
    });
  } catch (error) {
    console.error("Shifts API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch shift data" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, shiftName } = await request.json();

    if (action === "apply_recommendation" && shiftName) {
      // Apply logic: e.g., update shift times in DB or notify HR
      // For this hackathon demo, we'll just acknowledge it
      return NextResponse.json({
        success: true,
        message: `Applied recommendation for ${shiftName} shift.`,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Shift Update Error:", error);
    return NextResponse.json(
      { error: "Failed to update shifts" },
      { status: 500 },
    );
  }
}
