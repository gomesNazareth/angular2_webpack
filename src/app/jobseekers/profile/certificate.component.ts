import {FormBuilder,Validators } from '@angular/forms';

import {Component,Input,OnInit,EventEmitter,Output} from '@angular/core'
import {BehaviorSubject} from "rxjs/Rx";


//models

import {JobSeekerCertificate} from './models/JobSeekerCertificate';




import {CertService} from './services/cert.service';
import {ProfileService} from '../../core/services/profile.service';
import {AccountService} from "../../core/account/services/account.service";

var moment = require('moment');

declare var Pikaday:any;
declare var jQuery:any;
declare var moment:any;


@Component({
    
    selector: "cert-block",
    templateUrl: "certificate.component.html"
})


export class CertificateComponent  implements OnInit {

    @Input() cachedProfile:BehaviorSubject<any>;
    @Input() commonData:BehaviorSubject<any>;
    @Input() display_mode:string="desktop";  //desktop mobile
    @Output() onUpdateProfileStatus = new EventEmitter();

    //BehaviorSubject
    public jobSeekerCertList$: BehaviorSubject<any> = new BehaviorSubject(null);

    //flags
    public cert_add = false;

    public addNewCertFlag:boolean =true;
    public addNewCertFlag$:BehaviorSubject<any> = new BehaviorSubject(true);
    public addNewCertDatePickerFlag:boolean =false;
    public certSpinnerFlag = false;
    public cert_status = "read";

    //members
    public countryList = [];
    public cityList = [];
    public jobSeekerCertList : JobSeekerCertificate[]= [];
    public sectorList : any;
    public field_studyList : any;
    public educationList : any;
    public profileCacheDirty = false;

    public certificateEditList = [];

    constructor(public fb:FormBuilder,
                public _profileService:ProfileService,
                public _certService:CertService) {
    }



    ngOnDestroy() {
        if(this.profileCacheDirty){
            AccountService.profileCacheDirty = true;
        }
    }

    onReadCERT() {
        this.cert_status = "read";
        let last_index = this.jobSeekerCertList.length - 1;
        this.onCancelCERT(last_index);
    }

    onEditCERT(id:string = null){
        if(id == null) {
            this.cert_status = "edit";
        }
        else {
            this.cert_add =false;
            this.certificateEditList.push(id);
        }
    }


    onCancelCERT2($event)
    {
        this.onCancelCERT($event.id)
    }

    getCalDuration(cert_start_date,cert_end_date){

        let cert_duration = "";
        let a = moment(cert_end_date);
        let b = moment(cert_start_date);
        let date_diff = a.diff(b,'months');
        if(date_diff < 12) {
            if(date_diff == 1)
                cert_duration = date_diff+' Month';
            if(date_diff == 0)
            {
                a = moment(cert_end_date);
                b = moment(cert_start_date);
                let date_diff = a.diff(b,'days');
                if(date_diff == 1)
                {
                    cert_duration = date_diff+' Day';
                }
                else
                {
                    cert_duration = date_diff+' Days';
                }
            }
            else
                cert_duration = date_diff+' Months';
        }
        else{
            a = moment([cert_end_date]);
            b = moment([cert_start_date]);
            date_diff = a.diff(b,'years');
            if(date_diff == 1)
                cert_duration = date_diff+' Year';
            else
                cert_duration = date_diff+' Years';
        }

        return cert_duration;
    }

    onSaveCERT2($event)
    {
        if($event.id != null)
        {
            this.jobSeekerCertList[$event.id].cert_new = false;
            this.jobSeekerCertList[$event.id].id              = $event.result.jobseeker_certificate.id;
            this.jobSeekerCertList[$event.id].cert_id         = $event.result.jobseeker_certificate.id;
            this.jobSeekerCertList[$event.id].cert_name       = $event.result.jobseeker_certificate.name;
            this.jobSeekerCertList[$event.id].cert_university = $event.result.jobseeker_certificate.institute;
            this.jobSeekerCertList[$event.id].cert_start_date = $event.result.jobseeker_certificate.start_date;
            this.jobSeekerCertList[$event.id].cert_end_date   = $event.result.jobseeker_certificate.end_date;
            this.jobSeekerCertList[$event.id].cert_grade      = $event.result.jobseeker_certificate.grade;
            this.jobSeekerCertList[$event.id].cert_doc_upload_name = $event.result.jobseeker_certificate.document_file_name;
            this.jobSeekerCertList[$event.id].cert_doc_upload_path = $event.result.jobseeker_certificate.document;
            this.jobSeekerCertList[$event.id].cert_still_studing = true;
            this.jobSeekerCertList[$event.id].id
            if (this.jobSeekerCertList[$event.id].cert_end_date) {

                this.jobSeekerCertList[$event.id].cert_duration = this.getCalDuration(this.jobSeekerCertList[$event.id].cert_start_date,this.jobSeekerCertList[$event.id].cert_end_date);
                this.jobSeekerCertList[$event.id].cert_still_studing = false;
            }


            this.jobSeekerCertList[$event.id].cert_file_D.id  = $event.result.jobseeker_certificate.id;
            this.jobSeekerCertList[$event.id].cert_file_M.id  = $event.result.jobseeker_certificate.id;

            this.jobSeekerCertList[$event.id].cert_file_D.index  = $event.id;
            this.jobSeekerCertList[$event.id].cert_file_M.index  = $event.id;

            this.addNewCertFlag =true;
            this.addNewCertFlag$.next(this.addNewCertFlag);

            this.certificateEditList.splice( this.certificateEditList.indexOf($event.id),1);
        }

    }

