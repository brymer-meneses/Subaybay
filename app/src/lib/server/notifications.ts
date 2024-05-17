import type { ObjectId } from "mongodb";

export interface InboxNotification {
  type: "NewInboxItem" | "RecalledInboxItem" | "ReassignedInboxItem",
  requestId: ObjectId,
  stageTypeIndex: number,
}

export async function sendInboxNotification(notification: InboxNotification) {
  const response = await fetch("localhost:8080/notifications/events", { method: "POST", body: JSON.stringify(notification) });
  if (response.status !== 200) {
    throw Error("Invalid server message");
  }
}

