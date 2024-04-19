import { MongoClient } from "mongodb";
import { DATABASE_PORT, DATABASE_HOSTNAME, DATABASE_NAME } from "$env/static/private";
import { dev } from "$app/environment";

const hostname = dev ? "localhost" : DATABASE_HOSTNAME;

export const client = new MongoClient(`mongodb://${hostname}:${DATABASE_PORT}`);
await client.connect();

export const database = client.db(DATABASE_NAME);

export const user = database.collection<User>("users");
export const session = database.collection<Session>("sessions");
export const request = database.collection<Request>("requests");

export interface User {
  _id: string;
  email: string,
  name: string,
  profileUrl: string,
  isAdmin: boolean,
}

// camelcase needs to stay since `lucia` requires so
export interface Session {
  _id: string;
  expires_at: Date;
  user_id: string;
}

export interface StageType {
  _id: string;
  stageTitle: string;
  // how far along is this stage?
  stageNumber: number;
  defaultHandler: string;
}

export interface RequestType {
  _id: string;
  title: string;
  stages: Array<Array<StageType>>;
}

// instance of a `RequestType`
export interface Request {
  _id: string;
  requestType: RequestType;
  studentNumber: string;
  studentName: string;
  studentEmail: string;
  purpose: string;
}

// instance of a `StageType`
export interface Stage {
  _id: string;
  stageType: StageType;
  currentHandler: string;
}
