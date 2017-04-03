import {Http,Headers} from '@angular/http';
import {ConfigService} from '../../../shared/config.service';
import {JobSeekerContact} from '../models/JobSeekerContact';

import {Injectable,Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {AccountService} from  '../../../core/account/services/account.service'

@Injectable()
export class WorkService {

    private _url ="jobseekers/";
    private AuthHeader;
    private userId;


    constructor(private _http: Http,@Inject(AccountService) authService:AccountService) {
        this.AuthHeader = authService.AuthHeader();
        this.userId = authService.getUserId();
    }

    updateWorkDetails(summary :string): Observable<any[]> {
        return this._http.put(ConfigService.getBloovoAPI()+this._url, JSON.stringify(summary))
            .map(res => res.json())
    }

    getWorkList() : Observable<any[]>{
        return this._http.get(ConfigService.getBloovoAPI()+this._url)
            .map(res => res.json())
            .delay(500)
    }
}