import { Component, Input, OnInit, DoCheck }   from '@angular/core';
import { ProfileService } from '../core/services/profile.service';
import {EmployerService} from '../core/services/employer.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {NgClass,Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

import {FormBuilder,FormGroup} from '@angular/forms';
import {Router,ActivatedRoute} from '@angular/router';
import {AccountService} from '../core/account/services/account.service';
import {ConfigService} from "../../shared/config.service";



@Component({
    selector: 'top-header',
    templateUrl: 'header_bar.component.html',
})

export class HeaderBarComponent implements OnInit, DoCheck {

    @Input() navbarToggle = false;

    public cachedProfile$:BehaviorSubject<any> = new BehaviorSubject(null);
    public profileHeader$:BehaviorSubject<any> = new BehaviorSubject(null);
    public fullName:string;
    public form1:FormGroup;
    public search_string:string;
    public isAuthorized$:BehaviorSubject<any> = new BehaviorSubject(null);
    public activeRouterObs;
    public  sub;
    public isPublic$:BehaviorSubject<any> = new BehaviorSubject(null);
    public isHome$:BehaviorSubject<any> = new BehaviorSubject(null);
    public publicRoutes = ConfigService.publicRoutes;

    ngOnInit() : any {

        this.isPublic$.next(this._location.path().indexOf('/home/') != -1);
        this.isHome$.next(this.publicRoutes.includes(this._location.path().split(/[?#]/)[0]));

        this.sub = this._router.events.subscribe(params => {

            this.isPublic$.next(this._location.path().indexOf('/home/') != -1);
            this.isHome$.next(this.publicRoutes.includes(this._location.path().split(/[?#]/)[0]));
            this.isAuthorized$.next(this._accountService.getAuth());
        });
    }





    constructor(public _profile_service : ProfileService,public _router: Router,public _employer_service:EmployerService,
                public _activeRoute:ActivatedRoute,public fb:FormBuilder, public _accountService:AccountService,
                public _location: Location){



        let elements1 = {
            search_string:['']
        };
        this.form1 = fb.group(elements1);

        this.form1.controls["search_string"].valueChanges.subscribe(val => {
            this.search_string = val;
        });
    }


    public goBack() {
        window.history.back();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    logout() {
        this._accountService.getLogOutUser();

    }

    ngDoCheck() {
        let new_profile_header = this._accountService.getProfileHeader();
        this.profileHeader$.next(new_profile_header);
    }

    onSearch(){
        let pagination_url = {};
        this.activeRouterObs = this._activeRoute.queryParams.subscribe(params => {
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    pagination_url[key] = params[key];
                }
            }

            this.isPublic$.next(this._location.path().indexOf('/home/') != -1);
            this.isHome$.next(this.publicRoutes.includes(this._location.path()));

        });
        pagination_url["title"] = this.search_string;
        this._router.navigate([this._accountService.getPath()+'/jobs/all'],{queryParams:pagination_url});
    }
}
