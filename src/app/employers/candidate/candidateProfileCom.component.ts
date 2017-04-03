import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Router, ActivatedRoute} from '@angular/router';

//Services
import {AccountService} from '../../core/account/services/account.service';
import {CompanyService} from "../../core/services/company.service";
import {ProfileService} from '../../core/services/profile.service';
import {ErrorHandling} from '../../core/services/errorHandling.service';

//Validators

// var bootstrap = require('bootstrap');
var moment = require('moment');
declare let jsPDF;
declare let html2pdf;
declare var jQuery: any;
declare var moment:any;


@Component({

    selector: "jobseeker-profile-communication",
    templateUrl: "candidateProfileCom.component.html"

})


export class CandidateProfileComComponent implements OnInit {

    public candidateId: number = null;
    public jobId: number = null;
    public paramsObs;
    public offerLetterSelectedFlag = false;
    public generateOfferSelectedFlag = false;
    public appliedFlag = true;
    public postErrorFlag = false;
    public postSuccessFlag = false;
    public queryParamsObs;
    public singleLoad:boolean = false;
    public jobAppId = null;
    public interviewTime = null;
    public interviewTimeObs:BehaviorSubject<any> = new BehaviorSubject(null);
    public showofferletterFlag:boolean = false;
    public jobAppStatusId = 0;
    public jobAppStatusStatus = "Unprocessed";
    public jobBakAppStatusId = 1;
    public notAddFlag:boolean = false;
    public interviewStatus = null;

    public candidateDetailsObs:BehaviorSubject<any> = new BehaviorSubject(null);
    public pristineFlag$:BehaviorSubject<any> = new BehaviorSubject(true);
    public pristineReviewFlag$:BehaviorSubject<any> = new BehaviorSubject(true);
    public pristineSuccessFlag$:BehaviorSubject<any> = new BehaviorSubject(true);
    public pristineOfferFlag$:BehaviorSubject<any> = new BehaviorSubject(true);
    public pristineShortedFlag$:BehaviorSubject<any> = new BehaviorSubject(true);
    public pristineUnSuccessFlag$:BehaviorSubject<any> = new BehaviorSubject(true);
    public pristineInterviewFlag$:BehaviorSubject<any> = new BehaviorSubject(true);
    public stausChangeListObs:BehaviorSubject<any> = new BehaviorSubject(null);
    public noteListObs:BehaviorSubject<any> = new BehaviorSubject(null);
    public notesList = [];
    public validationList = {email:false,skype:false,goMeeting:false,phone:false};
    public modeHash = {"Hangout":"email","Skype":"skype","GoMeeting":"goMeeting","Phone":"phone"}
    public channelHash = {"Hangout":"Email Id","Skype":"Skype Id","GoMeeting":"GoMeeting Id","Phone":"Phone No"}
    public minDate = moment()._d;

    public postProgress = false;
    public formNote: FormGroup;
    public formAppReviewed: FormGroup;
    public formAppShortListed: FormGroup;
    public formAppUnSuccess: FormGroup;
    public formAppSuccess: FormGroup;
    public formAppInterview: FormGroup;
    public formGenerateOffer: FormGroup;

    //
    public offerLetter: File;



