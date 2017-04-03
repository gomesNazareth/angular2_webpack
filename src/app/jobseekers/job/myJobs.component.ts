import {OnInit,Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {FormBuilder, FormGroup,Validators } from '@angular/forms';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';

//Service
import {JobService} from './services/job.service';
import {ActivatedRoute} from "@angular/router";
import {AccountService} from "../../core/account/services/account.service";
import {BasicValidators} from "../../shared/validators/basicValidators";

var moment = require('moment');
declare var moment:any;

declare  var jQuery:any;
@Component({

    selector: "my-jobs",
    templateUrl: "myJobs.component.html"

})



export class MyJobsComponent implements OnInit {
    public activeRouterObs;

    public currentPage = 1;
    public totalPages = 1;

    public jobList$ = Observable;
    public form1:FormGroup;
    public formhangout:FormGroup;
    public formskype:FormGroup;
    public formgomeet:FormGroup;
    public formphone:FormGroup;
    public checkallFlag:boolean = false;
    public successPost:boolean = false;
    public postDone:boolean = false;
    public failedPost:boolean = false;
    public jobApplicationId:number = null;
    public stats$ =  new BehaviorSubject(null);
    public jobs$ = new BehaviorSubject(null);
    public myJobsPagination$: BehaviorSubject<any> = new BehaviorSubject(null);
    public displaySpinner$: BehaviorSubject<any> = new BehaviorSubject(true);
    public totalRecords$: BehaviorSubject<any> = new BehaviorSubject(1);
    public pristineFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public activateButton = false;
    public interviewTimeList = [];
    public interviewContactList = [];


    public setPhoneNo(phone_no) {

        this.formphone.controls['contact'].setValue(phone_no);
        this.getActivateButton("Phone");

    }

    public getActivateButton(contactType = "") {


        this.pristineFlag$.next(false);
        this.activateButton = false;
        if(contactType ==  "Hangout" && this.formhangout.valid){
            this.activateButton = true;
        }
        else if(contactType ==  "Skype" && this.formskype.valid){
            this.activateButton = true;
        }
        else if(contactType ==  "GoMeeting" && this.formgomeet.valid){
            this.activateButton = true;
        }
        else if(contactType ==  "Phone" && this.formphone.valid){
            this.activateButton = true;
        }



    }

    public showFeedback(id){
        this.jobs$.value[id].showFeedbackFlag = true;
    }

    public hideFeedback(id){
        this.jobs$.value[id].showFeedbackFlag = false;
    }

    public rejectInterview(jobAppid,interviewId) {

        this._jobservice.acceptRejectInterview(jobAppid,interviewId,null).subscribe(res => {
            jQuery('.close_popup').modal('hide');
            this.successPost = true;
            this.postDone = true;
            Observable.timer(5000).subscribe(res => {
                this.successPost = false;
            })
        },error=>{
            this.getFailedPost();
        })
    }

    public acceptInterview(jobAppid,interviewId,contactType = "Hangout") {


        let makePost = false;
        let contactValue = "";
        if(contactType ==  "Hangout" && this.formhangout.valid){
            makePost = true;
            contactValue = this.formhangout.value["contact"];
        }
        else if(contactType ==  "Skype" && this.formskype.valid){
            makePost = true;
            contactValue = this.formskype.value["contact"];
        }
        else if(contactType ==  "GoMeeting" && this.formgomeet.valid){
            makePost = true;
            contactValue = this.formgomeet.value["contact"];
        }
        else if(contactType ==  "Phone" && this.formphone.valid){
            makePost = true;
            contactValue = this.formphone.value["contact"];
        }

        if(makePost == true){
            this._jobservice.acceptRejectInterview(jobAppid,interviewId,contactValue).subscribe(res => {


                this.jobs$.value.forEach((selres,selcnt)=>{


                    if(selres['jobAppId'] == jobAppid){

                        selres['employersFeedbackInterview'] = res['interview'];
                        this.interviewTimeList.push(moment(Date.parse(selres['employersFeedbackInterview']['appointment'])).tz("UTC").format("h:mm a"));
                    }

                });


                jQuery('.close_popup').modal('hide');
                this.successPost = true;
                this.postDone = true;
             Observable.timer(5000).subscribe(res => {
                 this.successPost = false;
             })
            },error=>{
                this.getFailedPost();
            })
        }
        else {
            this.getFailedPost();
        }

    }

    public getFailedPost(){
        jQuery('.close_popup').modal('hide');
        this.failedPost = true;
        Observable.timer(5000).subscribe(res => {
            this.failedPost = false;
        })
    }



    constructor(public _jobservice:JobService,public fb:FormBuilder,public _activeRoute:ActivatedRoute,public _accountService:AccountService){
        let elements1 = {
            check_all:['',Validators.required],
            sortby_today:['',Validators.required]
        }
        this.form1 = fb.group(elements1);
        this.formhangout = fb.group({contact:['',BasicValidators.email]});
        this.formskype = fb.group({contact:['',Validators.required]});
        this.formgomeet = fb.group({contact:['',Validators.required]});
        this.formphone = fb.group({contact:['',Validators.required]});




        let dateEvent = this.form1.controls["sortby_today"].valueChanges;


        //URL Params Fetch
        this.activeRouterObs = this._activeRoute.queryParams.subscribe(params => {
            this.displaySpinner$.next(true);
            this.currentPage = (params["page"])?params["page"]:1;
            this.myJobsPagination$.next(this.currentPage);
        });


        this._jobservice.getMyJobStats().subscribe(res => {
            this.stats$.next(res["summary"]);
        });

         Observable.merge(
            dateEvent,
            this.myJobsPagination$
        )
        .switchMap(flag => this._jobservice.getMyJobList("","",null,this.currentPage))
        .subscribe(res=>{
            this.displaySpinner$.next(false);


            //REformating the time
            res["jobs"].forEach((selres,selcnt)=>{
                if(selres['employersFeedbackInterview']){
                    this.interviewTimeList.push(moment(Date.parse(selres['employersFeedbackInterview']['appointment'])).tz("UTC").format("h:mm a"));
                }
                else{
                    this.interviewTimeList.push(null);
                }

            });


            this.jobs$.next(res["jobs"]);


            this.totalRecords$.next(res["meta"]["total_count"]);
        });
    }

    ngOnInit() {


    }

    ngOnDestroy() {
            this.activeRouterObs.unsubscribe();
            }



}
