import {Component, OnInit, ElementRef, Inject, AfterViewChecked } from '@angular/core';
import { Title } from '@angular/platform-browser';

//Models
import {JobSeekerContact} from './models/JobSeekerContact';
import {JobSeekerAddress} from './models/JobSeekerAddress';
import {JobSeekerGeneralInfo, Language} from './models/JobSeekerGeneralInfo';
import {JobSeekerSkills} from './models/JobSeekerSkills';
//Models
import {Country} from '../../shared/models/Country';
import {City} from '../../shared/models/City';
import {File} from '../../shared/models/File';
import {File1} from '../../shared/models/File';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ActivatedRoute, Router} from '@angular/router';

//Forms
import {FormBuilder, Validators } from '@angular/forms';

//Validators
import {BasicValidators} from '../../shared/validators/basicValidators';

//Services
import {ProfileService} from '../../core/services/profile.service';
import {LoaderService} from '../../shared/services/loader.service';
import {AccountService} from '../../core/account/services/account.service';
import {ConfigService} from '../../shared/config.service'
import {Observable} from "rxjs/Observable";

import 'jquery';
declare var jQuery:any;
declare var Swiper:any;
declare var saveAs:any;
import  * as  mediaelement from 'localrepo/mediaelement';

@Component({

    selector: "profile-section",
    templateUrl: "profile.component.html",
    providers:[ProfileService]
})


export class ProfileComponent implements OnInit, AfterViewChecked {

    public profileCacheDirty = false;
    public cachedProfile$:BehaviorSubject<any> = new BehaviorSubject(null);
    public ismyProfile:boolean = true;
    public isInviteFriend:boolean = false;
    public showDownloadSpinner = false;
    public isLoading = true;
    public certificate$:BehaviorSubject<any> = new BehaviorSubject(null);
    public education$:BehaviorSubject<any> = new BehaviorSubject(null);
    public work_experience$:BehaviorSubject<any> = new BehaviorSubject(null);
    public summary$:BehaviorSubject<any> = new BehaviorSubject(null);
    public summary:any;

    public avatar:string =null;
    public avatar$:BehaviorSubject<any> = new BehaviorSubject(null);
    public files$:BehaviorSubject<any> = new BehaviorSubject(null);
    public skills$:BehaviorSubject<any> = new BehaviorSubject(null);
    public skillsString$:BehaviorSubject<any> = new BehaviorSubject(null);
    public skillsString:string;
    public generalInfo:any;
    public percentage$:BehaviorSubject<any> = new BehaviorSubject(null);

    public tags:any;
    public tags$:BehaviorSubject<any> = new BehaviorSubject(null);
    public address:any;
    public resume:File1[] = new Array();
    public cover_letter:File1[] = new Array();
    public contact:any;
    public profile_id:number;
    public first_name:string;
    public last_name:string;
    public cityObj:City = new City();
    public latestWorkSectorName$:BehaviorSubject<any>= new BehaviorSubject(null);
    public latestWorkCompanyName$:BehaviorSubject<any>= new BehaviorSubject(null);
    public latestWorkPositionName$:BehaviorSubject<any>= new BehaviorSubject(null);
    public city_id:number;
    public countryObj:Country = new Country();
    public country_id:number;
    public facebook:string;
    public linkedin:string;
    public google_plus:string;
    public skype:string;
    public video:string;
    public social_media_facebook:string;
    public social_media_linkedIn:string;
    public social_media_skype:string;
    public social_media_google_plus:string;
    public social_media_twitter:string;
    public work_experience;
    public cityName = "";


    public jobSeekerContact = new JobSeekerContact();
    public jobSeekerAddress = new JobSeekerAddress();
    public jobSeekerGeneralInfo = new JobSeekerGeneralInfo();
    public jobSeekerSkills:JobSeekerSkills[] = [];

