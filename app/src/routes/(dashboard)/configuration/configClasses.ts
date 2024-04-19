

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

export class SubstageData {
  stageName: string;
  handlerIndex: number;
  constructor(stageName: string = "", handlerIndex: number = 0) {
    this.stageName = stageName;
    this.handlerIndex = handlerIndex;
  }
}
