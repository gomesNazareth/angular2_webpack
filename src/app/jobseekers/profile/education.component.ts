import {FormBuilder, FormGroup, FormControl,Validators} from '@angular/forms';

import {Component,Input,OnInit,Output,EventEmitter} from '@angular/core';
import {BehaviorSubject} from "rxjs/Rx";


//models
import {JobSeekerEducation} from './models/JobSeekerEducation';
import {City} from "../../shared/models/City";
import {Country} from "../../shared/models/Country";


//Services
import {GeneralService} from  '../../shared/services/general.service';
import {ProfileService} from "../../core/services/profile.service";
import {AccountService} from "../../core/account/services/account.service";

var moment = require('moment');

declare var Pikaday:any;
declare var jQuery:any;
declare var moment:any;


@Component({

    selector: "edu-block",
    templateUrl: "education.component.html"
})



export class EducationComponent  implements OnInit {

    @Input() cachedProfile:BehaviorSubject<any>;
    @Input() commonData:BehaviorSubject<any>;
    @Output() onUpdateProfileStatus = new EventEmitter();
    public educations;
    public field_studyList;
    public educationList;
    public profileCacheDirty = false;

    //members
    city_Obj:City = new City();

    //Flags
    public edu_status = "read";
    public addNewEduFlag:boolean =true;
    public addNewEduFlag$:BehaviorSubject<any> = new BehaviorSubject(true);
    public cachedProfile$:BehaviorSubject<any> = new BehaviorSubject(null);
    public addNewEduDatePickerFlag:boolean =false;
    public eduSpinnerFlag = false;


    //Members
    public educationEditList = [];
    public jobSeekerEduList : JobSeekerEducation[]= [];
    public countryList = [];
    public cityList = [];


    @Input() display_mode = "desktop" // desktop mobile


    //BehaviorSubject
    public jobSeekerEduList$: BehaviorSubject<any> = new BehaviorSubject(null);


    ngOnDestroy() {
        if(this.profileCacheDirty){
            AccountService.profileCacheDirty = true;
        }
    }

    constructor(public fb:FormBuilder,
                public _generalService:GeneralService,
                public _profileService:ProfileService) {
    }

    onUploadComplete($event){
        if($event.id != null)
        {
            this.jobSeekerEduList[$event.id] = this.buildJobSeekerList(this.jobSeekerEduList[$event.id],$event["result"]["jobseeker_education"],$event.id);
            this.jobSeekerEduList$.next(this.jobSeekerEduList);
        }
    }

    // Education Related
    onReadEDU() {
        this.edu_status = "read";
        let last_index = this.jobSeekerEduList.length - 1;
        this.onCancelEDU(last_index);
    }

    onEditEDU(id:string = null){
        if(id == null) {
            this.edu_status = "edit";
        }
        else {
            this.educationEditList.push(id);
        }
    }

    closeBox()
    {
        jQuery('.close_delete').modal('hide');
    }

    onCancelEDU(id:number){
        if(!this.jobSeekerEduList || this.jobSeekerEduList.length == 0) {
            return;
        }
        if(this.jobSeekerEduList.length == 1){
            this.edu_status = "read";
        }

        // Change to array  so that i can remove an element
        let jobSeekerEduList = this.jobSeekerEduList;

        //Remove unsaved
        if(this.jobSeekerEduList[id].edu_new == true)
        {

            jobSeekerEduList.pop();
            this.addNewEduFlag =true;
            this.addNewEduFlag$.next(this.addNewEduFlag);
            this.addNewEduDatePickerFlag =false;
        }
        //Hide the element
        this.educationEditList.splice( this.educationEditList.indexOf(id),1);
    }


    onDeleteFile(id,edu_index) {
        this._profileService.deleteEduFile(id).subscribe(res =>{
            this.profileCacheDirty = true;
            jQuery('.close_delete').modal('hide');
            this.jobSeekerEduList[edu_index] = this.buildJobSeekerList(this.jobSeekerEduList[edu_index],res["jobseeker_education"],edu_index);
            this.jobSeekerEduList$.next(this.jobSeekerEduList);
        }, error => console.error("work experience file del failed"));
    }

