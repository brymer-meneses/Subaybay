import * as db from "$lib/server/database";

export const getInbox = async (userId: string): Promise<db.Inbox> => {
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

export const addToInbox = async (
  userId: string,
  type: "current" | "recallable",
  stageIdentifier: db.StageIdentifier,
) => {
  const userInbox = await getInbox(userId);

  await db.inbox.updateOne(
    { userId: userId },
    {
      $set: { [type]: [...userInbox[type], stageIdentifier] },
    },
  );
};

export const removeFromInbox = async (
  userId: string,
  type: "current" | "recallable",
  stageIdentifier: db.StageIdentifier,
) => {
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

export const moveInInbox = async (
  userId: string,
  from: "current" | "recallable",
  stageIdentifier: db.StageIdentifier,
) => {
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