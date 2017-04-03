import {Component} from '@angular/core';
import {AccountService} from '../account/services/account.service';

declare var jQuery:any;
@Component({

    selector: "about",
    templateUrl: "about.component.html"
})


export class AboutComponent {

    constructor(public _accountService:AccountService) {

    }
}
