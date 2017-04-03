import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Router, ActivatedRoute} from '@angular/router';

//Services
import {AccountService} from '../../core/account/services/account.service';
import {CompanyService} from "../../core/services/company.service";
import {LoaderService} from "../../shared/services/loader.service";
import {GeneralService} from "../../shared/services/general.service";
import {JobService} from "../../core/services/job.service";
import {ErrorHandling} from "../../core/services/errorHandling.service";




//Validation
import  {LessThanValidator} from '../../shared/validators/basicValidators'

declare var jQuery: any;
@Component({

    selector: "job-applicants",
    templateUrl: "jobApplicants.component.html"

})


export class JobsApplicantsComponent  implements OnInit {

    public activeSubscription;
    public activeParamsSubscription;
    public currentPage:number = 1;
    public orderBy = "matching_percentage";
    public orderByName = "Matching Percentage";
    public postQuery = "";
    public loadedData:boolean = false;
    public paramsList = {};
    public jobTitle = "";
    public jobId = null;
    public loadedCommon:boolean = false;
    public bulkPostSuccess:boolean = false;
    public bulkPostError:boolean = false;
    public showFilter:boolean = false;


    //Observables
    public jobSeekers$:BehaviorSubject<any> = new BehaviorSubject(null);
    public jobSeekersAnalysis$:BehaviorSubject<any> = new BehaviorSubject(null);
    public totalRecords$:BehaviorSubject<any> = new BehaviorSubject(0);
    public appStatusList$:BehaviorSubject<any> = new BehaviorSubject(null);
    public mPList$:BehaviorSubject<any> = new BehaviorSubject(null);
    public pristineFlag$:BehaviorSubject<any> = new BehaviorSubject(true);
    public reviewFilterList = {"all":false,"applied":false,"reviewed":false,"shortlisted":false,"interviewed":false,"successful":false,"unsuccessful":false};
    public reviewFilterKey = {"all":"","applied":6,"reviewed":1,"shortlisted":2,"interviewed":3,"successful":4,"unsuccessful":5};

    public bfeedForm: FormGroup;


    setAnalysisFilter(filter){

            delete  this.paramsList["status"];
            if(this.reviewFilterList[filter] == false && filter != 'all'){
                this.paramsList["status"]=  this.reviewFilterKey[filter];

            }

            this._router.navigate(['/'+this._accountService.getPath()+'/jobs/'+this.jobId +'/'+this._accountService.getSpaceToDash(this.jobTitle)+'/applicants'],{queryParams:this.paramsList});

    }


    //post hash map
    public postHash = {locations:"q[loc_co_in]",
        cities:"q[loc_ci_in]",
        sectors:"q[se_in]",
        fareas:"q[fa_in]",
        current_sal:"q[cur_sal_in]",
        expect_sal:"q[exp_sal_in]",
        edulevels:"q[je_in]",
        explevels:"q[yoe_in]",
        exprange:"q[exp_in]",
        age_group:"q[age_in]",
        language: "q[la_in]",
        gender: "q[ge_in]",
        notice_period: "q[not_in]",
        visa_status: "q[vi_in]",
        job_type:"q[jt_in]",
        nationality:"q[nat_in]",
    };


    public postHashEq = {last_active: "q[act_lteq]",status:"q[app_status_eq]"}


    sendBulkMail() {
        this.pristineFlag$.next(false);
        if(this.bfeedForm.valid){


            this._jobService.sendBulkFeedBack(this.jobId,this.bfeedForm.value["from"],this.bfeedForm.value["to"],this.bfeedForm.value["jobStatus"],this.bfeedForm.value["feedback"])
                .subscribe(res => {

                    this.bulkPostSuccess = true;
                    Observable.timer(1000).subscribe(r=>{
                        this.bulkPostSuccess = false;
                        jQuery('.bulk-feedback').modal('hide')
                    })
            },
            error=>{
                this.bulkPostError = true;
                Observable.timer(1000).subscribe(r=>{
                    this.bulkPostError = false;
                    jQuery('.bulk-feedback').modal('hide')
                });
            });
        }
    }


    sortBy(orderBy,orderName) {
        this.orderByName = orderName;
        this.orderBy = orderBy;
        this.paramsList['order_by'] = orderBy;
        this._router.navigate(['/'+this._accountService.getPath()+'/jobs/'+this.jobId+'/'+this._accountService.getSpaceToDash(this.jobTitle)+'/applicants'],{queryParams:this.paramsList});

    }


