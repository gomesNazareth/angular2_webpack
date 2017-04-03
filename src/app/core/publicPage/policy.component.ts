import {Component} from '@angular/core';
import {AccountService} from '../account/services/account.service';


declare var jQuery:any;
@Component({

    selector: "policy",
    templateUrl: "policy.component.html"
})


export class PolicyComponent {

    constructor(public _accountService:AccountService) {



    }
}
