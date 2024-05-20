import { type Request } from "./typeRequest"

const sortPending = (a: Request, b: Request) => {
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

export  const sortPendingNewest = (a: Request, b: Request) => {
    const { dateA, dateB } = sortPending(a, b);
    return dateB - dateA;
  };

export  const sortPendingOldest = (a: Request, b: Request) => {
    const { dateA, dateB } = sortPending(a, b);
    return dateA - dateB;
  };

const sortFinished = (a: Request, b: Request) => {
    const dateA = a.history[a.history.length - 1].dateFinished.getTime();
    const dateB = b.history[b.history.length - 1].dateFinished.getTime();

    return { dateA, dateB };
  };

export  const sortFinishedNewest = (a: Request, b: Request) => {
    const { dateA, dateB } = sortFinished(a, b);
    return dateB - dateA;
  };

export const sortFinishedOldest = (a: Request, b: Request) => {
    const { dateA, dateB } = sortFinished(a, b);

    return dateA - dateB;
  };