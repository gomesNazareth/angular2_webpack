import { Directive, Component, OnInit, ElementRef, Inject, AfterViewChecked } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Title } from '@angular/platform-browser';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

//services
import { AccountService } from '../../core/account/services/account.service';
import {StatsService} from "../../core/services/stats.service";

//Model
import {JobGraphs} from '../../jobseekers/job/models/Job';


@Component({

    selector: "stats-employer",
    templateUrl: "stats.component.html"
})


export class StatsComponent implements OnInit, AfterViewChecked {

    public companyId:number = null;
    public companyStats$:BehaviorSubject<any> = new BehaviorSubject(null);
    public jobsStats$:BehaviorSubject<any> = new BehaviorSubject(null);
    public graphStats$:BehaviorSubject<any> = new BehaviorSubject(null);
    public malePercent:number = 0;
    public femalePercent:number = 0;
    public months = [];
    public monthStats = [];
    public jobGraph = null;
    public viewMode = "general";
    public activeRouterObs;
    public activeRouter2Obs;

    public isLoadingS:boolean = false;
    public isLoadingC:boolean = false;
    public isLoadingBars:boolean = false;
    public isLoadingPieC:boolean = false;
    public isLoadingPieA:boolean = false;
    public isLoadingfollowers:boolean = false;


    constructor(public _accountService:AccountService,public _statsService:StatsService,public _activeRoute:ActivatedRoute){

        if(this.companyId == null){
            this.companyId = this._accountService.getCompanyId();

        }
    }
    ngOnInit():void {

        this.isLoadingS = true;
        this.isLoadingC = true;
        this.isLoadingBars = true;
        this.isLoadingPieC = true;
        this.isLoadingPieA = true;
        this.isLoadingfollowers = true;

        this.activeRouter2Obs = this._activeRoute.params.subscribe(selParams=>{
            this.viewMode = "general";
            if(selParams["statsmode"] == "applicants-by-country"){
                this.viewMode = "country";
            }
            if(selParams["statsmode"] == "applicants-by-sector"){
                this.viewMode = "sector";
            }
        });

        // this.activeRouterObs = this._activeRoute.queryParams.subscribe(selParams=>{
        //     this.viewMode = "general";
        //     if(selParams["type"]== "country"){
        //         this.viewMode = "country";
        //     }
        //     if(selParams["type"]== "sector"){
        //         this.viewMode = "sector";
        //     }
        // });

        this._statsService.getCompanyGraphStats(this._accountService.getCompanyId()).subscribe(res =>{
            this.companyStats$.next(res);
            this.months = res["jobs_graph"]["monthly"][0];
            this.monthStats = res["jobs_graph"]["monthly"][1];
            this.isLoadingBars = false;
        });




        this._statsService.getCompanyJobStats(this._accountService.getCompanyId()).subscribe(res=>{

            this.jobsStats$.next(res);
            if(res["job_applications"]["job_applications_by_country"]){
                this.isLoadingC=false
            }
            if(res["job_applications"]["job_applications_by_sector"]){
                this.isLoadingS =false;
            }

        });



        this._statsService.getCompanyFollowersPercentageStats(this._accountService.getCompanyId()).subscribe(res=>{
            this.graphStats$.next(res);
            this.isLoadingPieC = false;
            this.isLoadingPieA = false;
            this.isLoadingfollowers = false;
            let total = res["followers"]["total_count"];
            this.malePercent =  (res["followers"]["followers_by_gender"]["male"] * 100)/ total;
            this.femalePercent =  (res["followers"]["followers_by_gender"]["female"] * 100)/ total;
            this.jobGraph = this._getBuildCharts(res["followers"]["followers_by_country"],res["followers"]["followers_by_age"]);
        });






    }


    ngOnDestroy(){
        // this.activeRouterObs.unsubscribe();
        this.activeRouter2Obs.unsubscribe();
    }
    public _getBuildCharts(country,age) {



        let jobGraphs1 = new JobGraphs();
        jobGraphs1.mainLabel= "By Country";
        jobGraphs1.options = { colors: ['#0b4882','#1560a8','#2c6cb5','#3379bd','#f1f1f1'] };
        jobGraphs1.data = Array(['Heading', '']);
        let cnt1 = 0;

        country.labels.forEach(sel =>{

            jobGraphs1.data.push([sel, country.data[cnt1]]);
            cnt1++;
        });



        let jobGraphs2 = new JobGraphs();
        jobGraphs2.mainLabel= "By Age";
        jobGraphs2.options = { colors: ['#0b4882','#1560a8','#2c6cb5','#3379bd','#f1f1f1'] };
        jobGraphs2.data = Array(['Heading', '']);
        let cnt2 = 0;
        age.labels.forEach(sel =>{


            jobGraphs2.data.push([sel, age.data[cnt2]]);
            cnt2++;
        });

        return {"country": jobGraphs1,"age": jobGraphs2};
    }



    ngAfterViewChecked():void {
    }

}
