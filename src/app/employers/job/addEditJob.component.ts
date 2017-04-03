import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import {Location} from '@angular/common';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Router,ActivatedRoute} from '@angular/router';

//Services
import { AccountService } from '../../core/account/services/account.service';
import {CompanyService} from "../../core/services/company.service";
import {LoaderService} from "../../shared/services/loader.service";
import {GeneralService} from "../../shared/services/general.service";
import {ConfigService} from '../../shared/config.service';

//Models
import {City} from '../../shared/models/City';
import {TagService} from '../../shared/services/tag.service';
import {Tags} from "../../shared/models/Tags";

//Validations
import {TypeValidators} from '../../shared/validators/basicValidators';
import {DateValidator} from '../../shared/validators/basicValidators';
import {ExpLessThanValidator} from '../../shared/validators/basicValidators';


var moment = require('moment');
// var bootstrap = require('bootstrap');
declare var jQuery:any;
declare var moment:any;
@Component({

    selector: "add-edit-jobs",
    templateUrl: "addEditJob.component.html"

})


export class AddEditJobComponent implements OnInit {

    public paramsRoute;

    public minDate =   moment(new Date()).add(1,'days');
    public  jobForm: FormGroup;
    public loadedData:boolean = false;
    public pristineFlag$:BehaviorSubject<any> = new BehaviorSubject(true);

    //Observables
    public commonData$:BehaviorSubject<any> = new BehaviorSubject(null);
    public salary_range$:BehaviorSubject<any> = new BehaviorSubject(null);
    public jobTypeList$:BehaviorSubject<any> = new BehaviorSubject(null);
    public geoGroupList$:BehaviorSubject<any> = new BehaviorSubject(null);
    public jobExpList$:BehaviorSubject<any> = new BehaviorSubject(null);
    public functionalAreaList$:BehaviorSubject<any> = new BehaviorSubject(null);
    public expLevelList$:BehaviorSubject<any> = new BehaviorSubject(null);
    public benefits$:BehaviorSubject<any> = new BehaviorSubject(null);
    public ageGroup$:BehaviorSubject<any> = new BehaviorSubject(null);
    public visaStatusList$:BehaviorSubject<any> = new BehaviorSubject(null);
    public maritalStatusList$:BehaviorSubject<any> = new BehaviorSubject(null);
    public genderList$:BehaviorSubject<any> = new BehaviorSubject(null);
    public educationList$:BehaviorSubject<any> = new BehaviorSubject(null);
    public countryList$:BehaviorSubject<any> = new BehaviorSubject(null);
    public sectors$:BehaviorSubject<any> = new BehaviorSubject(null);
    public typeList$:BehaviorSubject<any> = new BehaviorSubject(null);
    public sizesList$:BehaviorSubject<any> = new BehaviorSubject(null);
    public classificationsList$:BehaviorSubject<any> = new BehaviorSubject(null);
    public immediateJoin$:BehaviorSubject<any> = new BehaviorSubject(false);
    public jobId$:BehaviorSubject<any> = new BehaviorSubject(null);
    public  url$:BehaviorSubject<any> = new BehaviorSubject(ConfigService.getDomain());


    public yearsExpList;
    public excludeToYears = [];
    public cityObj:City = new City();


    public countryList;
    public educationList;
    public sectorsList;
    public typeList;
    public sizesList;
    public classificationsList;
    public drivingLicenseRequired:boolean = false;
    public joinImidiateFlag:boolean = true;
    public savedDraft:boolean = false;
    public country_id:number = null;

    public certarry = [];
    public skillsarry = [];
    public languagearry = [];
    public genderHash = {"male":1,"female":2,"any":null}
    public iframeBlock ="";
    public startDate = null;
    public toYear = moment().format('YYYY');
    public maxDate = moment()._d;

    public postProgress:boolean = false;


    onBack(){
        window.history.back();
    }





    public getStartDate($event){

        this.jobForm.controls['start_date'].setValue($event['selDate']);
        this.jobForm.controls['end_date'].setValue(null);
        this.jobForm.controls['join_date'].setValue(null);
        this.startDate  = moment(new Date($event['selDate'])).add(1,'days')._d;

    }

