import {Http,Headers} from '@angular/http';
import {ConfigService} from '../../../../shared/config.service';

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ProfileStatService {

    public _urld ="profile_stats_daily.html";
    public _urlw ="profile_stats_weekly.html";
    public _urlm ="profile_stats_monthly.html";
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
