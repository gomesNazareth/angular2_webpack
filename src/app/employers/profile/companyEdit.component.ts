import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup,Validators } from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Router,ActivatedRoute} from '@angular/router';

//Services
import {CompanyService} from '../../core/services/company.service';
import {AccountService} from '../../core/account/services/account.service';

//validations
import {BasicValidators} from '../../shared/validators/basicValidators';

//Models
import {City} from '../../shared/models/City';
import {LoaderService} from "../../shared/services/loader.service";
import {File} from '../../shared/models/File';

import {File1} from '../../shared/models/File';

var moment = require('moment');

declare var moment:any;
declare var jQuery:any;
declare var Pikaday:any;

@Component({

    selector: "company-edit",
    templateUrl: "companyEdit.component.html"

})


export class CompanyEditComponent implements OnInit {

    public companyId:number = null;

    //Forms
    public commonForm:FormGroup;
    public aboutForm:FormGroup;

    //Loading Flags
    public loadingCommonData$:BehaviorSubject<any>= new BehaviorSubject(true);
    public pristineFlag$:BehaviorSubject<any>= new BehaviorSubject(true);
    public pristineAboutFlag$:BehaviorSubject<any>= new BehaviorSubject(true);

    //Observables
    public commonData$:BehaviorSubject<any> = new BehaviorSubject(null);
    public sectors$:BehaviorSubject<any> = new BehaviorSubject(null);
    public typeList$:BehaviorSubject<any> = new BehaviorSubject(null);
    public sizesList$:BehaviorSubject<any> = new BehaviorSubject(null);
    public companyObj$:BehaviorSubject<any> = new BehaviorSubject(null);
    public companyTeamObs:BehaviorSubject<any> = new BehaviorSubject(null);
    public companyCultureObs:BehaviorSubject<any> = new BehaviorSubject(null);
    public logoUpdated$:BehaviorSubject<boolean> = new BehaviorSubject(false);
    public coverUpdated$:BehaviorSubject<boolean> = new BehaviorSubject(false);
    public locationOffice$:Observable<any>;
    public classificationsList$:BehaviorSubject<any> = new BehaviorSubject(null);
    public maxDate =   moment()._d;
    //data
    public countryList;
    public sectorsList;
    public file_profile:File;
    public file_cover:File;
    public typeList;
    public sizesList;
    public classificationsList;
    public contact_country_id = null;
    public contact_country_name = null;
    public sector_id = null;
    public type_id = null;
    public size_id = null;
    public classification_id = null;
    public activeSocialMedial = null;
    public cityObj:City = new City();
    public companyObj;
    public companyTeam;
    public companyCulture;
    public postAboutSuccessFull:boolean = false;
    public lat;
    public lng;
    public phoneNo;
    public summary;
    public addressLine;
    public queryParamsObs;
    public establishmentDate;

    constructor(public _companyservice:CompanyService,
                public _accountService:AccountService,
                public _loaderService:LoaderService,
                public _router: Router,
                public _activeRoute: ActivatedRoute,
                public _fb:FormBuilder){

        this.file_profile = new File("Upload your Profile Image","profile", "PNG, JPG", 3, 'MB');
        this.file_profile.classMap = "myprofile";
        this.file_profile.root = "company[avatar]";
        this.file_profile.cropperSettings_croppedWidth = 172;
        this.file_profile.cropperSettings_croppedHeight = 172;
        this.file_profile.cropperSettings_width =172;
        this.file_profile.cropperSettings_height =172;

        this.file_cover = new File("Upload your Cover Image","company_cover", "PNG, JPG", 3, 'MB');
        this.file_cover.classMap = "mycover";
        this.file_cover.root = "company[cover]";
        this.file_cover.cropperSettings_croppedWidth = 1380;
        this.file_cover.cropperSettings_croppedHeight = 300;
        this.file_cover.cropperSettings_width =1380;
        this.file_cover.cropperSettings_height =300;
    }


    public getProcessedPhoneNo($event) {

        this.getTouch();
        if($event.match == "phone_no"){
            this.commonForm.controls["phone_no"]["_value"] =  $event.phone_no;
            this.phoneNo=$event.phone_no;
        }

    }


    getTouch(){
        this.pristineFlag$.next(false);
    }



    keyDownFunction(event) {
        if(event.keyCode == 13) {
            event.preventDefault();
            // rest of your code
        }
    }

