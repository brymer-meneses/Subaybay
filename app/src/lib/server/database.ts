import { MongoClient } from "mongodb";
import {
  DATABASE_PORT,
  DATABASE_HOSTNAME,
  DATABASE_NAME,
} from "$env/static/private";
import { dev } from "$app/environment";

const hostname = dev ? "localhost" : DATABASE_HOSTNAME;

export const client = new MongoClient(`mongodb://${hostname}:${DATABASE_PORT}/`);
await client.connect();

export const database = client.db(DATABASE_NAME);

export const user = database.collection<User>("users");
export const session = database.collection<Session>("sessions");
export const request = database.collection<Request>("requests");
export const requestType = database.collection<RequestType>("requestTypes");
export const inbox = database.collection<Inbox>("inboxes");

export interface User {
  _id: string;
  email: string;
  name: string;
  profileUrl: string;
  isAdmin: boolean;
}

// camelcase needs to stay since `lucia` requires so
export interface Session {
  _id: string;
  expires_at: Date;
  user_id: string;
}

export interface StageType {
  stageTitle: string;
  defaultHandlerId: string;
}

export interface RequestType {
  _id: string;
  title: string;
  stages: Array<StageType>;
}

// instance of a `RequestType`
export interface Request {
  _id: string;
  requestTypeId: string;
  studentNumber: string;
  studentName: string;
  studentEmail: string;
  purpose: string;
  remarks: string;
  isFinished: boolean;
  currentStage: Stage;
  history: Array<Stage>;
  nextHandlerId: string;
}

// instance of a `StageType`
export interface Stage {
  stageTypeIndex: number;
  handlerId: string;
  finished: boolean;
  dateStarted: Date;
  dateFinished: Date;
  roomId: string;
}

export interface Inbox {
  userId: string;
  recallableRequestIds: Array<string>;
  currentRequestIds: Array<string>;
}

export interface InboxStageData {
  requestTitle: string;
  stageTitle: string;
  dateSent: Date;
  requestId: string;
}
