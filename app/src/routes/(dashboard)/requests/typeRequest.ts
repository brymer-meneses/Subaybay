// instance of a `RequestType`
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
  }
  
// instance of a `StageType`
type Stage = {
stageTypeIndex: number;
handlerId: string;
prevHandlerId: string;
finished: boolean;
dateStarted: Date;
dateFinished: Date;
}