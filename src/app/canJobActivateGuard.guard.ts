import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import {CanActivate, Router} from '@angular/router';
import { AccountService } from '../app/core/account/services/account.service';

@Injectable()
export class CanJobActivateGuard implements CanActivate {

    public isPublic : boolean;

    constructor(public _accountService: AccountService,public _router:Router,public _location: Location) {}

    canActivate() {
        this.isPublic = this._location.path().indexOf('/home') != -1;
        if((this._accountService.getAuth() && !this._accountService.getCheckEmployer()) || this.isPublic ){
            return true;
        }
        else {
            this._accountService.getLogOutUser();
            return false;
        }

    }
}
