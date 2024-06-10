export interface InboxStageData {
  requestTitle: string;
  stageTitle: string; //the current stage title
  inboxStageTitle: string; // only different from stageTitle if in pending
  nextStageTitle: string; // possibly "None" for requests on their last stage
  dateSent: Date;
  requestId: string;
  handlerId: string;
  remarks: string;
  prevHandlerId: string;
  currentStageTypeIndex: number;
  inboxStageTypeIndex: number;
  inboxType: "active" | "pending";
  finalStageTypeIndex: number;
  finished: boolean;
  studentName: string;
  studentNumber: string;
}

export interface MultiStageData {
  mainStage: InboxStageData;
  otherStages: InboxStageData[];
}

