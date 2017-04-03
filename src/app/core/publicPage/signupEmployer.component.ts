import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup,Validators,FormControl } from '@angular/forms';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {BasicValidators} from '../../shared/validators/basicValidators';

import {City} from '../../shared/models/City';

//Validators
import {PasswordValidator} from "../../shared/validators/passwordValidator";

//Services

import {SignupService} from './services/signup.service';
import {LoaderService} from "../../shared/services/loader.service";
import {CropperSettings} from 'ng2-img-cropper/src/cropperSettings';
import {ImageCropperComponent} from 'ng2-img-cropper/src/imageCropperComponent';
import {Observable} from "rxjs/Observable";
import {Router} from "@angular/router";
import {AccountService} from "../account/services/account.service";


var moment = require('moment');
declare var moment:any;

@Component({

    selector: "signup-employer",
    templateUrl: "signupEmployer.component.html"
})


export class SignupEmployerComponent implements OnInit {
    public signupFirstForm:FormGroup;
    public signupSecondForm:FormGroup;
    public signupThirdForm:FormGroup;
    public pristineFlag$:BehaviorSubject<any>= new BehaviorSubject(true);
    public commonData$:BehaviorSubject<any> = new BehaviorSubject(null);
    public sectors$:BehaviorSubject<any> = new BehaviorSubject(null);
    public typeList$:BehaviorSubject<any> = new BehaviorSubject(null);
    public sizesList$:BehaviorSubject<any> = new BehaviorSubject(null);
    public classificationsList$:BehaviorSubject<any> = new BehaviorSubject(null);
    public current_step$:BehaviorSubject<any> = new BehaviorSubject(1);
    public postDate:any = {};
    public cityObj:City = new City();
    public establishmentDate;
    public postInProgress = false;
    public country_id = null;
    public maxDate =   moment()._d;
    public country_name = null;
    public nationality_id = null;
    public selectImageDone$:BehaviorSubject<any> = new BehaviorSubject(false);
    public selectImageDone2$:BehaviorSubject<any> = new BehaviorSubject(false);
    public selectedImageAvatar : File;
    public selectedImageCover : File;
    public coverImage$:BehaviorSubject<any> = new BehaviorSubject(null);
    public avatarImage$:BehaviorSubject<any> = new BehaviorSubject(null);
    public tagetFile:any = {'cover': null, 'avatar': null};
    public tagetFileAvatar:any = null;
    public targetFileCoverBase64 : any;
    public tagetFileCover:any = null;
    public cropperSettings: CropperSettings;
    public cropperSettings2: CropperSettings;
    public takenEmailError:boolean = false;
    @ViewChild('cropperAvatar', undefined) cropperAvatar:ImageCropperComponent;
    @ViewChild('cropperCover', undefined) cropperCover:ImageCropperComponent;

    public err_msg:string = "";




    ngOnInit() {

        this._loaderService.getCountries("alphabetical").subscribe(country=> {
            this.commonData$.next({countries: country});
        });

        this._loaderService.getSectors("alphabetical").subscribe(sectors=> {
            this.sectors$.next(sectors);
        });

        this._loaderService.getCompanyTypes().subscribe(res=>{
            this.typeList$.next(res);
        });


        this._loaderService.getCompanySizes().subscribe(res=>{
            this.sizesList$.next(res);
        });

        this._loaderService.getCompanyTypesClassifications().subscribe(res=>{
            this.classificationsList$.next(res);
        });

        this.signupFirstForm = this._fb.group({
            company_name: ["",Validators.required],
            country_id: ["",Validators.required],
            city_id: ["",Validators.required],
            sector_id: ["",Validators.required],
            establishment_date: ["",Validators.required],
            type_id: ["",Validators.required],
            classification_id: ["",Validators.required],
            size_id: ["",Validators.required],
            company_website: [""]
        });

        this.signupSecondForm = this._fb.group({
            contact_person: ["",Validators.required],
            phone: ["",[Validators.required,BasicValidators.phoneNo]],
            address_line1: ["",Validators.required],
            address_line2: [""],
            email: ["",  BasicValidators.email],
            password: ["",[Validators.required, PasswordValidator.complexPass]],
            confirm_password: ["",[Validators.required, PasswordValidator.passwordConfirm]],
            po_box: [""],
            company_email: ["", BasicValidators.email]
        });

        this.signupThirdForm = this._fb.group({
            avatar: [""],
            cover: [""]
        });

        this.tagetFile = {'cover': null, 'avatar': null};
        this.tagetFile['cover'] = null;
        this.tagetFile['avatar'] = null;

    }

    goToBackStep() {
        let curr_val = this.current_step$.getValue();
        this.current_step$.next(curr_val - 1);
    }

    onBack(){

        window.history.back();
    }

