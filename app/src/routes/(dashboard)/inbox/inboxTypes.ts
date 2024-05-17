export interface InboxStageData {
  requestTitle: string;
  stageTitle: string; //the current stage title
  inboxStageTitle: string; // only different from stageTitle if in pending
  dateSent: Date;
  requestId: string;
  handlerId: string;
  prevHandlerId: string;
  currentStageTypeIndex: number;
  inboxStageTypeIndex: number;
  final: boolean;
  finished: boolean;
}

// only contains very basic user data
export interface UserInfo {
  name: string;
  profileUrl: string;
}
