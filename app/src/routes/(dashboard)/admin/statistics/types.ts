export type User = {
  _id: string;
  name: string;
  email: string;
  profileUrl: string;
  isAdmin: boolean;
};

export type PermittedEmail = {
  email: string;
};

export type RequestTypeInstancesCount = {
  reqTitle: string;
  total: {
    finished: number;
    pending: number;
    stale: number;
  };
};

export type Summary = {
  type: string;
  count: number;
  countThisMonth: number;
};

type StageType = {
  stageTitle: string;
  defaultHandlerId: string;
}


export type RequestType = {
  _id: string;
  title: string;
  version: number;
  stages: Array<StageType>;
}

export type Request = {
  _id: string;
  requestTypeId: string;
  studentNumber: string;
  studentName: string;
  studentEmail: string;
  purpose: string;
  remarks: string;
  isFinished: boolean;
  currentStage: Stage;
  history: Array<Stage>;
  nextHandlerId: string;
  roomId: string;
};

type Stage = {
  stageTypeIndex: number;
  handlerId: string;
  prevHandlerId: string;
  finished: boolean;
  dateStarted: Date;
  dateFinished: Date;
}


export type Params = {
  sortBy: "date" | "requestType";
  sortType: "oldest" | "newest" | "request";
  startDate: Date;
  endDate: Date;
};