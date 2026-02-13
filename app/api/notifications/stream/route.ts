import { NextRequest, NextResponse } from "next/server";
import { notificationStream } from "@/lib/notificationStream";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const sendEvent = (data: any) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      console.log("Client connected to notification stream");

      // Send initial connection message
      sendEvent({
        type: "connected",
        message: "Connected to notification stream",
      });

      const onNotification = (data: any) => {
        console.log("Pushing notification to client", data.id);
        sendEvent(data);
      };

      notificationStream.on("notification", onNotification);

      // Clean up when connection closes
      request.signal.addEventListener("abort", () => {
        console.log("Client disconnected from notification stream");
        notificationStream.off("notification", onNotification);
        controller.close();
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
