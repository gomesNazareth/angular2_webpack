import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

//Services
import {LoaderService} from "../../shared/services/loader.service";
import {AccountService} from "../account/services/account.service";


declare var jQuery:any;
@Component({

    selector: "country-list",
    templateUrl: "country.component.html"
})


export class CountryComponent implements OnInit {

    public countries$:BehaviorSubject<any> = new BehaviorSubject(null);
    public totalRecords$:BehaviorSubject<any> = new BehaviorSubject(0);
    public loadingFlagList$:BehaviorSubject<any> = new BehaviorSubject(false);
    public currentPage = 1;

    ngOnInit(){
        this._loaderService.getCountries("alphabetical").subscribe(country=> {
            this.countries$.next(country);
        });
    }

    constructor( public _loaderService:LoaderService,public accountService:AccountService) {

    }
}
