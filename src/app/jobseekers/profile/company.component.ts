import {FormBuilder, FormGroup} from '@angular/forms';
import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";


//Directives

import {ProfileService} from '../../core/services/profile.service';


//models
import {RolesAndResponsible} from './models/JobSeekerWork';
import {Company} from '../../shared/models/Company';
import {City} from '../../shared/models/City';
import {Country} from "../../shared/models/Country";
import {GeneralService} from "../../shared/services/general.service";
import {AccountService} from "../../core/account/services/account.service";



var moment = require('moment');

declare var Pikaday:any;
declare var moment:any;


@Component({

    selector: "company-work-exp",
    templateUrl: "company.component.html"
})

export class CompanyComponent implements OnInit {


    //forms
    formCompany:FormGroup;

    //Inputs
    @Input() countryList;
    @Input() cityList;
    @Input() sectorList;
    @Input() work_experience;
    @Input() wrk_exp_index;
    @Input() display_mode = "";

    @Output() onUpdateProfileStatus = new EventEmitter();
    //Output
    @Output() cancelWE = new EventEmitter();
    @Output() saveWE = new EventEmitter();

    //members
    backupRR:any;
    city_Obj:City = new City();
    company_Obj:Company = new Company();
    country_Obj:Country = new Country();
    country_Obj$:BehaviorSubject<any> = new BehaviorSubject(null);
    formPostObj$:BehaviorSubject<any> = new BehaviorSubject(false);
    public spinnerLoader$:BehaviorSubject<any> = new BehaviorSubject(false);
    public toYear = moment().format('YYYY');
    public maxDate = moment()._d;


    public startDate;
    public endDate;
    public conpanyList = [];
    public profileCacheDirty = false;

    //flags
    company_end_date_req = false;
    firstCountryId:number;
    rollsAddedFlag = false;



    ngOnDestroy() {
        if(this.profileCacheDirty){
            AccountService.profileCacheDirty = true;
        }
    }
    selectStartDate(obj){
        this.startDate = obj.value;
    }

    selectEndDate(obj){
        this.endDate = obj.value;

    }

    onToggleCurrentlyWorking(){
        this.work_experience.company_still_working = (this.work_experience.company_still_working)?false:true;
        this.work_experience.company_form.controls["company_end_date"].setValue(null);
    }

    ngOnInit():any {

        this._generalService.getCompanies().subscribe(comRes =>{
            comRes.forEach(res=>{
                this.conpanyList.push({id:res["id"],name:res["name"]});

            });


        })

        this.backupRR = this.work_experience.company_roles_and_resp.slice();
        this.city_Obj.id    = this.work_experience.company_form.value.company_city_id;
        this.city_Obj.name    = this.work_experience.company_form.value.company_city_name;
        this.city_Obj.text    = this.work_experience.company_form.value.company_city_name;
        this.company_Obj.id =   this.work_experience.company_form.value.company_id;
        this.company_Obj.name = this.work_experience.company_form.value.company_name;
        this.company_Obj.text = this.work_experience.company_form.value.company_name;

            this.country_Obj.id = this.work_experience.company_form.value.company_country;
        this.firstCountryId = this.country_Obj.id;
        this.country_Obj$.next(this.country_Obj);
        this.work_experience.company_form.controls["company_end_date"].valueChanges.
            subscribe(val=>{

        })


        this.startDate = this.work_experience.company_form.value.company_start_date;
        this.endDate = this.work_experience.company_form.value.company_end_date;


        this.work_experience.company_form.controls["company_country"].valueChanges.subscribe(val =>{ this.onSelectCountry(val)})

    }



    onSelectCountry(val){
            this.country_Obj.id = val;
            this.country_Obj$.next(this.country_Obj);
            this.city_Obj = new City();
    }

    onSelectCity($event){

        if($event.id)
        {
            this.city_Obj.id = $event.id;
            this.city_Obj.name = $event.name;

        }
    }


    onSelectCompany($event:any){

        if($event.id)
        {
            this.company_Obj.id =$event.id;
            this.company_Obj.name =$event.name;
        }else{
            this.company_Obj.id = null;
            this.company_Obj.name =$event.name;
        }
    }

    onCancelWE(id:number = null) {
        this.work_experience.company_roles_and_resp =  this.backupRR;
        this.cancelWE.emit({id: id});
    }



    public onPost(index:number)
    {
        let rrList = Array();
        this.work_experience.company_roles_and_resp.forEach(selrr => {
            rrList.push(selrr.name)
        });

        this.work_experience.company_form.value.company_end_date =(this.work_experience.company_form.value.company_still_working)?null:this.work_experience.company_form.value.company_end_date;
        let postList = {
                        id:this.work_experience.company_form.value.work_id,
                        sector_id:this.work_experience.company_form.value.company_sector_id,
                        country_id:this.work_experience.company_form.value.company_country,
                        company_name:this.work_experience.company_form.value.company_name,
                        company_id:this.work_experience.company_form.value.company_id,
                        city_id:this.work_experience.company_form.value.company_city_id,
                        position:this.work_experience.company_form.value.company_title,
                        description:rrList,
                        from:this.work_experience.company_form.value.company_start_date,
                        to:this.work_experience.company_form.value.company_end_date,
                        document:''
                       }


        if(this.work_experience.company_form.value.work_id == -1)
        {
            this._profileService.postWorkExperience(postList).subscribe(res=>{

                this.onUpdateProfileStatus.emit({"update":true});
                this.profileCacheDirty = true;
                this.saveWE.emit({"id":-1,"result":res});
                this.formPostObj$.next(false);
                this.spinnerLoader$.next(false);

            });

        }
        else
        {
            this._profileService.updateWorkExperience(postList).subscribe(res=>{
                this.onUpdateProfileStatus.emit({"update":true});
                this.profileCacheDirty = true;
                this.saveWE.emit({"id":index,"result":res});
                this.formPostObj$.next(false);
                this.spinnerLoader$.next(false);
            });
        }
    }



    onSaveWE(index:number) {

        this.company_end_date_req = false;
        this.formPostObj$.next(true);


        if (this.work_experience.company_form.valid) {

            if(!this.work_experience.company_form.value.company_still_working)
            {
                 //if your not working here make sure data is entered
                if(this.work_experience.company_form.value.company_end_date == null)
                {
                    this.company_end_date_req = true;
                }
                else
                {
                    this.spinnerLoader$.next(true);
                    this.onPost(index);
                }
            }
            else
            {
                //if you are still working then
                this.work_experience.company_form.value.company_end_date = null
                this.spinnerLoader$.next(true);
                this.onPost(index);
            }
        }
    }


    onRemoveRR(index:number) {
        this.work_experience.company_roles_and_resp.splice(index,1);
    }

    onAddRR() {
        if (this.work_experience.temp_roles_resp != "" && this.work_experience.temp_roles_resp.length >= 5) {
            this.work_experience.temp_roles_resp_valid = true;
            this.work_experience.company_roles_and_resp.push(new RolesAndResponsible(this.work_experience.temp_roles_resp));
            this.work_experience.temp_roles_resp = "";
            this.rollsAddedFlag = true;
        }
        else {
            this.work_experience.temp_roles_resp_valid = false;
        }
    }


    constructor(public fb:FormBuilder,
                public _profileService:ProfileService,public _generalService:GeneralService) {
    }

}
