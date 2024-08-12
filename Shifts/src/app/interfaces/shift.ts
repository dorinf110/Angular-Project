import { Time } from "@angular/common";

export interface Shift {
    usrId:string,
    date:number,
    startTime:string,
    endTime:string,
    wage:number;
    place:string;
    name:string;
    comments:string;
    profit:number;
}
