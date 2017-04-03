import {Http} from '@angular/http';
import {ConfigService} from '../../shared/config.service';

import {Injectable,Inject} from '@angular/core';
import {AccountService} from  '../../core/account/services/account.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class StatsService {


    private _url ="jobseekers";
    private _url_numeric = "dashboard_summary";
    private _url_jobsbycountry = "jobsbycountry_stat.html";
    private _url_jobsbysector = "jobsbysector_stat.html";
    private _url_wire = "wire_stat.html";
    private _url_previous_poll = "previous_poll.html";

    public previousPollList: BarStat[];
    public previousPollCollection: BarStatCollection;
    public chartCollection: ChartDataSet[];

    private AuthHeader;
    private AuthHeader2;
    private AuthHeaderPdf;
    private AuthHeader3;
    private userId;

    constructor(private _http: Http,@Inject(AccountService) authService:AccountService) {
        this.AuthHeader = authService.AuthHeader();
        this.AuthHeader2 = authService.AuthHeader2();
        this.AuthHeaderPdf = authService.AuthHeaderPDF()
        this.AuthHeader3 = authService.AuthHeader3();
        this.userId = authService.getUserId();

    }


    getJobApplicationDailyWeeklyMonthlyStats() {

        return this._http.get(ConfigService.getAPI()+this._url+'/'+this.userId+'/job_applications_graph',this.AuthHeader)
            .map(res =>res.json());

    }

    getProfileViewDailyWeeklyMonthlyStats() {

        return this._http.get(ConfigService.getAPI()+this._url+'/'+this.userId+'/profile_views_graph',this.AuthHeader)
            .map(res =>res.json());

    }

    getFollowersDailyWeeklyMonthlyStats() {

        return this._http.get(ConfigService.getAPI()+this._url+'/'+this.userId+'/followed_companies_graph',this.AuthHeader)
            .map(res =>res.json());

    }

    getNumericStats(){


        return this._http.get(ConfigService.getAPI()+this._url+'/'+this.userId+'/dashboard_summary',this.AuthHeader)
                   .map(res =>res.json());


    }
    
    getJobsCountryStats(){

        return this._http.get(ConfigService.getAPI()+this._url+'/'+this.userId+'/job_applications_by_country',this.AuthHeader)
            .map(res =>res.json());


    }

    getTopViewedProfiles(currentPage:number=1){


        return this._http.get(ConfigService.getAPI()+this._url+'?order=viewers&page='+currentPage,this.AuthHeader)
            .map(res =>res.json());

    }

    getTopViewedJobs(currentPage:number=1){
        return this._http.get(ConfigService.getAPI()+'jobs/top_viewed_jobs?page='+currentPage,this.AuthHeader)
            .map(res =>res.json());
    }
    getCompanyFollowersPercentageStats(companyId:number = 1){

        return this._http.get(ConfigService.getAPI()+'companies/'+companyId+'/followers_percentage',this.AuthHeader)
            .map(res =>res.json());
    }

    getCompanyGraphStats(companyId:number = 1){

        return this._http.get(ConfigService.getAPI()+'companies/'+companyId+'/jobs_graph',this.AuthHeader)
            .map(res =>res.json());
    }



    getCompanyJobStats(companyId:number = 1){
        return this._http.get(ConfigService.getAPI()+'companies/'+companyId+'/job_applications_percentage',this.AuthHeader)
            .map(res =>res.json());
    }

    getJobsSectorStats(){

        return this._http.get(ConfigService.getAPI()+this._url+'/'+this.userId+'/job_applications_by_sector',this.AuthHeader)
            .map(res =>res.json());
    }

    getPreviousStats(){
        return this._http.get(ConfigService.getBloovoAPI()+this._url_previous_poll)
            .map(res =>res.json()).delay(500);
    }

    getEmployerViewed()
    {
        this.chartCollection = [];
        this.chartCollection.push(new ChartDataSet(["Jan", "Feb", "Mar", "Apr", "May", "June","Jul","Aug","Sep","Oct","Nov","Dec"],[12, 5, 9, 55, 33, 3,31,11,23,9,2,1],"monthly"));
        this.chartCollection.push(new ChartDataSet(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat","Sun"],[12, 19, 3, 5, 2, 3,11],"daily"));
        this.chartCollection.push(new ChartDataSet(["Week1", "Week2", "Week3", "Week3", "Week4", "Week5"],[12, 19, 3, 5, 2, 3],"weekly"));

        return this.chartCollection;
    }
}

class ChartDataSet {

    public labels: string[];
    public dataset: string[];
    public periodDesc: string;


    constructor(labels,dataset,periodDesc)
    {
        this.labels = labels;
        this.dataset = dataset;
        this.periodDesc = periodDesc;

    }
}

class BarStatCollection {

    public previousPollList: BarStat[];
    public pollDate: Date;
    public pollDesc: string
    constructor(previousPollList,pollDate,pollDesc){
        this.previousPollList = previousPollList;
        this.pollDate = pollDate;
        this.pollDesc = pollDesc;
    }
}

class BarStat {

    public  id: number;
    public  shortDesc: string;
    public  longDesc: string;
    public  pollVal: number;

    constructor(id,shortDesc,longDesc,pollVal)
    {
        this.id = id;
        this.shortDesc = shortDesc;
        this.longDesc = longDesc;
        this.pollVal = pollVal;
    }
}