    onCancelCERT(id:number = null){


        if(!this.jobSeekerCertList || this.jobSeekerCertList.length == 0 || id < 0) {
            return;
        }

        if(this.jobSeekerCertList.length == 1){
            this.cert_status = "read";
        }
        // Change to array  so that i can remove an element
        let jobSeekerCertList = this.jobSeekerCertList;

        //Remove unsaved

        if(this.jobSeekerCertList[id].cert_new == true)
        {
            jobSeekerCertList.pop();
            this.addNewCertFlag =true;
            this.addNewCertFlag$.next(this.addNewCertFlag);
            this.addNewCertDatePickerFlag =false;

        }

        //Hide the element
        this.certificateEditList.splice( this.certificateEditList.indexOf(id),1);
    }

    onAddCERT()
    {
        this.cert_status = "edit";
        let selCert = new JobSeekerCertificate();
        selCert.id = -1;
        selCert.cert_file_D.classMap = "upload_cert_d"+(this.jobSeekerCertList.length);
        selCert.cert_file_M.classMap = "upload_cert_m"+(this.jobSeekerCertList.length);

        selCert.cert_file_D.file_format_list =  ['text/plain','application/pdf','application/msword'];
        selCert.cert_file_M.file_format_list =  ['text/plain','application/pdf','application/msword'];

        selCert.cert_file_D.index = null;
        selCert.cert_file_M.index = null;

        selCert.cert_file_M.mode = "cert";
        selCert.cert_form =  this.buildCertForm(selCert);
        selCert.cert_new = true;
        this.addNewCertFlag =false;
        this.addNewCertFlag$.next(this.addNewCertFlag);

        this.jobSeekerCertList.push(selCert);
        this.certificateEditList.push((this.jobSeekerCertList.length -1));
    }


    onDeleteFile(id:number = null,index:number = null) {

        this._profileService.deleteCertificateFile(id).subscribe(res =>{
            jQuery('.close_delete').modal('hide');
            if(index != null) {

                this.jobSeekerCertList[index].cert_doc_upload_name = res["jobseeker_certificate"].document_file_name;
                this.jobSeekerCertList[index].cert_doc_upload_path = res["jobseeker_certificate"].document;
                this.jobSeekerCertList$.next(this.jobSeekerCertList);
            }

        }, error => console.error("certificate del failed"));
    }

    onDelete(id:number =null) {

        this.certSpinnerFlag=true;
        this._profileService.deleteCertificate(id).subscribe(res =>{

            jQuery('.close_delete').modal('hide');
            let certCnt =-1;
            this.jobSeekerCertList = [];
            if( res["jobseeker_certificates"].length == 0) this.onReadCERT();

            res["jobseeker_certificates"].forEach(cert=>{
                certCnt++;

                this.buildCertList(certCnt, cert);
            })

            this.jobSeekerCertList$.next(this.jobSeekerCertList);

        }, error => console.error("certificate del failed"));

    }

    onSaveCERT(id:number = null) {

        this.certSpinnerFlag=true;
        this._certService.postCertDetails(this.jobSeekerCertList[id])
            .subscribe(rslt=>{
                    this.profileCacheDirty = true;
                    this.jobSeekerCertList[id].cert_new = false;
                    this.certificateEditList.splice(id,1);
                    this.addNewCertFlag =true;
                    this.addNewCertFlag$.next(this.addNewCertFlag);

                },
                error =>{  }

            );

    }

    buildCertForm(selCert:any) {

        return this.fb.group({
            cert_id: [selCert.id],
            cert_name: [selCert.cert_name, Validators.required],
            cert_university: [selCert.cert_university, Validators.required],
            cert_start_date: [selCert.cert_start_date, Validators.required],
            cert_end_date: [selCert.cert_end_date,Validators.required],
            cert_grade: [selCert.cert_grade,Validators.required]
        });
    }

    ngOnInit(){
        this.commonData.subscribe(res => {
            if(res) {
                this.countryList = res["countries"];
            }
        });

        this.cachedProfile.subscribe(res => {

            if(res) {
                let certificate = res;
                let certCnt =-1;
                if (!certificate["certificate"]) {
                    this.jobSeekerCertList$.next([]);
                    return;
                }
                certificate["certificate"].forEach(cert=>{
                    certCnt++;

                    this.buildCertList(certCnt, cert);
                })

                this.jobSeekerCertList$.next(this.jobSeekerCertList);
            }
        })
    }

    public buildCertList(certCnt: number, cert) {
        let selCert = new JobSeekerCertificate();


        selCert.id = cert.id;

        /**
         * FileUploadSettings
         * @type {string}
         */
        selCert.cert_file_D.classMap = "upload_cert_d" + (certCnt);
        selCert.cert_file_M.classMap = "upload_cert_m" + (certCnt);

        selCert.cert_file_D.file_format_list =  ['text/plain','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        selCert.cert_file_M.file_format_list =  ['text/plain','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        selCert.cert_file_D.id = cert.id;
        selCert.cert_file_M.id = cert.id;


        selCert.cert_file_D.index = certCnt;
        selCert.cert_file_M.index = certCnt;

        selCert.cert_id = cert.certificate_id;
        selCert.cert_name = cert.name;
        selCert.cert_university = cert.university_name;
        selCert.cert_grade = cert.grade;

        selCert.cert_start_date = new Date(cert.start_date);
        selCert.cert_still_studing = true;
        if (cert.end_date) {

            selCert.cert_duration = this.getCalDuration(cert.start_date,cert.end_date);
            selCert.cert_end_date = new Date(cert.end_date);
            selCert.cert_still_studing = false;
        }


        selCert.cert_doc_upload_name = cert.document_file_name;
        selCert.cert_doc_upload_path = cert.document;

        selCert.cert_form = this.buildCertForm(selCert);


        this.jobSeekerCertList.push(selCert);
    }
}
