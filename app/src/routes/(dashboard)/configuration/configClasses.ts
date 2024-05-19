export class UserData {
  id: string;
  name: string;
  profileUrl: string;
  constructor(id: string, name: string, profileUrl: string = "") {
    this.id = id;
    this.name = name;
    this.profileUrl = profileUrl;
  }
}

export class StageType {
  stageTitle: string;
  defaultHandlerId: string;
  constructor(stageTitle: string = "", defaultHandlerId: string = "") {
    this.stageTitle = stageTitle;
    this.defaultHandlerId = defaultHandlerId;
  }
}
