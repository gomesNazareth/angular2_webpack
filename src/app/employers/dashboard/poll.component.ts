import { Directive, Component, OnInit, ElementRef, Inject, AfterViewChecked } from '@angular/core';
import { Title } from '@angular/platform-browser';

//services
import { AccountService } from '../../core/account/services/account.service';




@Component({

    selector: "poll-employer",
    templateUrl: "poll.component.html"
})


export class PollComponent implements OnInit, AfterViewChecked {

    public companyId:number = null;

    public  isPollActive =true;
    public  allPollFlag = false;

    constructor(public _accountService:AccountService){

        if(this.companyId == null){
            this.companyId = this._accountService.getCompanyId();

        }
    }
    ngOnInit():void {



    }

    ngAfterViewChecked():void {
    }

}
