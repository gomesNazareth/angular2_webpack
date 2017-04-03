import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import {CanLoad, Router, Route} from '@angular/router';
import { AccountService } from '../app/core/account/services/account.service';
import {ConfigService} from "../shared/config.service";

@Injectable()
export class CanLoadGuard implements CanLoad {
    constructor(public _accountService: AccountService,public _router:Router,public _location: Location) {

    }

    canLoad(route: Route) {

        if (route.path == "home"){
            return true;
        }else if (route.path == ConfigService.jobseekerPath && this._accountService.getUserType() == "jobseeker") {
            return true;
        }else if (route.path == "employer" && this._accountService.getUserType() == "employer") {
            return true;
        }
        else {
            this._router.navigate(['/home']);
        }

        return false
    }
}
