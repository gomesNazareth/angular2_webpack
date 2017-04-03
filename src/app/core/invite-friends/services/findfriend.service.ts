import {Injectable,Inject} from '@angular/core';
import {Http} from '@angular/http';
import {ConfigService} from '../../../shared/config.service';
import {Observable} from 'rxjs/Observable';

import {AccountService} from  '../../../core/account/services/account.service';
import {ActivatedRoute} from '@angular/router';


//Models
import {JobSeekerFriend} from '../models/JobSeekerFriend';

@Injectable()
export class FindFriendService {

    public _url = "friends.html";
    public _url_gmail = "/contacts/gmail";
    public _url_get_contacts = "user_invitations/get_contacts";
    public _url_accounts = {
        "gmail": "/contacts/gmail",
        "yahoo": "/contacts/yahoo",
        "outlook": "/contacts/outlook",
        "twitter": "/auth/twitter?use_authorize=true",
    }
    public _url_sendfriend_request = "/user_invitations/invite_by_email";
    public _url_invite_by_twitter = "/user_invitations/invite_by_twitter";
    public selectAllFlag = false;
    public queryParams$;

    public AuthHeader;
    public AuthHeader2;
    public AuthHeaderPdf;
    public AuthHeader3;
    public userId;
    public twitter_key;
    public twitter_secret;


    constructor(public _http:Http, public _activeRoute:ActivatedRoute,@Inject(AccountService) authService:AccountService) {

        this.AuthHeader = authService.AuthHeader();
        this.AuthHeader2 = authService.AuthHeader2();
        this.AuthHeaderPdf = authService.AuthHeaderPDF()
        this.AuthHeader3 = authService.AuthHeader3();
        this.userId = authService.getUserId();
        this.queryParams$ = this._activeRoute.queryParams.subscribe(params => {


            if(params) {
                // code...
                this.twitter_key = params["twitter_key"];
                this.twitter_secret = params["twitter_secret"];

            }
        });
    }




    public _bindFriendList(friends,flag): JobSeekerFriend[]
    {



        let friendList = new Array();


        if(flag !== true && flag !== false)
        {
            friends.forEach((friend)=> {

                let selfriend = new JobSeekerFriend();
                selfriend.id = friend.id;
                selfriend.name = friend.name;
                selfriend.image = friend.image;
                friendList.push(selfriend);

            });
            return friendList;
        }
        else
        {


                this.selectAllFlag = flag;

            friends.forEach((friend)=> {


                if (this.selectAllFlag)
                    friend.checked = true;
                else
                    friend.checked = false;
            });

            return friends;
        }



    }

    public getFriends(socialMedia:string):string {

        let url = ConfigService.getDomain() + this._url_accounts[socialMedia];

        return url;

    }

    public getFriendList(socialMedia:string,inviteContactId:string) : Observable<JobSeekerFriend[]>{
        //TO DO : socialMedia must go in the header
        let url = ConfigService.getAPI() + this._url_get_contacts + "?invite_contact_id=" + inviteContactId + "&provider=" + socialMedia;
        return this._http.get(url, this.AuthHeader)
            .map(res => res.json());
    }



    public postFriendList(receivers :JobSeekerFriend[],message_body:string, provider:string): Observable<any[]> {


        let postArry = {"receivers":receivers,"message_body": message_body, "template_type": "invite_jobseeker"};
        let url = ConfigService.getAPI();

        if(provider == "twitter") {
            // code...
            url = url + this._url_invite_by_twitter;
            let _activeRoute = new ActivatedRoute();
            postArry["twitter_key"] = this.twitter_key;
            postArry["twitter_secret"] = this.twitter_secret;
        }else{
            url = url + this._url_sendfriend_request;
        }

        return this._http.post(url, JSON.stringify({"user_invitation": postArry}),this.AuthHeader2)
            .map(res => res.json())


    }
}
