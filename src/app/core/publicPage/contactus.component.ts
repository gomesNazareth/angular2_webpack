import {Component} from '@angular/core';
import {AccountService} from '../account/services/account.service';

declare var jQuery:any;
@Component({

    selector: "contactus",
    templateUrl: "contactus.component.html"
})


export class ContactusComponent {

    constructor(public _accountService:AccountService) {

    }
}
