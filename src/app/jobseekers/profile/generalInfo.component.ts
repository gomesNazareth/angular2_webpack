import {Input, Component, OnInit,Output,EventEmitter} from '@angular/core'
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import {BehaviorSubject} from "rxjs/Rx";


//Services
import {GeneralService} from  '../../shared/services/general.service';
import {ProfileService} from '../../core/services/profile.service';
import {LoaderService} from '../../shared/services/loader.service';



//Models
import {JobSeekerGeneralInfo, Language} from './models/JobSeekerGeneralInfo';

//Validators
import {TypeValidators} from '../../shared/validators/basicValidators'
import {AccountService} from "../../core/account/services/account.service";

var moment = require('moment');

declare  var moment;
@Component({

    selector: "general_info",
    templateUrl: "generalInfo.component.html"


})

// export class GeneralInfoComponent implements OnInit {
export class GeneralInfoComponent  {


    @Input() generalInfo;
    @Input() percentage:BehaviorSubject<any>;

    @Input() jobSeekerGeneralInfo:BehaviorSubject<any>;

    @Output() onUpdateProfileStatus = new EventEmitter();

    // //Flags
    // public generalInfoLoader = false;
    // public toDOBYear  = moment().format('YYYY');
    // public activeForm = false;
    // public drivingLicenseFlag = false;
    // public maritalStatusHash = {"single":"Single","married":"Married"};
    // public genderHash = {"not_defined":"Any","null":"Any","male":"Male","female":"Female"};
    // public toYear = moment().subtract(18.1, 'y').format('YYYY');
    // public maxDate = moment().subtract(18.1, 'y')._d;
    //
    // public generalInfoLoader$: BehaviorSubject<any> = new BehaviorSubject(false);
    // public yearsExpList;
    //
    // //Forms
    // generalInfo_form:FormGroup;
    // form2:FormGroup;
    //
    // //Members
    // public languages:string;
    // public languagesList;
    // public jobSeekerGeneralInfo_val = new JobSeekerGeneralInfo();
    // public experienceLevelList = [];
    // public countryList = [];
    // public educationList = [];
    // public functionalAreaList = [];
    // public sectorList = [];
    // public jobTypeList = [];
    // public salaryList = [];
    // public profileCacheDirty = false;
    // public monthList = [];
    //
    // public yearList = [];
    // public genderList = [];
    // public maritalList = [];
    // public visaList = [];
    // public noticePeriodMonthsList = [];
    //
    // public language_valid:boolean = false;
    // public language_touched:boolean = false;
    //
    // public formPostedValid:boolean = false;
    // public formPostedValid$:BehaviorSubject<any> = new BehaviorSubject(false);
    //
    //
    // public tab_status = "read";
    // public jobseeker_id = -1;
    //
    // onRead() {
    //     this.tab_status = "read";
    //     this.activeForm = false;
    // }
    //
    // onEdit() {
    //     this.tab_status = "edit";
    //     this.activeForm = true;
    //     this.buildForm();
    // }
    //
    //
    //
    //
    // onChangeLan($event){
    //
    //     this.language_valid = false;
    //     let languageIdList = [];
    //     if($event.languageList) {
    //
    //         $event.languageList.forEach(selLan => {
    //             this.language_valid = true;
    //
    //             languageIdList.push(selLan.id);
    //         });
    //     }
    //
    //
    //     this.language_touched= true;
    //     this.generalInfo_form.value["language_ids"] = languageIdList;
    //
    // }
    //
    //
    // public onPost(){
    //
    //
    //     if(!this.drivingLicenseFlag){
    //
    //         this.generalInfo_form.value.driving_license_country_id = null;
    //     }
    //
    //     let postList = {
    //         "sector_id": this.generalInfo_form.value.sector_id,
    //         "job_education_id": this.generalInfo_form.value.highest_edu_name_id,
    //         "years_of_experience": this.generalInfo_form.value.total_years_experience,
    //         "current_salary": this.generalInfo_form.value.currently_monthly_salary,
    //         "nationality_id": this.generalInfo_form.value.nationality_id,
    //         "user_attributes": {
    //             "dob_day": moment(new Date(this.generalInfo_form.value.dob)).format('DD'),
    //             "dob_month": moment(new Date(this.generalInfo_form.value.dob)).format('MM'),
    //             "dob_year": moment(new Date(this.generalInfo_form.value.dob)).format('YYYY'),
    //             "gender": this.generalInfo_form.value.gender
    //         },
    //         "marital_status": this.generalInfo_form.value.marital_status,
    //         "driving_license_country_id": this.generalInfo_form.value.driving_license_country_id,
    //         "functional_area_id": this.generalInfo_form.value.functional_area_id,
    //         "job_experience_level_id": this.generalInfo_form.value.experience_level_id,
    //         "job_type_id": this.generalInfo_form.value.job_type_id,
    //         "expected_salary": this.generalInfo_form.value.expected_monthly_salary,
    //         "languages": this.generalInfo_form.value.language_ids,
    //         "visa_status_id": this.generalInfo_form.value.visa_status,
    //         "notice_period_in_month": this.generalInfo_form.value.notice_period_in_months
    //     }
    //
    //     this._profileService.updateMyInformation(postList).subscribe(
    //         res=>{
    //
    //             this.profileCacheDirty = true;
    //             this.generalInfoLoader =  false;
    //             this.generalInfoLoader$.next(false);
    //
    //             this.loadGeneralInfo(res["jobseeker_profile"]);
    //             this.onRead();
    //
    //             this.onUpdateProfileStatus.emit({"update":true});
    //
    //
    //         }
    //     );
    //
    // }
    //
    // public loadGeneralInfo(profile) {
    //
    //
    //     this.generalInfo = profile["general_info"];
    //     this.jobSeekerGeneralInfo_val.jobseeker_id = profile["jobseeker_id"];
    //     this.jobSeekerGeneralInfo_val.sector_id = profile["general_info"]["sector"]["id"];
    //     this.jobSeekerGeneralInfo_val.sector_name = profile["general_info"]["sector"]["name"];
    //
    //     this.jobSeekerGeneralInfo_val.functional_area_id = profile["general_info"]["functional_area"]["id"];
    //     this.jobSeekerGeneralInfo_val.functional_area_name = profile["general_info"]["functional_area"]["name"];
    //     this.jobSeekerGeneralInfo_val.highest_edu_id = profile["general_info"]["highest_edu"]["id"];
    //     this.jobSeekerGeneralInfo_val.highest_edu_name = profile["general_info"]["highest_edu"]["name"];
    //     this.jobSeekerGeneralInfo_val.experience_level_id = profile["general_info"]["experince_level"]["id"];
    //     this.jobSeekerGeneralInfo_val.experince_level_name = profile["general_info"]["experince_level"]["name"];
    //     this.jobSeekerGeneralInfo_val.total_years_experience = profile["general_info"]["total_years_experience"];
    //     this.jobSeekerGeneralInfo_val.job_type_id = profile["general_info"]["job_type"]["id"];
    //     this.jobSeekerGeneralInfo_val.job_type_name = profile["general_info"]["job_type"]["name"];
    //     this.jobSeekerGeneralInfo_val.current_salary = profile["general_info"]["current_salary"];
    //     this.jobSeekerGeneralInfo_val.nationality_id = profile["general_info"]["nationality"]["id"];
    //     this.jobSeekerGeneralInfo_val.nationality_name = profile["general_info"]["nationality"]["name"];
    //
    //     let lan:Language[] = [];
    //     profile["general_info"]["languages"].forEach((language=> {
    //             lan.push(new Language(language.id, language.name))
    //         })
    //     );
    //
    //     this.jobSeekerGeneralInfo_val.languages = lan;
    //
    //     this.jobSeekerGeneralInfo_val.expected_salary = profile["general_info"]["expected_salary"];
    //     this.jobSeekerGeneralInfo_val.gender = profile["general_info"]["gender"];
    //
    //
    //     this.jobSeekerGeneralInfo_val.marital_status = profile["general_info"]["marital_status"];
    //     this.jobSeekerGeneralInfo_val.visa_status = profile["general_info"]["visa_status"];
    //     this.jobSeekerGeneralInfo_val.driving_license = false;
    //     if (profile["general_info"]["driving_license_issued_from"]) {
    //         this.jobSeekerGeneralInfo_val.driving_license = true;
    //         this.jobSeekerGeneralInfo_val.driving_license_country_id = profile["general_info"]["driving_license_issued_from"]["id"];
    //     }
    //
    //     this.jobSeekerGeneralInfo_val.notice_period_in_months = profile["general_info"]["notice_period_in_months"];
    //
    //
    //     this.jobSeekerGeneralInfo_val.dob_day = profile["general_info"]["dob"]["day"];
    //     this.jobSeekerGeneralInfo_val.dob_month = profile["general_info"]["dob"]["month"];
    //     this.jobSeekerGeneralInfo_val.dob_year = profile["general_info"]["dob"]["year"];
    //
    //
    //     this.jobSeekerGeneralInfo_val.dob = new Date(profile["general_info"]["dob"]["year"],
    //         profile["general_info"]["dob"]["month"],
    //         profile["general_info"]["dob"]["day"]);
    //
    //
    //     this.jobSeekerGeneralInfo.next(this.jobSeekerGeneralInfo_val);
    // }
    //
    //
    // saveDetails() {
    //
    //     this.formPostedValid = true;
    //     this.formPostedValid$.next(true);
    //
    //
    //     if (this.generalInfo_form.valid && this.language_valid) {
    //         this.generalInfoLoader = true;
    //         this.generalInfoLoader$.next(true);
    //         this.onPost();
    //     }
    //     else {
    //         console.error("Invalid general Info");
    //
    //     }
    //
    // }
    //
    //
    // public buildForm() {
    //
    //
    //     this.jobSeekerGeneralInfo.subscribe(jobSeekerGeneralInfo=> {
    //
    //
    //         if (jobSeekerGeneralInfo) {
    //
    //             let languages = Array();
    //             let language_ids = Array();
    //
    //             jobSeekerGeneralInfo.languages.forEach(selLan=> {
    //
    //                 this.language_valid = true;
    //                 let lang1 = new Language(selLan.id,selLan.name);
    //
    //                 languages.push(lang1);
    //                 language_ids.push(selLan.id);
    //
    //
    //             });
    //
    //
    //
    //             this.languagesList = languages;
    //
    //
    //             // this.drivingLicenseFlag = jobSeekerGeneralInfo.driving_license;
    //             this.drivingLicenseFlag = (jobSeekerGeneralInfo.driving_license_country_id)?true:false;
    //             this.generalInfoLoader = false;
    //
    //             jobSeekerGeneralInfo.gender =(jobSeekerGeneralInfo.gender == "not_defined")?"null":jobSeekerGeneralInfo.gender;
    //
    //
    //             let group = {
    //                 jobseeker_id: jobSeekerGeneralInfo.jobseeker_id,
    //                 jobseeker_name: jobSeekerGeneralInfo.jobseeker_name,
    //                 sector_id: [jobSeekerGeneralInfo.sector_id, Validators.required],
    //                 functional_area_id: [jobSeekerGeneralInfo.functional_area_id, Validators.required],
    //                 highest_edu_name_id: [jobSeekerGeneralInfo.highest_edu_id, Validators.required],
    //                 experience_level_id: [jobSeekerGeneralInfo.experience_level_id, Validators.required],
    //                 expected_monthly_salary: [jobSeekerGeneralInfo.expected_salary, [Validators.required,TypeValidators.numeric_no_decimal]],
    //                 job_type_id: [jobSeekerGeneralInfo.job_type_id, Validators.required],
    //                 currently_monthly_salary: [
    //                     jobSeekerGeneralInfo.current_salary,
    //                     [Validators.required, TypeValidators.numeric_no_decimal]
    //                 ],
    //                 total_years_experience: [
    //                     jobSeekerGeneralInfo.total_years_experience,
    //                     [ Validators.required, TypeValidators.numeric_no_decimal]
    //                 ],
    //                 nationality_id: [jobSeekerGeneralInfo.nationality_id, Validators.required],
    //                 dob: [moment(Date.parse(jobSeekerGeneralInfo.dob_year+'-'+jobSeekerGeneralInfo.dob_month+'-'+jobSeekerGeneralInfo.dob_day)).format("D MMM, YYYY"),Validators.required],
    //                 gender: [jobSeekerGeneralInfo.gender, Validators.required],
    //                 marital_status: [jobSeekerGeneralInfo.marital_status, Validators.required],
    //                 visa_status: [jobSeekerGeneralInfo.visa_status["id"], Validators.required],
    //                 notice_period_in_months: [jobSeekerGeneralInfo.notice_period_in_months, Validators.required],
    //                 driving_license_status_id: [jobSeekerGeneralInfo.driving_license, Validators.required],
    //                 driving_license_country_id: [jobSeekerGeneralInfo.driving_license_country_id]
    //
    //             };
    //
    //
    //
    //             this.generalInfo_form = this.fb.group(group);
    //         }
    //
    //
    //     });
    //
    //
    // }
    //
    // setDOB($event){
    //     this.generalInfo_form.controls['dob'].setValue($event.selDate);
    // }
    //
    // ngOnDestroy() {
    //
    //     if(this.profileCacheDirty){
    //         AccountService.profileCacheDirty = true;
    //     }
    //
    // }
    // ngOnInit() {
    //
    //
    //
    //
    //     this.generalInfoLoader = false;
    //
    //
    //
    //     this.monthList = this._generalService.getMonths();
    //     this.yearList = this._generalService.getYears();
    //
    //     this.genderList = this._generalService.getJobseekerGender();
    //     this.maritalList = this._generalService.getMaritalStatus();
    //     this._generalService.getVisaStatus()
    //         .subscribe(
    //             visa_statuses => {
    //                 this.visaList = visa_statuses
    //             }
    //         );
    //
    //     this.noticePeriodMonthsList = this._generalService.getNoticePeriod();
    //
    //
    //
    //     this._loaderService.getJobTypes()
    //         .subscribe(
    //             job_types => {
    //                 this.jobTypeList =job_types;
    //             }
    //         );
    //
    //
    //     this._loaderService.getCountries("alphabetical")
    //         .subscribe(
    //             countries => {
    //                 this.countryList = countries
    //             }
    //         );
    //
    //     this._loaderService.getSectors()
    //         .subscribe(
    //             sectors => {
    //                 this.sectorList = sectors
    //             }
    //         );
    //
    //     this._loaderService.getFunctionalArea()
    //         .subscribe(
    //             functional_areas => {
    //                 this.functionalAreaList = functional_areas
    //             }
    //         );
    //
    //     this._generalService.getJobEducations()
    //         .subscribe(
    //             job_educations => {
    //                 this.educationList = job_educations
    //             }
    //         );
    //
    //     this._generalService.getJobExperienceLevels()
    //         .subscribe(
    //             job_experience_levels => {
    //                 this.experienceLevelList = job_experience_levels
    //             }
    //         );
    //
    //
    // }
    //
    // public radioValue: any = '200';
    // public radioValue2: any = '200';
    //
    // constructor(public _generalService:GeneralService,
    //             public _loaderService:LoaderService,
    //             public fb:FormBuilder,
    //             public _profileService:ProfileService) {
    //
    //     this.yearsExpList = this._generalService.getExpList();
    //
    // }
    //
    //
    // clickSelectDrivingLicense() {
    //     this.drivingLicenseFlag = true;
    // }
    //
    // clickUnSelectDrivingLicense() {
    //     this.drivingLicenseFlag = false;
    // }


}
