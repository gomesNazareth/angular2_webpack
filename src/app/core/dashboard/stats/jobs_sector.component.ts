import {Component, Input, OnInit} from "@angular/core";
import {StatsService} from "../../../core/services/stats.service";
import {AccountService} from '../../account/services/account.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';



@Component({

    selector: "jobs-sector",
    templateUrl: "jobs_sector.component.html",
    providers: [StatsService,AccountService]
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

    @Input() cached:boolean = false;
    @Input() jobsStatsObs:Observable<any> = Observable.of(null);


    ngOnInit():any {

        this.loadJobSectorStats();
        this.loadAds();


    }

    public loadAds(){
        this.adsLoading = true;


    }

     goBack() {
             window.history.back();
     }

    public loadJobSectorStats() {


            if(this.cached == false){

                this._statsService.getJobsSectorStats()
                    .subscribe(
                        stats => {
                            this.isLoadingS = false;
                            this.jobsBySector$.next(stats["job_applications_by_sector"]);
                        });
            }
            else
            {
                this.jobsStatsObs.subscribe(res =>{
                    this.isLoadingS = false;
                })

            }




    }

    constructor(public _statsService:StatsService,public _accountService:AccountService) {

    }


}