    constructor(public _accountService: AccountService, public _fb: FormBuilder,
                public _companyService: CompanyService,
                public _errorHandling: ErrorHandling,
                public _profileService: ProfileService,
                public _activeRoute: ActivatedRoute,
                public _router: Router) {


        let paramsNote = {note:['',Validators.required]};
        this.formNote = _fb.group(paramsNote);

        var d = new Date();
        var formatteddatestr = moment(d).format('h:mm: a');


            //Status Flags
            //  6 -> Applied
            // 1 -> Reviewed
            // 2 -> Shortlisted
            // 3 -> Interviewed
            // 4 -> Successful
            // 5 -> Unsuccessful



        let paramsAppStatus = {comment:['',Validators.required],
                               status:[1,Validators.required] };
        this.formAppReviewed = _fb.group(paramsAppStatus);
        this.formAppShortListed = _fb.group({comment:['',Validators.required],status:[2,Validators.required]});
        this.formAppUnSuccess = _fb.group({comment:['Your Application has not been Successful',Validators.required],status:[5,Validators.required]});
        this.formAppSuccess = _fb.group(
            {comment:['',Validators.required],
             status:[4,Validators.required],
             fileName: ['']
            });

        this.formGenerateOffer = _fb.group({
            title:['',Validators.required],
            content:['',Validators.required]
        });

        this.formAppInterview = _fb.group(
            {comment:['',Validators.required],
                status:[3,Validators.required],
                date:['',Validators.required],
                timeZone:['',Validators.required],
                time:['',Validators.required],
                additionalComment:['',Validators.required],
                mode:['Hangout',Validators.required],
                email:[''],
                skype:[''],
                goMeeting:[''],
                phone:[''],

            },{
                validator: (control:FormGroup)  => {
                    var mode = control.controls["mode"];
                    var email = control.controls["email"];
                    var skype = control.controls["skype"];
                    var goMeeting = control.controls["goMeeting"];
                    var phone = control.controls["phone"];


                    this._activateAllValidators();
                    if(mode.value == "Hangout"){

                        var regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        var valid = regEx.test(email.value);
                        if(!valid) {
                            this.validationList["email"] = false;
                            return {invalid: true};
                        }
                        return null;
                    }
                    if(mode.value == "Skype" && skype.value == ""){

                        this.validationList["skype"] = false;
                        return {invalid: true};
                    }
                    if(mode.value == "GoMeeting" && goMeeting.value == ""){

                        this.validationList["goMeeting"] = false;
                        return {invalid: true};
                    }
                    if(mode.value == "Phone" && phone.value == ""){

                        this.validationList["phone"] = false;
                        return {invalid: true};
                    }
                    return null;
                },
            }
            );
        // this.formAppInterview.addControl("email",new FormControl('',emailonConditionValidators("mode",this.formAppInterview.controls["mode"].value)));

    }

    public _activateAllValidators(){
        //Validation
        this.validationList["email"] = true;
        this.validationList["skype"] = true;
        this.validationList["goMeeting"] = true;
        this.validationList["phone"] = true;

    }


    public removeOfferLetter(mode = "upload") {

        if(mode == "upload") {
            this.formAppSuccess.controls["fileName"].setValue(null);
            this.offerLetterSelectedFlag = false;
            this.offerLetter = null;
        }
        if(mode == "generate") {

            this.generateOfferSelectedFlag=false;
        }



    }


    public generateOffer(){

        this.pristineOfferFlag$.next(false);
        if(this.formGenerateOffer.valid){

            this.removeOfferLetter();
            this.generateOfferSelectedFlag=true;
            jQuery('.generate-offer').modal('hide');

        }
    }

    public closeGenerateBox(){
        jQuery('.generate-offer').modal('hide');
    }


    public  selectFile($event) {

        this.offerLetter = $event.target.files[0];
        var file:Blob = $event.target.files[0];
        this.offerLetterSelectedFlag = true;
        this.generateOfferSelectedFlag = false;
    }


    shareFeedbackSucess(){

        this.pristineSuccessFlag$.next(false);

        if(this.formAppSuccess.valid){

            if(this.generateOfferSelectedFlag == true){

                if(this.formGenerateOffer.valid){

                    this._profileService.postApplicationGenerateOfferLetter(this.jobAppId,
                        this.formAppSuccess.value['status'],
                        this.formAppSuccess.value['comment'],
                        this.formGenerateOffer.value["title"],
                        this.formGenerateOffer.value["content"],
                    ).subscribe(res => {

                            this.jobAppStatusId =this.getCorrectCode(res['job_application_status_change']['job_application_status']);
                            this.jobAppStatusStatus = 'Successful';
                            this.stausChangeListObs.value.unshift(res["job_application_status_change"]);
                            this.postSuccessFlag = true;
                            Observable.timer(2000).subscribe(r=>{
                                this.postSuccessFlag = false;
                            })
                        },
                        error=>{
                            this.postErrorFlag = true;
                            Observable.timer(2000).subscribe(r=>{
                                this.postErrorFlag = false;
                            })
                        });
                }

            }
            else {

                if(this.offerLetterSelectedFlag == true){

                    this._profileService.postApplicationOfferLetter(this.jobAppId,
                        this.formAppSuccess.value['status'],
                        this.formAppSuccess.value['comment'],
                        this.offerLetter
                    ).subscribe(res => {

                            this.jobAppStatusId =this.getCorrectCode(res['job_application_status_change']['job_application_status']);
                            this.jobAppStatusStatus = 'Successful';
                            this.stausChangeListObs.value.unshift(res["job_application_status_change"]);
                            this.postSuccessFlag = true;
                            Observable.timer(2000).subscribe(r=>{
                                this.postSuccessFlag = false;
                            })
                        },
                        error=>{
                            this.postErrorFlag = true;
                            Observable.timer(2000).subscribe(r=>{
                                this.postErrorFlag = false;
                            })
                        });
                }

            }



        }
    }

