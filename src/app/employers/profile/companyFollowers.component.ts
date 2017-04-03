import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import {Location} from '@angular/common';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Router,ActivatedRoute} from '@angular/router';

//Services
import { AccountService } from '../../core/account/services/account.service';
import {StatsService} from "../../core/services/stats.service";
import {CompanyService} from "../../core/services/company.service";



@Component({

    selector: "company-followers",
    templateUrl: "companyFollowers.component.html"

})


export class CompanyFollowersComponent implements OnInit {

    public companyId:number = null;
    public currentPage:number = 1;
    public activeRouterObs;
    public showHelp = false;
    public search_string = "";
    public showfilter:boolean = false;

    public form1:FormGroup;

    //Observable
    public followingProfiles$:BehaviorSubject<any> = new BehaviorSubject(null);

    public showSpinner$:BehaviorSubject<any> = new BehaviorSubject(false);
    public totalRecords$:BehaviorSubject<any> = new BehaviorSubject(0);


    toggleHelp() {

        this.showHelp = (this.showHelp)?false:true;
    }

    constructor(public _accountService:AccountService,public fb:FormBuilder, public _companyService:CompanyService, public _statsService:StatsService,public _activeRoute:ActivatedRoute,public _router:Router){

        if(this.companyId == null){
            this.companyId = this._accountService.getCompanyId();
        }

    }

    getToggleFilter()
    {
        this.showfilter = (this.showfilter)?false:true;
    }
    onSearch(){
        this.currentPage = 1;

        let pagination_url = {};


        this.activeRouterObs = this._activeRoute.queryParams.subscribe(params => {


            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    pagination_url[key] = params[key];
                }
            }

               pagination_url["name"] = this.search_string;

        });


        this._router.navigate(['/'+this._accountService.getPath()+'/profile/followers'],{queryParams:pagination_url});
    }

    ngOnDestroy() {
        this.activeRouterObs.unsubscribe();
    }

    ngOnInit(){

        let elements1 = {
            search_string:['',Validators.required]
        }
        this.form1 = this.fb.group(elements1);

        this.form1.controls["search_string"].valueChanges.subscribe(val => {
            this.search_string = val;
        });

        //URL Params Fetch
        this.activeRouterObs = this._activeRoute.queryParams.subscribe(params => {
            this.showSpinner$.next(true);


            if(!this._accountService.getSearchJobSeekers()){

                this._router.navigate(['/'+this._accountService.getPath()+'/profile'])
            }
            this.currentPage = (params["page"])?params["page"]:1;
            this.search_string = (params["name"])?params["name"]:"";
            this._companyService.getCompanyFollowers(this.companyId,this.currentPage,this.search_string,params).subscribe(res=>{


                this.followingProfiles$.next(res);
                this.showSpinner$.next(false);
                this.totalRecords$.next(res["meta"]["total_count"]);

            });

        });


    }
}
