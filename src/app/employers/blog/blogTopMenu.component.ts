import { Component, Input } from '@angular/core';
import {AccountService} from "../../core/account/services/account.service";


@Component({

    selector: "blog-topmenu",
    templateUrl: "blogTopMenu.component.html"
})


export class BlogTopMenuComponent {

    @Input() activeFlag = 'blog';
    constructor(public _accountService:AccountService){

    }

}
