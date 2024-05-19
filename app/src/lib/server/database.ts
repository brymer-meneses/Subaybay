import { MongoClient, ObjectId } from "mongodb";
import {
  DATABASE_PORT,
  DATABASE_HOSTNAME,
  DATABASE_NAME,
} from "$env/static/private";
import { dev } from "$app/environment";

const hostname = dev ? "localhost" : DATABASE_HOSTNAME;

export const client = new MongoClient(
  `mongodb://${hostname}:${DATABASE_PORT}/`,
);
await client.connect();

export const database = client.db(DATABASE_NAME);

export const user = database.collection<User>("users");
export const session = database.collection<Session>("sessions");
export const request = database.collection<Request>("requests");
export const requestType = database.collection<RequestType>("requestTypes");
export const inbox = database.collection<Inbox>("inboxes");
export const archive = database.collection<Archive>("archive");
export const permittedEmail =
  database.collection<PermittedEmail>("permittedEmails");

export interface User {
  _id: string;
  email: string;
  name: string;
  profileUrl: string;
  isAdmin: boolean;
}

export interface PermittedEmail {
  email: string;
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
  version: number;
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
  roomId: string;
}

// instance of a `StageType`
export interface Stage {
  stageTypeIndex: number;
  handlerId: string;
  prevHandlerId: string;
  finished: boolean;
  dateStarted: Date;
  dateFinished: Date;
}

export interface Message {
  _id: ObjectId;
  requestId: string;
  userId: string;

  // seconds since the unix epoch
  dateTime: number;
  content: string;
}

export interface Inbox {
  userId: string;
  recallable: Array<StageIdentifier>;
  current: Array<StageIdentifier>;
}

export interface StageIdentifier {
  requestId: string;
  stageTypeIndex: number;
}

export interface InboxStageData {
  requestTitle: string;
  stageTitle: string;
  dateSent: Date;
  requestId: string;
}

export interface Archive {
  _id: string;
  requestIds: Array<string>;
}
