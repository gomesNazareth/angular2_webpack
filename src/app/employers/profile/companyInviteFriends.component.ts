import {Directive, Component, OnInit, ElementRef, Inject, AfterViewChecked} from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

//services
import {AccountService} from '../../core/account/services/account.service';


@Component({

    selector: "company-invite-friends",
    templateUrl: "companyInviteFriends.component.html"
})


export class CompanyInviteFirendsComponent implements OnInit, AfterViewChecked {

    public companyId: number = null;
    public queryParamsObs;

    constructor(public _accountService: AccountService, public _activeRoute: ActivatedRoute,public _router:Router) {

        if (this.companyId == null) {
            this.companyId = this._accountService.getCompanyId();

        }


        this.queryParamsObs = this._activeRoute.queryParams.subscribe(qparams => {

            if(!this._accountService.getInviteFriends())
            this._router.navigate(['/'+this._accountService.getPath()+'/profile'])
        });
    }


    ngOnDestroy() {
        this.queryParamsObs.unsubscribe();
    }


    ngOnInit(): void {


    }

    ngAfterViewChecked(): void {
    }

}
