import {Router,ActivatedRoute} from '@angular/router';
import {Injectable,Inject} from '@angular/core';
import {AccountService} from "../account/services/account.service";
import {CookieService} from "./cookie.service";


@Injectable()
export class ErrorHandling {


    constructor(private _activeRoute:ActivatedRoute,private _router:Router,private  _cookieService: CookieService){

    }



    public getClearStorage(){

        this._cookieService.eraseCookie('authKey');
        localStorage.removeItem('user_name');
        localStorage.removeItem('userId');
        localStorage.removeItem('company_id');
        localStorage.removeItem('employer_id');
        localStorage.removeItem('permissions');
        localStorage.removeItem('role');
        AccountService.profileHeader={};
        AccountService.rememberme=false;
    }

    public getLogOutUser(){


        this.getClearStorage();
        this._router.navigateByUrl('/home');
    }

    public errorHandling(error){

        if(error.status == 500){
            this._router.navigate(['/404']);
        }
        else if(error.status == 404){
            this._router.navigate(['/404']);
        }
        else if(error.status == 403){
            this._router.navigate(['/unauthorized']);
            this.getLogOutUser();
        }
        else if(error.status == 401){
            this.getLogOutUser();
        }

    }

}