import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';

import {FindFriendService} from './services/findfriend.service';
import {ActivatedRoute,Router} from '@angular/router';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AccountService} from "../account/services/account.service";

import {BasicValidators} from "../../shared/validators/basicValidators";

@Component({

    selector: "invite-friend",
    templateUrl: "inviteFriend.component.html"


})


export class InviteFriendComponent {

    public emailForm:FormGroup;


    public loader:boolean = false;
    public findfriendFlag:boolean = false;
    public findfriendFlag$:BehaviorSubject<any> = new BehaviorSubject(false);
    public sent$:BehaviorSubject<any> = new BehaviorSubject(false);

    public socialMedia:string;
    public emails_str:string;
    public email_body:string;
    public friendList:any = new Array();
    public friendsArr:any = new Array();
    public show_errors:boolean = false;
    public queryParams$:any;


    constructor(fb:FormBuilder,
                private _activeRoute:ActivatedRoute,
                private _router:Router,
                private _accountService:AccountService,
                private _findFriends:FindFriendService) {
        let emailVal = {
            email_name: ['', BasicValidators.email],
            email_textbox: ['', Validators.required]
        };
        this.emailForm = fb.group(emailVal);


    }



    ngOnInit():any {
        this.findfriendFlag$.next(false);
        this.queryParams$ = this._activeRoute.queryParams.subscribe(params => {


            if(params["invite_contact_id"] && params["provider"]){

                this.onGetFriends(params["provider"], params["invite_contact_id"]);
            }else if(params["sent"] == "success") {
                // code...

                this.sent$.next(true);
            }
        });


    }

    ngOnDestroy() {
        this.queryParams$.unsubscribe();
    }

    onGetFriends(socialMedia:string, inviteContactId:string) {


        this._findFriends.getFriendList(socialMedia, inviteContactId).subscribe(res => {
            this.friendsArr = res["user_invitations"];

            this.socialMedia = socialMedia;
            this.findfriendFlag = true;
            this.findfriendFlag$.next(true);

        });
    }

    onFindFriend(socialMedia:string) {
        window.location.href  = this._findFriends.getFriends(socialMedia);
    }


    onBackClick($event) {


        if (!$event.findfriendFlag) {
            this.findfriendFlag = false;
        }
    }

    sendEmail() {
        if (this.emailForm.valid) {
            this.loader = true;

            var receivers : string[] = this.emails_str.split(",");
            let receivers_obj : any = new Array();
            for (var i = 0; i < receivers.length; i++) {
                // code...
                receivers_obj.push({name: "", email: receivers[i]})
            }

            this._findFriends.postFriendList(receivers_obj, this.email_body, "Email").subscribe(res => {
                if(res["message"] == "Success") {
                    this.loader = false;
                    this._router.navigate( ['/'+this._accountService.getPath()+'/profile/invite-connections'],{queryParams: {sent:'success'}});
                }

            })

        }
        else {
            this.show_errors = true;
        }
    }


}
