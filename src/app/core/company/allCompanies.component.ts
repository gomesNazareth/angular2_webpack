import {Component, OnInit, EventEmitter, Output,Input} from '@angular/core';
import {FormBuilder, FormGroup,Validators } from '@angular/forms';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

//directives
import {Router,ActivatedRoute} from '@angular/router';

//Services

import {CompanyService} from '../../core/services/company.service';
import {AccountService} from "../../core/account/services/account.service";

@Component({

    selector: "all-company-listing",
    providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],
    templateUrl: "allCompanies.component.html"
})


export class AllCompaniesComponent implements OnInit {

    @Output() companyDetailsClick = new EventEmitter();

    //Forms
    public form1:FormGroup;

    //Observable
    public isPublic:boolean = false;
    public allCompanies$:Observable<any>;
    // public currentPage$:BehaviorSubject = new BehaviorSubject(null);
    public searchList$:BehaviorSubject<any> = new BehaviorSubject(null);
    public totalRecords$:BehaviorSubject<any> = new BehaviorSubject(10);
    public loadingFlagsArray$:BehaviorSubject<any> = new BehaviorSubject(false);
    public order:string = "";
    public activeRouterObs;

    //Flags
    public loadingFlagsArray = [];
    public showfilter:boolean = false;
    public allCompanies = [];
    public postData = [];


    //members
    @Input() currentPageObs:BehaviorSubject<any> = new BehaviorSubject(1);
    public currentPage:number = 1;
    //hash keys
    public paramsHash = {locations:"locations",cities:"cities",sectors:"sectors",fareas:"fareas",jobtypes:"jobtypes",salarylevels:"salarylevels",edulevels:"edulevels",explevels:"explevels",companies:'companies'};

    public paramsList = ["locations","cities","sectors","fareas","jobtypes","salarylevels","edulevels","explevels","companies"];


    ngOnInit() {

        this.loadData();
    }

    getToggleFilter() {
        this.showfilter = (this.showfilter) ? false : true;
    }

    public onFollowCompany(index:number){

        this.loadingFlagsArray['companyLoader'] = false;
        this.loadingFlagsArray$.next(false);

        this._companyservice.getFollowCompany(this.allCompanies[index]["id"]).subscribe(res => {
            this.loadingFlagsArray['companyLoader'] = false;
            this.loadingFlagsArray$.next(false);
            this.allCompanies[index]["followingFlag"] = true;
            this.allCompanies[index]["follower"]++;
            this.allCompanies$= Observable.of(this.allCompanies);
        });

    }

    public onUnFollowCompany(index:number){

        this.loadingFlagsArray['companyLoader'] = false;
        this.loadingFlagsArray$.next(false);

        this._companyservice.getUnfollowCompany(this.allCompanies[index]["id"]).subscribe(res => {
            this.loadingFlagsArray['companyLoader'] = false;
            this.loadingFlagsArray$.next(false);
            this.allCompanies[index]["followingFlag"] = false;
            this.allCompanies[index]["follower"]--;
            this.allCompanies$ = Observable.of(this.allCompanies);
        });
    }


    previous(){
        this._router.navigate(['/companies',{ locations:1 }]);
    }



    public _getBuildParamsUrl(params) {
        let  ary = [];
        if (params != null && params) {
            ary = params.split(",").map(Number);
        }
        return ary;
    }

    loadData() {
        this.allCompanies$ = Observable.of(null);
        //URL Params Fetch
        this.activeRouterObs = this._activeRoute.queryParams.subscribe(params => {

            this.order = this.location.path().indexOf('top-followed-companies') != -1 ? 'followers' : null;
            this.currentPage = (params["page"])?params["page"]:1;
            this.paramsList.forEach(selparams => {this.postData[selparams] = this._getBuildParamsUrl(params[this.paramsHash[selparams]])});
            this.searchList$.next("filter");
            this.isPublic = (this.location.path() == '/home/companies');
        });

        this.loadingFlagsArray['companyLoader'] = true;
        this.loadingFlagsArray$.next(true);

        let elements1 = {
            search_string: ['', Validators.required]
        }
        this.form1 = this.fb.group(elements1);
        this.form1.controls["search_string"].valueChanges.subscribe(val => {
            this.searchList$.next(val);
        });

        Observable.merge(
            this.searchList$
        )
        .switchMap(dataVal =>{
            this.loadingFlagsArray$.next(true);
            this.allCompanies$ = Observable.of(null);
            return this._companyservice.getAllCompanyList(this.order,this.postData,this.currentPage);
        })
        .subscribe(res => {

            this.loadingFlagsArray$.next(false);
            this.allCompanies = res["companies"];
            this.totalRecords$.next(res["meta"]["total_count"]);
            this.allCompanies$ = Observable.of(this.allCompanies);
        });

    }


    constructor(public _companyservice:CompanyService, public fb:FormBuilder,
                public _router: Router,
                public _accountService:AccountService,
                public _activeRoute:ActivatedRoute, public location: Location) {
        this.location = location;
    }

    ngOnDestroy() {
        this.activeRouterObs.unsubscribe();
    }
}
