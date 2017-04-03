import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { AccountService } from '../app/core/account/services/account.service';

@Injectable()
export class CanEmpActivateGuard implements CanActivate {

    constructor(public _accountService: AccountService,public _router:Router) {}

    canActivate() {

        if(this._accountService.getAuth() && this._accountService.getCheckEmployer() ){
            return true;
        }
        else {
            this._accountService.getLogOutUser();
            return false;
        }

    }
}
