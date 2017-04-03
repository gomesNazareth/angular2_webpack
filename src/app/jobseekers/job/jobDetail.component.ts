import {OnInit,Component,Input,EventEmitter,Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Location} from '@angular/common';
import {FormBuilder} from '@angular/forms';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Router,ActivatedRoute} from '@angular/router';
//Service
import {JobService} from './services/job.service';
import {CompanyService} from '../dashboard/who_view_my_profile/services/company.service';
import {ConfigService} from '../../shared/config.service';
import {AccountService} from "../../core/account/services/account.service";


declare var google:any;
declare var jQuery:any;
@Component({

    selector: "job-detail",
    templateUrl: "jobDetail.component.html",
    styles: ['.chart {display: block; width: 90%;height: 20%}']
})


export class JobDetailComponent implements OnInit {

    @Input() jobId :number;
    @Input() fromPage :string;
    @Output() jobDetailsClick = new EventEmitter();
    @Output() backClick = new EventEmitter();

    public selJob$ = new BehaviorSubject(null);
    public similarJob$ = new BehaviorSubject(null);
    public similarCompanies;
    public similarCompanies$ = new BehaviorSubject(null);
    public isAuthorized$:BehaviorSubject<any> = new BehaviorSubject(null);
    public sub;
    public unSavedFlag:boolean = false;
    public isPublic:boolean;
    public savedFlag:boolean = false;
    public jobCharts$ = new BehaviorSubject(null);
    public jobCounts$ = new BehaviorSubject(null);
    public jobUrl$ = new  BehaviorSubject(null);
    public jobUrlDesc$ = new  BehaviorSubject(null);
    public errrorFlag$:BehaviorSubject<any> = new BehaviorSubject(false);
    public errrorMessage$:BehaviorSubject<any> = new BehaviorSubject(null);
    public successFlag$:BehaviorSubject<any> = new BehaviorSubject(null);

    public genderHash = {'male':"Male",'female':"Female",null:'Any','':'Any'}
    public followCompany$ = new BehaviorSubject(null);

    //Flags
    applyJobFlag = false;

    //members
    public selJob = [];



    onApplyJob(){
        // this.applyJobFlag = true;


        this._jobservice.applyJobNoAttach(this.jobId).subscribe(res =>{
                this.successFlag$.next(true);

                Observable.of(1).delay(2000)
                    .subscribe(x => {
                        this.successFlag$.next(false);
                        jQuery('.close_delete').modal('hide');
                        this.selJob$.value['appliedDate'] = res['job_application']['applied_date'];
                        // this._router.navigate(['/'+this._accountService.getPath()+'/jobs/my-jobs']);
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

    onClickJobDetail(id:number) {


        this.jobDetailsClick.emit({"id": id,"fromPage":this.fromPage});
    }

    onClickBack(){


        this._location.back();
    }


    public doughnutChartOptions:any = {
        responsive: true,
        title: {
            display: true,
            text: 'In Percentage',
            position: 'top'
        },
        legend: {
            display: true,
            alignment:"center",
            position: 'right',
            configuration:{
                fontSize:20
            }
        }
    };

    public doughnutChartColor:Array<any> = [
        { // grey
            backgroundColor: [
                '#0b4882',
                '#1560a8',
                '#2c6cb5',
                '#3379bd',
                '#f1f1f1'

            ]

        }

    ];

    public doughnutChartLegend:boolean = true;




    // events
    public chartClicked(e:any):void {
        console.log(e);
    }

    public chartHovered(e:any):void {
        console.log(e);
    }


    public onSaveJob() {
        this._jobservice.saveJob(this.selJob["id"]).subscribe(res => {

            this.savedFlag =true;
            Observable.timer(1000).subscribe(res =>{
                this.savedFlag =false;
            });
            this.selJob["isSaved"] = true;
            this.selJob$.next(this.selJob);
        });
    }

    public onUnSaveJob() {
        this._jobservice.getDeleteSavedJobList([this.selJob["id"]]).subscribe(res => {

            this.unSavedFlag =true;
            Observable.timer(1000).subscribe(res =>{
                this.unSavedFlag =false;
            });

            this.selJob["isSaved"] = false;
            this.selJob$.next(this.selJob);
        });
    }

    public onFollowSimilarCompany(index:number){
        this._companyservice.getFollowCompany(this.similarCompanies[index]["id"]).subscribe(res => {

            this.similarCompanies[index]["followingFlag"] = true;
            this.similarCompanies[index]["follower"]++;
            this.similarCompanies$.next(this.similarCompanies);
        });
    }



    public onUnFollowSimilarCompany(index:number){


        this._companyservice.getUnfollowCompany(this.similarCompanies[index]["id"]).subscribe(res => {

            this.similarCompanies[index]["followingFlag"] = false;
            this.similarCompanies[index]["follower"]--;
            this.similarCompanies$.next(this.similarCompanies);
        });
    }

    public onFollowCompany(){
        this._companyservice.getFollowCompany(this.selJob["companyObj"]["id"]).subscribe(res => {

            this.selJob["companyObj"]["followingFlag"] = true;
            this.selJob$.next(this.selJob);
        });
    }

    public onUnFollowCompany(){
        this._companyservice.getUnfollowCompany(this.selJob["companyObj"]["id"]).subscribe(res => {
            this.selJob["companyObj"]["followingFlag"] = false;
            this.selJob$.next(this.selJob);
        });
    }

    public _loadDate(){

        if (this._location.path().indexOf('home/jobs') == -1){
            this._jobservice.getViewCount(this.jobId)
                .subscribe(res => {
                    this.jobCounts$.next(res);
                });



            this._jobservice.getJobCharts(this.jobId)
                .subscribe(res => {
                    this.jobCharts$.next(res["jobCharts"]);
                });


            this._jobservice.getSimilarCompanies(this.jobId)
                .subscribe(res => {
                    this.similarCompanies = res["similarCompanies"];
                    this.similarCompanies$.next(this.similarCompanies);

                });


            this._jobservice.getSimilarJobs(this.jobId)
                .subscribe(res => {

                    this.similarJob$.next(res["similarJobs"]);
                });

        }

        this._jobservice.getJobDetails(this.jobId)
            .subscribe(res=>{
                let jobUrl = ConfigService.getDomain();
                this._activeRoute.url["_value"].forEach(selVal =>{
                    jobUrl+="/"+selVal;
                });

                this._router.navigate(['/'+this._accountService.getPath()+'/jobs/'+this.jobId+'/'+this._accountService.getSpaceToDash(res["selectedJobs"]["title"])]);
                this.jobUrl$.next(jobUrl);
                this.jobUrlDesc$.next(ConfigService.getSocialMediaContent());
                this.selJob = res["selectedJobs"];
                this.selJob$.next(this.selJob);

            });
    }

    ngOnInit() {

        this.sub = this._activeRoute.params.subscribe(params => {
            this.isAuthorized$.next(this._accountService.getAuth());
            if (params['id']){
                this.jobId = params['id'];


                this._loadDate();
            }
        });

        this.isPublic = (this._location.path().indexOf('home/jobs') != -1);
    }

    constructor(public _jobservice:JobService,public _companyservice: CompanyService,public fb:FormBuilder,public _router: Router,
                public _activeRoute:ActivatedRoute,
                public _accountService:AccountService,
                public _location: Location) {
    }
}