    //observable
    public jobSeekerContact$:BehaviorSubject<any> = new BehaviorSubject(null);
    public jobSeekerAddress$:BehaviorSubject<any> = new BehaviorSubject(null);
    public jobSeekerGeneralInfo$:BehaviorSubject<any> = new BehaviorSubject(null);
    public social_media_video$:BehaviorSubject<any> = new BehaviorSubject(null);
    public video_screenshot$:BehaviorSubject<any> = new BehaviorSubject(null);
    public loadSpinner$:BehaviorSubject<any> = new BehaviorSubject(false);

    //Models
    public countryList:Country[];
    public cityList:City[];
    public cityArray = Array();
    public file_video:File;
    public file_profile:File;
    public params$;
    public queryParams$;
    public ac$;

    //Flags
    public facebookToggleFlag:boolean = false;
    public twitterToggleFlag:boolean = false;
    public linkedInToggleFlag:boolean = false;
    public googleplusToggleFlag:boolean = false;
    public skypeToggleFlag:boolean = false;
    public profilePostError:boolean = false;

    public profileFormValidateFlag:boolean = true;
    public profilePristine:boolean = true;
    public profileFormValidateFlag$:BehaviorSubject<any> = new BehaviorSubject(false);

    // Send Countries to another child
    public commonData$:BehaviorSubject<any> = new BehaviorSubject(null);

    public validationList:Array<any> = Array();

    public current_step$:BehaviorSubject<any> = new BehaviorSubject(3);


    //forms
    public profile_form;


    public profile_status = "read";
    public profile_video = "read";
    elementRef:ElementRef;


    public minDate: Date = new Date();

    public onSelect(timestamp): void {

    }

    onToggleSocialMedia(socialMedia:string = "facebook") {


        if (socialMedia == "facebook") {
            this.facebookToggleFlag = (this.facebookToggleFlag) ? false : true;
            this.twitterToggleFlag = this.linkedInToggleFlag = this.googleplusToggleFlag = this.skypeToggleFlag = false;
        }
        if (socialMedia == "twitter") {
            this.twitterToggleFlag = (this.twitterToggleFlag) ? false : true;
            this.facebookToggleFlag = this.linkedInToggleFlag = this.googleplusToggleFlag = this.skypeToggleFlag = false;
        }
        if (socialMedia == "linkedIn") {
            this.linkedInToggleFlag = (this.linkedInToggleFlag) ? false : true;
            this.facebookToggleFlag = this.twitterToggleFlag = this.googleplusToggleFlag = this.skypeToggleFlag = false;
        }
        if (socialMedia == "googleplus") {
            this.googleplusToggleFlag = (this.googleplusToggleFlag) ? false : true;
            this.facebookToggleFlag = this.twitterToggleFlag = this.linkedInToggleFlag = this.skypeToggleFlag = false;
        }

        if (socialMedia == "skype") {
            this.skypeToggleFlag = (this.skypeToggleFlag) ? false : true;
            this.facebookToggleFlag = this.twitterToggleFlag = this.linkedInToggleFlag = this.googleplusToggleFlag = false;
        }

    }

    onReadProfile() {
        this.profile_status = "read";
    }

    onEditProfile() {
        this.profile_status = "edit";
        this.profile_form.value.city_id = this.cityObj.id;
        this.city_id = this.cityObj.id;
    }


    onReadVideo() {
        this.profile_video = "read";
    }

    onEditVideo() {
        this.profile_video = "edit";
    }





    onSelectCountry(id:number) {

        this.country_id = id;
        this.validationList["country"] = false;
        this.city_id = null;
        this.profile_form.value.city_id = null;

    }

  onSavePDF(){

      if( this.showDownloadSpinner == false){
          this.showDownloadSpinner = true;
          this.profileFormValidateFlag$.next(false);
          this._profileService.getProfilePdf().subscribe(res=> {
              if(res == 'success')
              {
                  this.profileFormValidateFlag$.next(true);
                  this.showDownloadSpinner = false;
              }
              else if(res == 'error'){
                  this.profileFormValidateFlag$.next(true);
                  this.showDownloadSpinner = false;
              }
          });
          this.profileFormValidateFlag = false;
      }


    }


