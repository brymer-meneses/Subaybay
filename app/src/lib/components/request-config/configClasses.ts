export class UserData {
    id: string;
    name: string;
    imgSrc: string;
    constructor(id: string, name: string, imgSrc: string = "") {
        this.id = id;
        this.name = name;
        this.imgSrc = imgSrc;
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