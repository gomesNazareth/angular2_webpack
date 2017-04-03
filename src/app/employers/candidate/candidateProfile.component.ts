import { Directive, Component, OnInit, ElementRef,OnDestroy, Inject, AfterViewChecked } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router'


//services
import { AccountService } from '../../core/account/services/account.service';




@Component({

    selector: "candidate-emp-profile",
    templateUrl: "candidateProfile.component.html"
})


export class CandidateProfileComponent implements OnInit, AfterViewChecked ,OnDestroy {

    public companyId:number = null;
    public candidateId:number = null;
    public jobId:number = null;

    public appliedFlag:boolean = true;
    public queryParamsObs;
    public paramsObs;


    constructor(public _accountService:AccountService,public _activeRoute:ActivatedRoute){

        if(this.companyId == null){
            this.companyId = this._accountService.getCompanyId();
        }
    }

    ngOnDestroy(){
        this.queryParamsObs.unsubscribe();
        this.paramsObs.unsubscribe();
    }
    ngOnInit():void {

        this.paramsObs = this._activeRoute.params.subscribe(selParams => {

            this.candidateId = selParams["id"];
            this.queryParamsObs=  this._activeRoute.queryParams.subscribe(res=>{

                if(res["job_id"]){
                    this.jobId = res["job_id"];
                }
            })

        })




    }




    ngAfterViewChecked():void {
    }

}
