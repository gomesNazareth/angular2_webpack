import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import {Location} from '@angular/common';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Router} from '@angular/router';

//Services
import {CompanyService} from '../../core/services/company.service';
import {ConfigService} from '../../shared/config.service';
import {AccountService} from '../../core/account/services/account.service';

//validations
import {BasicValidators} from '../../shared/validators/basicValidators';

//Models
import {Address} from '../models/address';
import {City} from '../../shared/models/City';
import {LoaderService} from "../../shared/services/loader.service";
import {File} from '../../shared/models/File';
import {File1} from '../../shared/models/File';



declare var jQuery:any;
@Component({

    selector: "company-general-mobile",
    templateUrl: "companyGeneralMobile.component.html"

})


export class CompanyGeneralMobileComponent implements OnInit {

    @Input() companyObs:BehaviorSubject<any> = new BehaviorSubject(null);
    @Input() countryObs:BehaviorSubject<any> = new BehaviorSubject(null);
    @Input() commonDataObs:BehaviorSubject<any> = new BehaviorSubject(null);
    @Input() sectorObs:BehaviorSubject<any> = new BehaviorSubject(null);
    @Input() companyTypesObs:BehaviorSubject<any> = new BehaviorSubject(null);
    @Input() companySizesObs:BehaviorSubject<any> = new BehaviorSubject(null);
    @Input() classificationsListObs:BehaviorSubject<any> = new BehaviorSubject(null);
    @Input() typeListObs:BehaviorSubject<any> = new BehaviorSubject(null);
    @Input() sizesListObs:BehaviorSubject<any> = new BehaviorSubject(null);
    @Input() logoUpdatedObs:BehaviorSubject<any> = new BehaviorSubject(false);
    @Input() coverUpdatedObs:BehaviorSubject<any> = new BehaviorSubject(false);
    @Input() file_profile;
    @Input() file_cover;
    @Input() companyId:number =null;

    @Output() backEmit:EventEmitter<any> = new EventEmitter();

    public companyObj;
    public companyObj$:BehaviorSubject<any> = new BehaviorSubject(null);
    public locationOffice$:Observable<any>;
    public loadingCommonData$:BehaviorSubject<any>= new BehaviorSubject(true);
    public pristineFlag$:BehaviorSubject<any>= new BehaviorSubject(true);

    //Forms
    public commonForm:FormGroup;

    //data
    public countryList;
    public sectorsList;
    public typeList;
    public postSuccessFull:boolean = false;
    public sizesList;
    public classificationsList;
    public contact_country_id = null;
    public contact_country_name = null;
    public sector_id = null;
    public type_id = null;
    public size_id = null;
    public classification_id = null;
    public activeSocialMedial = null
    public cityObj:City = new City();
    public lat;
    public lng;
    public phoneNo;
    public establishmentDate;


    public getProcessedPhoneNo($event) {



        if($event.match == "phone_no"){
            this.commonForm.controls["phone_no"]["_value"] =  $event.phone_no;
            this.phoneNo=$event.phone_no;
        }

    }


    constructor(public _router: Router,
                public _companyservice: CompanyService,
                public _fb:FormBuilder) {

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

    getCoOrdinates(mode =3) {


        let addressUrl = "";

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




    onBack() {

        this.backEmit.emit({operation:"back"});
    }

    onCompanySave(){

        this.pristineFlag$.next(false);

        let postData = {};
        if(this.commonForm.valid)
        {


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


                this.postSuccessFull = true;
                window.scroll(0, 0);
                Observable.of(1).delay(2000)
                    .subscribe(x => {
                        this.postSuccessFull = false;
                        this.backEmit.emit({operation:"back"});
                    });


            })
        }

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













    setDate($event) {


        this.establishmentDate = $event["selDate"];
    }



        ngOnInit():void {

        this.companyObs.subscribe(res => {


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
            this.establishmentDate = res["establishmentDate"];




            this.buildGoogleURL();

            this.commonForm = this._fb.group({
                id: [res["id"]],
                company_name: [res["name"],Validators.required],
                facebook: [res["facebookUrl"],[BasicValidators.url]],
                linked_in: [res["linkedInUrl"], [BasicValidators.url]],
                twitter: [res["twitterUrl"],[BasicValidators.url]],
                google_plus: [res["googlePlusUrl"],[BasicValidators.url]],
                contact_country_id: [res["country"]["id"],Validators.required],
                contact_city_id: [res["city"]["id"],Validators.required],
                phone_no: [res["phoneNo"], Validators.required],
                sector_id: [res["sectorId"], Validators.required],
                website_url: [res["websiteUrl"], Validators.required],
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


        });



    }


}
