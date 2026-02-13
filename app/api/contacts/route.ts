import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const contacts = await db.collection("contacts").find().toArray();
    return NextResponse.json({ contacts });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, role, type } = body;

    if (!name || (!phone && !email)) {
      return NextResponse.json(
        {
          error:
            "Name and at least one contact method (phone/email) are required",
        },
        { status: 400 },
      );
    }

    const db = await getDb();
    const newContact = {
      id: `contact_${Date.now()}`,
      name,
      phone,
      email,
      role: role || "stakeholder",
      type: type || "general", // 'emergency', 'fleet_manager', 'employee'
      createdAt: new Date(),
      active: true,
    };

    await db.collection("contacts").insertOne(newContact);
    return NextResponse.json({ success: true, contact: newContact });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add contact" },
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
    await db.collection("contacts").deleteOne({ id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 },
    );
  }
}