    gethtpValidate(url) {

      if(url.indexOf('http') == -1 || url.indexOf('https') == -1){

          return "http://"+url;
      }
      else{
          return url;
      }
    }

    onSubmitProfile() {
        this.profileFormValidateFlag = false;
        this.profileFormValidateFlag$.next(false);
        this.profilePristine = false;


        if (this.profile_form.valid) {
            this.loadSpinner$.next(true);
           let postDate = {
                id:this.profile_form.value["id"],
                user_attributes: {
                first_name:this.profile_form.value["first_name"],
                last_name:this.profile_form.value["last_name"],
                city_id:this.profile_form.value["city_id"],
                country_id:this.profile_form.value["country_id"]
                },
                facebook_page_url:this.profile_form.value["facebook"],
                linkedin_page_url:this.profile_form.value["linkedIn"],
                twitter_page_url:this.profile_form.value["twitter"],
                google_plus_page_url:this.profile_form.value["google_plus"],
                skype_id:this.profile_form.value["skype"]
           };

        this._profileService.updateProfile(postDate).
            subscribe(res=> {
                this.profileCacheDirty = true;
                this.loadSpinner$.next(false);
                this.first_name = res["jobseeker_profile"]["first_name"];
                this.last_name = res["jobseeker_profile"]["last_name"];
                this.countryObj = res["jobseeker_profile"]["country"];
                this.profileFormValidateFlag = true;
                this.profileFormValidateFlag$.next(true);
                this.onReadProfile();
                this.cityObj =  res["jobseeker_profile"]["city"];

                this.buildPersonalSection(res["jobseeker_profile"]);
                this.onUpdateProfileStatus();

            }, error=> this.profilePostError = true);
        }
    }

    onSelectCity($event) {

        if($event.id)
        {
            this.cityObj.id = $event.id;
            this.profile_form.value.city_id = $event.id;
        }
    }

    onSubmit(id:number) {

    }

    ngOnInit():any {
        this.params$ = this._activeRoute.params.subscribe(params => {
            if(params["invite-connections"]){
                this.onClickInviteFriend();
            }
        });

        this.onUpdateProfileStatus();


        this.loader();
    }

    ngOnDestroy() {

      if(this.profileCacheDirty){
          AccountService.profileCacheDirty = true;
      }

       this.params$.unsubscribe();
    }


