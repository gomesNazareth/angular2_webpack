import {Http,Headers} from '@angular/http';
import {ConfigService} from '../../../shared/config.service';
import {JobSeekerContact} from '../models/JobSeekerContact';

import {Injectable,Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AccountService} from  '../../../core/account/services/account.service';




@Injectable()
export class SummaryService {

    private _url ="jobseekers/";
    private AuthHeader;
    private AuthHeader2;
    private userId;
 

    constructor(private _http: Http,@Inject(AccountService) authService:AccountService) {

        this.AuthHeader = authService.AuthHeader();
        this.AuthHeader2 = authService.AuthHeader2();
        this.userId = authService.getUserId();
    }



 

    updateContactDetails(summary :string): Observable<any[]> {
        


        return this._http.put(ConfigService.getAPI()+this._url+this.userId,
            JSON.stringify({jobseeker: summary}), this.AuthHeader2)
            .map(res => res.json())

    }





}