import { Directive, Component, OnInit, ElementRef, Inject, AfterViewChecked } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Title } from '@angular/platform-browser';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

//services
import { AccountService } from '../../core/account/services/account.service';
import {StatsService} from "../../core/services/stats.service";



@Component({

    selector: "most-viewed-profiles-employer",
    templateUrl: "mostViewedProfiles.component.html"
})


export class MostViewedProflesComponent implements OnInit, AfterViewChecked {


    public companyId:number = null;
    public currentPage:number = 1;
    public activeRouterObs;



    //Observable
    public topViewedProfiles$:BehaviorSubject<any> = new BehaviorSubject(null);

    public showSpinner$:BehaviorSubject<any> = new BehaviorSubject(false);
    public totalRecords$:BehaviorSubject<any> = new BehaviorSubject(0);

    ngAfterViewChecked(){

    }


    constructor(public _accountService:AccountService,public _statsService:StatsService,public _activeRoute:ActivatedRoute){

        if(this.companyId == null){
            this.companyId = this._accountService.getCompanyId();
        }

    }

    ngOnInit(){

        //URL Params Fetch
        this.activeRouterObs = this._activeRoute.queryParams.subscribe(params => {
            this.showSpinner$.next(true);

            this.currentPage = (params["page"])?params["page"]:1;
            this._statsService.getTopViewedProfiles(this.currentPage).subscribe(res=>{
                this.topViewedProfiles$.next(res);
                this.showSpinner$.next(false);
                this.totalRecords$.next(res["meta"]["total_count"]);
            });

        });


    }
}
