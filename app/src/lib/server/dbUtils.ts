import { ObjectId } from "mongodb";
import * as db from "./database";
import { removeFromInbox } from "./inboxUtils";

export async function getArchive () {
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

export async function getLatestRequestTypes () {
  let requestTypes: { [title: string]: db.RequestType } = {};
  var cursor = db.requestType.find();
  for await (const reqType of cursor) {
    if (!(reqType.title in requestTypes)) {
      requestTypes[reqType.title] = reqType;
    } else if (reqType.version > requestTypes[reqType.title].version) {
      requestTypes[reqType.title] = reqType;
    }
  }

  // to be returned as list
  let reqTypeList = Object.keys(requestTypes).map((title) => {
    return requestTypes[title];
  });

  reqTypeList = reqTypeList.filter((reqType) => {
    return !reqType.deprecated;
  });

  return reqTypeList;
};

/**
 * accessed by request type id
 */
export async function getRequestTypes() {
  let requestTypes: { [id: string]: db.RequestType } = {};
  let cursor = db.requestType.find();
  for await (const reqType of cursor) {
    requestTypes[reqType._id] = reqType;
  }

  return requestTypes;
};

export async function removeFromPendingInboxes(request: db.Request) {
  // Remove request from pending of all inboxes that would still have it
  let index = request.currentStage.stageTypeIndex - 1;
  for (let i = request.history.length - 1; i >= 0; i--) {
    if (index < 0) break;
    if (request.history[i].stageTypeIndex != index) continue;

    const handlerId = request.history[i].handlerId;
    await removeFromInbox(handlerId, "recallable", {
      requestId: request._id,
      stageTypeIndex: index,
    });

    index--;
  }
}