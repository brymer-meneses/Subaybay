import type { ObjectId } from "mongodb";
import { writable } from "svelte/store";

export interface InboxItemIdentifier {
  requestId: string,
  stageTypeIndex: string,
}

export interface Notifications {
  inbox: {
    pending: Array<[InboxItemIdentifier, number]>,
    active: Array<[InboxItemIdentifier, number]>,
  }
}

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


export const notifications = writable<Notifications>({ inbox: { pending: [], active: [] } });
