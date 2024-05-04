type User = {
    _id: string;
    name: string;
    email: string;
    profileUrl: string;
    isAdmin: boolean;
  };

type RequestTypeInstancesCount = {
  reqType: string, 
  reqTitle: string, 
  total: {
    finished: number, 
    pending: number, 
    stale: number
  }
}