    public numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    public loader() {

        this._loaderService.getCountries("alphabetical").subscribe(country=> {
             let geoGroups;
             this.countryList = country.slice();
             geoGroups = country.slice();
             geoGroups.unshift({id:'-1',name:"All"});
            this.countryList$.next({countries: this.countryList});
            this.geoGroupList$.next({geo_countries:geoGroups});
        });


        // this._generalService.getGeoGroups().subscribe(geoGroups=> {
        //     geoGroups.push({id:'',name:"Geo Groups"});
        //     this.geoGroupList$.next({geo_countries:geoGroups});
        // });


        this._generalService.getJobEducations().subscribe(education=> {
            this.educationList = education;
            // this.educationList.push({id:'',name:"Highest Education Achievement"});
            this.educationList$.next({education: this.educationList});
        });

        this._generalService.getSalaryRanges().subscribe(salary_range=> {

            let salaryRange = [];

            salary_range.forEach(selRange=>{

                if(selRange['salary_to'] > 10000){
                    salaryRange.push({id:selRange['id'],"name":'10,000+'});

                }
                else {
                    salaryRange.push({id:selRange['id'],"name":this.numberWithCommas(selRange['salary_from'])+'-'+this.numberWithCommas(selRange['salary_to'])});

                }
            })
            this.salary_range$.next({salary_range: salaryRange});
        });


        this._generalService.getJobTypes().subscribe(jobtypes=> {

            // jobtypes.push({id:'',name:"Job type"});
            this.jobTypeList$.next({job_types:jobtypes});
        });


           this.jobExpList$.next([{id:1,name:'1 Year'},{id:2,name:'2 Years'},{id:3,name:'3 Years'},{id:4,name:'4 Years'},{id:5,name:'5 Years'},{id:6,name:'6 Years'},{id:7,name:'7 Years'},{id:8,name:'8 Years'},{id:9,name:'9 Years'},{id:10,name:'10 Years'}]);



        this._loaderService.getSectors().subscribe(sectors=> {

            this.sectorsList = sectors;
            // this.sectorsList.push({id:'',name:"Sector"});
            this.sectors$.next(this.sectorsList);
        });

        this._loaderService.getFunctionalArea().subscribe(res=>{

            // res.push({id:'',name:"Functional Area"});
            this.functionalAreaList$.next(res);
        })

        this._generalService.getJobExperienceLevels().subscribe(res=>{

            // res.push({id:'',name:"Experience Level"});
            this.expLevelList$.next(res);
        })
        this._generalService.getBenefits().subscribe(res=>{

            this.benefits$.next(res);
        })

        this._generalService.getVisaStatus()
            .subscribe( visa_statuses => {

                // To Do  Change this to 0 . Since now visa status 0 is giving error
                visa_statuses.unshift({id:0,name:"Any"});
                this.visaStatusList$.next(visa_statuses);
                }
            );
        this._generalService.getAgeGroups().subscribe(res => {

            let ageGroupList = [];
            res.forEach(selAge => {

                if(selAge.max_age < 100){
                    ageGroupList.push({id:selAge.id,name:selAge.min_age+' to '+selAge.max_age})
                }
                else{
                    ageGroupList.push({id:selAge.id,name:selAge.min_age+'+'})
                }
            })
            ageGroupList.unshift({id:0,name:"Any"});
            this.ageGroup$.next(ageGroupList);
        });

        this.maritalStatusList$.next(this._generalService.getMaritalStatus2());
        this.genderList$.next(this._generalService.getGender());




    }


    setJoinDate($event){


        this.jobForm.controls['join_date'].setValue($event['selDate']);
        if($event['selDate'] != null){
            this.jobForm.controls['join_immediately'].setValue(false);
        }
        else{
            this.jobForm.controls['join_immediately'].setValue(true);
        }


    }


    onRemoveElement(index: number,mode='cert') {


        if (mode == 'cert' && index > -1) {
            this.certarry.splice(index, 1);
        }
        if (mode == 'skills' && index > -1) {
            this.skillsarry.splice(index, 1);
        }
        if (mode == 'language' && index > -1) {
            this.languagearry.splice(index, 1);
        }


    }


    onAddElement($event,mode='cert'){

        if(mode == 'cert'){
            this.certarry.push({id:$event.id,name:$event.name});
        }
        if(mode == 'skills'){
            this.skillsarry.push({id:$event.id,name:$event.name});
        }

        if(mode == 'language'){
            this.languagearry.push({id:$event.id,name:$event.name});
        }





    }


    getSetBenefit(id){


        let  benefitList = this.jobForm.controls["benefit_ids"].value;
        let  foundlocation = benefitList.indexOf(id);
        if(foundlocation == -1){
            benefitList.push(id);
        }
        else {

            benefitList.splice(foundlocation,1);
        }

        this.jobForm.controls["benefit_ids"].setValue(benefitList);
    }


