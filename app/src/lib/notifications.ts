import type { User } from "lucia";
import { writable } from "svelte/store";

export interface StageIdentifier {
  requestId: string;
  stageTypeIndex: string;
}

export interface Notifications {
  inbox: {
    pending: Array<[StageIdentifier, number]>;
    active: Array<[StageIdentifier, number]>;
  };
}

export interface InboxNotification {
  type: "NewStage" | "RolledBackStage" | "ReassignedStage";
  requestId: string;
  stageTypeIndex: number;
}

export async function sendInboxNotification(
  notification: InboxNotification,
  receiverId: string,
  credentials: { sessionId: string; userId: string },
  fetch: any,
) {
  if (receiverId == credentials.userId) {
    return;
  }

  const payload = JSON.stringify({
    type: notification.type,
    stage: {
      stageTypeIndex: notification.stageTypeIndex,
      requestId: notification.requestId,
    },
    from: credentials.userId,
    receiverId,
  });

  const response = await fetch("/notifications/events", {
    method: "POST",
    body: payload,
    headers: {
      "Content-Type": "application/json",
      userId: credentials.userId,
      sessionId: credentials.sessionId,
    },
  });

  try {
    const body = await response.text();
    console.log(body);
  } catch (err) {
    console.log(err);
  }
}

export const notifications = writable<Notifications>({
  inbox: { pending: [], active: [] },
});
