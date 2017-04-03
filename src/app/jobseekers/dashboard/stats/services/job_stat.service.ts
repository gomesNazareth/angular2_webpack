import {Http,Headers} from '@angular/http';
import {ConfigService} from '../../../../shared/config.service';


import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class JobStatService {

    public _urld ="job_stats_daily.html";
    public _urlw ="job_stats_weekly.html";
    public _urlm ="job_stats_monthly.html";
    constructor(public _http: Http) {

    }


    getDaily() : Observable<any[]>{

        return this._http.get(ConfigService.getBloovoAPI()+this._urld)
            .map(res => res.json());

    }

    getWeekly() : Observable<any[]>{

        return this._http.get(ConfigService.getBloovoAPI()+this._urlw)
            .map(res => res.json());

    }

    getMonthly() : Observable<any[]>{

        return this._http.get(ConfigService.getBloovoAPI()+this._urlm)
            .map(res => res.json());
    }







}
