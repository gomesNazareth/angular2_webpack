import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import {Location} from '@angular/common';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Router,ActivatedRoute} from '@angular/router';

//Services
import { AccountService } from '../../core/account/services/account.service';
import {CompanyService} from "../../core/services/company.service";


declare var jQuery:any;
@Component({

    selector: "company-users",
    templateUrl: "companyUsers.component.html"

})


export class CompanyUsersComponent implements OnInit {


    public companyUsersObs:BehaviorSubject<any> = new BehaviorSubject(null);
    public totalRecords$:BehaviorSubject<any> = new BehaviorSubject(0);
    public activeRouterObs;
    public currentPage:number =1;
    public userList = [];
    public errorMessage = "Sorry User Cannot be Deleted";
    public errorFlag = false;


    loadUsers(currentPage){

        this._companyService.getCompanyUsers(this._accountService.getCompanyId(),this.currentPage).subscribe(res => {

            this.userList = res;
            this.companyUsersObs.next(this.userList);
            this.totalRecords$.next(res["meta"]["total_count"]);
        })
    }

    ngOnInit() {



        //URL Params Fetch
        this.activeRouterObs = this._activeRoute.queryParams.subscribe(params => {
            this.companyUsersObs.next(null);
            this.currentPage = (params["page"])?params["page"]:1;
            this.loadUsers(this.currentPage);
        });

    }

    ngOnDestroy(){

        this.activeRouterObs.unsubscribe();
    }


    deleteUser(userId:number,userIndex:number){

        this._companyService.getDeleteCompanyUser(userId).subscribe(res => {


            this.userList["users"].splice(userIndex,1);

            this.companyUsersObs.next(this.userList);
            this.totalRecords$.next(res["meta"]["total_count"]);
            jQuery('.close_delete').modal('hide');

            if(this.userList["users"].length == 0 && this.currentPage > 1)
            {
                this.currentPage--;
                this._router.navigate(['/'+this._accountService.getPath()+'profile/users'], { queryParams: {page:this.currentPage} });
            }

        },error=>{

            this.errorFlag = true;
            Observable.timer(2000).subscribe(val=>{
                this.errorFlag = false;
            });

        });
    }

    constructor(public _accountService:AccountService,public fb:FormBuilder, public _companyService:CompanyService,public _activeRoute:ActivatedRoute,public _router:Router) {

    }


}