    shareFeedbackInterview(){

        this.pristineInterviewFlag$.next(false);
        if(this.formAppInterview.valid) {


            this._profileService.postApplicationInterview(this.jobAppId,
                this.formAppInterview.value['status'],
                this.formAppInterview.value['comment'],
                this.formAppInterview.value['date'],
                this.formAppInterview.value['time'],
                this.formAppInterview.value['timeZone'],
                this.formAppInterview.value['additionalComment'],
                this.formAppInterview.value['mode'],
                this.formAppInterview.value[this.modeHash[this.formAppInterview.value['mode']]]


            ).subscribe(res => {


                    this.jobAppStatusId =this.getCorrectCode(res['job_application_status_change']['job_application_status']);
                    this.jobAppStatusStatus = 'Interview';
                    this.interviewStatus = null;
                    this.interviewTimeObs.next(moment(Date.parse(res["job_application_status_change"]['interview']['appointment'])).tz("UTC").format("h:mm a"))
                    this.stausChangeListObs.value.unshift(res["job_application_status_change"]);
                    this.postSuccessFlag = true;
                    Observable.timer(2000).subscribe(res=>{
                        this.postSuccessFlag = false;
                        this.jobAppStatusId++;

                    })
                },
                error=>{
                    this.postErrorFlag = true;
                    Observable.timer(2000).subscribe(r=>{
                        this.postErrorFlag = false;
                    })
                });





        }
    }

    shareFeedbackUnSuccess() {

        this.pristineUnSuccessFlag$.next(false);
        if(this.formAppUnSuccess.valid) {

            this.jobAppStatusStatus =  "Unsuccessful";
            this._postFeedBack(this.jobAppId,this.formAppUnSuccess.value['status'],this.formAppUnSuccess.value['comment']);

        }

    }


    public getCorrectCode(jobApplicationStatus){


        //Status Flags
        //  6 -> Applied
        // 1 -> Reviewed
        // 2 -> Shortlisted
        // 3 -> Interviewed
        // 4 -> Successful
        // 5 -> Unsuccessful
        let jobApplicationStatusHash = {1:0,2:1,3:2,4:3,5:4};

        return jobApplicationStatusHash[jobApplicationStatus['id']];


    }

    public _postFeedBack(jobAppId,status,comment) {
        this._profileService.postApplicationFeedBack(jobAppId,status,comment).subscribe(res => {


                this.postSuccessFlag = true;
                Observable.timer(2000).subscribe(r=>{
                    this.postSuccessFlag = false;
                    this.stausChangeListObs.value.unshift(res["job_application_status_change"]);
                    //this.jobAppStatusId = this.jobBakAppStatusId;
                    this.jobAppStatusId =this.getCorrectCode(res['job_application_status_change']['job_application_status'])

                    if(this.jobAppStatusId == 3 || this.jobAppStatusId == 4){
                        this.jobAppStatusId = 5;
                    }
                    else {
                        this.jobAppStatusId++;
                    }


                })
            },
            error=>{
                this.postErrorFlag = true;
                Observable.timer(2000).subscribe(r=>{
                    this.postErrorFlag = false;
                })
            });
    }

