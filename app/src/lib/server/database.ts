import { MongoClient } from "mongodb";
import { DATABASE_PORT, DATABASE_HOSTNAME, DATABASE_NAME } from "$env/static/private";
import { dev } from "$app/environment";

const hostname = dev ? "localhost" : DATABASE_HOSTNAME;

export const client = new MongoClient(`mongodb://${hostname}:${DATABASE_PORT}`);
await client.connect();

export const database = client.db(DATABASE_NAME);

export const user = database.collection<User>("users");
export const session = database.collection<Session>("sessions");

export interface User {
  _id: string;
  email: string,
  name: string,
  imageUrl: string,
  isAdmin: boolean,
}

export interface Session {
  _id: string;
  expires_at: Date;
  user_id: string;
}
