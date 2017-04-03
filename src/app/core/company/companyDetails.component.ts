import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup,Validators } from '@angular/forms';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

import {Router,ActivatedRoute} from '@angular/router';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

//Services
import {CompanyService} from '../services/company.service';
import {ConfigService} from '../../shared/config.service';
import {AccountService} from '../account/services/account.service';
import {ErrorHandling} from '../../core/services/errorHandling.service';
import {JobService} from "../../core/services/job.service";

var moment = require('moment');
declare var jQuery;
declare var moment;

@Component({

    selector: "company-details",
    templateUrl: "companyDetails.component.html",
    providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})


export class CompanyDetailsComponent implements OnInit {


    @Input() companyId:number = null;
    @Input() fromPage:string;
    @Input() editMode:boolean= false;

    @Output() backClick = new EventEmitter();


    //Forms
    public form1:FormGroup;

    public isPublic:boolean = false;
    public canEditCompany:boolean = false;


    //Observable
    public companyDetails$:Observable<any>;
    public team$:Observable<any>;
    public jobs$:Observable<any>;
    public cultures$:Observable<any>;
    public locationOffice$:Observable<any>;
    public folowers$:Observable<number>;
    public  url$:BehaviorSubject<any> = new BehaviorSubject(ConfigService.getDomain());
    public isAuthorized$:BehaviorSubject<any> = new BehaviorSubject(null);
    public totalRecords$:BehaviorSubject<any> = new BehaviorSubject(0);


    public errrorFlag$:BehaviorSubject<any> = new BehaviorSubject(false);
    public errrorMessage$:BehaviorSubject<any> = new BehaviorSubject(null);
    public successFlag$:BehaviorSubject<any> = new BehaviorSubject(null);

    //Flags
    public loadingFlagsArray = [];


    //Variables
    public followers:number;
    public company:any;
    public team:any;
    public jobs:any;
    public cultures:any;
    public queryParamsObs:any;

    getIfExpired(end_date){
        return  moment(new Date()).isAfter(Date.parse(end_date))
    }

    ngOnDestroy() {
        if (this.isPublic == false){
            this.queryParamsObs.unsubscribe();

        }
    }



    ngOnInit() {

        this.isPublic = (this.location.path().indexOf('/home/companies') != -1);
        this.canEditCompany = this._accountService.getEditCompany();

        let loadEvent =  Observable.of(this.companyId);
        this.loadingFlagsArray['companyLoader'] = true;
        Observable.merge(
            loadEvent
        )
        .switchMap(dataVal => this._companyservice.getCompanyDetails(dataVal, this.isPublic))
        .subscribe(res => {
            if(!this._accountService.getCheckEmployer()){
                this._router.navigate(['/'+this._accountService.getPath()+'/companies/'+res['id']+'/'+res['name_url']]);
            }
            this.loadingFlagsArray['companyLoader'] = false;
            this.isAuthorized$.next(this._accountService.getAuth());
            this.company = res;

            this.companyDetails$ =  Observable.of(this.company);
            this.followers = this.company.follower;
            this.folowers$ =  Observable.of(this.followers);
            if(res["lat"] && res["long"]) {
                this.locationOffice$ =  Observable.of({});
                this.locationOffice$["lat"] = res["lat"];
                this.locationOffice$["long"] = res["long"];
                this.locationOffice$["google_url"] = 'https://www.google.com/maps/embed/v1/place?q='+
                res["lat"]+','+res["long"]+'&key=AIzaSyARNR0nd7PxryzgmXmivhpfWCFvnNBQWT0';
            }
        },error =>{this._error.errorHandling(error)});

        if (this.isPublic == false) {

            this.queryParamsObs = this._activeRoute.queryParams.subscribe(qparams => {
                let currentPage = 1;
                if (qparams["page"]) {
                    currentPage = qparams["page"];

                }

                this._companyservice.getCompanyJobsWithFilter(this.companyId,[],currentPage).subscribe(jobs =>{
                    this.jobs = jobs[0];
                    this.jobs$ = Observable.of(this.jobs);
                    this.totalRecords$.next(jobs[1]["total_count"]);

                    if(jobs[0].length == 0 && currentPage > 1)
                    {
                        currentPage--;
                        this._router.navigate(['/'+this._accountService.getPath()+'/profile'], { queryParams: {page:currentPage} });
                    }


                });

            });


            this._companyservice.getCompanyTeam(this.companyId).subscribe(teamMembers =>{
                this.team = teamMembers;
                this.team$ = Observable.of(this.team);
            });

            this._companyservice.getCompanyCulture(this.companyId).subscribe(cultures =>{
                this.cultures = cultures;
                this.cultures$ = Observable.of(this.cultures);
            });

        }
    }




    onFollow() {

        this._companyservice.getFollowCompany(this.company.id).subscribe(res =>{

            this.company.follower++;
            this.company.followingFlag = true;
            this.companyDetails$ =  Observable.of(this.company);
        })

    }

    onUnfollow() {


        this._companyservice.getUnfollowCompany(this.company.id).subscribe(res =>{

            this.company.follower--;
            this.company.followingFlag = false;
            this.companyDetails$ =  Observable.of(this.company);
        })




    }


    onApplyJob(jobId,index){
        // this.applyJobFlag = true;


        this._jobservice.applyJobNoAttach(jobId).subscribe(res =>{
                this.successFlag$.next(true);

                Observable.of(1).delay(2000)
                    .subscribe(x => {
                        this.successFlag$.next(false);
                        jQuery('.close_delete').modal('hide');

                        let jobs = [];
                        this.jobs$.subscribe(jobsList => {

                            jobsList.forEach((selJob,selIndex)=>{
                                if(selIndex == index){
                                    selJob['appliedFlag'] = true;
                                }
                                jobs.push(selJob);
                            });

                            this.jobs$ = Observable.of(jobs);

                        })

                    });
            },
            error =>{

                this.errrorMessage$.next("Sorry apply for job failed")
                Observable.of(1).delay(2000)
                    .subscribe(x => {
                        this.errrorMessage$.next(null);
                        jQuery('.close_delete').modal('hide');
                        // this._router.navigate(['/'+this._accountService.getPath()+'/jobs/my-jobs']);
                    });

            });

        // this._router.navigate(['/' + this._accountService.getPath() + '/jobs/apply/'+this.jobId]);
    }


    onClickBack() {

        // this.backClick.emit({"type": this.fromPage});
        this.location.back();
    }


    constructor(public _companyservice:CompanyService,
                public _jobservice:JobService,
                public fb:FormBuilder,
                public _accountService:AccountService,
                public _router:Router,
                public _activeRoute:ActivatedRoute,
                public location:Location,
                public _error:ErrorHandling) {

        this.location = location;
        this.loadingFlagsArray['companyLoader'] = true;
        let elements1 = {
            search_string: ['', Validators.required]
        };
        this.form1 = fb.group(elements1);
    }
}
