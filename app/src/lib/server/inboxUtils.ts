import * as db from "$lib/server/database";

export async function getInbox (userId: string) {
  let userInbox: db.Inbox | null = await db.inbox.findOne({ userId: userId });
  if (!userInbox) {
    userInbox = {
      userId: userId,
      recallable: [],
      current: [],
    };

    await db.inbox.insertOne(userInbox);
  }

  return userInbox;
};

export async function addToInbox (
  userId: string,
  type: "current" | "recallable",
  stageIdentifier: db.StageIdentifier,
) {
  const userInbox = await getInbox(userId);

  await db.inbox.updateOne(
    { userId: userId },
    {
      $set: { [type]: [...userInbox[type], stageIdentifier] },
    },
  );
};

export async function removeFromInbox (
  userId: string,
  type: "current" | "recallable",
  stageIdentifier: db.StageIdentifier,
) {
  const userInbox = await getInbox(userId);

  await db.inbox.updateOne(
    { userId: userId },
    {
      $set: {
        [type]: userInbox[type].filter(
          (item) =>
            item.stageTypeIndex !== stageIdentifier.stageTypeIndex ||
            item.requestId !== stageIdentifier.requestId,
        ),
      },
    },
  );
};

export async function removeFromAllInboxes(request: db.Request) {
  await removeFromPendingInboxes(request);

  await removeFromActiveInbox(request);
}

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

export async function removeFromActiveInbox (request: db.Request) {
  await removeFromInbox(request.currentStage.handlerId, "current", {
    requestId: request._id,
    stageTypeIndex: request.currentStage.stageTypeIndex,
  });
};

export async function moveInInbox (
  userId: string,
  from: "current" | "recallable",
  stageIdentifier: db.StageIdentifier,
) {
  const to = from == "current" ? "recallable" : "current";

  const userInbox = await getInbox(userId);

  await db.inbox.updateOne(
    { userId: userId },
    {
      $set: {
        [to]: [...userInbox[to], stageIdentifier],
        [from]: userInbox[from].filter(
          (item) =>
            item.stageTypeIndex !== stageIdentifier.stageTypeIndex ||
            item.requestId !== stageIdentifier.requestId,
        ),
      },
    },
  );
};

export async function existsInInbox (
  userId: string,
  type: "current" | "recallable",
  stageIdentifier: db.StageIdentifier,
) {
  const inbox = await getInbox(userId);

  for (const item of inbox[type]) {
    if (
      item.requestId == stageIdentifier.requestId &&
      item.stageTypeIndex == stageIdentifier.stageTypeIndex
    ) {
      return true;
    }
  }

  return false;
};
