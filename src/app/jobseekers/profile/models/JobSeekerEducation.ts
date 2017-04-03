import {File} from '../../../shared/models/File';
import {FormGroup} from '@angular/forms';
import {City} from "../../../shared/models/City";
import {Country} from "../../../shared/models/Country";



export class JobSeekerEducation {

    id: number;
    school:string;
    edu_id:number;
    edu_form:FormGroup;
    edu_name:string;
    edu_qualification:string;
    edu_qualification_id:any = "";
    edu_field_study:string;
    edu_field_study_id:any = "";
    edu_logo:string;
    edu_city:string;
    city:City;
    country:Country;
    edu_city_id:any = "";
    edu_city_name:string;
    edu_country:string;
    edu_country_name:string;
    edu_country_code:any = "";
    edu_start_date: Date;
    edu_end_date: Date;
    edu_duration: number;
    edu_still_studing: boolean = false;
    edu_grade: string;
    edu_doc_upload_name: string;
    edu_doc_upload_path: string;
    edu_new:boolean = false;
    edu_file_D:File = new File("Education Certificate",'edu','Doc, PDF',4,'MB');
    edu_file_M:File = new File("Education Certificate",'edu','Doc, PDF',4,'MB');

}

 