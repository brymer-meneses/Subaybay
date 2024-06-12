import type { PageServerLoad } from "./$types"
import type { MessageNotificationData } from "./types";

import * as db from "$lib/server/database";
import { ObjectId } from "mongodb";

function sanitizeId(elem: any) {
  for (const [f_, object] of Object.entries<any>(elem)) {
    if (object._id && object._id instanceof ObjectId) {
      object._id = object._id.toString();
    }
  }
  return elem;
}

export const load: PageServerLoad = async ({ cookies, locals }) => {

  const messageNotificationData = (await db.notification.aggregate<MessageNotificationData>(
    [
      {
        $match: {
          "userId": locals.user?.id,
          "body.type": "message"
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo"
        }
      },

      {
        $unwind: "$userInfo"
      },

      {
        $lookup: {
          from: "messages",
          localField: "body.content.messageId",
          foreignField: "_id",
          as: "message"
        }
      },

      {
        $unwind: "$message"
      },

      {
        $lookup: {
          from: "requests",
          localField: "message.requestId",
          foreignField: "_id",
          as: "request"
        }
      },

      {
        $unwind: "$request"
      },

      {
        $lookup: {
          from: "requestTypes",
          localField: "request.requestTypeId",
          foreignField: "_id",
          as: "requestType"
        }
      },

      {
        $unwind: "$requestType"
      },

      {
        $sort: {
          "message.dateTime": -1
        }
      },
      {
        $project: {
          _id: 0,
          seen: 1,
          from: "$userInfo",
          request: "$request",
          requestType: "$requestType",
          message: "$message",
        }
      },
    ],
  ).toArray()).map(sanitizeId);


  return { messageNotificationData }

}