    getCoOrdinates(mode =3,customAddress="") {
        let addressUrl = "";

        if(mode == 0){
            addressUrl = customAddress;
        }
        if(mode == 1)
            addressUrl =this.contact_country_name;
        if(mode == 2)
            addressUrl =this.cityObj.name+"+"+this.contact_country_name;
        if(mode == 3)
            addressUrl =this.commonForm.controls['address_line1'].value+"+"+this.commonForm.controls['address_line2'].value+"+"+this.commonForm.controls['po_box'].value+"+"+this.cityObj.name+"+"+this.contact_country_name;

        this._companyservice.getGoogleCoOrdinates(addressUrl).subscribe(res => {
            if(res["results"].length >0) {

                this.lat = res["results"][0].geometry.location.lat;
                this.lng = res["results"][0].geometry.location.lng;

                this.buildGoogleURL();
            }
        });
    }

    setDate($event) {
        this.establishmentDate = $event["selDate"];
    }

    public loader() {

        this._loaderService.getCountries("alphabetical").subscribe(country=> {
            this.countryList = country;
            this.commonData$.next({countries: this.countryList});
        });

        this._loaderService.getSectors().subscribe(sectors=> {

            this.sectorsList = sectors;
            this.sectors$.next(this.sectorsList);
        });

        this._loaderService.getCompanyTypes().subscribe(res=>{

            this.typeList = res;
            this.typeList$.next(this.typeList);
        })


        this._loaderService.getCompanySizes().subscribe(res=>{
            this.sizesList = res;
            this.sizesList$.next(this.sizesList);
        })

        this._loaderService.getCompanyTypesClassifications().subscribe(res=>{
            this.classificationsList = res;
            this.classificationsList$.next(this.classificationsList);
        })
    }


    onAboutSave(){
        this.pristineAboutFlag$.next(false);

        let postData = {};
        if(this.aboutForm.valid) {
            postData = {company:{
                summary:this.aboutForm.value["summary"]
            }};

            this._companyservice.updateCompanyDetails(this.companyId,postData).subscribe(res => {
                this.postAboutSuccessFull = true;

                Observable.of(1).delay(2000)
                    .subscribe(x => {
                        this.postAboutSuccessFull = false;
                    });
            },
            error => {this._accountService.getErrorCheck(error);});
        }
    }

    onCompanySave(){
        this.pristineFlag$.next(false);

        let postData = {};
        if(this.commonForm.valid){
            postData = {company:{
                name:this.commonForm.value["company_name"],
                facebook_page_url:this.commonForm.value["facebook"],
                linkedin_page_url:this.commonForm.value["linked_in"],
                twitter_page_url:this.commonForm.value["twitter"],
                google_plus_page_url:this.commonForm.value["google_plus"],
                current_country_id:this.commonForm.value["contact_country_id"],
                current_city_id:this.commonForm.value["contact_city_id"],
                phone:this.commonForm.value["phone_no"],
                sector_id:this.commonForm.value["sector_id"],
                website:this.commonForm.value["website_url"],
                address_line1:this.commonForm.value["address_line1"],
                address_line2:this.commonForm.value["address_line2"],
                po_box:this.commonForm.value["po_box"],
                latitude:this.commonForm.value["latitude"],
                longitude:this.commonForm.value["longitude"],
                company_type_id:this.commonForm.value["type_id"],
                company_size_id:this.commonForm.value["size_id"],
                company_classification_id:this.commonForm.value["classification_id"],
                establishment_date:this.commonForm.value["establishment_date"],
                contact_email:this.commonForm.value["email_address"],

            }};


            this._companyservice.updateCompanyDetails(this.companyId,postData).subscribe(res => {

                this._router.navigate(['/employer/profile']);
            },
            error=>{ this._accountService.getErrorCheck(error)})
        }

    }


    onAvatarUploaded($event) {


        if($event.result.company) {
            this.logoUpdated$.next(true);
            this.companyObj.profileImage = $event.result.company.avatar;

        }

    }
    onCoverUploaded($event) {

        if($event.result.company) {
            this.coverUpdated$.next(true);
            this.companyObj.coverImage = $event.result.company.cover;

        }

    }

    onSelectCountry($event) {
        this.contact_country_id =$event.id;
        this.contact_country_name =$event.name;

            this.cityObj.id = null;
            this.cityObj.text = null;
            this.cityObj.name = null;
            this.cityObj.country_id =null;
        this.getCoOrdinates(1);

    }