    onSaveEDU($event){
        if($event.id != null) {


            let edu = $event.result.jobseeker_education;
            this.jobSeekerEduList[$event.id] = this.buildJobSeekerList(this.jobSeekerEduList[$event.id],edu,$event.id);
            this.jobSeekerEduList[$event.id].edu_new = false;
            this.educationEditList.splice( this.educationEditList.indexOf($event.id),1);
            this.addNewEduFlag =true;
            this.addNewEduFlag$.next(this.addNewEduFlag);

        }
        else
        {

            this.jobSeekerEduList[(this.jobSeekerEduList.length -1)].edu_new = false;
            this.jobSeekerEduList[(this.jobSeekerEduList.length -1)]  =this.buildJobSeekerList(this.jobSeekerEduList[(this.jobSeekerEduList.length -1)],$event["result"]["jobseeker_education"],(this.jobSeekerEduList.length));

            this.onCancelEDU((this.jobSeekerEduList.length -1));
            this.addNewEduFlag =true;
            this.addNewEduFlag$.next(this.addNewEduFlag);
        }

    }

    buildJobSeekerList(selEdu,edu,eduCnt) {
        selEdu.id = edu.id;
        selEdu.school = edu.school;

        selEdu.edu_file_D.classMap = "upload_edu_d"+(eduCnt);
        selEdu.edu_file_M.classMap = "upload_edu_m"+(eduCnt);


        selEdu.edu_file_M.file_format_list =  ['text/plain','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        selEdu.edu_file_D.file_format_list =  ['text/plain','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        selEdu.edu_file_M.file_name = edu.document_file_name;
        selEdu.edu_file_D.file_name = edu.document_file_name;

        selEdu.edu_file_M.file_url = edu.document;
        selEdu.edu_file_D.file_url = edu.document;

        selEdu.edu_file_M.id = edu.id;
        selEdu.edu_file_D.id = edu.id;
        selEdu.edu_file_M.index = eduCnt;
        selEdu.edu_file_D.index = eduCnt;

        selEdu.edu_file_M.mode = "edu";
        selEdu.edu_file_D.mode = "edu";

        selEdu.edu_qualification = edu.education_qualification;
        selEdu.edu_qualification_id = edu.education_qualification;

        /**
         * Only if education is set;
         */
        if(edu.job_education != null) {
            selEdu.edu_id = edu.job_education.id;
            selEdu.edu_name = edu.job_education.name;
        }


        selEdu.edu_field_study = edu.field_of_study;

        selEdu.edu_logo = edu.logo;

        selEdu.city = new City();
        if(edu.city != null) {
            selEdu.city.id = edu.city.id;
            selEdu.city.name = edu.city.name;
            selEdu.city.text = edu.city.name;
        }
        this.city_Obj = selEdu.city;


        selEdu.country = new Country();
        if(edu.country != null) {
            selEdu.country.id = edu.country.id;
            selEdu.country.name = edu.country.name;

        }



        this.countryList.forEach((country)=>{

            if(country["code"] == edu.country)
            {
                selEdu.edu_country_name = country["name"];
            }
        })

        this.cityList.forEach((city)=>{

            if(city["id"] == edu.city_id)
            {
                selEdu.edu_city_name = city["name"];
            }

        })


        selEdu.edu_start_date =  new Date(edu.start_date);
        selEdu.edu_still_studing = true;
        if(edu.end_date)
        {
            selEdu.edu_duration = this.getCalDuration(edu.start_date,edu.end_date)
            selEdu.edu_end_date = new Date(edu.end_date);
            selEdu.edu_still_studing = false;
        }
        else{
            selEdu.edu_still_studing = true;
            selEdu.edu_end_date = null;
        }


        selEdu.edu_doc_upload_name =  edu.doc_upload_name;
        selEdu.edu_doc_upload_path = edu.doc_upload_path;
        selEdu.edu_grade = edu.grade;


        selEdu.edu_form = this.buildEduForm(selEdu);


        return selEdu;
    }


    getCalDuration(start_date,end_date){

        let duration = "";
        let a = moment(end_date);
        let b = moment(start_date);
        let date_diff = a.diff(b,'months');
        if(date_diff < 12) {
            if(date_diff == 1)
                duration = date_diff+' Month';
            if(date_diff == 0)
            {
                a = moment(end_date);
                b = moment(start_date);
                let date_diff = a.diff(b,'days');
                if(date_diff == 1)
                {
                    duration = date_diff+' Day';
                }
                else
                {
                    duration = date_diff+' Days';
                }
            }
            else
                duration = date_diff+' Months';
        }
        else{
            a = moment([end_date]);
            b = moment([start_date]);
            date_diff = a.diff(b,'years');
            if(date_diff == 1)
                duration = date_diff+' Year';
            else
               duration = date_diff+' Years';
        }

        return duration;
    }



    onCancelEDU2($event) {

        this.onCancelEDU($event.id)
    }

    onDeleteEdu(id:number,index:number =null) {


        this._profileService.deleteEducation(id).subscribe(res =>{
                this.profileCacheDirty = true;
                jQuery('.close_delete').modal('hide');
                this.jobSeekerEduList = [];
                if( res["jobseeker_educations"].length == 0) this.onReadEDU();
                res["jobseeker_educations"].forEach((edu, eduCnt)=>{

                    let selEdu = new JobSeekerEducation();
                    selEdu = this.buildJobSeekerList(selEdu,edu,eduCnt)
                    this.jobSeekerEduList.push(selEdu);

                });

                this.jobSeekerEduList$.next(this.jobSeekerEduList);
            },
            error => console.error("education del failed"))
    }

    onAddEdu()
    {
        this.edu_status = "edit";
        let selEdu = new JobSeekerEducation();
        selEdu.id = -1;

        selEdu.edu_file_D.classMap = "upload_edu_d"+(this.jobSeekerEduList.length);
        selEdu.edu_file_M.classMap = "upload_edu_m"+(this.jobSeekerEduList.length);

        selEdu.city = new City();
        selEdu.country = new Country();
        selEdu.edu_form =  this.buildEduForm(selEdu);
        selEdu.edu_new = true;
        this.addNewEduFlag =false;
        this.addNewEduFlag$.next(this.addNewEduFlag);

        this.jobSeekerEduList.push(selEdu);

        this.educationEditList.push((this.jobSeekerEduList.length -1));
    }

    public buildEduForm(selEdu:any)
    {
        return this.fb.group({
            edu_id: [selEdu.id],
            edu_name: [selEdu.school, Validators.required],
            edu_q_id: [selEdu.edu_id, Validators.required],
            edu_field_study: [selEdu.edu_field_study, Validators.required],
            edu_country_id: [selEdu.country.id, Validators.required],
            edu_city_id: [selEdu.city.id, Validators.required],
            edu_start_date: [selEdu.edu_start_date, Validators.required],
            edu_end_date: [selEdu.edu_end_date],
            edu_still_studing: [selEdu.edu_still_studing],
            edu_grade: [selEdu.edu_grade, Validators.required]
        });
    }



    ngOnInit():any {
        this.commonData.subscribe(res => {
            if(res) {
                this.countryList = res["countries"];
            }
        });

        this._generalService.getJobEducations()
            .subscribe(
                educationList => {
                    this.educationList = educationList;

                });

        this.cachedProfile.subscribe(res => {


            if(res) {
                let edu = res;
                let eduCnt =-1;

                if (!edu["education"]) {
                    this.jobSeekerEduList$.next([])
                    return;
                }

                edu["education"].forEach(edu=>{
                    let selEdu = new JobSeekerEducation();
                    eduCnt++;

                    selEdu = this.buildJobSeekerList(selEdu,edu,eduCnt)

                    this.jobSeekerEduList.push(selEdu);
                })


                this.jobSeekerEduList$.next(this.jobSeekerEduList);
            }
        });
    }
}
