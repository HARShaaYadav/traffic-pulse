import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const incidentsCollection = db.collection("incidents");

    // Get all incidents
    const incidents = await incidentsCollection
      .find()
      .sort({ timestamp: -1 })
      .toArray();

    return NextResponse.json({ incidents });
  } catch (error) {
    console.error("Error fetching incidents:", error);
    return NextResponse.json(
      { error: "Failed to fetch incidents" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const incident = await request.json();

    const db = await getDb();
    const incidentsCollection = db.collection("incidents");

    const newIncident = {
      ...incident,
      id: `inc_${Date.now()}`,
      timestamp: new Date(),
      status: "active",
    };

    await incidentsCollection.insertOne(newIncident);

    return NextResponse.json({ success: true, incident: newIncident });
  } catch (error) {
    console.error("Error creating incident:", error);
    return NextResponse.json(
      { error: "Failed to create incident" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { id, status } = requestBody;

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID and status are required" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const incidentsCollection = db.collection("incidents");

    await incidentsCollection.updateOne(
      { id },
      {
        $set: {
          status,
          interventions: requestBody.interventions,
          driver: requestBody.driver,
          updatedAt: new Date(),
        },
      },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating incident:", error);
    return NextResponse.json(
      { error: "Failed to update incident" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const db = await getDb();
    const incidentsCollection = db.collection("incidents");

    await incidentsCollection.deleteOne({ id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting incident:", error);
    return NextResponse.json(
      { error: "Failed to delete incident" },
      { status: 500 },
    );
  }
}
