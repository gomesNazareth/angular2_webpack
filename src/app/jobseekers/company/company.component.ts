import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Title } from '@angular/platform-browser';

//service
import {ConfigService} from '../../shared/config.service'

import {ActivatedRoute} from '@angular/router';
import {AccountService} from "../../core/account/services/account.service";

@Component({

    selector: "company-listing",
    templateUrl: "company.component.html"
})


export class CompanyComponent implements OnInit {

    //Flags
    public allCompaniesFlag:boolean = true;
    public mostFollowedCompaniesFlag:boolean = false;
    public companyDetailsFlag:boolean = false;
    public postMode:string = "all";

    //Variables
    public companyId:number;
    public fromPage:string;
    public currentPage:number =1;
    public currentPageObs:BehaviorSubject<any> = new BehaviorSubject(1);
    public isAuthorized$:BehaviorSubject<any> = new BehaviorSubject(null);
    public activeRouterObs;
    public isPublic:boolean;


    ngOnDestroy() {
        this.activeRouterObs.unsubscribe();
    }

    ngOnInit() {

        this.isPublic = true;


        this.activeRouterObs = this._activeRoute.queryParams.subscribe(params=>{
            // let order = params["order"];
            this.isAuthorized$.next(this._accountService.getAuth());

            // Page
            this.currentPage = (params['page'])?params['page']:1;
            this.currentPageObs.next(this.currentPage);
        });



        this._activeRoute.params.subscribe(params => {
            let id = params['id'];

            if(id)
            {
                this.onClickCompanyDetail({id:id,fromPage:'all'});
            }
        });

        this._activeRoute.url.subscribe(urls => {
            if (urls && urls.length > 0 && urls[0].path == 'top-followed-companies') {
                this.onSelectFollowedCompanies();
            }
        })
    }


    onSelectAllCompanies() {
        this.allCompaniesFlag = true;
        this.postMode ="all";
        this.mostFollowedCompaniesFlag = false;
        this.companyDetailsFlag = false;
    }

    onSelectFollowedCompanies() {
        this.allCompaniesFlag = false;
        this.postMode ="top";
        this.mostFollowedCompaniesFlag = true;
        this.companyDetailsFlag = false
        ;
    }


    public onClickBack($event) {


        if ($event.type) {
            if ($event.type == "allCompanies") {
                this.onSelectAllCompanies();
            }
            else if ($event.type == "topFollowCompanies") {
                this.onSelectFollowedCompanies()
            }
            else {

                this.onSelectAllCompanies();
            }
        }
    }


    public onClickCompanyDetail($event) {


        if ($event.id) {
            this.companyId = $event.id;
            this.fromPage = $event.fromPage;

        }

        this.allCompaniesFlag = false;
        this.mostFollowedCompaniesFlag = false;
        this.companyDetailsFlag = true;
    }

    constructor(public _activeRoute:ActivatedRoute,public _title:Title,public _accountService:AccountService) {

        this._title.setTitle(ConfigService.titles["companies"]);
    }
}
