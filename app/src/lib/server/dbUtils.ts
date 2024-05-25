import * as db from "./database";

export async function getLatestRequestTypes () {
  let requestTypes: { [title: string]: db.RequestType } = {};
  var cursor = db.requestType.find();

  // only get highest version
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

  // remove all deprecated
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