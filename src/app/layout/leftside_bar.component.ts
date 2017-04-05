import {Component,Output,EventEmitter,ElementRef,Inject} from '@angular/core';
import {AccountService} from '../core/account/services/account.service';
import {NgClass,Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import {FormBuilder,FormGroup} from '@angular/forms';
import {Router,ActivatedRoute} from '@angular/router';
import {ConfigService} from '../shared/config.service';

declare var jQuery:any;

@Component ({
    selector: 'leftside-bar',
    templateUrl: 'leftside_bar.component.html',
})

export class LeftsideBarComponent {

    public navbarToggle = false;
    public isAuthorized$:BehaviorSubject<any> = new BehaviorSubject(null);
    public activeMenu:string;
    public search_string:string;
    public showMobileSearch = false;
    public activeRouterObs;
    public isPublic:boolean;
    public form1:FormGroup;
    public sub;
    public path = "jobseeker";
    elementRef: ElementRef;

    @Output() change = new EventEmitter();

    constructor(@Inject(ElementRef) elementRef: ElementRef,public fb:FormBuilder,
                public _router: Router,
                public _accountService:AccountService,
                public _activeRoute:ActivatedRoute, public _location: Location) {
        this.elementRef = elementRef;
        let elements1 = {
            search_string:['']
        };
        this.form1 = fb.group(elements1);

        this.form1.controls["search_string"].valueChanges.subscribe(val => {
            this.search_string = val;
        });


    }

    toggleNavbar(e:any,activeMenu:string = "profile"){

        if(this.navbarToggle)
            this.navbarToggle =false;
        else
            this. navbarToggle = true;

        this.change.emit({navbarToggle: this.navbarToggle});
        this.activeMenu = activeMenu;

    }



    ngAfterViewInit() {

        // jQuery(this.elementRef.nativeElement.querySelector('video'))
        //     .mediaelementplayer({
        //         alwaysShowControls: false,
        //         videoVolume: 'horizontal',
        //         features: ['playpause', 'progress', 'volume', 'fullscreen']
        //     });

    }

    ngOnInit() {
        this.sub= this._router.events.subscribe(params => {
            this.isAuthorized$.next(this._accountService.getAuth());
            this.isPublic = (this._location.path().indexOf('/home') != -1);
        });
    }

    logout() {
        this._accountService.getLogOutUser();

    }


    ngOnDestroy() {
        this.sub.unsubscribe();
    }


    onSearch(){
        let pagination_url = {};


        this.activeRouterObs = this._activeRoute.queryParams.subscribe(params => {
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    pagination_url[key] = params[key];
                }
            }

        });
        pagination_url["title"] = this.search_string;


        this._router.navigate([this._accountService.getPath()+'/jobs/all'],{queryParams:pagination_url});
    }

}