    ngAfterViewInit() {


        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            spaceBetween: 30,
        });

        // jQuery(this.elementRef.nativeElement.querySelector('video'))
        //     .mediaelementplayer({
        //         alwaysShowControls: false,
        //         videoVolume: 'horizontal',
        //         features: ['playpause', 'progress', 'volume', 'fullscreen']
        //     });
    }

    public loader() {

        this._loaderService.getCountries("alphabetical").subscribe(country=> {

            this.countryList = country;
            this.commonData$.next({countries: this.countryList});
        });
    }

    public processFile(file) {

        let fileList = Array();
        file.forEach(selFile=> {

            let fileNew = new File1();
            fileNew.id = selFile.id;
            fileNew.name = selFile.name;
            fileNew.desc = selFile.desc;
            fileNew.url = selFile.url;
            fileNew.size = selFile.size;
            if (selFile.default) {
                fileNew.default = selFile.default;
            }

            fileList.push(fileNew);

        });

        return fileList;
    }


    public onUpdateProfileStatus() {
        this._profileService.getProfileStatus().subscribe(res => {this.percentage$.next(res);});
    }



    ngAfterViewChecked() {

        Observable.timer(1500).subscribe(res =>{

            if(!this.cachedProfile$.getValue()) {


                let profile = this._profileService.getProfileObj();
                if(profile) {
                    this.current_step$.next(profile["current_step"]);
                    // this.current_step$.next(1);
                    this.loadSpinner$.next(false);
                    this.cachedProfile$.next(profile);
                    this.buildPersonalSection(profile);
                }
            }
        })
    }

    public buildPersonalSection(profile) {
        this.certificate$.next(profile["certificate"]);
        this.education$.next(profile["education"]);
        this.work_experience$.next(profile["work_experience"]);
        this.summary$.next(profile["summary"]);
        this.summary = profile["summary"];
        this.avatar = profile["avatar"];
        this.avatar$.next(this.avatar);


        this.jobSeekerSkills = profile["skills"];


        this.latestWorkSectorName$.next(profile["general_info"] && profile["general_info"]["sector"] ? profile["general_info"]["sector"]["name"] : "No Sector");

        if(profile["current_experience"]) {

            this.latestWorkCompanyName$.next(profile["current_experience"]["company_name"] || "No Company");
            this.latestWorkPositionName$.next(profile["current_experience"]["position"] || "No Position");
        }else{
            this.latestWorkCompanyName$.next("No Company");
            this.latestWorkPositionName$.next("No Position");
        }

        this.skills$.next(this.jobSeekerSkills);

        this.tags = profile["tags"];
        this.tags$.next(profile["tags"]);
        this.address = profile["address"];
        this.contact = profile["contact"];

        this.loadAddress(profile);
        this.loadContact(profile);
        this.loadGeneralInfo(profile);


        this.first_name = profile["first_name"];
        this.last_name = profile["last_name"];


        let cityObj = new City();
        if (!profile["city"]) profile["city"] = {};
        if (!profile["country"]) profile["country"] = {};
        cityObj.id = profile["city"]["id"];

        cityObj.name = profile["city"]["name"];
        cityObj.text = profile["city"]["name"];
        cityObj.country_id = profile["country"]["id"];
        this.cityObj = cityObj;


        let countryObj = new Country();
        countryObj.id = profile["country"]["id"];
        countryObj.name = profile["country"]["name"];

        this.countryObj = countryObj;

        if (!profile["social_media"]) profile["social_media"] = {};
        this.social_media_facebook = profile["social_media"]["facebook"];
        this.social_media_google_plus = profile["social_media"]["google_plus"];
        this.social_media_linkedIn = profile["social_media"]["linkedin"];
        this.social_media_skype = profile["social_media"]["skype"];
        this.social_media_twitter = profile["social_media"]["twitter"];
        this.social_media_video$.next(profile["video"]);
        this.video_screenshot$.next(profile["video_screenshot"]);

        this.profile_form.controls["facebook"].setValue(this.social_media_facebook);
        this.profile_form.controls["linkedIn"].setValue(this.social_media_linkedIn);
        this.profile_form.controls["skype"].setValue(this.social_media_skype);
        this.profile_form.controls["twitter"].setValue(this.social_media_twitter);
        this.profile_form.controls["google_plus"].setValue(this.social_media_google_plus);




        this.work_experience = profile["work_experience"];

        // jQuery(this.elementRef.nativeElement.querySelector('video'))
        //     .mediaelementplayer({
        //         alwaysShowControls: false,
        //         videoVolume: 'horizontal',
        //         features: ['playpause', 'progress', 'volume', 'fullscreen']
        //     });
    }

    public loadGeneralInfo(profile) {
        if (!profile["general_info"]) {
            profile["general_info"] = {
                sector: {}, functional_area: {}, highest_edu: {}, experince_level: {}, job_type: {}, nationality: {},
                languages: [], dob: {}
            };
        }
        this.generalInfo = profile["general_info"];
        this.jobSeekerGeneralInfo.jobseeker_id = profile["jobseeker_id"];
        this.jobSeekerGeneralInfo.jobseeker_name = profile["first_name"];
        this.jobSeekerGeneralInfo.sector_id = profile["general_info"]["sector"]["id"];
        this.jobSeekerGeneralInfo.sector_name = profile["general_info"]["sector"]["name"];

        this.jobSeekerGeneralInfo.functional_area_id = profile["general_info"]["functional_area"]["id"];
        this.jobSeekerGeneralInfo.functional_area_name = profile["general_info"]["functional_area"]["name"];
        this.jobSeekerGeneralInfo.highest_edu_id = profile["general_info"]["highest_edu"]["id"];
        this.jobSeekerGeneralInfo.highest_edu_name = profile["general_info"]["highest_edu"]["name"];
        this.jobSeekerGeneralInfo.experience_level_id = profile["general_info"]["experince_level"]["id"];
        this.jobSeekerGeneralInfo.experince_level_name = profile["general_info"]["experince_level"]["name"];
        this.jobSeekerGeneralInfo.total_years_experience = profile["general_info"]["total_years_experience"];
        if (!profile["general_info"]["job_type"]) profile["general_info"]["job_type"] = {};
        this.jobSeekerGeneralInfo.job_type_id = profile["general_info"]["job_type"]["id"];
        this.jobSeekerGeneralInfo.job_type_name = profile["general_info"]["job_type"]["name"];
        this.jobSeekerGeneralInfo.current_salary = profile["general_info"]["current_salary"];

        if (!profile["general_info"]["nationality"]) profile["general_info"]["nationality"] = {};
        this.jobSeekerGeneralInfo.nationality_id = profile["general_info"]["nationality"]["id"];
        this.jobSeekerGeneralInfo.nationality_name = profile["general_info"]["nationality"]["name"];

        let lan:Language[] = [];
        profile["general_info"]["languages"].forEach((language=> {
                lan.push(new Language(language.id, language.name))
            })
        );

        this.jobSeekerGeneralInfo.languages = lan;

        this.jobSeekerGeneralInfo.expected_salary = profile["general_info"]["expected_salary"];
        this.jobSeekerGeneralInfo.gender = profile["general_info"]["gender"];


        this.jobSeekerGeneralInfo.marital_status = profile["general_info"]["marital_status"];
        this.jobSeekerGeneralInfo.visa_status = profile["general_info"]["visa_status"];
        this.jobSeekerGeneralInfo.driving_license = false;
        if (profile["general_info"]["driving_license_issued_from"]) {
            this.jobSeekerGeneralInfo.driving_license = true;
            this.jobSeekerGeneralInfo.driving_license_country_id = profile["general_info"]["driving_license_issued_from"]["id"];
        }

        this.jobSeekerGeneralInfo.notice_period_in_months = profile["general_info"]["notice_period_in_months"];


        this.jobSeekerGeneralInfo.dob_day = profile["general_info"]["dob"]["day"];
        this.jobSeekerGeneralInfo.dob_month = profile["general_info"]["dob"]["month"];
        this.jobSeekerGeneralInfo.dob_year = profile["general_info"]["dob"]["year"];


        this.jobSeekerGeneralInfo.dob = new Date(profile["general_info"]["dob"]["year"],
            profile["general_info"]["dob"]["month"],
            profile["general_info"]["dob"]["day"]);


        this.jobSeekerGeneralInfo$.next(this.jobSeekerGeneralInfo);
    }


    public loadContact(profile) {

        this.jobSeekerContact.jobseeker_id = profile["jobseeker_id"];
        profile["contact"] = profile["contact"] ? profile["contact"] : {};
        this.jobSeekerContact.email_address = profile["contact"]["email_address"];
        this.jobSeekerContact.phone_no = profile["contact"]["phone_no"];
        this.jobSeekerContact.phone_no_country_code = profile["contact"]["phone_no_country_code"];
        this.jobSeekerContact.mobile_no = profile["contact"]["mobile_no"];
        this.jobSeekerContact.mobile_no_country_code = profile["contact"]["mobile_no_country_code"];
        this.jobSeekerContact$.next(this.jobSeekerContact);
    }


    onAvatarUploaded($event) {

        if($event.result.user) {

            this.avatar = $event.result.user.avatar;
            let full_name = this.first_name + " " + this.last_name;
            this._profileService.setProfileHeader(full_name, this.avatar);
            this.avatar$.next(this.avatar);
        }

    }

    onVideoUploaded($event) {


        if($event.result.user) {

            this.social_media_video$.next($event.result.user.video);
            this.video_screenshot$.next($event.result.user.video_screenshot);
        }
    }

    public loadAddress(profile) {

        if (!profile["address"]) {
            profile["address"] = {city: {}, country: {}};
        };

        this.jobSeekerAddress.address_line1 = profile["address"]["address_line1"];
        this.jobSeekerAddress.address_line2 = profile["address"]["address_line2"];
        this.jobSeekerAddress.postal_code = profile["address"]["postal_code"];

        /**
         *
         * @ToDo . City needs to be sent in the address module . But used from the main module of the sent json
         */
        let city = new City();
        city.id = profile["address"]["city"]["id"];
        city.name = profile["address"]["city"]["name"];
        city.text = profile["address"]["city"]["name"];

        this.jobSeekerAddress.city = city;
        this.jobSeekerAddress.country = profile["address"]["country"];
        this.jobSeekerAddress$.next(this.jobSeekerAddress);


    }


    onClickProfile() {

        this.ismyProfile = true;
        this.isInviteFriend = false;
    }

    onDeleteVideo() {
        this._accountService.deleteProfileVideo().subscribe(res => {

            this.social_media_video$.next(res["user"]["video"]);

            jQuery('.close_delete').modal('hide');
        });

    }

    onDeleteImage() {
        this._accountService.deleteProfileImage().subscribe(res => {

            this.social_media_video$.next(res["user"]["video"]);

            jQuery('.close_delete').modal('hide');
        });

    }

    onClickInviteFriend() {

        this.ismyProfile = false;
        this.isInviteFriend = true;
    }

    constructor(fb:FormBuilder,
                public _profileService:ProfileService,
                public _accountService:AccountService,
                public _activeRoute:ActivatedRoute,
                public _title:Title,
                @Inject(ElementRef) elementRef:ElementRef,
                public _loaderService:LoaderService) {

        this.validationList["country"] = true;

        // this._title.setTitle(ConfigService.titles["profile"]);

        this.elementRef = elementRef;
        this.profile_form = fb.group({
            id: [''],
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            city_id: ['', Validators.required],
            country_id: ['', [Validators.required]],
            facebook: ['',BasicValidators.url],
            linkedIn: ['', BasicValidators.url],
            skype: [''],
            twitter: ['',BasicValidators.url],
            google_plus: ['',BasicValidators.url]
        });



        this.file_video = new File("Upload Your Video","video", "WMV, MPG, MP4, M4V, MOV, FLV, MPEG and WEBM", 5, 'MB');
        this.file_video.file_format_list =  ['video/x-msvideo', 'video/avi', 'video/quicktime',
            'video/3gpp', 'video/x-ms-wmv', 'video/mp4','video/webm',
            'flv-application/octet-stream', 'video/x-flv',
            'video/mpeg', 'video/mpeg4', 'video/x-la-asf',
            'video/x-ms-asf', 'flv-application/octet-stream'];

        this.file_video.classMap = "myvideo";
        this.file_video.extraDesc = " Maximum Upload Time <span class='dark'>30-Seconds.</span>";

        this.file_profile = new File("Upload your Profile Image","profile", "PNG, JPG", 3, 'MB');

        this.file_profile.cropperSettings_width = 190;
        this.file_profile.cropperSettings_height = 230;
        this.file_profile.cropperSettings_canvasWidth = 500;
        this.file_profile.cropperSettings_canvasHeight = 500;
        this.file_profile.cropperSettings_minWidth= 100;
        this.file_profile.cropperSettings_minHeight= 100;
        this.file_profile.cropperSettings_croppedWidth = 500;
        this.file_profile.cropperSettings_croppedHeight = 500;


        this.file_profile.classMap = "myprofile";


        let typeCityEvent = this.profile_form.controls["city_id"].valueChanges;
        let changeCountryEvent = this.profile_form.controls["country_id"].valueChanges;

        changeCountryEvent.subscribe(country =>{ this.onSelectCountry(country)});
    }
}
