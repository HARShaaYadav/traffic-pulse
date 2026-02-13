import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const defaultSettings = {
  alertThreshold: 65,
  criticalThreshold: 85,
  refreshInterval: 30,
  autoIntervene: false,
  maxConcurrentInterventions: 3,
  notifications: {
    email: true,
    sms: false,
    push: true,
    sound: true,
  },
  mapStyle: "dark",
  showHeatmap: true,
  showIncidents: true,
  weatherIntegration: true,
};

// GET: Fetch settings
export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection("settings");

    const settings = await collection.findOne({ key: "app_settings" });

    return NextResponse.json({
      settings: settings?.data || defaultSettings,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({
      settings: defaultSettings,
    });
  }
}

// PUT: Save settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const db = await getDb();
    const collection = db.collection("settings");

    await collection.updateOne(
      { key: "app_settings" },
      {
        $set: {
          key: "app_settings",
          data: body,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 },
    );
  }
}
