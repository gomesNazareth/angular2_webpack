import {Component, OnInit, Input} from '@angular/core';
import {FormBuilder, FormGroup,Validators } from '@angular/forms';
import {Router} from '@angular/router';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {BasicValidators} from '../../shared/validators/basicValidators';

import {City} from '../../shared/models/City';

//Validators
import {PasswordValidator} from "../../shared/validators/passwordValidator";
import {TypeValidators} from "../../shared/validators/basicValidators";

//Services
import {SignupService} from './services/signup.service';
import {LoaderService} from "../../shared/services/loader.service";
import {Observable} from "rxjs/Observable";

var moment = require('moment');
declare var jQuery:any;
declare var Pikaday:any;
declare var moment:any;

@Component({

    selector: "signup-form-jobseeker",
    templateUrl: "signupFormJobseeker.component.html"
})


export class SignupFormJobseekerComponent implements OnInit {
    public signupForm:FormGroup;
    public pristineFlag$:BehaviorSubject<any>= new BehaviorSubject(true);
    public commonData$:BehaviorSubject<any> = new BehaviorSubject(null);
    public cityObj:City = new City();
    public birthDate;
    public defaultBirthDate = moment().subtract(25,'years')._d;
    public toYear = moment().subtract(18.1, 'y').format('YYYY');
    public maxDate = moment().subtract(18.1, 'y')._d;
    public country_id = null;
    public country_name = null;
    public nationality_id = null;
    public nationality_name = null;
    public errorFlag = false;
    public successFlag = false;
    public postinProgress =  false;
    @Input() popupMode:boolean = true;
    public errorMessage = "This is the error";

    ngOnInit() {
        this._loaderService.getCountries("alphabetical").subscribe(country=> {
            this.commonData$.next({countries: country});
        });

        this.signupForm = this._fb.group({
            first_name: ["",[Validators.required,TypeValidators.nonNumeric]],
            last_name: ["",[Validators.required,TypeValidators.nonNumeric]],
            email: ["",BasicValidators.email],
            gender: ["1",Validators.required],
            country_id: ["",Validators.required],
            city_id: ["",Validators.required],
            nationality_id: ["",Validators.required],
            birth_date: ["",Validators.required],
            password: ["",[Validators.required, PasswordValidator.complexPass]],
            confirm_password: ["",[Validators.required, PasswordValidator.passwordConfirm]],
        });
    }

    signup_jobseeker() {
        this.pristineFlag$.next(false);

        if(this.signupForm.valid){
            this.pristineFlag$.next(true);

            var postDate = {
                user: {
                    first_name: this.signupForm.value["first_name"],
                    last_name: this.signupForm.value["last_name"],
                    birthday: this.signupForm.value["birth_date"],
                    email: this.signupForm.value["email"],
                    password: this.signupForm.value["password"],
                    password_confirmation: this.signupForm.value["password_confirmation"],
                    gender: this.signupForm.value["gender"],
                    nationality_id: this.signupForm.value["nationality_id"],
                    country_id: this.signupForm.value["country_id"],
                    city_id: this.signupForm.value["city_id"],
                    role: "jobseeker"
                }
            };


            if(this.postinProgress == false) {

                this.postinProgress = true;
                this._signupService.signup_jobseeker(postDate).subscribe(res => {
                    this.successFlag = true;
                    this.postinProgress= false;
                    if (this.popupMode) {
                        jQuery('.join-jobseeker').modal('hide');
                        jQuery('.conform-jobseeker').modal();
                        Observable.timer(5000).subscribe(val => {
                            this.successFlag = false;
                            jQuery('.conform-jobseeker').modal('hide');

                        })
                    }
                    else {
                        Observable.timer(7000).subscribe(val => {
                            this.successFlag = false;
                            this._router.navigate(['/home/login']);

                        })
                    }


                }, error => {
                    this.postinProgress= false
                    this.errorFlag = true;
                    let body = JSON.parse(error["_body"])
                    for (var errorkey in body) {
                        this.errorMessage = " Sorry an error occurred.";
                        if (errorkey == "email") {
                            this.errorMessage = " Email has already been taken.";
                        }
                        if (errorkey == "password") {
                            this.errorMessage = " Password is invalid  (needs to be alpha numeric and minimum of 8 characters).";
                        }

                    }
                    Observable.timer(5000).subscribe(val => {
                        this.errorFlag = false;
                    })
                });

            }

        }
    }

    onSelectCountry($event) {
        this.country_id =$event.id;
        this.country_name =$event.name;

        this.cityObj.id = null;
        this.cityObj.text = null;
        this.cityObj.name = null;
        this.cityObj.country_id =null;

    }

    onSelectNationality($event) {
        this.nationality_id =$event.id;
        this.nationality_name =$event.name;

    }

    setDate($event) {
        this.birthDate = $event["selDate"];
    }


    constructor(public _signupService:SignupService,
                public _loaderService:LoaderService,
                public _router:Router,
                public _fb:FormBuilder) {
    }

}
