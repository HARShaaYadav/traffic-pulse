import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

// GET: Fetch active and past emergency corridors
export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection("emergency_corridors");

    const corridors = await collection
      .find()
      .sort({ activatedAt: -1 })
      .limit(20)
      .toArray();

    const active = corridors.filter((c: any) => c.status === "active");
    const past = corridors.filter((c: any) => c.status !== "active");

    return NextResponse.json({ active, past, total: corridors.length });
  } catch (error) {
    console.error("Error fetching emergency corridors:", error);
    return NextResponse.json(
      { error: "Failed to fetch corridors" },
      { status: 500 },
    );
  }
}

// POST: Activate an emergency corridor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, from, to, priority } = body;

    if (!type) {
      return NextResponse.json(
        { error: "Emergency type is required" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const collection = db.collection("emergency_corridors");

    const isCritical = priority === "critical";

    // Hackathon Polish: Make critical corridors look more impressive
    const etaMinutes = isCritical
      ? Math.round(Math.random() * 5 + 5) // 5-10 min (faster)
      : Math.round(Math.random() * 10 + 10); // 10-20 min

    const timeSaved = isCritical
      ? Math.round(Math.random() * 10 + 15) // 15-25 min saved!
      : Math.round(Math.random() * 5 + 5); // 5-10 min saved

    const corridor = {
      id: `emg_${Date.now()}`,
      type,
      from: from || "ORR Start",
      to: to || "Destination Hospital",
      priority: priority || "critical",
      status: "active",
      eta: `${etaMinutes} min`,
      timeSaved: `${timeSaved} min`,
      signalsCleared: isCritical
        ? Math.round(Math.random() * 5 + 8)
        : Math.round(Math.random() * 3 + 2),
      trafficHeld: isCritical
        ? Math.round(Math.random() * 500 + 500)
        : Math.round(Math.random() * 100 + 50),
      activatedAt: new Date(),
    };

    await collection.insertOne(corridor);

    return NextResponse.json({ success: true, corridor });
  } catch (error) {
    console.error("Error activating corridor:", error);
    return NextResponse.json(
      { error: "Failed to activate corridor" },
      { status: 500 },
    );
  }
}

// PATCH: Deactivate a corridor
export async function PATCH(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Corridor ID is required" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const collection = db.collection("emergency_corridors");

    await collection.updateOne(
      { id },
      {
        $set: {
          status: "completed",
          deactivatedAt: new Date(),
        },
      },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deactivating corridor:", error);
    return NextResponse.json(
      { error: "Failed to deactivate corridor" },
      { status: 500 },
    );
  }
}
