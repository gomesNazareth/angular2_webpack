import {Component, OnInit} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AccountService} from '../account/services/account.service';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';

declare var jQuery:any;
@Component({

    selector: "change-password",
    templateUrl: "changePassword.component.html"
})


export class ChangePasswordComponent implements OnInit {

    public changePasswordForm:FormGroup;
    public pristineFlag$:BehaviorSubject<any>= new BehaviorSubject(true);
    public errorMessage = null;
    public successMessage = null;
    public passwordToken:string = null;
    public email:string = null;

    constructor(public _accountService:AccountService, public _fb:FormBuilder, public _activeRoute: ActivatedRoute) {

    }

    ngOnInit() {
        this.changePasswordForm = this._fb.group({
            password: ["",Validators.required],
            password_confirmation: ["",Validators.required]
        });

        this._activeRoute.queryParams.subscribe(params => {
            this.passwordToken = params["reset_password_token"];
            this.email = params["email"];
        });
    }

    changePassword() {
        this.pristineFlag$.next(false);

        if (this.changePasswordForm.valid) {
            let postData = {
                user: {
                    password: this.changePasswordForm.value['password'],
                    password_confirmation: this.changePasswordForm.value['password_confirmation'],
                    reset_password_token: this.passwordToken
                }
            };

            this._accountService.changePassword(postData).subscribe(res => {
                this.successMessage = "Your Password is Changed Successfully.";
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
