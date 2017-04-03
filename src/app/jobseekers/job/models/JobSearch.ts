import {FormGroup} from "@angular/forms";
export class JobSearch {
    id:number;
    title:string;
    title_url:string;
    web_url:string;
    dateCreated:Date;
    alertType: string;
    alertTypeId: number;
    checked:boolean = false;
    form:FormGroup;
}