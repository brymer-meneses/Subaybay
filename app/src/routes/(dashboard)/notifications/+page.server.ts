import type { PageServerLoad, Actions } from "./$types"
import type { MessageNotificationData, InboxNotificationData } from "./types";

import { z } from "zod";

import * as db from "$lib/server/database";
import { ObjectId } from "mongodb";
import { zfd } from "zod-form-data";
import { setFlash } from "sveltekit-flash-message/server";
import { message } from "sveltekit-superforms";
import { redirect } from "@sveltejs/kit";


export const load: PageServerLoad = async ({ locals }) => {
  const messageNotificationData = await getMessageNotifications(locals.user?.id!);
  const inboxNotificationsData = await getInboxNotifications(locals.user?.id!);

  return { messageNotificationData, inboxNotificationsData }
}


export const actions: Actions = {
  set_seen: async ({ request, cookies }) => {

    const schema = zfd.formData({
      notification_id: zfd.text(),
    })

    try {
      const { notification_id } = schema.parse(await request.formData());
      const notification = await db.notification.findOneAndUpdate({ _id: new ObjectId(notification_id) }, {
        "$set": {
          "seen": true,
        }
      })

      // TODO: redirect user to the proper path
      // also learn how i can leverage cookies to make the user open certain tabs using cookies

    } catch (error) {
      console.log(error)
      setFlash({ type: "error", message: "Something went wrong" }, cookies);
      return;
    }

  }
}

async function getInboxNotifications(userId: string) {
  const inboxNotificationsData = db.notification.aggregate<InboxNotificationData>([
    {
      $match: {
        "userId": userId,
        "body.type": "event",
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "body.content.from",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },

    {
      $lookup: {
        from: "requests",
        localField: "body.content.stage.requestId",
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
      $project: {
        _id: 1,
        seen: 1,
        from: "$user",
        request: "$request",
        requestType: "$requestType",
        stage: "$body.content.stage",
        type: "$body.content.type",
        dateTime: 1,
      }
    },
  ]);

  return (await inboxNotificationsData.toArray()).map(sanitizeId);
}
async function getMessageNotifications(userId: string) {
  const messageNotificationData = (await db.notification.aggregate<MessageNotificationData>(
    [
      {
        $match: {
          "userId": userId,
          "body.type": "message"
        },
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
          from: "users",
          localField: "message.userId",
          foreignField: "_id",
          as: "user"
        }
      },

      {
        $unwind: "$user"
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
          "message.dateTime": -1,
        }
      },
      {
        $project: {
          _id: 1,
          seen: 1,
          from: "$user",
          request: "$request",
          requestType: "$requestType",
          message: "$message",
        }
      },
    ],
  ).toArray()).map(sanitizeId);

  return messageNotificationData as InboxNotificationData[];
}

function sanitizeId(elem: any) {
  if (elem._id) {
    elem._id = elem._id.toString();
  }
  for (const [_, object] of Object.entries(elem)) {
    // @ts-ignore
    if (object._id && object._id instanceof ObjectId) {
      // @ts-ignore
      object._id = object._id.toString();
    }
  }
  return elem;
}
