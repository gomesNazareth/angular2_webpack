import {Component, DoCheck, AfterViewChecked} from '@angular/core';
import {Location} from '@angular/common'
import {Router} from '@angular/router'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {AccountService} from "../core/account/services/account.service";
import {ConfigService} from "../../shared/config.service";


@Component({
    moduleId: module.id,
    selector: "footer-bar",
    templateUrl: "footer_bar.component.html"
})


export class FooterBarComponent implements AfterViewChecked {
	public loadData$:BehaviorSubject<any> = new BehaviorSubject(false);
	public isHome$:BehaviorSubject<any> = new BehaviorSubject(null);
	public isAuthorized$:BehaviorSubject<any> = new BehaviorSubject(false);
	public sub;
	public publicRoutes = ConfigService.publicRoutes;

	constructor(public _accountService:AccountService,public _location:Location,public _router:Router) {

		this.sub = this._router.events.subscribe(params => {

			this.isHome$.next(this.publicRoutes.includes(this._location.path()));
			this.isAuthorized$.next(this._accountService.getAuth());
		});
	}

	ngOnDestroy() {
	        this.sub.unsubscribe();
	        }


    ngAfterViewChecked() {
    	let loading = document.getElementsByClassName("load-data-js");
    	if(loading && loading.length > 0) {
    		this.loadData$.next(true);
    	}
    }
}
