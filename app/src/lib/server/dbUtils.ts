import { ObjectId } from "mongodb";
import * as db from "./database";

export const getArchive = async () => {
  let archive = await db.archive.findOne();
  if (!archive) {
    archive = {
      _id: new ObjectId().toString(),
      requestIds: [],
    };
    await db.archive.insertOne(archive);
  }

  return archive;
};

export const getLatestRequestTypes = async (): Promise<db.RequestType[]> => {
  let requestTypes: { [title: string]: db.RequestType } = {};
  var cursor = db.requestType.find();
  for await (const reqType of cursor) {
    if (!(reqType.title in requestTypes)) {
      requestTypes[reqType.title] = reqType;
    } else if (reqType.version > requestTypes[reqType.title].version) {
      requestTypes[reqType.title] = reqType;
    }
  }

  // return as list
  return Object.keys(requestTypes).map((title) => {
    return requestTypes[title];
  });
};

/**
 * accessed by request type id
 */
export const getRequestTypes = async () => {
  let requestTypes: { [id: string]: db.RequestType } = {};
  let cursor = db.requestType.find();
  for await (const reqType of cursor) {
    requestTypes[reqType._id] = reqType;
  }

  return requestTypes;
};
