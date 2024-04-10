export const addColor = "#6cf5a5";
export const addHoverColor = "#87fad0";
export const deleteColor = "#db2a4d";
export const deleteHoverColor = "#e8356e";
export const disabledColor = "#909599";
export const headerColor = "#dee2e3";
export const subBGColor = "#d2d8d9";
export const subBGHoverColor = "#e3e7e8";
export const mainBGColor = "#bdc3c7"
export const renamableColor = "#b6d4d9";

export const height = 40;
export const buttonSize = height / 2;
export const radius = buttonSize / 2;

export enum ButtonType {
    Delete = -1,
    Disabled = 0,
    Add = 1
}

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

export class Step {
    name: string;
    handler: string;
    constructor(stepName: string, defaultHandler: string) {
        this.name = stepName;
        this.handler = defaultHandler;
    }
}