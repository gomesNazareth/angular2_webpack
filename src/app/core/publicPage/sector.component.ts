import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

//Services
import {LoaderService} from "../../shared/services/loader.service";
import {AccountService} from "../account/services/account.service";



declare var jQuery:any;
@Component({

    selector: "sector-list",
    templateUrl: "sector.component.html"
})


export class SectorComponent implements OnInit {

    public sectors$:BehaviorSubject<any> = new BehaviorSubject(null);
    public totalRecords$:BehaviorSubject<any> = new BehaviorSubject(0);
    public loadingFlagList$:BehaviorSubject<any> = new BehaviorSubject(false);
    public currentPage = 1;

    ngOnInit(){
        this._loaderService.getSectors().subscribe(sectors=> {
            this.sectors$.next(sectors);
        });
    }

    constructor( public _loaderService:LoaderService,public accountService:AccountService) {

    }
}
