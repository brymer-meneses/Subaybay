export interface InboxStageData {
    requestTitle: string;
    stageTitle: string;
    dateSent: Date;
    requestId: string;
    handlerId: string;
    prevHandlerId: string;
    currentStageTypeIndex: number;
    inboxStageTypeIndex: number;
    final: boolean;
    finished: boolean;
  }