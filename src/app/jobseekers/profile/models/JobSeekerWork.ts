import {File} from '../../../shared/models/File';
import {FormGroup} from '@angular/forms';
import {City} from "../../../shared/models/City";
import {Country} from "../../../shared/models/Country";
import {Sector} from "../../../shared/models/Sector";
import {Company} from "../../../shared/models/Company";
import {Department} from "../../../shared/models/Department";




export class JobSeekerWork {
    id: number;
    company_form:FormGroup;
    company_id: number;
    company_name: string;
    company_title: string;
    company_logo: string;
    company_sector_id: any = "";
    company_sector: Sector;
    company:Company;
    department:Department;
    company_city:City;
    company_country:Country;
    company_city_id: any = "";
    company_country_name: string;
    company_start_date: Date;
    company_end_date: Date;
    company_still_working: boolean = false;
    company_duration: number;
    company_doc_upload_name: string;
    company_doc_upload_path: string;
    temp_roles_resp: string = "";
    temp_roles_resp_valid:boolean = true;
    valid_state:boolean;
    newed:boolean = false;
    company_roles_and_resp: RolesAndResponsible[];
    work_file_D:File = new File("Work Exp Certificate",'exp','Doc, PDF',4,'MB');
    work_file_M:File = new File("Work Exp Certificate",'exp','Doc, PDF',4,'MB');

}


export class RolesAndResponsible {

    constructor(name) {
        this.name = name;
    }

    id:number;
    name:string;

}



