import {Component} from '@angular/core';
import {AccountService} from '../account/services/account.service';


declare var jQuery:any;
@Component({

    selector: "terms",
    templateUrl: "terms.component.html"
})


export class TermsComponent {

    constructor(public _accountService:AccountService) {

    }
}
