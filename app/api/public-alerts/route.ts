import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { notifyDrivers, sendSMS } from "@/lib/twilio";
import { sendNotificationToAll } from "@/lib/notificationStream";

export const dynamic = "force-dynamic";

// GET: Fetch public alert history
export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection("public_alerts");

    // Fetch latest alerts
    const alerts = await collection
      .find()
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();

    // Calculate stats using aggregation for accuracy
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const statsAggregation = await collection
      .aggregate([
        {
          $match: {
            timestamp: { $gte: today.toISOString() },
          },
        },
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
            totalRecipients: { $sum: "$recipients" },
          },
        },
      ])
      .toArray();

    const stats = {
      smsSent: 0,
      pushSent: 0,
      vmsActive: 0,
    };

    statsAggregation.forEach((stat) => {
      if (stat._id === "sms") stats.smsSent = stat.totalRecipients || 0;
      if (stat._id === "push") stats.pushSent = stat.totalRecipients || 0;
      // vms if needed
    });

    return NextResponse.json({ alerts, stats });
  } catch (error) {
    console.error("Error fetching public alerts:", error);
    return NextResponse.json(
      { error: "Failed to fetch public alerts" },
      { status: 500 },
    );
  }
}

// POST: Create a new public alert
export async function POST(request: NextRequest) {
  try {
    const { type, message, priority, contactId, senderId } =
      await request.json();

    if (!type || !message) {
      return NextResponse.json(
        { error: "Type and message are required" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const collection = db.collection("public_alerts");

    let recipientCount = 0;
    let externalId = null;
    let status = "delivered";

    // Integration with real services
    if (type === "sms") {
      try {
        if (contactId) {
          const contact = await db
            .collection("contacts")
            .findOne({ id: contactId });
          if (contact && contact.phone) {
            const smsResult = await sendSMS(contact.phone, message);
            recipientCount = 1;
            if (!smsResult.success) {
              status = "failed";
            }
          } else {
            status = "failed";
            console.error("Contact not found or missing phone");
          }
        } else {
          // Fallback to broadcast logic
          const smsResult = await notifyDrivers(message);
          // @ts-ignore
          if (smsResult.success) {
            // @ts-ignore
            recipientCount = smsResult.recipientCount || 0;
          }
        }
      } catch (e) {
        status = "failed";
        console.error("SMS exception:", e);
      }
    } else if (type === "push") {
      // Push Notification Logic (Real Data)
      // Count all users in the system as potential recipients
      const userCount = await db.collection("users").countDocuments();
      recipientCount = userCount;
    } else {
      // Others
      recipientCount = 0;
    }

    // Fallback for demo if services aren't configured but we want to show UI success
    if (status === "failed") {
      // We still save it as failed
    }

    const newAlert = {
      id: `pub_alert_${Date.now()}`,
      type,
      message,
      priority: priority || "medium",
      timestamp: new Date().toISOString(),
      status,
      recipients: recipientCount,
      externalId,
      senderId,
      createdAt: new Date(),
    };

    await collection.insertOne(newAlert);

    // Broadcast notification to all connected clients
    sendNotificationToAll(newAlert);

    return NextResponse.json({ success: true, alert: newAlert });
  } catch (error) {
    console.error("Error creating public alert:", error);
    return NextResponse.json(
      { error: "Failed to create public alert" },
      { status: 500 },
    );
  }
}