    goToNextStep() {
        this.pristineFlag$.next(false);
        if (this.current_step$.getValue() == 1) {
            if (this.signupFirstForm.valid) {
                this.pristineFlag$.next(true);

                this.postDate = {
                    company: {
                        name: this.signupFirstForm.value["company_name"],
                        current_country_id: this.signupFirstForm.value["country_id"],
                        current_city_id: this.signupFirstForm.value["city_id"],
                        sector_id: this.signupFirstForm.value["sector_id"],
                        establishment_date: this.signupFirstForm.value["establishment_date"],
                        company_type_id: this.signupFirstForm.value["type_id"],
                        company_classification_id: this.signupFirstForm.value["classification_id"],
                        company_size_id: this.signupFirstForm.value["size_id"],
                        website: this.signupFirstForm.value["company_website"]
                    },
                    user: {
                        birthday: this.signupFirstForm.value["establishment_date"],
                        role: "company_owner",
                        country_id: this.signupFirstForm.value["country_id"],
                        city_id: this.signupFirstForm.value["city_id"]
                    }
                };

                this.current_step$.next(2);
            }
        }else if (this.current_step$.getValue() == 2) {


            this._accountService.getIfValidEmail(this.signupSecondForm.value["email"]).subscribe(res=>{

                this.takenEmailError =  (res["user"]["valid"])?false:true;


                if (this.signupSecondForm.valid && !this.takenEmailError) {
                    this.pristineFlag$.next(true);

                    if (!this.postDate || !this.postDate.company || !this.postDate.user) {
                        this.postDate = {company: {}, user: {}};
                    }

                    let comp2 = {
                        contact_person: this.signupSecondForm.value["contact_person"],
                        phone: this.signupSecondForm.value["phone"],
                        address_lin1: this.signupSecondForm.value["address_line1"],
                        address_lin2: this.signupSecondForm.value["address_line2"],
                        po_box: this.signupSecondForm.value["po_box"],
                        contact_email: this.signupSecondForm.value["company_email"]
                    };

                    let user2 = {
                        email: this.signupSecondForm.value["email"],
                        password: this.signupSecondForm.value["password"],
                        password_confirmation: this.signupSecondForm.value["confirm_password"],
                        first_name: this.signupSecondForm.value["contact_person"],
                        last_name: this.signupSecondForm.value["contact_person"]
                    };

                    Object.assign(this.postDate.company, comp2);
                    Object.assign(this.postDate.user, user2);

                    this.current_step$.next(3);
                }



            });



        }
    }


    signup_employer() {
        this.pristineFlag$.next(false);

        if(this.postInProgress == false) {
            this.postInProgress = true;
            this._signupService.signup_employer(this.postDate).subscribe(res => {
                this.postInProgress = false;
                this.current_step$.next(4);
                this.getTimerReload();
            }, err => {
                let error = JSON.parse(err['_body']);
                this.postInProgress = false;
                for (var key in error) {
                    if (error[key].length > 0) {
                        this.err_msg += key + ": " + error[key].toString();
                        break;
                    }
                }

                this.current_step$.next(5);
            })
        }
    }


    getTimerReload(){
        Observable.timer(5000).subscribe(val=>{
            this._router.navigate(['/home']);
        });
    }

    goToStep(num:number){
        this.current_step$.next(num);
    }

    signup_employer_with_image() {
        this.pristineFlag$.next(false);
        if(this.selectedImageAvatar || this.selectedImageCover){

            this.postDate['company']['avatar'] = this.selectedImageAvatar;
            this.postDate['company']['cover'] = this.selectedImageCover;
        }

        this.signup_employer();
    }

    onSelectCountry($event) {
        this.country_id =$event.id;
        this.country_name =$event.name;

        this.cityObj.id = null;
        this.cityObj.text = null;
        this.cityObj.name = null;
        this.cityObj.country_id =null;
    }

    setDate($event) {
        this.establishmentDate = $event["selDate"];
    }

    public dataCrop:any = {};
    public dataCropAvatar:any = {};
    public dataCropCover:any = {};

    public fileInfo:any = {
        size: 2,
        format_list: ['image/jpeg',' image/png'],
        file_types:['JPG',' PNG'],
        sizeUnit: "MB"
    };

    selectImage(select_type) {
        if (select_type == 'cover') {
            this.coverImage$.next(this.dataCropCover.image);
            this.selectedImageCover = this.dataCropCover.image;
            this.signupThirdForm.value[select_type] = this.selectedImageCover;
        }else {
            this.avatarImage$.next(this.dataCropAvatar.image);
            this.selectedImageAvatar = this.dataCropAvatar.image;
            this.signupThirdForm.value[select_type] = this.selectedImageAvatar;
        }
    }

    fileChange(event, select_type) {

        if (select_type != 'cover'){
            this.selectImageDone$.next(true);
        }
        else{
            this.selectImageDone2$.next(true);
        }

        var image:any = new Image();

        if (select_type == 'cover') {
            this.tagetFileCover = event.target.files[0];
        }else {
            this.tagetFileAvatar = event.target.files[0];
        }

        var file:Blob = event.target.files[0];
        var myReader:FileReader = new FileReader();
        var that = this;
        myReader.onloadend = function (loadEvent:any) {
            image.src = loadEvent.target.result;

            if (select_type == 'cover') {
                that.cropperCover.setImage(image);
            }
            else {
                that.cropperAvatar.setImage(image);
            }
        };

        myReader.readAsDataURL(file);
    }

    constructor(public _signupService:SignupService,
                public _loaderService:LoaderService,
                public _accountService:AccountService,
                public _router:Router,
                public _fb:FormBuilder) {

        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;

        //780x340
        this.cropperSettings.width = 142;
        this.cropperSettings.height = 142;

        this.cropperSettings.croppedWidth = 500;
        this.cropperSettings.croppedHeight = 500;

        this.cropperSettings.canvasWidth = 500;
        this.cropperSettings.canvasHeight = 500;

        this.cropperSettings.minWidth = 100;
        this.cropperSettings.minHeight = 100;
        this.cropperSettings.rounded = false;


        //1380x340
        this.cropperSettings2 = new CropperSettings();
        this.cropperSettings2.noFileInput = true;
        this.cropperSettings2.width = 1380;
        this.cropperSettings2.height = 300;

        this.cropperSettings2.croppedWidth = 1380;
        this.cropperSettings2.croppedHeight = 300;

        this.cropperSettings2.canvasWidth = 500;
        this.cropperSettings2.canvasHeight = 300;

        this.cropperSettings2.minWidth = 100;
        this.cropperSettings2.minHeight = 100;
        this.cropperSettings2.rounded = false;

        this.dataCrop = {};
        this.dataCropAvatar = {};
        this.dataCropCover = {};
    }
}
