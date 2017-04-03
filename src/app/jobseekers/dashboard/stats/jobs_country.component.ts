import {Component, Input, OnInit} from "@angular/core";
import {StatsService} from "../../../core/services/stats.service";

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AccountService} from "../../../core/account/services/account.service";




@Component({

    selector: "jobs-country",
    templateUrl: "jobs_country.component.html",
    providers: [StatsService]
})


export class JobsCountryComponent implements OnInit {

    public statNumeric;
    public ads;
    public adsLoading;
    isLoading = true;
    public numericStatLoading:boolean = true;
    public stat;
    postsLoading;
    isLoadingC = true;
    public jobsByCountry$: BehaviorSubject<any> = new BehaviorSubject(null);


    ngOnInit():any {

        this.loadJobCountryStats();
        this.loadAds();


    }

    public loadAds(){
        this.adsLoading = true;




        // this._adservice.getAdList()
        //     .subscribe(
        //         ads => {
        //             this.ads = ads["ads"];


        //         }, null,
        //         ()=> {this.adsLoading = true;});
    }


    public loadJobCountryStats() {

        this._statsService.getJobsCountryStats()
            .subscribe(
                stats => {
                    this.isLoadingC = false;
                    this.jobsByCountry$.next(stats["job_applications_by_country"]);
                });


    }

    constructor(public _statsService:StatsService,public _accountService:AccountService) {

    }


}
