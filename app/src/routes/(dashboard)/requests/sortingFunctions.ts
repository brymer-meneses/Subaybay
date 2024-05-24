import type { RequestSearchItem } from "./RequestsTable.svelte"

const sortPending = (a: RequestSearchItem, b: RequestSearchItem) => {
    let dateA =
      a.history.length > 0
        ? a.history[0].dateStarted.getTime()
        : a.currentStage.dateStarted.getTime();
    let dateB =
      b.history.length > 0
        ? b.history[0].dateStarted.getTime()
        : b.currentStage.dateStarted.getTime();
    return { dateA, dateB };
  };

export  const sortPendingNewest = (a: RequestSearchItem, b: RequestSearchItem) => {
    const { dateA, dateB } = sortPending(a, b);
    return dateB - dateA;
  };

export  const sortPendingOldest = (a: RequestSearchItem, b: RequestSearchItem) => {
    const { dateA, dateB } = sortPending(a, b);
    return dateA - dateB;
  };

const sortFinished = (a: RequestSearchItem, b: RequestSearchItem) => {
    const dateA = a.history[a.history.length - 1].dateFinished.getTime();
    const dateB = b.history[b.history.length - 1].dateFinished.getTime();

    return { dateA, dateB };
  };

export  const sortFinishedNewest = (a: RequestSearchItem, b: RequestSearchItem) => {
    const { dateA, dateB } = sortFinished(a, b);
    return dateB - dateA;
  };

export const sortFinishedOldest = (a: RequestSearchItem, b: RequestSearchItem) => {
    const { dateA, dateB } = sortFinished(a, b);

    return dateA - dateB;
  };