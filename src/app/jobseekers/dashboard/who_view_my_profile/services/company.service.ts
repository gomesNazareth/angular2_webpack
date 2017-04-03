import {Http} from '@angular/http';
import {ConfigService} from '../../../../shared/config.service';

import {AccountService} from  '../../../../core/account/services/account.service';
import {Injectable,Inject} from '@angular/core';

import 'rxjs/add/operator/map';
// import 'rxjs/Rx';

@Injectable()
export class CompanyService {

    public _url ="jobseekers/";
    public _url_company ="companies/";
    public _url1 ="companies.html";
    public _url2 ="company_view.html";

    public AuthHeader;
    public AuthHeader2;
    public AuthHeaderPdf;
    public AuthHeader3;
    public userId;

    constructor(public _http: Http,@Inject(AccountService) authService:AccountService) {
        this.AuthHeader = authService.AuthHeader();
        this.AuthHeader2 = authService.AuthHeader2();
        this.AuthHeaderPdf = authService.AuthHeaderPDF()
        this.AuthHeader3 = authService.AuthHeader3();
        this.userId = authService.getUserId();
    }

    getUnfollowCompany(companyId) {

        let geturl = ConfigService.getAPI()+this._url_company+companyId+'/'+'unfollow';
        return this._http.put(geturl,'', this.AuthHeader2)
            .map(res =>res.json())
            .map(res =>res["company"]);
    }



    getFollowCompany(companyId) {
        let geturl = ConfigService.getAPI()+this._url_company+companyId+'/'+'follow';

        return this._http.put(geturl,'', this.AuthHeader2)
            .map(res =>res.json())
            .map(res =>res["company"]);
    }

    getCompanyList(order=""){
        let url = ConfigService.getAPI()+this._url+this.userId+'/'+'profile_views';
        if(order && order.length > 0) {
            url += '?order='+order
        }
        return this._http.get(url, this.AuthHeader)
            .map(res =>{
                return res.json();
            })
            .map(res =>res["profile_views"]);
    }
}

