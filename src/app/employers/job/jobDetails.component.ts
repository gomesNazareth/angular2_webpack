import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import {Location} from '@angular/common';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Router,ActivatedRoute} from '@angular/router';

//Services
import { AccountService } from '../../core/account/services/account.service';
import {CompanyService} from "../../core/services/company.service";
import {LoaderService} from "../../shared/services/loader.service";
import {GeneralService} from "../../shared/services/general.service";
import {ConfigService} from "../../shared/config.service";
import {JobService} from "../../core/services/job.service";
import {ErrorHandling} from "../../core/services/errorHandling.service";

var moment = require('moment');
declare var jQuery:any;
declare var moment:any;
@Component({

    selector: "employer-jobs-details",
    templateUrl: "jobDetails.component.html"

})


export class JobsDetailsComponent implements OnInit {

    public loadedData:boolean = false;
    public activeRouteHolder;
    public selJobObs:BehaviorSubject<any> = new BehaviorSubject(null);
    public selJobAnalysisObs:BehaviorSubject<any> = new BehaviorSubject(null);
    public  url$:BehaviorSubject<any> = new BehaviorSubject(ConfigService.getDomain());
    public genderHash = {'male':"Male",'female':"Female",null:'Any','':'Any'}

    getIfExpired(end_date){

        return  moment(new Date()).isAfter(Date.parse(end_date))

    }

    ngOnInit(){

        this.activeRouteHolder = this._activeRoute.params.subscribe(selParams=>{

            this.loadedData = true;
            if(selParams["id"])
            {
                let jobId = +selParams["id"];
                this._companyService.getCompanyJob(jobId).subscribe(res=>{
                this._router.navigate(['/'+this._accountService.getPath()+'/jobs/'+jobId+'/'+this._accountService.getSpaceToDash(res["job"]["title"])]);
                    this.selJobObs.next(res["job"]);
                },
                error=>{
                    this._router.navigate(['/404']);
                });
                this._companyService.getCompanyJobAnalysis(jobId).subscribe(res=>{

                    this.selJobAnalysisObs.next(res["job_application_analysis"])
                },
                error=>{ this._errorService.errorHandling(error); });
            }

        });

        this.loadedData = true;
    }

    onBack(){

        window.history.back();
    }

    constructor(public _accountService:AccountService,public _fb:FormBuilder,
                public _companyService:CompanyService,
                public _loaderService:LoaderService,
                public _errorService:ErrorHandling,
                public _generalService:GeneralService,
                public _activeRoute:ActivatedRoute,
                public _jobService:JobService,
                public _router:Router) {


    }
}
