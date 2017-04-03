import {Component, Input, OnInit} from "@angular/core";
import {StatsService} from "../../../core/services/stats.service";

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {AccountService} from '../../account/services/account.service';




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

    @Input() cached:boolean = false;
    @Input() jobsStatsObs:Observable<any> = Observable.of(null);


    ngOnInit():any {

        this.loadJobCountryStats();
        this.loadAds();


    }

    public loadAds(){
        this.adsLoading = true;

    }

    goBack() {
        window.history.back();
    }

    public loadJobCountryStats() {

        if(this.cached == false){
        this._statsService.getJobsCountryStats()
            .subscribe(
                stats => {
                    this.isLoadingC = false;
                    this.jobsByCountry$.next(stats["job_applications_by_country"]);
                });

        }
        else
        {
            this.jobsStatsObs.subscribe(res =>{
                this.isLoadingC = false;
            })

        }


    }

    constructor(public _statsService:StatsService,public _accountService:AccountService) {

    }


}
