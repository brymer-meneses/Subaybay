import type { Message, Request, RequestType, User, StageIdentifier } from "$lib/server/database";

export interface MessageNotificationData {
  _id: string,
  request: Request;
  requestType: RequestType,
  message: Message;
  seen: boolean,
  from: User;
}

export interface InboxNotificationData {
  _id: string,
  type: "NewStage" | "RolledbackStage" | "ReassignedStage"
  request: Request,
  requestType: RequestType,
  stage: StageIdentifier,
  seen: boolean,
  // seconds since unix epoch
  dateTime: number,
  from: User,
}
