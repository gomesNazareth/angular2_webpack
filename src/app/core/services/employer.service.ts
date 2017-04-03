import {Http,Headers} from '@angular/http';
import {ConfigService} from '../../shared/config.service';
import {AccountService} from  '../../core/account/services/account.service';
import {Router} from '@angular/router';

import {Injectable,Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

//Models


import 'rxjs/add/operator/map';

@Injectable()
export class EmployerService {

    //members
    private AuthHeader;
    private AuthHeader2;
    private AuthHeader3;
    private AuthHeaderPdf;
    private userId;
    private employerId;
    private _authkey;


    //Cache
    public static profileCache : any = null;
    public static profileHeader : any = null;
    public currentTime : number = null;


    constructor(private _http: Http,private _router: Router,@Inject(AccountService) authService:AccountService) {

        this.AuthHeader = authService.AuthHeader();
        this.AuthHeader2 = authService.AuthHeader2();
        this.AuthHeader3 = authService.AuthHeader3();
        this.AuthHeaderPdf = authService.AuthHeaderPDF();
        this.userId = authService.getUserId();
        this.employerId = authService.getEmployerId();
        this._authkey = authService.getAuthKey();

    }


    setProfileHeader(company_name:string,full_name:string, avatar:string){
        let names = full_name.split(" ");
        EmployerService.profileHeader = {
            full_name: company_name,
            avatar: avatar,
            first_name: names[0],
            last_name: names[1]
        };
    }

    getProfileHeader() : any {
        return EmployerService.profileHeader;
    }

    getProfile() : Observable<any[]>{

        let url = ConfigService.getAPI()+'company_users/'+this.employerId+'/employer_details';


        return this._http.get(url, this.AuthHeader)
            .map(res => {
                let profile = res.json();

                let full_name = profile["user"]["first_name"] + " " + profile["user"]["last_name"];
                let company_name = profile["user"]["company"]["name"];
                this.setProfileHeader(company_name,full_name, profile["user"]["company"]["avatar"]);
                return profile;
            });
    }






}