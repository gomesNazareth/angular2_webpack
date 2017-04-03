import {Component, Input, OnInit} from "@angular/core";
import {StatsService} from "../../../core/services/stats.service";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AccountService} from "../../../core/account/services/account.service";


@Component({

    selector: "jobs-sector",
    templateUrl: "jobs_sector.component.html",
    providers: [StatsService]
})


export class JobsSectorComponent implements OnInit {

    public statNumeric;
    public ads;
    public adsLoading;
    isLoading = true;
    public numericStatLoading:boolean = true;
    public stat;
    postsLoading;
    isLoadingS = true;
    public jobsBySector$: BehaviorSubject<any> = new BehaviorSubject(null);


    ngOnInit():any {

        this.loadJobSectorStats();
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