    getPostJson(){


        if(this.jobForm.controls['join_immediately'].value == true){
            this.jobForm.controls['join_date'].setValue(null);
        }

        let langList = [];

        this.languagearry.forEach(selLang =>{
            langList.push(selLang["id"]);
        });

        let geoCountryIdList = this.jobForm.value['geo_countries_ids'].slice(',');

        if(this.jobForm.value['geo_countries_ids'].indexOf("-1") != -1){

            let selectedCountries = [];
            this.geoGroupList$.value["geo_countries"].forEach(selCountry=>{
                if(selCountry.id != -1){
                    selectedCountries.push(selCountry.id);
                }
            });

            this.jobForm.controls['geo_countries_ids'].setValue(selectedCountries);
        }


        let visa_status_id = (this.jobForm.value['visa_status_id'] == 0)? null :this.jobForm.value['visa_status_id'];
        let age_group_id = (this.jobForm.value['age_group_id'] == 0)? null :this.jobForm.value['age_group_id'];

        return {
            "job": {
            "title": this.jobForm.value['title'],
                "description": this.jobForm.value['description'],
                "qualifications": "",
                "active": true,
                "deleted": false,
                "requirements": this.jobForm.value['requirements'],
                "job_status_id": this.jobForm.value['job_status'],
                "job_type_id": this.jobForm.value['job_type_id'],
                "start_date": this.jobForm.value['start_date'],
                "end_date": this.jobForm.value['end_date'],
                "country_id": this.jobForm.value['country_id'],
                "city_id": this.jobForm.value['city_id'],
                "sector_id": this.jobForm.value['sector_id'],
                "functional_area_id": this.jobForm.value['functional_area_id'],
                "job_education_id": this.jobForm.value['job_education_id'],
                "job_experience_level_id": this.jobForm.value['job_experience_level_id'],
                "experience_from": this.jobForm.value['experience_from'],
                "experience_to": this.jobForm.value['experience_to'],
                "join_date": this.jobForm.value['join_date'],
                "nationality_id": "",
                "age_group_id": age_group_id,
                "gender": this.genderHash[this.jobForm.value['gender_type']],
                "visa_status_id": visa_status_id,
                "languages": langList,
                "notification_type": this.jobForm.value['notification_type'],
                "license_required": this.jobForm.value['license_required'],
                "marital_status": this.jobForm.value['marital_status_id'],
                "benefit_ids": this.jobForm.value['benefit_ids'],
                "geo_country_ids": this.jobForm.value['geo_countries_ids'],
                "salary_range_id": this.jobForm.value['salary_range_id'],
                "certificates": this.certarry,
                "skills": this.skillsarry
        }
        }

    }


    getIfExpired(){

        if(this.jobForm.controls['job_status'].value != 1 && !moment(Date.parse(this.jobForm.controls['end_date'].value)).isAfter(new Date()))
         {
            return true;
         }
         else {
            return false;
        }

    }

    saveDraft() {

        this.jobForm.controls['job_status'].setValue(1);

        let postJson = this.getPostJson();

        if(this.jobForm.controls['id'].value == null){

            if(this.postProgress == false) {

            this.postProgress = true;
            this._companyService.getAddJobs(postJson).subscribe(res =>{
                this.postProgress = false;

                this.jobForm.controls['id'].setValue(res['job']['id']);
                this.jobId$.next(res['job']['id']);
                this.savedDraft = true;
                jQuery('#post-draft').modal('show');
                Observable.timer(2000).subscribe(val=>{
                    this.savedDraft = false;
                    jQuery('#post-draft').modal('hide');
                });

            },
            error=>{
                this.postProgress = false;
            });
            }
        }
        else {

            if(this.postProgress == false) {
                this.postProgress = true;
                this._companyService.getUpdateJobs(this.jobForm.controls['id'].value, postJson).subscribe(res => {
                        this.postProgress = false;
                        this.jobId$.next(res['job']['id']);
                        this.jobForm.controls['id'].setValue(res['job']['id']);
                        this.savedDraft = true;
                        jQuery('#post-draft').modal('show');
                        Observable.timer(2000).subscribe(val => {
                            this.savedDraft = false;
                            jQuery('#post-draft').modal('hide');
                            this._router.navigate([this._accountService.getPath() + '/jobs']);
                        });


                    },
                    error => {
                        this.postProgress = false;
                    });
            }
        }


    }

