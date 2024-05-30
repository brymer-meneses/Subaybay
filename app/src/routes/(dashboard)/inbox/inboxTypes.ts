export interface InboxStageData {
  requestTitle: string;
  stageTitle: string; //the current stage title
  inboxStageTitle: string; // only different from stageTitle if in pending
  dateSent: Date;
  requestId: string;
  handlerId: string;
  remarks: string;
  prevHandlerId: string;
  currentStageTypeIndex: number;
  inboxStageTypeIndex: number;
  inboxType: "active" | "pending";
  final: boolean;
  finished: boolean;
}

export interface MultiStageData {
  mainStage: InboxStageData;
  otherStages: InboxStageData[];
}

// only contains very basic user data
export interface UserInfo {
  name: string;
  profileUrl: string;
}
