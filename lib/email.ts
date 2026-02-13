import nodemailer from "nodemailer";

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  try {
    // Check if we have real SMTP credentials
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: '"TrafficPulse" <alerts@trafficpulse.com>',
        to,
        subject,
        text,
      });

      console.log("Message sent: %s", info.messageId);
      return { success: true, messageId: info.messageId };
    }

    // Fallback: Log the email (Mock)
    // Fallback: Log the email (Mock)
    console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);

    // Create a warning if no keys are present but we are "sending"
    if (!process.env.SMTP_HOST) {
      console.warn(
        "[MOCK EMAIL] SMTP_HOST not set. Email simulated successfully.",
      );
    }

    return { success: true, messageId: "mock-email-id" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
