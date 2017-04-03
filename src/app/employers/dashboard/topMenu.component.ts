import { Component, Input } from '@angular/core';


//services
import { AccountService } from '../../core/account/services/account.service';

@Component({

    selector: "emp-profile-topmenu",
    templateUrl: "topMenu.component.html"
})


export class TopMenuComponent {

    @Input() activeFlag = 'profile';
    public showFlag:boolean = null;

    constructor(public _accountService:AccountService)
    {

        this._accountService.getActiveEmployerPermissionList().subscribe(res =>{
            if(res.indexOf('search_jobseekers') != -1) {
                this.showFlag = true
            }
            else{
                this.showFlag= false;
            }
        });
    }

}
