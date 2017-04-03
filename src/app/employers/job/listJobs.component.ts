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

var moment = require('moment');

declare var jQuery:any;
declare var moment:any
@Component({

    selector: "employer-jobs-search",
    templateUrl: "listJobs.component.html"

})


export class ListJobsComponent implements OnInit {


    public companyUsersObs: BehaviorSubject<any> = new BehaviorSubject(null);
    public totalRecords$: BehaviorSubject<any> = new BehaviorSubject(0);
    public activeRouterObs;
    public currentPage: number = 1;
    public sectorId:number = -1;
    public fareaId:number = -1;
    public jobTypeId:number = -1;
    public titleString:string = "";
    public paramsObs

    public sectorListObs: BehaviorSubject<any> = new BehaviorSubject(null);
    public fareaListObs: BehaviorSubject<any> = new BehaviorSubject(null);
    public jobTypeListObs: BehaviorSubject<any> = new BehaviorSubject(null);
    public jobListObs: BehaviorSubject<any> = new BehaviorSubject(null);
    public totalJobsObs: BehaviorSubject<any> = new BehaviorSubject(0);


    public sectorList = [];
    public fareaList = [];
    public jobTypeList = [];
    public params = [];


    searchFilter(){





        let params = {};
        if(this.sectorId != -1) {
            params['sector'] = this.sectorId;
        }
        if(this.fareaId != -1) {
            params['fArea'] = this.fareaId;

        }
        if(this.jobTypeId != -1) {
            params['jobTypes'] = this.jobTypeId;
        }
        if(this.titleString != ""){
            params['title'] = this.titleString;
        }


        this._router.navigate(['/'+this._accountService.getPath()+'/jobs'],{queryParams:params})
        // this.onLoadJobs(params);
    }

    setSearchString(val){

        this.titleString = val;
    }


    getIfExpired(end_date){

        return  moment(new Date()).isAfter(Date.parse(end_date))

    }

    onLoadJobs(params = []){

        this.jobListObs.next(null);
        this._companyService.getCompanyJobsWithFilter(this._accountService.getCompanyId(),params,this.currentPage).subscribe(res =>{

            this.jobListObs.next(res[0]);
            this.totalJobsObs.next(res[1]["total_count"]);

            if(res[0].length == 0 && this.currentPage > 1)
            {
                this.currentPage--;
                this._router.navigate(['jobs'], { queryParams: {page:this.currentPage} });
            }

        });
    }


    deleteJob(jobId:number,jobIndex:number) {

        this._companyService.getDeleteJob(this._accountService.getCompanyId(),jobId,this.currentPage).subscribe(res =>{

            this.onLoadJobs(this.params);

            jQuery('.close_delete').modal('hide');




        });

    }


    ngOnInit() {

        this.paramsObs =  this._activeRoute.queryParams.subscribe(selParams=>{


            let params = [];
            if(selParams["sector"]) {
                params.push({name:'sector',id:selParams["sector"]});
            }
            if(selParams["fArea"]) {
                params.push({name:'fArea',id:selParams["sector"]});
            }
            if(selParams["jobTypes"]) {
                params.push({name:'jobTypes',id:selParams["jobTypes"]});
            }
            if(selParams["title"]){
                params.push({name:'title',value:selParams["title"]});
            }
            if(selParams["page"]){
                this.currentPage = selParams["page"];
            }


            this.params = params;

            if(this.sectorList.length == 0)
                this._loaderService.getSectors().subscribe(res => {


                    // this.sectorList.push({id:-1,name:'Sector'});
                    res.forEach(selSector=>{
                        this.sectorList.push({id:selSector["id"],name:selSector["name"]});
                    });

                    this.sectorListObs.next(this.sectorList);
                });



            if(this.fareaList.length ==0)
                this._loaderService.getFunctionalArea().subscribe(res => {


                    // this.fareaList.push({id:-1,name:'Functional Area'});
                    res.forEach(selFarea=>{
                        this.fareaList.push({id:selFarea["id"],name:selFarea["name"]});
                    });

                    this.fareaListObs.next(this.fareaList);
                });




            if(this.jobTypeList.length ==0)
                this._generalService.getJobTypes().subscribe(res => {


                    // this.jobTypeList.push({id:-1,name:'Job Type'});
                    res.forEach(seljobType =>{
                        this.jobTypeList.push({id:seljobType["id"],name:seljobType["name"]});
                    });

                    this.jobTypeListObs.next(this.jobTypeList);
                });

            this.onLoadJobs(params);

        });




    }

    ngOnDestroy() {
        this.paramsObs.unsubscribe();
    }

    constructor(public _accountService:AccountService,public fb:FormBuilder,
                public _companyService:CompanyService,
                public _loaderService:LoaderService,
                public _generalService:GeneralService,
                public _activeRoute:ActivatedRoute,
                public _router:Router) {


    }


}