    updateJob() {

        this.pristineFlag$.next(false);
        if(this.jobForm.valid && this.languagearry.length > 0){

            this.jobForm.controls['job_status'].setValue(2);
            let postJson = this.getPostJson();

            if(this.jobForm.controls['id'].value == null){


                if(this.postProgress == false){

                    this.postProgress = true;
                    this._companyService.getAddJobs(postJson).subscribe(res =>{



                       this.postProgress = false;
                        this.jobId$.next(res['job']['id']);
                        this.jobForm.controls['id'].setValue(res['job']['id']);
                        jQuery('#post-published').modal('show');

                    },
                    error=>{
                        this.postProgress = false;
                    });
                }

            }
            else {

                if(this.postProgress == false) {
                    this.postProgress = true;
                    this._companyService.getUpdateJobs(this.jobForm.controls['id'].value, postJson).subscribe(res => {

                            this.postProgress = false;
                            this.jobId$.next(res['job']['id']);
                            this.jobForm.controls['id'].setValue(res['job']['id']);
                            jQuery('#post-published').modal('show');

                            this.iframeBlock = '<iframe src="' + res['job']['id'] + '"><iframe>'
                        },
                        error => {
                            this.postProgress = false;
                        });
                }
            }



        }
    }



      clean(obj) {
        for (var propName in obj) {
            if (obj[propName] === null || obj[propName] === undefined) {

                if(propName != "join_date")
                obj[propName] = {};
            }
        }
        return obj;
    }

    cleanData(res){


        if(res["job"]["experience_from"] == null){
            res["job"]["experience_from"] = "";
        }

        if(res["job"]["experience_to"] == null){
            res["job"]["experience_to"] = "";
        }

        if(typeof(res["job"]["gender_type"]) === 'object'){

            res["job"]["gender_type"] = 'any';
        }

        if(typeof(res["job"]["marital_status"]) === 'object'){

            res["job"]["marital_status"] = null;
        }

        return res;
    }

