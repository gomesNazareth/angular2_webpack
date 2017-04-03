import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import {Component, Input, OnInit,Output,EventEmitter} from '@angular/core'
import {BehaviorSubject} from "rxjs/Rx";


//Services
import {GeneralService} from  '../../shared/services/general.service';
import {ProfileService} from "../../core/services/profile.service";

//models
import {JobSeekerWork, RolesAndResponsible} from './models/JobSeekerWork';
import {Company} from "../../shared/models/Company";
import {Sector} from "../../shared/models/Sector";
import {City} from "../../shared/models/City";
import {Country} from "../../shared/models/Country";
import {Department} from "../../shared/models/Department";
import {AccountService} from "../../core/account/services/account.service";

var moment = require('moment');

declare var Pikaday:any;
declare var jQuery:any;
declare var moment:any;

@Component({

    selector: "work-block",
    templateUrl: "work.component.html"

})


export class WorkComponent implements OnInit {

    @Input() cachedProfile:BehaviorSubject<any>;
    @Input() commonData:BehaviorSubject<any>;
    @Input() display_mode ="desktop"  //desktop mobile;
    @Output() onUpdateProfileStatus = new EventEmitter();

    //flags
    public work_exp_status = "read";
    public work_exp_add = false;
    public workSpinnerFlag = false;

    //BehaviorSubject
    public jobSeekerWorkList$:BehaviorSubject<any> = new BehaviorSubject(null);

    //members
    public jobSeekerWorkList:JobSeekerWork[] = [];
    public addNewWorkFlag:boolean = true;
    public addNewWorkDatePickerFlag:boolean = false;
    public companyEditList = [];
    public countryList = [];
    public cityList = [];
    public sectorList = [];
    public editId:number = -1;
    public profileCacheDirty = false;

    //forms
    formCompany:FormGroup;


    constructor(public fb:FormBuilder,
                public _generalService:GeneralService,
                public _profileService:ProfileService) {


    }


    ngOnDestroy() {
        if(this.profileCacheDirty){
            AccountService.profileCacheDirty = true;
        }
    }

    public buildCompanyForm(selWork:any) {

        return this.fb.group({
            work_id: [selWork.id],
            company_id: [selWork.company.id],
            company_name: [selWork.company.name, Validators.required],
            company_title: [selWork.company_title, Validators.required],
            company_sector_id: [selWork.company_sector.id, Validators.required],
            company_country: [selWork.company_country.id, Validators.required],
            company_city_id: [selWork.company_city.id, Validators.required],
            company_city_name: [selWork.company_city.name],
            company_start_date: [selWork.company_start_date, Validators.required],
            company_end_date: [selWork.company_end_date],
            company_still_working: [selWork.company_still_working]
        });
    }



    updateProfile($event){
        this.onUpdateProfileStatus.emit($event);
    }


    onDelete(id:number =null,index:number =null) {


        this._profileService.deleteWorkExperience(id).subscribe(res =>{
            this.profileCacheDirty = true;
            jQuery('.close_delete').modal('hide');
            this.jobSeekerWorkList = [];
            if(res["jobseeker_experiences"].length == 0){
                this.work_exp_status = "read";
            }

            res["jobseeker_experiences"].forEach((work, work_count)=>{

                let selWork = new JobSeekerWork();

                selWork =this.getBuildWorkExp(selWork,work,work_count);
                selWork.company_form = this.buildCompanyForm(selWork);
                this.jobSeekerWorkList.push(selWork);

            });


            this.jobSeekerWorkList$.next(this.jobSeekerWorkList);

        }, error => console.error("work experience del failed"));

    }



    onDeleteFile(id:number = null,index:number =null) {


        this._profileService.deleteWorkFile(id).subscribe(res =>{
            this.profileCacheDirty = true;
            jQuery('.close_delete').modal('hide');

            this.jobSeekerWorkList[index] = this.getBuildWorkExp(this.jobSeekerWorkList[index],res["jobseeker_experience"],index);
            this.jobSeekerWorkList[index].company_form = this.buildCompanyForm(this.jobSeekerWorkList[index]);


            this.jobSeekerWorkList$.next(this.jobSeekerWorkList);
        }, error => console.error("work experience file del failed"));
    }


