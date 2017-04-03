import {File} from '../../../shared/models/File';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';

export class JobSeekerCertificate {

    id: number;
    cert_id:number;
    cert_name:string;
    cert_university:string;

    cert_logo:string;

    cert_start_date: Date;
    cert_end_date: Date;
    cert_duration: any;
    cert_form:FormGroup;
    cert_still_studing: boolean = false;
    cert_grade: string;
    cert_doc_upload_name: string;
    cert_doc_upload_path: string;
    cert_new:boolean = false;
    cert_file_D:File = new File("Upload Certificate",'cert','Doc, PDF',2,'MB',false);
    cert_file_M:File = new File("Upload Certificate",'cert','Doc, PDF',2,'MB',false);
}
 