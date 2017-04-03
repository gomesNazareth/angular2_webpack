import {Input, OnInit, EventEmitter, Output,Component} from '@angular/core';
import {FormBuilder, FormGroup, FormControl,Validators} from '@angular/forms';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';


//Service
import {FindFriendService} from './services/findfriend.service';



//Models
import {JobSeekerFriend} from './models/JobSeekerFriend';

//directives

import {Observable} from "rxjs/Observable";

import {SearchNameEmail} from '../../shared/pipes/searchNameEmail';

@Component({

    selector: "find-friends",
    templateUrl: "find_friends.component.html",
    providers:[SearchNameEmail]


})


export class FindFriendComponent implements OnInit {



    ngOnInit() {

        this.friendListObs = this.friendsArr;



    }


    @Input() socialMedia = "";
    @Input() friendsArr = new Array();
    @Output() backbuttonClick = new EventEmitter();

    public searchFriendForm:FormGroup;
    public selectAllFlag = false;
    public postflag = false;
    public errorMessageflag:boolean = false;
    public errorFriendflag:boolean = false;
    public checkedFriendList = new Array();
    public search_text : string = "";
    public filterEmail:SearchNameEmail;
    public result$ = Observable;
    public requestMessage:string = `You have received an invitation from sajeerali Arakka to join BLOOVO. Visit https://www.bloovo.com/

    Thank You
    BLOOVO Team`;
    public friendList:any = Array();
    public friendListObs:any;

    onBack() {
        // this.backbuttonClick.emit({"findfriendFlag": false});
        window.location.href = '/profile/invite-connections';
    }





    public _allFriendSelect(friendList:any)
    {

        if (this.selectAllFlag)
            this.selectAllFlag = false;
        else
            this.selectAllFlag = true;

        friendList.forEach((friend)=> {


            if (this.selectAllFlag)
                friend.checked = true;
            else
                friend.checked = false;
        });

        return friendList;

    }

    InviteFriends() {

        let postData:JobSeekerFriend[] = new Array();

        this.errorMessageflag = false;
        this.errorFriendflag = false;
        if (!this.requestMessage)
            this.errorMessageflag = true;
        else {



            if (this.checkedFriendList.length > 0) {
                this.postflag = true;

                this._findFriendService.postFriendList(this.checkedFriendList, this.requestMessage, this.socialMedia).subscribe(res => {
                    if(res["message"] == "Success") {
                        window.location.href = "/profile/invite-connections?sent=success"
                    }

                })

            }
            else {
                this.errorFriendflag = true;
            }


        }
    }

    public addRemoveAll(newValue) {

        if(newValue) {
            this.checkedFriendList = this.friendsArr;
        }else{
            this.checkedFriendList = [];
        }

    }

    public searchContacts(newValue:string) {
        this.friendsArr = this.filterEmail.transform(this.friendListObs, newValue);

        if(this.selectAllFlag) {
            this.checkedFriendList = this.friendsArr;
        }
    }

    public addRemoveFriend(id:any) {

        let indx = this.checkedFriendList.indexOf(id);
        if(indx!= -1) {
            this.checkedFriendList.splice(indx,1);
        }
        else {
            this.checkedFriendList.push(id);
        }

    }

    public _buildCheckedFriendList(data)
    {
        data.forEach(val=>{

            if(val.checked){

                this.checkedFriendList.push(val.id);
            }
            else {

                let indx = this.checkedFriendList.indexOf(val.id);
                if(indx!= -1) {
                    this.checkedFriendList.splice(indx,1);
                }

            }
        });

        return data;
    }



    constructor(public fb:FormBuilder,public _findFriendService:FindFriendService, public _filterEmail:SearchNameEmail) {

        this.filterEmail = _filterEmail;
        let searchFriend = {
            search_friend:['',Validators.required],
            check_all:['',Validators.required]
        }

        // this._findFriendService.getFriends().subscribe(res => {
        //
        //     console.log(res);
        // });

        this.searchFriendForm = fb.group(searchFriend);

        let typeEvent = this.searchFriendForm.controls["search_friend"].valueChanges;
        let clickEvent = this.searchFriendForm.controls["check_all"].valueChanges;

        let loadEvent = new BehaviorSubject(null);
        this.friendListObs =
            Observable.merge(
            typeEvent,
            clickEvent,
            loadEvent
        )
        .switchMap(query => this._findFriendService.getFriendList(this.socialMedia,query))
        .map(res=> this._buildCheckedFriendList(res));
    }
}