    getCalDuration(start_date,end_date){

        let duration = "";
        let a = (end_date == null) ? moment():  moment(end_date);

        let b = moment(start_date);
        let date_diff_month = a.diff(b,'months');
        if(date_diff_month < 12) {
            if(date_diff_month == 1)
                duration = date_diff_month+' Month';
            if(date_diff_month == 0)
            {
                a = (end_date == null) ? moment():  moment(end_date);
                b = moment(start_date);
                let date_diff_day = a.diff(b,'days');
                if(date_diff_day == 1)
                {
                    duration = date_diff_day+' Day';
                }
                else
                {
                    duration = date_diff_day+' Days';
                }
            }
            else
                duration = date_diff_month+' Months';
        }
        else{
            a = (end_date == null) ? moment():  moment(end_date);
            b = moment(start_date);


            let date_diff_year =Number((date_diff_month/12).toFixed(1));


            if(date_diff_year == 1){
                duration = date_diff_year+' Year';

            }
            else {
                duration = date_diff_year + ' Years';
            }

        }


        return duration;
    }


    getBuildWorkExp(selWork,work,work_count) {


        selWork.id = work.id;
        selWork.company_title = work.position;
        selWork.company_start_date = new Date(work["from"]);
        if(work["to"] != null){
            selWork.company_end_date = new Date(work["to"]);
        }
        else{
            selWork.company_end_date = null;
        }
        selWork.work_file_D.classMap = "upload_work_d" + (work_count);
        selWork.work_file_M.classMap = "upload_work_m" + (work_count);

        selWork.work_file_M.file_format_list =  ['text/plain','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        selWork.work_file_D.file_format_list =  ['text/plain','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        selWork.work_file_D.id = work.id;
        selWork.work_file_M.id = work.id;

        selWork.work_file_D.index = work_count;
        selWork.work_file_M.index = work_count;

        selWork.company_doc_upload_name = work.document_file_name;
        selWork.company_doc_upload_path = work.document;

        //Objects
        selWork.company = (work.company != null)?work.company:new Company();
        selWork.company_sector = (work.sector != null)?work.sector:new Sector();
        selWork.company_city = (work.city != null)?work.city:new City();
        selWork.company_country = (work.country != null)?work.country: new Country();
        selWork.department = (work.department != null)?work.department : new Department();
        selWork.company_still_working = true;



        if (work["to"] != null) {
            selWork.company_duration = this.getCalDuration(work["from"],work["to"]);

            selWork.company_still_working = false;

        }
        else {
            selWork.company_duration = this.getCalDuration(work["from"],null);
        }

        selWork.temp_roles_resp_valid = true;
        selWork.temp_roles_resp = "";
        selWork.company_roles_and_resp = new Array();

        if(work["description"] && work["description"].length >0)
        {
            work["description"].forEach(rr=> {
                selWork.company_roles_and_resp.push(new RolesAndResponsible(rr));
            });
        }

        return selWork;

    }

    ngOnInit():any {
        this.commonData.subscribe(res => {
            if(res) {
                this.countryList = res["countries"];
            }
        });

        this._generalService.getSectors()
            .subscribe(
                sector => {  this.sectorList = sector;  });

        this.cachedProfile.subscribe(res => {

            if(res) {
                let work_experience = res;
                if (!work_experience || !work_experience["work_experience"]) {
                    this.jobSeekerWorkList$.next(null);
                }else{
                    work_experience["work_experience"].forEach((work, work_count)=>{

                        let selWork = new JobSeekerWork();

                        selWork =this.getBuildWorkExp(selWork,work,work_count);
                        selWork.company_form = this.buildCompanyForm(selWork);

                        this.jobSeekerWorkList.push(selWork);
                    });

                    this.jobSeekerWorkList$.next(this.jobSeekerWorkList);

                }
            }
        })
    }

    onReadWE() {
        this.work_exp_status = "read";
        let last_index = this.jobSeekerWorkList.length - 1;
        this.onCancelWE(last_index);
    }

    onEditWE(id:number = null) {
        if (id == null) {
            this.work_exp_status = "edit";
        }
        else {
            this.companyEditList.push(id);
        }
    }

    onCancelWE(id:number = null) {
        if(!this.jobSeekerWorkList || this.jobSeekerWorkList.length == 0) {
            return;
        }
        if(this.jobSeekerWorkList.length == 1){
            this.work_exp_status = "read";
        }

        // Change to array  so that i can remove an element
        let jobSeekerWorkList = this.jobSeekerWorkList;
        this.addNewWorkFlag = true;

        //Remove unsaved
        if (this.jobSeekerWorkList[id].newed == true) {
            jobSeekerWorkList.pop();
            this.addNewWorkDatePickerFlag = false;
        }

        //Hide the element
        this.companyEditList.splice(this.companyEditList.indexOf(id), 1);
    }

    onCancelWE2($event) {

        this.onCancelWE($event.id)
    }


    onSaveWE2($event) {
        if($event["result"]){
            if($event.id == -1) {


                this.jobSeekerWorkList[(this.jobSeekerWorkList.length -1)].newed = false;
                this.jobSeekerWorkList[(this.jobSeekerWorkList.length -1)]  =this.getBuildWorkExp(this.jobSeekerWorkList[(this.jobSeekerWorkList.length -1)],$event["result"]["jobseeker_experience"],(this.jobSeekerWorkList.length-1));

                this.jobSeekerWorkList[(this.jobSeekerWorkList.length -1)].company_form = this.buildCompanyForm(this.jobSeekerWorkList[(this.jobSeekerWorkList.length -1)]);
                this.onCancelWE((this.jobSeekerWorkList.length -1));
            }
            else
            {

                this.jobSeekerWorkList[$event.id] = this.getBuildWorkExp(this.jobSeekerWorkList[$event.id],$event["result"]["jobseeker_experience"],$event.id);
                this.jobSeekerWorkList[$event.id].company_form = this.buildCompanyForm(this.jobSeekerWorkList[$event.id]);
                this.onCancelWE($event.id);
            }
            this.jobSeekerWorkList$.next(this.jobSeekerWorkList);
        }
    }

    closeBox() {
        jQuery('.close_delete').modal('hide');
    }

    onUploadComplete($event){
        if($event.id != null)
        {

            this.jobSeekerWorkList[$event.id] = this.getBuildWorkExp(this.jobSeekerWorkList[($event.id)],$event["result"]["jobseeker_experience"],$event.id);
            this.jobSeekerWorkList[$event.id].company_form = this.buildCompanyForm(this.jobSeekerWorkList[$event.id]);

            this.jobSeekerWorkList$.next(this.jobSeekerWorkList);
        }
    }


    onAddWorkExp() {
        this.work_exp_status = "edit";
        let selWork = new JobSeekerWork();

        selWork.id = -1
        selWork.company_id = -1;
        selWork.newed = true;
        selWork.company_roles_and_resp = [];
        selWork.work_file_D.classMap = "upload_work_d" + (this.jobSeekerWorkList.length);
        selWork.work_file_M.classMap = "upload_work_m" + (this.jobSeekerWorkList.length);

        selWork.work_file_M.file_format_list =  ['text/plain','application/pdf','application/msword'];
        selWork.work_file_D.file_format_list =  ['text/plain','application/pdf','application/msword'];

        //company
        selWork.company = new Company();

        //sector
        selWork.company_sector = new Sector();

        //country
        selWork.company_country = new Country();

        //city
        selWork.company_city = new City();

        selWork.company_form = this.buildCompanyForm(selWork);
        this.addNewWorkFlag = false;
        this.jobSeekerWorkList.push(selWork);
        this.jobSeekerWorkList$.next(this.jobSeekerWorkList);
        let id = this.jobSeekerWorkList.length - 1;

        this.companyEditList.push(id);

        this.work_exp_add = true;
    }
}
