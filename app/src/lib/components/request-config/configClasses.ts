export class UserData {
    email: string; //used like an id
    name: string;
    profileUrl: string;
    constructor(email: string, name: string, profileUrl: string = "") {
        this.email = email;
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