import {Component, OnInit, EventEmitter, Output, Input, ChangeDetectionStrategy} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {FormBuilder, FormGroup, FormControl,Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {Router,ActivatedRoute} from '@angular/router';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';

var moment = require('moment');

//Service
import {JobService} from './services/job.service';
import {AccountService} from "../../core/account/services/account.service";

declare var moment;
@Component({

    selector: "all-jobs",
    templateUrl: "allJobs.component.html"

})

export class AllJobsComponent implements OnInit {

    @Output() jobDetailsClick = new EventEmitter();
    @Input() locations = [];
    @Input() currentPageObs:BehaviorSubject<any> = new BehaviorSubject(1);

    public pages$:BehaviorSubject<any> = new BehaviorSubject(null);
    public postObserver$ = new BehaviorSubject(null);
    public jobList$ = new BehaviorSubject([]);
    public featuredJobList$ = new BehaviorSubject(null);
    public maxPages$:BehaviorSubject<any> = new BehaviorSubject(null);
    public jobSearchTagList$ = new BehaviorSubject(null);
    public help_message$= new BehaviorSubject(null);
    public matching_jobs$= new BehaviorSubject(null);
    public search_tags$= new BehaviorSubject(null);
    public searchString$ =  new BehaviorSubject(null);
    public removeFilter$ = new BehaviorSubject(null);
    public searchList$ =  new BehaviorSubject(null);
    public order_name$:BehaviorSubject<any> = new BehaviorSubject("Date Posted");
    public totalRecords$:BehaviorSubject<any> = new BehaviorSubject(0);
    public currentPage:number = 1;
    public isPublic$:BehaviorSubject<any> = new BehaviorSubject(null);
    public isAuthorized$:BehaviorSubject<any> = new BehaviorSubject(null);
    public activeRouterObs;
    public activeparams;
    public urlPath;
    public url_params = {};

    //hash keys
    public paramsHash = {
        locations:"locations",cities:"cities",sectors:"sectors",fareas:"fareas",jobtypes:"jobtypes",
        salarylevels:"salarylevels",edulevels:"edulevels",explevels:"explevels",companies:'companies'
    };

    public paramsList = [
        "locations","cities","sectors","fareas","jobtypes","salarylevels","edulevels","explevels","companies"
    ];

    //members
    public search_tags = [];
    public postData = [];

    public form1:FormGroup;

    //Flags
    public checkallFlag:boolean = false;
    public showHelpFlag:boolean = false;
    public showfilter:boolean = false;
    public showSpinner$:BehaviorSubject<any> = new BehaviorSubject(true);

    public searchTags = Array();

    public searchArray = Array();
    public filterList = null;
    public search_string = "";
    public loctitle = "";
    public title$:BehaviorSubject<any> = new BehaviorSubject("");
    public loctitle$:BehaviorSubject<any> = new BehaviorSubject("");
    public order_string = "";
    public hashOrder = {"matching_percentage":"matching_percentage","created_at":"created_at"};
    public hashOrderName = {"matching_percentage":"Matching Percentage","created_at":"Date Posted"};


    onSearch(){
        this.currentPage = 1;

        let pagination_url = {};


        this.activeRouterObs = this._activeRoute.queryParams.subscribe(params => {

            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    pagination_url[key] = params[key];
                }
            }
            pagination_url["title"] = this.search_string;

        });


        this._router.navigate(['/'+this._accountService.getPath()+'/jobs/all'],{queryParams:pagination_url});
    }

    onSelectOrder(mode= null,name='None') {


        let pagination_url = {};


        this.activeRouterObs = this._activeRoute.queryParams.subscribe(params => {

            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    pagination_url[key] = params[key];
                }
            }
            pagination_url["order"] = mode;
            this._router.navigate(['/'+this._accountService.getPath()+'/jobs/all'],{queryParams: pagination_url});
        });





        // this.showSpinner$.next(true);
        // this.order_string = mode;
        // this.searchList$.next(this.filterList);
    }




    onClickJobDetail(id:number) {
        this.jobDetailsClick.emit({"id": id,"fromPage":"allJobs"});
    }

    ngOnInit(){

        this._router.events.subscribe(params => {


            this.isPublic$.next(this._location.path().indexOf('/home/') != -1);
        });
        this.loadData();
    }

    getToggleFilter()
    {
        this.showfilter = (this.showfilter)?false:true;
    }

    getToggleHelp()
    {
        this.showHelpFlag = (this.showHelpFlag)?false:true;
    }


    onClickTag(filterIndx:number,mode:string)
    {

        if(mode == "locations"){
            this.search_tags["locations"].splice(filterIndx,1);
        }

        if(mode == "cities"){
            this.search_tags["cities"].splice(filterIndx,1);
        }
        if(mode == "companies"){
            this.search_tags["companies"].splice(filterIndx,1);
        }
        if(mode == "edulevels"){
            this.search_tags["edulevels"].splice(filterIndx,1);
        }
        if(mode == "explevels"){
            this.search_tags["explevels"].splice(filterIndx,1);
        }
        if(mode == "fareas"){
            this.search_tags["fareas"].splice(filterIndx,1);
        }

        if(mode == "jobtypes"){
            this.search_tags["jobtypes"].splice(filterIndx,1);
        }

        if(mode == "salarylevels"){
            this.search_tags["salarylevels"].splice(filterIndx,1);
        }

        if(mode == "sectors"){
            this.search_tags["sectors"].splice(filterIndx,1);
        }



        this.showSpinner$.next(true);
        this.searchList$.next({filter:this.search_tags,page:this.currentPage});
    }

    public _getBuildParamsUrl(params) {

        let  ary = [];
        if (params != null && params) {
            ary = params.split(",").map(Number);
        }
        return ary;
    }


    ngOnDestroy() {
        this.activeRouterObs.unsubscribe();
        this.activeparams.unsubscribe();
    }

    loadData() {


        this.urlPath = '/'+this._accountService.getPath()+'/jobs/all'
        this.searchTags = [];
        let elements1 = {
            search_string:['',Validators.required]
        };
        this.form1 = this.fb.group(elements1);

        let dateEvent = this.form1.controls["search_string"].valueChanges;


        //URL Params Fetch
        this.activeRouterObs = this._activeRoute.queryParams.subscribe(params => {

            this.activeparams = this._activeRoute.params.subscribe(params2 => {


                this.url_params = params;

                if(this._location.path().indexOf('?') == -1){
                    this.urlPath = this._location.path();
                }
                else {
                    this.urlPath = this._location.path().slice(0,this._location.path().indexOf('?'));
                }



                this.isAuthorized$.next(this._accountService.getAuth());
                this.showSpinner$.next(true);
                this.search_string = params["title"];
                this.title$.next(this.search_string );
                this.loctitle = params["loctitle"];
                this.loctitle$.next(this.loctitle );
                this.currentPage = (params["page"])?params["page"]:1;

                this.order_string = (this.hashOrder[params["order"]])?this.hashOrder[params["order"]]:"";
                let order_name = (this.hashOrderName[params["order"]])?this.hashOrderName[params["order"]]:"Date Posted";

                this.order_name$.next(order_name);

                this.paramsList.forEach(selparams => {
                    if(params[this.paramsHash[selparams]]){
                        this.postData[selparams] = this._getBuildParamsUrl(params[this.paramsHash[selparams]]);
                    }
                    else {
                        this.postData[selparams] = this._getBuildParamsUrl(params2[this.paramsHash[selparams]]);
                    }
                });

                // this.paramsList.forEach(selparams => {this.postData[selparams] = this._getBuildParamsUrl(params2[this.paramsHash[selparams]])});
                this.searchList$.next({filter:this.postData,page:this.currentPage});


            });



        });





        this.form1.controls["search_string"].valueChanges.subscribe(val => {
            this.search_string = val;
        });
        Observable.merge(
            this.searchList$
        )
        .switchMap(dataVal => {

            this.filterList = dataVal ;
            if (this.filterList !=null && this.filterList.filter) {
                return this._jobservice.getAllJobList(this.search_string,this.loctitle,this.order_string,this.filterList.filter,this.filterList.page || 1);
            }
            return this._jobservice.getAllJobList(this.search_string,this.loctitle,this.order_string,null,1);
        })
        .subscribe(res=>{

            this.showSpinner$.next(false);
            res["jobs"].forEach((selJob,selJobCnt)=>{
                res["jobs"][selJobCnt].createdDate =  moment(Date.parse(selJob.createdDate)).format("D MMM, YYYY");
            });
            this.jobList$.next(res["jobs"]);
            this.matching_jobs$.next(res["matching_jobs"]);


            this.totalRecords$.next(res["meta"]["total_count"]);


            if(res["search_tags"] != null) {
                this.search_tags =  res["search_tags"];

                this.search_tags$.next(this.search_tags);
            }
        });
    }


    constructor(public _jobservice:JobService,public _accountService:AccountService,
                public _activeRoute:ActivatedRoute,public fb:FormBuilder,
                public _router:Router, public _location: Location) {

    }
}
