import {Component, Input, OnInit} from "@angular/core";
import {StatsService} from "../../../core/services/stats.service";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {NumericStats} from '../models/NumericStats';


import {AccountService} from  '../../../core/account/services/account.service';





@Component({

    selector: "numeric-stat",
    templateUrl: "numeric_stat.component.html",
    providers: [StatsService]
})


export class NumericStatComponent implements OnInit {

    public statNumeric$: BehaviorSubject<any> = new BehaviorSubject(null);
    public statNumeric:NumericStats = new NumericStats();

    isLoading = true;
    public numericStatLoading:boolean = true;
    public stat;
    postsLoading;


    ngOnInit():any {

        this.loadNumericStats();


    }



    public loadNumericStats() {


        this._statsService.getNumericStats()
            .subscribe(
                stats => {
                    this.numericStatLoading = false;
                    this.statNumeric.inProgress = stats["summary"]["in_progress"];
                    this.statNumeric.success = stats["summary"]["successful"];
                    this.statNumeric.unSuccess = stats["summary"]["unsuccessful"];
                    this.statNumeric.totalApp = stats["summary"]["total"];



                    this.statNumeric$.next(this.statNumeric);
                });


    }

    constructor(public _statsService:StatsService) {

    }


}
