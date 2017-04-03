import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {AccountService} from "../../core/account/services/account.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";



declare var jQuery:any;
@Component({

    selector: "list-blogs",
    templateUrl: "listBlog.component.html"

})


export class ListBlogComponent implements OnInit {

    public isAuthorized$:BehaviorSubject<any> = new BehaviorSubject(null);

    ngOnInit() {
        this.isAuthorized$.next(this._accountService.getAuth());
    }

    constructor(public _accountService:AccountService) {


        }

}
