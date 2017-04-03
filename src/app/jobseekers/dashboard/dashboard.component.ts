import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';


import { Router, ActivatedRoute }       from '@angular/router';

import {ConfigService} from  '../../shared/config.service';

import {OnDestroy} from "@angular/core";
import { Component } from '@angular/core';
import {AccountService} from "../../core/account/services/account.service";


@Component({

    selector: "main-content",
    templateUrl: "dashboard.component.html",
})



export class DashboardComponent implements  OnDestroy {


    public isStatsActive = true;
    public isWvmpActive = false;
    public  isPollActive =false;
    public selectedTab = "stats";
    public allPollFlag = false;

    public parameters$;

    ngOnDestroy(){
        this.parameters$.unsubscribe();
    }


    public url_flag = "";

    ngOnInit() {


        this.parameters$ = this.route.params;

        this.parameters$.subscribe(params => {
            this.url_flag = params['details'];
           if(this.url_flag == "poll-list"){
               this.onClickPoll(true);
           }
           else if(this.url_flag == "my_stats"){
               this.onClickMyStats();
           }
           else if(this.url_flag == "polls"){
               this.onClickPoll();
           }
           else if(this.url_flag == "who-viewed-my-profile"){
               this.onClickWvmp();
           }
        });


    }


    onClickMyStats() {

        this.isStatsActive = true;
        this.isPollActive = this.isWvmpActive = false;
        this.selectedTab = "stats";
    }

    onClickWvmp() {

        this.isWvmpActive = true;
        this.isStatsActive = this.isPollActive = false;
        this.selectedTab = "wvmp";
    }

    onClickPoll(allPollFlag = false) {

        this.isPollActive = true;
        this.isStatsActive = this.isWvmpActive = false;
        this.selectedTab = "poll";
        this.allPollFlag = allPollFlag;

    }


    constructor(    public route: ActivatedRoute,
                    public _accountService:AccountService,
                    public router: Router,public _title:Title)
    {
        this._title.setTitle(ConfigService.titles["dashboard"]);
    }


}
