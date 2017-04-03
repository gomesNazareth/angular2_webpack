
import {CanActivate,ActivatedRouteSnapshot,RouterStateSnapshot} from "@angular/router";
import {Observable} from 'rxjs/Observable';
import {Inject,getModuleFactory} from '@angular/core';


//Services
import {AccountService} from '../../core/account/services/account.service';

export class CanActivateMostViewedProfiles implements CanActivate {


    constructor(@Inject(AccountService)  public _accountServices: AccountService){

    }

    canActivate(
        route:ActivatedRouteSnapshot,
        state:RouterStateSnapshot):Observable<boolean> {



       return this._accountServices.getActiveEmployerPermissionList().map(res => {

            if(res.indexOf("search_jobseekers") != -1){
                return true;
            }
            else
                return false;
        });

    }



}