    ngOnInit() {

        this.activeSubscription = this._activeRoute.params.subscribe(selParams => {
            if (selParams["id"]) {

                this.jobId = selParams["id"];



                this.activeParamsSubscription = this._activeRoute.queryParams.subscribe(params => {
                    this.loadedData = false;
                    let statusSet = false;

                    //Reset the hash
                    for (var key2 in this.reviewFilterList) {
                        if(this.reviewFilterList.hasOwnProperty(key2)){
                            this.reviewFilterList[key2] = false;
                        }

                    }


                        this.postQuery =  "";
                        this.paramsList = {};
                        if(params) {

                            Object.assign(this.paramsList, params);
                        }


                    this.currentPage = (this.paramsList["page"])?this.paramsList["page"]:1;


                        this.orderBy = (params["order_by"])?params["order_by"]:this.orderBy;
                        for (var key in this.paramsList) {
                            if (params.hasOwnProperty(key)) {
                                let paramSplit = params[key].split(',');
                                paramSplit.forEach(selVal => {
                                    if(this.postHash[key]) {
                                        this.postQuery += "&"+this.postHash[key]+"[]="+selVal;
                                    }
                                    if(this.postHashEq[key]){
                                        this.postQuery += "&"+this.postHashEq[key]+"="+selVal;
                                    }


                                    if(key == "status"){

                                        statusSet = true;
                                        for (var key2 in this.reviewFilterKey) {
                                            this.reviewFilterList[key2] = false;
                                            if(this.reviewFilterKey.hasOwnProperty(key2) && this.reviewFilterKey[key2] == selVal){
                                                this.reviewFilterList[key2] = true;
                                            }


                                        }

                                    }


                                });

                            }
                        }





                        //Loaded only once
                        if(this.loadedCommon == false){

                            this.loadedCommon = true;
                            this._jobService.getJobDetails(selParams["id"]).subscribe(res =>{

                           this._router.navigate(['/'+this._accountService.getPath()+'/jobs/'+this.jobId+'/'+this._accountService.getSpaceToDash(res["selectedJobs"]["title"])+'/applicants'],{queryParams:params});

                                    this.jobTitle = res.selectedJobs.title;
                            },
                                error => {
                                    this._errorHandling.errorHandling(error);
                                }
                            );

                            this._jobService.getAppStatusList().subscribe(res => {

                                let jobASList = [];
                                res["job_application_statuses"].forEach(selStatus => {
                                   jobASList.push({id:selStatus["id"],name:selStatus["status"]});

                                });
                                this.appStatusList$.next(jobASList);
                            },
                                error => {
                                    this._errorHandling.errorHandling(error);
                                });

                            let matchingPercentage = [];
                            for(var i=1;i<=100;i++){

                                matchingPercentage.push({id:i,name:i+"%"})
                            }
                            this.mPList$.next(matchingPercentage);

                            this._companyService.getJobseekersAppliedAnalysis(selParams["id"]).subscribe(res => {
                                this.jobSeekersAnalysis$.next(res["job_application_analysis"]);
                            })
                        }



                        this._companyService.getJobseekersApplied(selParams["id"],this.currentPage,this.orderBy,this.postQuery).subscribe(res => {

                                this.loadedData = true;
                                this.jobSeekers$.next(res["applicants"]);
                                this.totalRecords$.next(res["meta"]["total_count"]);

                            },
                            error => {
                                this._errorHandling.errorHandling(error);
                            })



                    if(!statusSet) {
                        this.reviewFilterList["all"] = true;
                    }
                });

            }

        });


    }


    ngOnDestroy() {

        this.activeSubscription.unsubscribe();
        this.activeParamsSubscription.unsubscribe();
    }


    onBack() {
        this._router.navigate(['/'+this._accountService.getPath()+'/jobs']);
    }

    constructor(public _accountService: AccountService, public fb: FormBuilder,
                public _companyService: CompanyService,
                public _jobService: JobService,
                public _loaderService: LoaderService,
                public _errorHandling: ErrorHandling,
                public _generalService: GeneralService,
                public _activeRoute: ActivatedRoute,
                public _router: Router) {


        let formParams = {
            from:['',Validators.required],
            to:['',[Validators.required,LessThanValidator.lessThan]],
            jobStatus:['',Validators.required],
            feedback:['',Validators.required]
        };

       this.bfeedForm = this.fb.group(formParams);
    }


}
