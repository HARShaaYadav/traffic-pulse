import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

// GET: Fetch all alerts
export async function GET() {
  try {
    const db = await getDb();
    const alertsCollection = db.collection("alerts");

    const alerts = await alertsCollection
      .find()
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
      { status: 500 },
    );
  }
}

// POST: Create a new alert (or batch-upsert from traffic generator)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDb();
    const alertsCollection = db.collection("alerts");

    if (Array.isArray(body.alerts)) {
      // Batch insert from traffic generator
      const newAlerts = body.alerts.map((alert: any) => ({
        ...alert,
        acknowledged: false,
        createdAt: new Date(),
      }));

      if (newAlerts.length > 0) {
        await alertsCollection.insertMany(newAlerts);
      }

      return NextResponse.json({ success: true, count: newAlerts.length });
    }

    // Single alert creation
    const newAlert = {
      ...body,
      id: `alert_${Date.now()}`,
      acknowledged: false,
      timestamp: new Date().toISOString(),
      createdAt: new Date(),
    };

    await alertsCollection.insertOne(newAlert);
    return NextResponse.json({ success: true, alert: newAlert });
  } catch (error) {
    console.error("Error creating alert:", error);
    return NextResponse.json(
      { error: "Failed to create alert" },
      { status: 500 },
    );
  }
}

// PATCH: Acknowledge an alert
export async function PATCH(request: NextRequest) {
  try {
    const { id, acknowledged } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Alert ID is required" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const alertsCollection = db.collection("alerts");

    await alertsCollection.updateOne(
      { id },
      {
        $set: {
          acknowledged: acknowledged ?? true,
          acknowledgedAt: new Date(),
        },
      },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error acknowledging alert:", error);
    return NextResponse.json(
      { error: "Failed to acknowledge alert" },
      { status: 500 },
    );
  }
}

// DELETE: Remove old alerts
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const db = await getDb();
    const alertsCollection = db.collection("alerts");

    if (id) {
      await alertsCollection.deleteOne({ id });
    } else {
      // Delete all acknowledged alerts older than 24 hours
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      await alertsCollection.deleteMany({
        acknowledged: true,
        createdAt: { $lt: yesterday },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting alerts:", error);
    return NextResponse.json(
      { error: "Failed to delete alerts" },
      { status: 500 },
    );
  }
}
