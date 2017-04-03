import { Component, Input } from '@angular/core';
import {AccountService} from "../../core/account/services/account.service";

@Component({
    
    selector: "emp-profile-topmenu",
    templateUrl: "topMenu.component.html"
})

export class TopMenuComponent {

    @Input() activeFlag = 'profile';
    constructor(public _accountService:AccountService){
    }

}
