import twilio from "twilio";
import { getDb } from "./mongodb";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

export async function sendSMS(to: string, body: string) {
  if (!accountSid || !authToken || !fromNumber) {
    console.warn("Twilio credentials missing. Skipping SMS.");
    return { success: false, error: "Missing Twilio Credentials" };
  }

  const client = twilio(accountSid, authToken);

  try {
    const message = await client.messages.create({
      body,
      from: fromNumber,
      to,
    });
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error(`Failed to send SMS to ${to}:`, error);
    return { success: false, error };
  }
}

export async function notifyDrivers(message: string) {
  console.log(`[Twilio] Broadcasting to drivers: "${message}"`);

  const db = await getDb();
  // Fetch contacts with role 'driver' or 'fleet_manager'
  const recipients = await db
    .collection("contacts")
    .find({
      role: { $in: ["driver", "fleet_manager", "transport_admin"] },
      phone: { $exists: true, $ne: "" },
    })
    .toArray();

  if (recipients.length === 0) {
    console.warn("No contacts found with valid phone numbers.");
    return { success: false, error: "No recipients found" };
  }

  const results = await Promise.all(
    recipients.map((recipient) =>
      sendSMS(recipient.phone, `TRAFFIC ALERT: ${message}`),
    ),
  );

  const successCount = results.filter((r) => r.success).length;
  console.log(`[Twilio] Sent ${successCount}/${recipients.length} messages.`);

  return {
    success: true,
    recipientCount: successCount,
    total: recipients.length,
  };
}
