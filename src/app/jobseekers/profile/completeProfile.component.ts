import {Component, OnInit, EventEmitter, Output,Input, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {City} from '../../shared/models/City';

//Validators
import {TypeValidators} from '../../shared/validators/basicValidators'

//Services
import {ProfileService} from '../../core/services/profile.service';

//Services

import {LoaderService} from "../../shared/services/loader.service";
import {GeneralService} from "../../shared/services/general.service";
import {JobSeekerSkills} from './models/JobSeekerSkills';
import {AccountService} from "../../core/account/services/account.service";

// var bootstrap = require('bootstrap');
var moment = require('moment');

declare var moment:any;

@Component({

    selector: "complete-profile",
    templateUrl: "completeProfile.component.html"
})


export class CompleteProfileComponent implements OnInit {

    @Input() current_step:BehaviorSubject<any> = new BehaviorSubject(null);
    @Input() profileObject:BehaviorSubject<any> = new BehaviorSubject(null);

    public countryList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public sectorList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public jobTypeList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public functionalAreaList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public pristineFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public experienceLevelList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public educationLevelList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public visaStatusList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public avatarImage$:BehaviorSubject<any> = new BehaviorSubject(null);
    public video$:BehaviorSubject<any> = new BehaviorSubject(null);
    public loadSpinner$:BehaviorSubject<any> = new BehaviorSubject(false);
    public formPostedValid$:BehaviorSubject<any> = new BehaviorSubject(false);
    public languageIdList = [];
    public country_id = null;
    public country_name = null;
    public cityObj:City = new City();
    public backFlag:boolean = false;
    public work_experience_id = null;
    public work_experience = null;
    public current_experience:boolean = false;
    public maxDate = moment()._d;
    public toYear = moment().format('YYYY');
    public yearsExpList;

    public maritalList$: BehaviorSubject<any> = new BehaviorSubject([{id: 'married', name: 'Married'}, {id: 'single', name: 'Single'}]);
    public noticeList$: BehaviorSubject<any> = new BehaviorSubject([]);
    public current_step$: BehaviorSubject<any> = new BehaviorSubject(null);
    public has_location$: BehaviorSubject<any> = new BehaviorSubject(false);
    public skills$:BehaviorSubject<any> = new BehaviorSubject(null);
    public skills:BehaviorSubject<any>= new BehaviorSubject([]);
    public completeLocationForm:FormGroup;
    public completeFirstForm:FormGroup;
    public completeSecondForm:FormGroup;
    public skillList:JobSeekerSkills[] = [];
    public dataLoaded = false;
    public uploadError = false;
    public conpanyList = [];
    public showCurrentEmp = false;
    public videoFormatList =['video/x-msvideo', 'video/avi', 'video/quicktime',
    'video/3gpp', 'video/x-ms-wmv', 'video/mp4','video/webm',
    'flv-application/octet-stream', 'video/x-flv',
    'video/mpeg', 'video/mpeg4', 'video/x-la-asf',
    'video/x-ms-asf', 'flv-application/octet-stream'];

    public videoFileExtentions = '.avi,.mp4,.flv,.wmv,.mpeg';


    //validation flags
    public validationListError = {job_type_id:true,position:true,current_comp_id:true,from_date:true};
    public validationListErrorObj = new BehaviorSubject(this.validationListError);

    public touchedList = {job_type_id:false,position:false,current_comp_id:false,from_date:false};
    public touchedListObj    =  new BehaviorSubject(this.touchedList);


    public loadFiles($event,fileType='image'){

        if(fileType == 'image'){
            this.avatarImage$.next($event.file);
        }
        else if(fileType == 'video'){
           this.video$.next($event.file);
        }
    }

    public validateInput(name = ""){
        this.touchedListObj.value[name] = true;

        if(this.completeFirstForm.value[name] == "" || this.completeFirstForm.value[name] == " "){
            this.validationListErrorObj.value[name] = true;
        }
        else {
            this.validationListErrorObj.value[name] = false;
        }


    }

    public getHashValue(hash, key, level2 = null) {


        if (hash == null) {
            return null;
        }
        if (hash.hasOwnProperty(key)) {
            if (level2 == null) {
                return hash[key];
            }
            else {
                if (hash[key] && hash[key].hasOwnProperty(level2)) {
                    return hash[key][level2];
                }
                else {
                    return null;
                }
            }
        }
        else {
            return null;
        }


    }

   public _loadData() {


           this.profileObject.next(this._profileService.getProfileObj());
           this.profileObject.subscribe(profileObj => {
               if (profileObj.country.name && profileObj.city.name) {
                   this.has_location$.next(true);
               }
           });

          // this.video$.next(this.profileObject["video_screenshot"]);
          //  this.avatarImage$.next(this.profileObject["avatar"]);
           this.completeFirstForm.controls['job_type_id'].setValue(this.getHashValue(this.profileObject["job_type"], "id"));
           this.completeFirstForm.controls['position'].setValue(this.getHashValue(this.profileObject["current_experience"], "position"));
           this.completeFirstForm.controls['company_name'].setValue(this.getHashValue(this.profileObject["current_experience"], "company_name"));
           this.completeFirstForm.controls['current_comp_id'].setValue(this.getHashValue(this.profileObject["current_experience"], "id"));
           if(this.completeFirstForm.controls['position'].value == null) {
               this.showCurrentEmp = true;
           }

           this.completeFirstForm.controls['functional_area_id'].setValue(this.getHashValue(this.profileObject["general_info"], "functional_area","id"));
           this.completeFirstForm.controls['sector_id'].setValue(this.getHashValue(this.profileObject["general_info"],"sector", "id"));
           this.completeFirstForm.controls['job_experience_level_id'].setValue(this.getHashValue(this.profileObject["general_info"],"experince_level", "id"));
           this.completeFirstForm.controls['current_salary'].setValue(this.getHashValue(this.profileObject["general_info"],"current_salary"));
           this.completeFirstForm.controls['expected_salary'].setValue(this.getHashValue(this.profileObject["general_info"],"expected_salary"));
           this.completeFirstForm.controls['total_years_experience'].setValue(this.getHashValue(this.profileObject["general_info"],"total_years_experience"));

           this.completeSecondForm.controls['job_education_id'].setValue(this.getHashValue(this.profileObject.getValue(), "job_education", "id"));

           if(this.getHashValue(this.profileObject["contact"], "mobile_no") != null){
               this.completeSecondForm.controls['mobile_phone'].setValue(this.getHashValue(this.profileObject["contact"], "mobile_phone"));
           }
           this.completeSecondForm.controls['marital_status'].setValue(this.getHashValue(this.profileObject["general_info"], "marital_status"));
           this.completeSecondForm.controls['visa_status_id'].setValue(this.getHashValue(this.profileObject["general_info"],"visa_status", "id"));
           this.completeSecondForm.controls['notice_period_in_month'].setValue(this.getHashValue(this.profileObject["general_info"],"notice_period_in_months"));
           if(this.getHashValue(this.profileObject["general_info"],"driving_license_issued_from","id") != null)
           {
               this.completeSecondForm.controls['has_driving_license'].setValue("true");
           }
           else {
               this.completeSecondForm.controls['has_driving_license'].setValue("false");

           }
           this.completeSecondForm.controls['driving_license_country_id'].setValue(this.getHashValue(this.profileObject["general_info"],"driving_license_issued_from","id"));
           this.completeSecondForm.controls['language_ids'].setValue(this.getHashValue(this.profileObject["general_info"], "languages"));
           this.languagesList = this.getHashValue(this.profileObject["general_info"], "languages") || [];

           if(this.profileObject["skills"]){
               this.skillList = this.profileObject["skills"];
           }

           this.dataLoaded = true;
   }

    onSelectCompany($event) {
        this.completeFirstForm.controls['company_name'].setValue($event.name);
        this.completeFirstForm.controls['current_comp_id'].setValue($event.id);
        this.validateInput('current_comp_id')
    }

    ngOnInit() {
        this.languagesList = [];

        this.noticeList$.next([
            {id: 0, name: "Less than 1 Month"}, {id: 1, name: "1 Month"}, {id: 2, name: "2 Months"},
            {id: 3, name: "3 Months"}, {id: 4, name: "4 Months"}, {id: 5, name: "5 Months"},
            {id: 12, name: "+6 Months"}
        ]);


        this._generalService.getCompanies().subscribe(comRes =>{
            comRes.forEach(res=>{
                this.conpanyList.push({id:res["id"],name:res["name"]});

            });
        });

        this._loaderService.getCountries("alphabetical")
            .subscribe(
                countries => {
                    this.countryList$.next(countries);
                }
            );

        this._loaderService.getSectors()
            .subscribe(
                sectors => {
                    this.sectorList$.next(sectors);
                }
            );

        this._loaderService.getJobTypes()
            .subscribe(
                job_types => {
                    this.jobTypeList$.next(job_types);
                }
            );

        this._loaderService.getFunctionalArea()
            .subscribe(
                functional_areas => {
                    this.functionalAreaList$.next(functional_areas);
                }
            );

        this._loaderService.getExperienceLevels()
            .subscribe(
                experience_levels => {
                    this.experienceLevelList$.next(experience_levels);
                }
            );

        this._loaderService.getEducationLevels()
            .subscribe(
                education_levels => {
                    this.educationLevelList$.next(education_levels);
                }
            );

        this._loaderService.getVisaStatuses()
            .subscribe(
                visa_statuses => {
                    this.visaStatusList$.next(visa_statuses);
                }
            );

        this.completeLocationForm = this._fb.group({
            country_id: ["",Validators.required],
            city_id: ["",Validators.required],
        });

        this.completeFirstForm = this._fb.group({
            sector_id: ["",Validators.required],
            current_salary: ["", [Validators.required, TypeValidators.numeric_no_decimal]],
            expected_salary: ["",[Validators.required,TypeValidators.numeric_no_decimal]],
            position: [""],
            company_name: [""],
            current_comp_id: [""],
            from_date: [""],
            working: ["false"],
            total_years_experience: ["",[Validators.required,TypeValidators.numeric_no_decimal]],
            job_type_id: [""],
            functional_area_id: ["",Validators.required],
            job_experience_level_id: ["",Validators.required]
        });


        this.getCurrentExp();

        this.completeSecondForm = this._fb.group({
            job_education_id: ["", Validators.required],
            mobile_phone: ["", Validators.required],
            marital_status: ["", Validators.required],
            visa_status_id: ["", Validators.required],
            has_driving_license: ["false"],
            driving_license_country_id: [null],
            notice_period_in_month: ["", Validators.required],
            language_ids: [[]]
        });

        this.current_step.subscribe(curr_st => {
            this.current_step$.next(curr_st);
        });

        this._loadData();

    }


    public languages:string;
    public languagesList;
    public language_valid:boolean = false;
    public language_touched:boolean = false;



    onChangeLan($event){

        this.language_valid = false;
        this.languageIdList = [];
        if($event.languageList) {

            $event.languageList.forEach(selLan => {
                this.language_valid = true;

                this.languageIdList.push(selLan.id);
            });
        }
        this.language_touched = true;
        this.completeSecondForm.value["language_ids"] = this.languageIdList;
    }


    onBack(step){
        this.backFlag = true;
        this.current_step$.next(step - 1);
    }

    onSkip(step) {
        let current_step =step + 1;
        this.current_step$.next(current_step);
        this.reloadPage(current_step);
    }

    onSelectCountry($event) {
        this.country_id =$event.id;
        this.country_name =$event.name;

        this.cityObj.id = null;
        this.cityObj.text = null;
        this.cityObj.name = null;
        this.cityObj.country_id =null;

    }


    onSubmitProfile(step:number) {

        this.pristineFlag$.next(false);
        let postData = {};
        let currentFormValid = false;
        if (this.has_location$.getValue() == false) {
            if (this.completeLocationForm.valid) {
                currentFormValid = true;

                postData = {
                    user_attributes: {
                        country_id: this.completeLocationForm.value["country_id"],
                        city_id: this.completeLocationForm.value["city_id"]
                    }
                }
            }
        }else if (step == 1) {
            if (this.completeFirstForm.valid &&
                ((this.completeFirstForm.value["working"] == 'true' &&
                  !this.validationListErrorObj.value["position"] &&
                  !this.validationListErrorObj.value["job_type_id"] &&
                  !this.validationListErrorObj.value["current_comp_id"] &&
                  !this.validationListErrorObj.value["from_date"])
                || this.completeFirstForm.value["working"] == 'false')) {

                currentFormValid = true;
                postData = {
                        functional_area_id: this.completeFirstForm.value["functional_area_id"],
                        sector_id: this.completeFirstForm.value["sector_id"],
                        job_experience_level_id: this.completeFirstForm.value["job_experience_level_id"],
                        years_of_experience: this.completeFirstForm.value["total_years_experience"],
                        current_salary: this.completeFirstForm.value["current_salary"],
                        expected_salary: this.completeFirstForm.value["expected_salary"]
                };

                if(!this.validationListErrorObj.value["job_type_id"]){
                    postData["job_type_id"] = this.completeFirstForm.value["job_type_id"];
                }

                let skillList = [];
                this.skillList.forEach((selSkill,selIndex)=>{
                    if(selSkill.name != ""){
                        skillList.push(selSkill);
                    }
                });
                let skillsData = {"jobseeker":{"skills":skillList}};
                this._profileService.updatSkills(skillsData)
                    .subscribe(res=>{
                            this.skillList = [];
                            res["jobseekers"].forEach(res1=>{

                                let selJobseeker = new JobSeekerSkills();
                                selJobseeker.id = res1.id;
                                selJobseeker.name = res1.name;
                                selJobseeker.level = res1.level;
                                this.skillList.push(selJobseeker);
                            });
                            this.skills$.next(this.skillList);
                    },
                    error=> {
                        console.log(error);
                    });



                // Post & Put Experice
                let experienceData = {
                    position:this.completeFirstForm.value["position"],
                    from:this.completeFirstForm.value["from_date"],
                    company_name:this.completeFirstForm.value["company_name"],
                    company_id:this.completeFirstForm.value["current_comp_id"]
                };

                if (this.completeFirstForm.value["working"] == 'true' ){


                    if(!this.current_experience){
                        this._profileService.postWorkExperience(experienceData).subscribe(res => {
                            this.current_experience = true;
                            this.work_experience_id = res["jobseeker_experience"]["id"];
                        }, error => {
                            console.log(error);
                        });
                    }
                    else {

                        this._profileService.putWorkExperience(this.work_experience_id,experienceData).subscribe(res => {
                            this.current_experience = true;


                        }, error => {
                            console.log(error);
                        });

                    }

                }

            }
        }
        else if (step == 2) {

            if (this.completeSecondForm.valid &&
                ((this.completeSecondForm.value["has_driving_license"] == 'true' &&
                  this.completeSecondForm.value["driving_license_country_id"] != null) ||
                    this.completeSecondForm.value["has_driving_license"] == 'false'
                )) {
                currentFormValid = true;

                postData = {
                        job_education_id: this.completeSecondForm.value["job_education_id"],
                        mobile_phone: this.completeSecondForm.value["mobile_phone"],
                        marital_status: this.completeSecondForm.value["marital_status"],
                        visa_status_id: this.completeSecondForm.value["visa_status_id"],
                        notice_period_in_month: this.completeSecondForm.value["notice_period_in_month"],
                        languages: this.languageIdList
                }

                if(this.completeSecondForm.value["has_driving_license"] == 'true'){
                   postData["driving_license_country_id"] = this.completeSecondForm.value["driving_license_country_id"];
                }
                else {
                    postData["driving_license_country_id"] = null
                }
            }
        }
        else if (step == 3) {

            postData = { user_attributes: { } }

            if(this.avatarImage$.value != null){
                postData["user_attributes"]["avatar"] = this.avatarImage$.value;
            }

            if(this.video$.value != null){
                postData["user_attributes"]["video"] = this.video$.value;
            }

            if(this.avatarImage$.value != null || this.video$.value != null ){
                currentFormValid = true;
            }
            else {
                this.uploadError = true;
                Observable.timer(1000).subscribe(tim=>{
                    this.uploadError = false;
                })

            }


        }



        if (currentFormValid) {
            this._profileService.updateProfile(postData).
            subscribe(res=> {
                let current_step = step + 1;
                this.current_step$.next(current_step);

                if (this.has_location$.getValue() == false){
                    if (res["jobseeker_profile"]["country"] && res["jobseeker_profile"]["country"]["name"] &&
                        res["jobseeker_profile"]["city"] && res["jobseeker_profile"]["city"]["name"]) {
                        this.has_location$.next(true);
                    }
                }

                currentFormValid = false;
                this.pristineFlag$.next(true);
                this.reloadPage(current_step);
            }, error=> {
                console.log("error", error);
            });

        }
    }

    setSkills($event){
        this.skillList = $event;
    }



    public getCurrentExp() {

        this._profileService.getProfile(this._accountService.getUserId()).subscribe(val =>{
            if(val["current_experience"] && val["current_experience"]["id"]){
                    this.showCurrentEmp = true;
                    this.work_experience_id = val["current_experience"]["id"];

                    this.completeFirstForm.controls["job_type_id"].setValue(val["general_info"]["job_type"]["id"]);
                    this.completeFirstForm.controls["current_comp_id"].setValue(val["current_experience"]["company_id"]);
                    this.completeFirstForm.controls["company_name"].setValue(val["current_experience"]["company_name"]);
                    this.completeFirstForm.controls["position"].setValue(val["current_experience"]["position"]);
                    this.completeFirstForm.controls["from_date"].setValue(val["current_experience"]["from"]);
                    this.completeFirstForm.controls["working"].setValue('true');
                this.current_experience = true;

                this.validateInput("job_type_id");
                this.validateInput("position");
                this.validateInput("current_comp_id");
                this.validateInput("from_date");
            }

            if(val["general_info"]){

                if(val["general_info"]["functional_area"])
                    this.completeFirstForm.controls["functional_area_id"].setValue(val["general_info"]["functional_area"]["id"]);
                if(val["general_info"]["job_experience_level"])
                    this.completeFirstForm.controls["job_experience_level_id"].setValue(val["job_experience_level"]["id"]);
                this.completeFirstForm.controls["current_salary"].setValue(val["general_info"]["current_salary"]);
                if(val["general_info"]["sector"])
                    this.completeFirstForm.controls["sector_id"].setValue(val["general_info"]["sector"]["id"]);
                this.completeFirstForm.controls["expected_salary"].setValue(val["general_info"]["expected_salary"]);

                if(val["job_experience_level"])
                    this.completeFirstForm.controls["job_experience_level_id"].setValue(val["job_experience_level"]["id"]);
                this.completeFirstForm.controls["total_years_experience"].setValue(val["general_info"]["total_years_experience"]);

                if(this.profileObject["job_education"])
                    this.completeSecondForm.controls['job_education_id'].setValue(val["job_education"]["id"]);
                this.completeSecondForm.controls['marital_status'].setValue(val["general_info"]["marital_status"]);
                this.completeSecondForm.controls['mobile_phone'].setValue(val["contact"]["mobile_no"]);
                if(val["general_info"]["visa_status"])
                    this.completeSecondForm.controls['visa_status_id'].setValue(val["general_info"]["visa_status"]["id"]);
                this.completeSecondForm.controls['notice_period_in_month'].setValue(val["general_info"]["notice_period_in_months"]);

                if(val["general_info"]["driving_license_issued_from"] && val["general_info"]["driving_license_issued_from"]["id"]) {

                    this.completeSecondForm.controls['has_driving_license'].setValue('true');
                    this.completeSecondForm.controls['driving_license_country_id'].setValue(val["general_info"]["driving_license_issued_from"]["id"]);
                }

                // this.completeSecondForm.controls['driving_license_country_id'].setValue(val["general_info"]["notice_period_in_months"]);

                this.languagesList = this.getHashValue(val["general_info"], "languages") || [];
            }



        });
    }


    public  reloadPage(currentPage){
        if(currentPage > 3){

            Observable.timer(1000).subscribe(res =>{
                window.location.reload();
            });
        }
    }

    constructor(public _loaderService:LoaderService,
                public _accountService:AccountService,
                public _fb:FormBuilder,
                public _generalService:GeneralService,
                public _profileService:ProfileService) {

        this.yearsExpList = this._generalService.getExpList();
    }
}
