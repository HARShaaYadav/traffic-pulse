import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { sendSMS } from "@/lib/twilio";

export async function POST(request: NextRequest) {
  try {
    const { incidentId, action, location, incidentType } = await request.json();

    if (!incidentId || !action) {
      return NextResponse.json(
        { error: "Incident ID and Action are required" },
        { status: 400 },
      );
    }

    let recipientPhone = "";
    let smsText = "";
    let dispatchedDriver: any = null;

    if (action === "tow") {
      // Fetch a tow truck driver from the database
      const db = await getDb();
      const driver =
        (await db.collection("contacts").findOne({
          role: "driver",
          type: "tow", // Prefer specific type if available
        })) || (await db.collection("contacts").findOne({ role: "driver" })); // Fallback to any driver

      if (driver) {
        dispatchedDriver = driver;
        recipientPhone = driver.phone || "+918123048560";
        console.log(
          `[Dispatch] Found driver: ${driver.name} (${recipientPhone})`,
        );
      } else {
        console.warn("[Dispatch] No driver found in DB, using default.");
        recipientPhone = "+918123048560";
      }

      smsText = `TOW-REQ: ${incidentType} at ${location}. Deploy immediately. ID: ${incidentId}`;
    } else if (action === "alert") {
      recipientPhone = "BROADCAST";
      smsText = `ALERT: ${incidentType} at ${location}. Drive carefully.`;
    } else if (action === "diversion") {
      // Diversion usually handled by signals API, but we can notify traffic police
      recipientPhone = "+91 100";
      smsText = `DIVERSION: Active at ${location} due to ${incidentType}.`;
    }

    // 1. Send Real SMS (if phone number is valid and not broadcast/shortcode)
    let smsResult: { success: boolean; sid?: string; error?: any } = {
      success: false,
      error: "Skipped",
    };

    const isShortCode = recipientPhone.replace(/\D/g, "").length < 10;
    const isBroadcast = recipientPhone === "BROADCAST";

    if (recipientPhone && !isBroadcast && !isShortCode) {
      smsResult = await sendSMS(recipientPhone, smsText);
      if (smsResult.success) {
        console.log(`[SMS] Sent to ${recipientPhone}: ${smsResult.sid}`);
      } else {
        console.warn(
          `[SMS] Failed to send to ${recipientPhone}:`,
          smsResult.error,
        );
      }
    } else {
      // Simulate/Log for Broadcast or Short Codes (Police 100)
      console.log(
        `[SMS] Simulation/Broadcast to ${recipientPhone}: ${smsText}`,
      );
      smsResult.success = true; // Treat as success for the UI
    }

    // 2. Log to Database
    try {
      const db = await getDb();
      await db.collection("logs").insertOne({
        type: "dispatch",
        action,
        incidentId,
        location,
        recipient: { phone: recipientPhone },
        status: { sms: smsResult.success },
        timestamp: new Date(),
      });
      console.log("[Dispatch] Logged to DB");
    } catch (logError) {
      console.error("[Dispatch] Failed to log to DB:", logError);
    }

    if (smsResult.success || recipientPhone === "BROADCAST") {
      return NextResponse.json({
        success: true,
        message: `${action} dispatched successfully`,
        smsSid: smsResult.sid,
        driver:
          action === "tow" && dispatchedDriver
            ? {
                name: dispatchedDriver.name,
                phone: dispatchedDriver.phone,
                vehicle: dispatchedDriver.vehicle || "Standard Tow Truck",
                rating: dispatchedDriver.rating || 4.5,
              }
            : undefined,
      });
    } else {
      console.error("Dispatch failed", {
        smsError: smsResult.error,
      });
      // We return success to not block the UI if SMS fails in dev environment without keys
      return NextResponse.json({
        success: true,
        warning: "Dispatch simulation only (check logs)",
        driver:
          action === "tow" && dispatchedDriver
            ? {
                name: dispatchedDriver.name,
                phone: dispatchedDriver.phone,
                vehicle: dispatchedDriver.vehicle || "Standard Tow Truck",
                rating: dispatchedDriver.rating || 4.5,
              }
            : undefined,
      });
    }
  } catch (error) {
    console.error("Dispatch API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
