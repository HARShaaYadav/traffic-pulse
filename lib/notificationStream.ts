import { EventEmitter } from "events";

declare global {
  var notificationStream: EventEmitter | undefined;
}

if (!global.notificationStream) {
  global.notificationStream = new EventEmitter();
  global.notificationStream.setMaxListeners(200); // Allow many clients
}

export const notificationStream = global.notificationStream;

export function sendNotificationToAll(data: any) {
  console.log("Broadcasting notification:", data.id);
  notificationStream.emit("notification", data);
}
