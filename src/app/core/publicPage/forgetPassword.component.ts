import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup } from '@angular/forms';
import {BasicValidators} from '../../shared/validators/basicValidators';
import {AccountService} from '../account/services/account.service';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';

declare var jQuery:any;
@Component({

    selector: "forget-password",
    templateUrl: "forgetPassword.component.html"
})


export class ForgetPasswordComponent implements OnInit {

    public forgetForm:FormGroup;
    public pristineFlag$:BehaviorSubject<any>= new BehaviorSubject(true);
    public errorMessage = null;
    public successMessage = null;

    constructor(public _accountService:AccountService, public _fb:FormBuilder) {

    }

    ngOnInit() {
        this.forgetForm = this._fb.group({
            email: ["",BasicValidators.email]
        });
    }

    submitEmail() {
        this.pristineFlag$.next(false);

        if (this.forgetForm.valid) {
            let postData = {
                user: {
                    email: this.forgetForm.value['email']
                }
            };

            this._accountService.sendForgetPasswordEmail(postData).subscribe(res => {
                this.successMessage = "An Email has been sent to you to reset your password.";
                this.errorMessage = null;
                this.pristineFlag$.next(true);
            }, error => {
                var errorJson = JSON.parse(error["_body"]);

                this.errorMessage = errorJson["user"]["error"];
                this.successMessage = null;
                this.pristineFlag$.next(true);
            })
        }
    }
}
