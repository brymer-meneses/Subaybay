type User = {
  _id: string;
  name: string;
  email: string;
  profileUrl: string;
  isAdmin: boolean;
};

type PermittedEmail = {
  email: string;
};

type RequestTypeInstancesCount = {
  reqTitle: string;
  total: {
    finished: number;
    pending: number;
    stale: number;
  };
};

type summary = {
  type: string;
  count: number;
  countThisMonth: number;
};

type RequestType = {
  _id: string;
  title: string;
};

type OURRequest = {
  _id: string;
  requestTypeId: string;
  studentNumber: string;
  studentName: string;
  studentEmail: string;
  purpose: string;
  remarks: string;
};
