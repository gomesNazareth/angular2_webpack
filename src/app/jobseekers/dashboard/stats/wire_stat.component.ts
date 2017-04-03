import {Component, ElementRef, OnInit} from '@angular/core';
import {StatsService} from "../../../core/services/stats.service";
import {ProfileStatService} from "./services/profile_stat.service";
import {NewFollowStatService} from "./services/newfollow_stat.service";

import {BehaviorSubject} from 'rxjs/BehaviorSubject';


declare var jQuery:any;

@Component({

    selector: "wire-stat",

    templateUrl: "wire_stat.component.html",
    styles: ['.chart {display: block; width: 90%;height: 20%}']
})

export class WireStatComponent implements OnInit {
    elementRef:ElementRef;
    public dailyTab: boolean;
    public weeklyTab: boolean;
    public monthlyTab: boolean;
    public employerViewedCharts;

    public jobAppTab: boolean;
    public profileViewTab: boolean;
    public newFollowTab: boolean;

    isLoadingJ = true;
    isLoadingP = true;
    isLoadingN = true;

    // lineChart
    public lineChartDailyData:Array<any> ;
    public lineChartDailyLabels:Array<any>;


    public lineChartDailyData$: BehaviorSubject<any> = new BehaviorSubject(null);
    public lineChartDailyLabels$: BehaviorSubject<any> = new BehaviorSubject(null);

    public lineChartMonthData:Array<any> ;
    public lineChartMonthLabels:Array<any>;

    public lineChartMonthData$: BehaviorSubject<any> = new BehaviorSubject(null);
    public lineChartMonthLabels$: BehaviorSubject<any> = new BehaviorSubject(null);


    public lineChartWeeklyData:Array<any> ;
    public lineChartWeeklyLabels:Array<any>;

    public lineChartWeeklyData$: BehaviorSubject<any> = new BehaviorSubject(null);
    public lineChartWeeklyLabels$: BehaviorSubject<any> = new BehaviorSubject(null);


    //Profile lineChart
    public profileChartDailyData:Array<any> ;
    public profileChartDailyLabels:Array<any>;
    public profileChartDailyData$: BehaviorSubject<any> = new BehaviorSubject(null);
    public profileChartDailyLabels$: BehaviorSubject<any> = new BehaviorSubject(null);

    public profileChartMonthData:Array<any> ;
    public profileChartMonthLabels:Array<any>;
    public profileChartMonthData$: BehaviorSubject<any> = new BehaviorSubject(null);
    public profileChartMonthLabels$: BehaviorSubject<any> = new BehaviorSubject(null);


    public profileChartWeeklyData:Array<any> ;
    public profileChartWeeklyLabels:Array<any>;
    public profileChartWeeklyData$: BehaviorSubject<any> = new BehaviorSubject(null);
    public profileChartWeeklyLabels$: BehaviorSubject<any> = new BehaviorSubject(null);




    //New Follow lineChart
    public nfChartDailyData:Array<any> ;
    public nfChartDailyLabels:Array<any>;
    public nfChartDailyData$: BehaviorSubject<any> = new BehaviorSubject(null);
    public nfChartDailyLabels$: BehaviorSubject<any> = new BehaviorSubject(null);


    public nfChartMonthData:Array<any> ;
    public nfChartMonthLabels:Array<any>;
    public nfChartMonthData$: BehaviorSubject<any> = new BehaviorSubject(null);
    public nfChartMonthLabels$: BehaviorSubject<any> = new BehaviorSubject(null);


    public nfChartWeeklyData:Array<any> ;
    public nfChartWeeklyLabels:Array<any>;
    public nfChartWeeklyData$: BehaviorSubject<any> = new BehaviorSubject(null);
    public nfChartWeeklyLabels$: BehaviorSubject<any> = new BehaviorSubject(null);









    constructor(public _statsService: StatsService,
                public _profileStatService: ProfileStatService,
                public _newfStatService: NewFollowStatService


    ) {

        this.dailyTab = true;
        this.weeklyTab = false;
        this.monthlyTab = false;

        this.jobAppTab= true;
        this.profileViewTab= false;
        this.newFollowTab= false;

    }



