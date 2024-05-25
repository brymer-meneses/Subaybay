import { MongoClient, ObjectId } from "mongodb";
import { dev } from "$app/environment";

import { env } from "$env/dynamic/private";


// NOTE:
// This gets run by the build step somehow, MongoClient(URI) will throw an
// error if URI is not a valid mongodb URI (because mongodb://undefined:undefined/ is not valid)
// so we need to check here.
//
// Also `client.connect` is run at `src/hooks.server.ts` repeated use of
// `client.connect` is a no-op if it is connected anyway

const hostname = dev ? "localhost" : env.DATABASE_HOSTNAME;
const URI = env.DATABASE_NAME !== undefined
  ? `mongodb://${env.DATABASE_USERNAME}:${env.DATABASE_PASSWORD}@${hostname}:${env.DATABASE_PORT}/`
  : "mongodb://localhost:27017";

export const client = new MongoClient(URI);
export const database = client.db(env.DATABASE_NAME);

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
  dateAdded: Date;
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
  deprecated: boolean;
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
  copies: number;
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
