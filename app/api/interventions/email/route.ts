import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email, phone, role, interventionId, title, description } =
      await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    let subject = `ACTION REQUIRED: ${title}`;
    let bodyContext = "";

    // Role-based personalization
    const selectedRole = role || "driver";

    if (selectedRole === "driver") {
      subject = `🚨 URGENT DISPATCH: ${title}`;
      bodyContext = `
        YOU ARE AUTHORIZED TO DEPLOY IMMEDIATELY.
        PRIORITY: CRITICAL
        TARGET: Field Unit
        `;
    } else if (selectedRole === "corporate") {
      subject = `📢 Service Update: Traffic Advisory for ${title}`;
      bodyContext = `
        ADVISORY NOTE:
        Please inform employees/transport desks to expect delays.
        Work-From-Home (WFH) is recommended if applicable.
        `;
    } else if (selectedRole === "public") {
      subject = `⚠️ Traffic Alert: ${title}`;
      bodyContext = `
        PUBLIC ADVISORY:
        Commuters are advised to avoid the affected sector.
        Use suggested alternate routes.
        `;
    }

    const text = `
Traffic Control Center Alert
--------------------------------
${bodyContext}
--------------------------------

Intervention ID: ${interventionId}
Action: ${title}
Details: ${description}

Contact Phone: ${phone || "N/A"}

--
TrafficPulse
    `;

    const result = await sendEmail({ to: email, subject, text });

    if (result.success) {
      return NextResponse.json({ success: true, messageId: result.messageId });
    } else {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
