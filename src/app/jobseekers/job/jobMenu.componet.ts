import {Component, OnInit, Input} from '@angular/core';
import {AccountService} from "../../core/account/services/account.service";
import {Location} from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Router} from '@angular/router';



declare var jQuery:any;
@Component({

    selector: "job-menu",
    templateUrl: "jobMenu.component.html"

})


export class jobMenuComponent implements OnInit {

    @Input() activeFlag = 'all';

    public isPublic$:BehaviorSubject<any> = new BehaviorSubject(null);

    ngOnInit() {

        this._router.events.subscribe(params => {
            this.isPublic$.next(this._location.path().indexOf('/home/') != -1);
        });
    }

    constructor(public _accountService:AccountService, public _location:Location, public _router:Router) {


    }
}