    ngOnInit() {

        //Jobs


        this._statsService.getJobApplicationDailyWeeklyMonthlyStats()
            .subscribe(sectors =>{
                this.isLoadingJ = false;
                this.lineChartDailyData = [{data: sectors["job_applications_graph"]["daily"][1], label: 'Daily',fill: false,lineTension: 0.5,pointRadius:5}];
                this.lineChartDailyLabels = [sectors["job_applications_graph"]["daily"][0]][0];


                this.lineChartDailyData$.next(this.lineChartDailyData);
                this.lineChartDailyLabels$.next(this.lineChartDailyLabels);




                this.lineChartMonthData = [{data: sectors["job_applications_graph"]["monthly"][1], label: 'Daily',fill: false,lineTension: 0.5,pointRadius:5}];
                this.lineChartMonthLabels = [sectors["job_applications_graph"]["monthly"][0]][0];


                this.lineChartMonthData$.next(this.lineChartMonthData);
                this.lineChartMonthLabels$.next(this.lineChartMonthLabels);



                this.lineChartWeeklyData = [{data: sectors["job_applications_graph"]["weekly"][1], label: 'Daily',fill: false,lineTension: 0.5,pointRadius:5}];
                this.lineChartWeeklyLabels = [sectors["job_applications_graph"]["weekly"][0]][0];


                this.lineChartWeeklyData$.next(this.lineChartWeeklyData);
                this.lineChartWeeklyLabels$.next(this.lineChartWeeklyLabels);




            });







        //Profile



        this._statsService.getProfileViewDailyWeeklyMonthlyStats()
            .subscribe(sectors =>{


                this.isLoadingP = false;
                this.profileChartDailyData = [{data: sectors["profile_views_graph"]["daily"][1], label: 'Daily',fill: false,lineTension: 0.5,pointRadius:5}];
                this.profileChartDailyLabels = [sectors["profile_views_graph"]["daily"][0]][0];

                this.profileChartDailyData$.next(this.profileChartDailyData);
                this.profileChartDailyLabels$.next(this.profileChartDailyLabels);




                this.profileChartMonthData = [{data: sectors["profile_views_graph"]["monthly"][1], label: 'Daily',fill: false,lineTension: 0.5,pointRadius:5}];
                this.profileChartMonthLabels = [sectors["profile_views_graph"]["monthly"][0]][0];


                this.profileChartMonthData$.next(this.profileChartMonthData);
                this.profileChartMonthLabels$.next(this.profileChartMonthLabels);





                this.profileChartWeeklyData = [{data: sectors["profile_views_graph"]["weekly"][1], label: 'Daily',fill: false,lineTension: 0.5,pointRadius:5}];
                this.profileChartWeeklyLabels = [sectors["profile_views_graph"]["weekly"][0]][0];



                this.profileChartWeeklyData$.next(this.profileChartWeeklyData);
                this.profileChartWeeklyLabels$.next(this.profileChartWeeklyLabels);



            });











        //new Followers



        this._statsService.getFollowersDailyWeeklyMonthlyStats()
            .subscribe(sectors =>{

                this.isLoadingN = false;
                this.nfChartDailyData = [{data: sectors["followed_companies_graph"]["daily"][1], label: 'Daily',fill: false,lineTension: 0.5,pointRadius:5}];
                this.nfChartDailyLabels = [sectors["followed_companies_graph"]["daily"][0]][0];

                this.nfChartDailyData$.next(this.nfChartDailyData);
                this.nfChartDailyLabels$.next(this.nfChartDailyLabels);





                this.nfChartMonthData = [{data: sectors["followed_companies_graph"]["monthly"][1], label: 'Daily',fill: false,lineTension: 0.5,pointRadius:5}];
                this.nfChartMonthLabels = [sectors["followed_companies_graph"]["monthly"][0]][0];

                this.nfChartMonthData$.next(this.nfChartMonthData);
                this.nfChartMonthLabels$.next(this.nfChartMonthLabels);




                this.nfChartWeeklyData = [{data: sectors["followed_companies_graph"]["weekly"][1], label: 'Daily',fill: false,lineTension: 0.5,pointRadius:5}];
                this.nfChartWeeklyLabels = [sectors["followed_companies_graph"]["weekly"][0]][0];

                this.nfChartWeeklyData$.next(this.nfChartWeeklyData);
                this.nfChartWeeklyLabels$.next(this.nfChartWeeklyLabels);



            });












    }


    public lineChartOptions:any = {
        animation: false,
        showTooltips:false,
        responsive: true,
        title: { display:false },
        legend: { display :false },
        scales: {
            xAxes : [ {
                gridLines : {
                    display : false
                }
            } ],
            yAxes: [{
                gridLines : {
                    display : false
                },
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };
    public lineChartColours:Array<any> = [
        { // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }

    ];
    public lineChartLegend:boolean = true;
    public lineChartType:string = 'line';
    public barChartType:string = 'bar';

    // events
    public chartClicked(e:any):void {
        console.log(e);
    }

    public chartHovered(e:any):void {
        console.log(e);
    }



    OnClickDailyTab() {

        this.dailyTab = true;
        this.weeklyTab = false;
        this.monthlyTab = false;

    }
    onClickWeeklyTab() {
        this.dailyTab = false;
        this.weeklyTab = true;
        this.monthlyTab = false;
    }
    onClickMonthlyTab() {
        this.dailyTab = false;
        this.weeklyTab = false;
        this.monthlyTab = true;
    }
    onClickJobApp() {
        this.jobAppTab= true;
        this.profileViewTab= false;
        this.newFollowTab= false;
    }
    onClickProfileView(){
        this.jobAppTab= false;
        this.profileViewTab= true;
        this.newFollowTab= false;
    }
    onClickNewFollow(){
        this.jobAppTab= false;
        this.profileViewTab= false;
        this.newFollowTab= true;
    }


}

