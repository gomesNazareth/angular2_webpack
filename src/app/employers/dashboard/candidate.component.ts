import { Directive, Component, OnInit, ElementRef,OnDestroy, Inject, AfterViewChecked } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router'


//services
import { AccountService } from '../../core/account/services/account.service';




@Component({

    selector: "candidate-emp-dashboard",
    templateUrl: "candidate.component.html"
})


export class CandidateComponent implements OnInit, AfterViewChecked ,OnDestroy {

    public companyId:number = null;
    public candidateId:number = null;

    public queryParamsObs;


    constructor(public _accountService:AccountService,public _activeRoute:ActivatedRoute){

        if(this.companyId == null){
            this.companyId = this._accountService.getCompanyId();
        }
    }

    ngOnDestroy(){
        this.queryParamsObs.unsubscribe();
    }
    ngOnInit():void {

        this.queryParamsObs=  this._activeRoute.queryParams.subscribe(res=>{

            this.candidateId = res["id"];
        })



    }




    ngAfterViewChecked():void {
    }

}