    shareFeedbackApplied() {

        this.pristineReviewFlag$.next(false);
        if(this.formAppReviewed.valid) {

            this._postFeedBack(this.jobAppId,this.formAppReviewed.value['status'],this.formAppReviewed.value['comment']);
        }

    }
    shareFeedbackShortlisted() {

        this.pristineShortedFlag$.next(false);
        if(this.formAppShortListed.valid) {
            this._postFeedBack(this.jobAppId,this.formAppShortListed.value['status'],this.formAppShortListed.value['comment']);
        }

    }

    ngOnDestroy() {
        this.queryParamsObs.unsubscribe();
        this.paramsObs.unsubscribe();
    }

    onBack() {
        window.history.back();
    }

    postNote(){


        this.pristineFlag$.next(false);
        if(this.formNote.valid) {
            this.postProgress = true;
            this._profileService.postNote(this.jobAppId,this.formNote.value["note"]).subscribe(res=>{
                this.notesList.unshift(res["note"]);

                this.pristineFlag$.next(true);
                //Clear the note
                this.formNote.reset();
                this.postProgress = false;
                this.noteListObs.next(this.notesList);
                this.notAddFlag = true;
                Observable.timer(2000).subscribe(val=>{
                    this.notAddFlag = false;
                })
            },error=>{
                this.postProgress = false;
            })

        }
    }






    public downloadingFlag:boolean = false;

    onSaveOfferLetter(){
        this.downloadingFlag = true;
        this._companyService.getOfferLetter(this.jobAppId,this.formGenerateOffer.controls['title'].value,this.formGenerateOffer.controls['content'].value,"OfferLetter_"+this.candidateDetailsObs.value["first_name"]+"_"+this.candidateDetailsObs.value["last_name"]).subscribe(res=>{

            if(res == "success"){

                this.downloadingFlag = false;
            }

        })

    }


    ngOnInit() {
        this.paramsObs = this._activeRoute.params.subscribe(params => {

            if(params["id"]){
                this.candidateId = params["id"];
                this.queryParamsObs = this._activeRoute.queryParams.subscribe(qparams => {

                    if(qparams["job_id"]) {
                        this.jobId = qparams["job_id"];
                    }

                    if(this.singleLoad == false) {

                        this.singleLoad = true;
                        this._profileService.getProfile(this.candidateId,this.jobId).subscribe(res => {

                            if(res["job_application"] == null){
                                let error = {status:404};
                                this._errorHandling.errorHandling(error);


                            }

                            this.jobAppId = res["job_application"]["id"];
                            this._profileService.getChangeStatusList(this.jobAppId).subscribe(resSL => {



                                let reShuffle = [];
                                resSL["job_application_status_changes"].forEach(selStatus=>{

                                    reShuffle.unshift(selStatus);
                                    if(selStatus["interview"] && selStatus["interview"]["status"] == "accept"){

                                        this.interviewStatus = "accept";
                                    }
                                    else if(selStatus["interview"] && selStatus["interview"]["status"] == "reject"){
                                        this.interviewStatus = "reject";
                                    }

                                });



                                reShuffle.forEach((selres,selcnt)=>{

                                    if(selres['interview']){
                                        this.interviewTimeObs.next(moment(Date.parse(selres['interview']['appointment'])).tz("UTC").format("h:mm a"));
                                    }

                                });
                                // console.log(reShuffle[0]['interview']['appointment']);
                                // console.log(moment(Date.parse(reShuffle[0]['interview']['appointment'])).tz("UTC").format("h:mm a"));
                                this.stausChangeListObs.next(reShuffle);
                                let count =  resSL["job_application_status_changes"].length -1;
                                if (resSL["job_application_status_changes"] && resSL["job_application_status_changes"][count]){
                                    this.jobAppStatusId=   resSL["job_application_status_changes"][count]["job_application_status"]["id"];
                                    this.jobAppStatusStatus=   resSL["job_application_status_changes"][count]["job_application_status"]["status"];
                                    this.jobBakAppStatusId=   resSL["job_application_status_changes"][count]["job_application_status"]["id"];


                                }

                            });
                            this._profileService.getNoteList(this.jobAppId).subscribe(resSL => {
                                this.notesList = resSL["notes"];
                                this.noteListObs.next(this.notesList);
                            });
                            this.candidateDetailsObs.next(res);
                        });

                    }

                });

            }


        });
    }


}
