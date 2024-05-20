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

export type RequestType = {
  _id: string;
  title: string;
};

export type Request = {
  _id: string;
  requestTypeId: string;
  studentNumber: string;
  studentName: string;
  studentEmail: string;
  purpose: string;
  remarks: string;
};

export type Params = {
  sortBy: "date" | "requestType";
  sortType: "oldest" | "newest" | "request";
  startDate: Date;
  endDate: Date;
};