import {Component, OnInit, EventEmitter, Output, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, FormControl,Validators} from '@angular/forms';
import { Title } from '@angular/platform-browser';


import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ActivatedRoute} from '@angular/router';

//Services
import {AccountService} from './services/account.service';
import {ConfigService} from  '../../shared/config.service';

//Validators
import {PasswordValidator} from "../../shared/validators/passwordValidator";


declare var jQuery;

@Component({
    selector: "account-settings",
    templateUrl: "accountSettings.component.html"
})


export class AccountSettingsComponent implements OnInit,OnDestroy {


    //Observer
    account$:BehaviorSubject<any> = new BehaviorSubject(null);
    postsuccessFlag$:BehaviorSubject<any> = new BehaviorSubject(false);
    deactivatedFlag$:BehaviorSubject<any> = new BehaviorSubject(null);
    notificationUpateFlag$:BehaviorSubject<any> = new BehaviorSubject(null);
    newletterSub$:BehaviorSubject<any> = new BehaviorSubject(false);
    newsletterFlag$:BehaviorSubject<any> = new BehaviorSubject(null);
    errorMessage = " Sorry details could not be Updated.";

    //Variables
    account:any;
    suggestedJobNotificationId:number =0;
    blogPostNotificationId:number =0;
    pollNotificationId:number =0;
    candidateNotificationId:number =0;
    userType:string ="";

    //Forms
    form1:FormGroup;

    //Flags
    activateFlag:boolean;
    subscribeNewsLetter:boolean;
    postFlag :boolean= false;
    loadingFlag1:boolean = false;
    failedPostFlag:boolean = false;

    ngOnDestroy() {

    }

    setNotificationId(id:number,mode:number = 1) {
        if(mode == 1 && this.userType == "jobseeker")   this.account["job"] = id;
        if(mode == 1 && this.userType == "employer")   this.account["candidate"] = id;
        if(mode == 2)   this.account["blog"] = id;
        if(mode == 3)   this.account["poll_question"] = id;
    }

    ngOnInit() {
        let group = {};
        group["username"] = [this._accountservice.getUsername(), Validators.required];
        group["current_password"] = ['', Validators.required];
        group["new_password"] = ['', [Validators.required, PasswordValidator.complexPass]];
        group["new_password2"] = ['',[Validators.required, PasswordValidator.passwordMissmatch]];


        this.form1 = this.fb.group(group);

        this.activateFlag = true;
        this.subscribeNewsLetter = false;

        this._accountservice.getNotification()
        .subscribe(res => {
            this.account = res;
            this.account$.next(this.account);

            this.suggestedJobNotificationId = this.account["job"];
            this.blogPostNotificationId =  this.account["blog"];
            this.pollNotificationId =  this.account["poll_question"];
            this.candidateNotificationId =  this.account["candidate"];
            this.newletterSub$.next(this.account["newsletter"]);
        },
        error=>{});

        this.userType = this._accountservice.getUserType();
    }

    setEmployerVisible(val){
        this.account["visible_by_employer"] = val;
    }

    onUpdateNotifications(){

        let postData = {
            blog: this.account$.getValue()["blog"],
            job: this.account$.getValue()["job"],
            poll_question: this.account$.getValue()["poll_question"],
            // candidate: this.account$.getValue()["candidate"],
            visible_by_employer: this.account$.getValue()["visible_by_employer"]
        };

        this._accountservice.getUpdateNotifications(postData)
            .subscribe(res => {
                this.notificationUpateFlag$.next(true);
                Observable.timer(2000).subscribe(val=>{
                    this.notificationUpateFlag$.next(null);
                })

            },
           error=>{this.notificationUpateFlag$.next(false)});
    }

    onActivate() {



            this._accountservice.getDeactivate().subscribe(res => {
                    jQuery('.close_deactivate').modal('hide');
                    this.deactivatedFlag$.next(true);
                    this._accountservice.getLogOutUser();
            },
            error => this.deactivatedFlag$.next(false));
    }

    onSubNewsLetter() {
       this._accountservice.getUpdateNewsLetter(true).subscribe(res =>
           {
               this.newsletterFlag$.next(true);
               this.newletterSub$.next(true);
               Observable.timer(2000).subscribe(val=>{
                   this.newsletterFlag$.next(null);
               });
           },
           error => this.newsletterFlag$.next(false));
    }

    onUnSubNewsLetter(){
        this._accountservice.getUpdateNewsLetter(false).subscribe(res =>
            {
                this.newsletterFlag$.next(true);
                this.newletterSub$.next(false);
                Observable.timer(2000).subscribe(val=>{
                    this.newsletterFlag$.next(null);
                });
            },
            error => this.newsletterFlag$.next(false));
    }

    onSubmitAccountSettings() {

        this.postFlag = true;
        if (this.form1.valid) {
            this.loadingFlag1 = true;


            this._accountservice.getUpdateCredentials(this.form1.value)
                .subscribe(res => {
                    this.loadingFlag1 =false;
                    this.postsuccessFlag$.next(true);
                        Observable.timer(2000).subscribe(val=>{
                            this.postsuccessFlag$.next(null);
                        });

                },
                error => {
                    this.loadingFlag1 = false;
                    this.failedPostFlag=true;
                    error = JSON.parse(error._body);
                    if(error["current_password"]){
                        this.errorMessage = " Current password is Invalid.";
                    }
                    else if(error["password"]){
                        this.errorMessage = " Your password is too Short.";
                    }
                    else if(error["current_password"]){
                        this.errorMessage = " Your current password is Wrong.";
                    }
                    else{
                        this.errorMessage = " Sorry details could not be Updated.";
                    }

                    Observable.timer(2000).subscribe(val=>{
                        this.failedPostFlag = false;
                    });
                    console.log(error);

                } );

        }
    }

    constructor(public _accountservice:AccountService, public fb:FormBuilder, public route:ActivatedRoute,public _title:Title) {

        this._title.setTitle(ConfigService.titles["settings"]);
    }


}
