import {Component, OnInit} from "@angular/core";

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {StatsService} from "../../../core/services/stats.service";
import {AccountService} from "../../../core/account/services/account.service";





@Component({

    selector:"bar-stat",
    templateUrl: "bar_stat.component.html"

})

export class BarStatComponent implements OnInit {

    public jobsByCountry$: BehaviorSubject<any> = new BehaviorSubject(null);
    public jobsBySector$: BehaviorSubject<any> = new BehaviorSubject(null);

    isLoadingC = true;
    isLoadingS = true;
    public stat;
    postsLoading;



    ngOnInit():any {

        this.loadJobCountryStats();
        this.loadJobSectorStats();


    }



    public loadJobCountryStats() {

        this._statsService.getJobsCountryStats()
            .subscribe(
                stats => {
                    this.isLoadingC = false;
                    this.jobsByCountry$.next(stats["job_applications_by_country"]);
                });


    }
    public loadJobSectorStats() {

        this._statsService.getJobsSectorStats()
            .subscribe(
                stats => {
                    this.isLoadingS = false;
                    this.jobsBySector$.next(stats["job_applications_by_sector"]);
                });
    }

    constructor(public _statsService:StatsService,public _accountService:AccountService) {

    }


}