    ngOnInit(){

        this.paramsRoute = this._activeRoute.params.subscribe(params => {





            if(params["id"]){
                let jobId = +params["id"];
                this._companyService.getCompanyJob(jobId).subscribe(res=>{

                    res["job"] = this.clean(res["job"])

                    this.cityObj.id = res["job"]["city"]["id"];
                    this.cityObj.name = res["job"]["city"]["name"];
                    this.cityObj.text = res["job"]["city"]["name"];
                    this.cityObj.country_id = res["job"]["country"]["id"];



                    this.joinImidiateFlag = (res["job"]["join_date"] == null)?true:false;
                    this.drivingLicenseRequired = (res["job"]["license_required"] == null)?false:res["job"]["license_required"];

                    let benefit_ids = [];

                    if(res["job"]["benefits"] != "undefined" && res["job"]["benefits"]  != null){
                        res["job"]["benefits"].forEach(selBenefit=>{

                            benefit_ids.push(selBenefit["id"]);
                        });
                    }

                    let geo_countries_ids = [];

                    if(res["job"]["geo_countries"] != "undefined" && res["job"]["geo_countries"]  != null){
                        res["job"]["geo_countries"].forEach(selGeo=>{

                            geo_countries_ids.push(selGeo["id"]);
                        });
                    }

                    if(res["job"]["languages"] != "undefined" && res["job"]["languages"]  != null){
                        res["job"]["languages"].forEach(selLang=>{

                            this.languagearry.push({id:selLang["id"],name:selLang["name"]});
                        });
                    }

                    if(res["job"]["skills"] != "undefined" && res["job"]["skills"]  != null){
                        res["job"]["skills"].forEach(selSkill=>{

                            this.skillsarry.push({id:selSkill["id"],name:selSkill["name"]});
                        });
                    }

                    if(res["job"]["certificates"] != "undefined" && res["job"]["certificates"]  != null){
                        res["job"]["certificates"].forEach(certSkill=>{

                            this.certarry.push({id:certSkill["id"],name:certSkill["name"]});
                        });
                    }



                    let start_date = moment(res["job"]["start_date"]).format("D MMM, YYYY");
                    let end_date = moment(res["job"]["end_date"]).format("D MMM, YYYY");


                    let visa_status_id = (!res["job"]["visa_status"])?0:res["job"]["visa_status"]["id"];
                    let age_group_id   = (!res["job"]["age_group"])?0:res["job"]["age_group"]["id"];




                    res = this.cleanData(res);


                    this.country_id = res["job"]["country"]["id"];
                    this.jobForm = this._fb.group({
                        id: [res["job"]["id"]],
                        job_status: [res["job"]["job_status"]["id"].toString(),Validators.required],
                        notification_type: [res["job"]["notification_type"].toString(),Validators.required],
                        country_id: [res["job"]["country"]["id"],Validators.required],
                        city_id: [res["job"]["city"]["id"],Validators.required],
                        job_education_id: [res["job"]["job_education"]["id"],Validators.required],
                        salary_range_id: [res["job"]["salary_range"]["id"],Validators.required],
                        job_type_id: [res["job"]["job_type"]["id"],Validators.required],
                        sector_id: [res["job"]["sector"]["id"],Validators.required],
                        functional_area_id: [res["job"]["functional_area"]["id"],Validators.required],
                        description: [res["job"]["description"],Validators.required],
                        benefit_ids: [benefit_ids],
                        geo_countries_ids: [geo_countries_ids,TypeValidators.array],
                        age_group_id: [age_group_id,Validators.required],
                        requirements: [res["job"]["requirements"],Validators.required],
                        visa_status_id: [visa_status_id,Validators.required],
                        gender_type: [res["job"]["gender_type"],Validators.required],
                        license_required: [this.drivingLicenseRequired.toString(),Validators.required],
                        marital_status_id: [res["job"]["marital_status"] ,Validators.required],
                        join_date: [res["job"]["join_date"]],
                        join_immediately: [this.joinImidiateFlag],
                        job_experience_level_id: [res["job"]["job_experience_level"]["id"],Validators.required],
                        start_date: [start_date,[Validators.required,DateValidator.validDate,DateValidator.validDateGrtEqlToday]],
                        end_date: [end_date,[Validators.required,DateValidator.validDate,DateValidator.validDateRange]],
                        experience_from: [res["job"]["experience_from"],[Validators.required,TypeValidators.numeric_no_decimal]],
                        experience_to: [res["job"]["experience_to"],[Validators.required,TypeValidators.numeric_no_decimal,ExpLessThanValidator.explessThan]],
                        title: [res["job"]["title"],Validators.required]
                    });

                    this.loadedData =true;
                });
            }
            else {

                if(!this._accountService.getCreateJob()) {
                    this._router.navigate(['/'+this._accountService.getPath()+'/jobs']);
                }


                this.cityObj.id = null
                this.cityObj.name = "";
                this.cityObj.text = "";
                this.cityObj.country_id = null;



                this.joinImidiateFlag = true;
                this.drivingLicenseRequired = false;

                let benefit_ids = [];



                let geo_countries_ids = [];






                this.country_id = null;
                this.jobForm = this._fb.group({
                    id: [null],
                    job_status: ['2',Validators.required],
                    notification_type: ['1',Validators.required],
                    country_id: ['',Validators.required],
                    city_id: ['',Validators.required],
                    job_education_id: ['',Validators.required],
                    salary_range_id: [1,Validators.required],
                    job_type_id: ['',Validators.required],
                    sector_id: ['',Validators.required],
                    functional_area_id: ['',Validators.required],
                    description: ['',Validators.required],
                    benefit_ids: [benefit_ids],
                    geo_countries_ids: [geo_countries_ids,Validators.required],
                    age_group_id: [null,Validators.required],
                    requirements: ['',Validators.required],
                    visa_status_id: [null,Validators.required],
                    gender_type: ['',Validators.required],
                    license_required: [this.drivingLicenseRequired.toString(),Validators.required],
                    marital_status_id: ['' ,Validators.required],
                    join_date: [''],
                    join_immediately: [this.joinImidiateFlag],
                    job_experience_level_id: ['',Validators.required],
                    start_date: ['',[Validators.required,DateValidator.validDate,DateValidator.validDateGrtEqlToday]],
                    end_date: ['',[Validators.required,DateValidator.validDate]],
                    experience_from: [-1,[Validators.required,TypeValidators.numeric_no_decimal]],
                    experience_to: [-1,[Validators.required,TypeValidators.numeric_no_decimal,ExpLessThanValidator.explessThan]],
                    title: ['',Validators.required]
                });

                this.loadedData =true;
            }



            this.loader();

        })
    }


    ngOnDelete(){

    }


    updateExp(id) {

        this.excludeToYears = [];
        this.jobForm.controls['experience_to'].setValue(null);
        this.yearsExpList.forEach(selVal=>{
            if(selVal.id <=id)
            this.excludeToYears.push({id:selVal.id});
        });
    }

    constructor(public _accountService:AccountService,public _fb:FormBuilder,
                public _companyService:CompanyService,
                public _loaderService:LoaderService,
                public _generalService:GeneralService,
                public _activeRoute:ActivatedRoute,
                public _router:Router) {

        this.yearsExpList = this._generalService.getExpList();


    }

}