    public buildGoogleURL(coordinates=null,type="lng") {


        if(coordinates !=null){
            this.locationOffice$ =  Observable.of({});
            this.locationOffice$["lat"] = (type == "lat")?  coordinates:this.lat;
            this.locationOffice$["long"] = (type == "lng")? coordinates:this.lng;

            this.lat = (type == "lat")?  coordinates:this.lat;
            this.lng = (type == "lng")? coordinates:this.lng;
            this.locationOffice$["google_url"] = 'https://www.google.com/maps/embed/v1/place?q='+
                this.lat+','+this.lng+'&key=AIzaSyARNR0nd7PxryzgmXmivhpfWCFvnNBQWT0';
        }
        else if(this.lat && this.lng) {
            this.locationOffice$ =  Observable.of({});
            this.locationOffice$["lat"] = this.lat;
            this.locationOffice$["long"] = this.lng;
            this.locationOffice$["google_url"] = 'https://www.google.com/maps/embed/v1/place?q='+
                this.lat+','+this.lng+'&key=AIzaSyARNR0nd7PxryzgmXmivhpfWCFvnNBQWT0';
        }
    }

    ngOnDestroy() {
        this.queryParamsObs.unsubscribe();
    }

    ngOnInit(){
        this.queryParamsObs = this._activeRoute.params.subscribe(qparams => {
            if(!this._accountService.getEditCompany())
                this._router.navigate(['/'+this._accountService.getPath()+'/profile']);
        });

        this.loader();
        this.companyId = this._accountService.getCompanyId();
        this._companyservice.getCompanyTeam(this.companyId).subscribe(res=>{

            this.companyTeam = res;
            this.companyTeamObs.next(this.companyTeam);
        });

        this._companyservice.getCompanyCulture(this.companyId).subscribe(res=>{

            this.companyCulture = res;
            this.companyCultureObs.next(this.companyCulture);
        });
        //
        //
        this._companyservice.getCompanyDetails(this.companyId)
            .subscribe(res => {
                console.log(res);
                this.companyObj = res;
                this.companyObj$.next(this.companyObj);
                this.contact_country_id = res["country"]["id"];
                this.contact_country_name = res["country"]["name"];
                this.cityObj.id = res["city"]["id"];
                this.cityObj.text = res["city"]["name"];
                this.cityObj.name = res["city"]["name"];
                this.cityObj.country_id =this.contact_country_id;
                this.sector_id = res["sectorId"];
                this.type_id = res["companyTypeId"];
                this.size_id = res["companySizeId"];
                this.classification_id = res["classificationId"];
                this.lat = res["lat"];
                this.lng = res["long"];
                this.phoneNo = res["phoneNo"];
                this.summary = res["summary"];
                this.addressLine = res["addressLine"];
                this.establishmentDate = moment(res["establishmentDate"]).format("D MMM, YYYY"); //res["establishmentDate"];

                if(!this.lat || !this.lng){
                    this.getCoOrdinates(0,this.cityObj.name+"+"+this.contact_country_name);
                }
                else{
                    this.buildGoogleURL();
                }

                this.aboutForm = this._fb.group({
                    id: [res["id"]],
                    summary: [res["summary"], Validators.compose([
                        Validators.required,
                        Validators.minLength(30),
                        Validators.maxLength(1800)
                    ])]
                });

                this.commonForm = this._fb.group({
                    id: [res["id"]],
                    company_name: [res["name"], Validators.required],
                    facebook: [res["facebookUrl"], BasicValidators.url],
                    linked_in: [res["linkedInUrl"], BasicValidators.url],
                    twitter: [res["twitterUrl"],BasicValidators.url],
                    google_plus: [res["googlePlusUrl"],BasicValidators.url],
                    contact_country_id: [res["country"]["id"],Validators.required],
                    contact_city_id: [res["city"]["id"],Validators.required],
                    phone_no: [res["phoneNo"], [Validators.required,BasicValidators.phoneNo]],
                    sector_id: [res["sectorId"], Validators.required],
                    website_url: [res["websiteUrl"]],
                    address_line1: [res["addressLine"], Validators.required],
                    address_line2: [res["addressLine2"]],
                    po_box: [res["poBox"]],
                    latitude: [res["lat"], Validators.required],
                    longitude: [res["long"], Validators.required],
                    type_id: [res["companyTypeId"], Validators.required],
                    size_id: [res["companySizeId"], Validators.required],
                    classification_id: [res["classificationId"], Validators.required],
                    establishment_date: [res["establishmentDate"]],
                    email_address: [res["contactEmail"], BasicValidators.email]
                });

                this.loadingCommonData$.next(false);
            })
    }


}
