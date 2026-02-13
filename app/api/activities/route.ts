import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();

    // 1. Fetch Intervention History (Decisions)
    const decisions = await db
      .collection("intervention_history")
      .find()
      .sort({ timestamp: -1 })
      .limit(20)
      .toArray();

    // 2. Fetch Dispatch Logs (Actions)
    const dispatches = await db
      .collection("logs")
      .find()
      .sort({ timestamp: -1 })
      .limit(20)
      .toArray();

    // 3. Fetch Signal Logs
    const signals = await db
      .collection("signals")
      .find({ key: "signal_plan_log" })
      .sort({ activatedAt: -1 })
      .limit(20)
      .toArray();

    // 4. Fetch Emergency Activations
    const emergencies = await db
      .collection("emergency_corridors")
      .find()
      .sort({ activatedAt: -1 })
      .limit(20)
      .toArray();

    // 5. Fetch Incident Reports
    const incidents = await db
      .collection("incidents")
      .find()
      .sort({ timestamp: -1 })
      .limit(20)
      .toArray();

    // 6. Combine and Format
    const activities = [
      ...decisions.map((d: any) => ({
        id: d._id,
        type: "decision",
        title: d.title,
        action: d.action, // accepted/rejected
        timestamp: d.timestamp,
        details: d.description,
      })),
      ...dispatches.map((l: any) => ({
        id: l._id,
        type: "dispatch",
        title: `Dispatch: ${l.action.toUpperCase()}`,
        action: l.status?.sms ? "sent" : "failed",
        timestamp: l.timestamp,
        details: `To: ${l.recipient?.phone || "Unknown"}`,
      })),
      ...signals.map((s: any) => ({
        id: s._id,
        type: "signal",
        title: "Signal Update",
        action: s.logType === "timing_override" ? "override" : "plan_change",
        timestamp: s.activatedAt,
        details: s.detail,
      })),
      ...emergencies.map((e: any) => ({
        id: e._id,
        type: "emergency",
        title: `Emergency: ${e.type.toUpperCase()}`,
        action: e.status,
        timestamp: e.activatedAt,
        details: `${e.from} -> ${e.to}`,
      })),
      ...incidents.map((i: any) => ({
        id: i._id,
        type: "incident",
        title: `Incident: ${i.type.replace("_", " ").toUpperCase()}`,
        action: i.status,
        timestamp: i.timestamp,
        details: `Reported at ${i.location}`,
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 50); // Keep top 50 recent actions

    return NextResponse.json({ success: true, activities });
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 },
    );
  }
}
