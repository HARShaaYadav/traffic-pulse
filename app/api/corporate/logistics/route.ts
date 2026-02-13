import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { seedCorporateData } from "@/lib/corporateData";

export async function GET() {
  try {
    const db = await getDb();

    // Ensure data exists
    await seedCorporateData();

    const partners = await db.collection("corporate_partners").find().toArray();
    const zones = await db.collection("corporate_zones").find().toArray();

    return NextResponse.json({
      partners: partners.map((p) => ({ ...p, id: p.id || p._id })),
      zones: zones.map((z) => ({ ...z, id: z.id || z._id })),
    });
  } catch (error) {
    console.error("Logistics API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch logistics data" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { zoneId, action, value } = await request.json();

    if (!zoneId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const db = await getDb();

    // Construct the update path, e.g., "actions.suspendDelivery"
    const updatePath = `actions.${action}`;

    const result = await db
      .collection("corporate_zones")
      .updateOne({ id: zoneId }, { $set: { [updatePath]: value } });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Zone not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      updated: { zoneId, action, value },
    });
  } catch (error) {
    console.error("Logistics Update Error:", error);
    return NextResponse.json(
      { error: "Failed to update zone" },
      { status: 500 },
    );
  }
}
