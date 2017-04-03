import {Http, Headers} from '@angular/http';
import {ConfigService} from '../../../shared/config.service';

import {Injectable,Inject} from '@angular/core';
import {Location} from '@angular/common';

import {Observable} from 'rxjs/Rx';
import { Router,ActivatedRoute } from '@angular/router';
import {ProfileService} from '../../../core/services/profile.service';

//Service
import {CookieService} from '../../../core/services/cookie.service';

//Models
import {Account} from "../models/account";

import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {ErrorHandling} from "../../services/errorHandling.service";

@Injectable()
export class AccountService {

  public _url = "users/";
  public _forget_password_email_url = "users/generate_new_password_email";
  public _change_password_url = "users/password";
    public static profileCache : any = null;
    public static switchFlag : boolean = false;
    public static firstLoadFlag : boolean = true;
    public static profileCacheDirty :boolean = true;
    public static profileHeader : any = null;
    public static googleLoaded:boolean = false;
    public static rememberme:boolean = false;
    public isPublic : boolean;
    public sub;

    constructor(public _http: Http, public router: Router, public location: Location,
                @Inject(CookieService) public  _cookieService: CookieService,
                @Inject(ErrorHandling) public  _errorHandling: ErrorHandling) {
        this.sub = this.router.events.subscribe(params => {
            this.location = location;
            this.isPublic = this.location.path().indexOf('/home/') != -1;

            if(this.location.path().indexOf('/'+ConfigService.jobseekerPath+'/') != -1 || this.location.path().indexOf('/employer/') != -1){


                // If jobseeker then keep preloader active
                if(this.getFistLoadFlag() == true && this.location.path().indexOf('/profile') != -1 && this.location.path().indexOf('/employer/') == -1){
                    this.setSwitchPage(true);
                }
                else {
                    Observable.timer(1500).subscribe(val=>{
                        this.setSwitchPage(false);
                    })
                }
            }
        });

    }


    getIfValidEmail(emailId= ''){
        let url =   ConfigService.getAPI()+'users/valid_email';
        let postParams = {"user": {"email": emailId}};

        let headers = new Headers();
        headers.append('Content-Type', "application/json");

        return this._http.post(url,JSON.stringify(postParams),{headers: headers}).map(res=>res.json());
    }


    getSwitchOffLoader(){
        this.setSwitchPage(false);
        this.setFistLoadFlag(false);
    }

    setFistLoadFlag(modeFlag:boolean = true) {
        AccountService.firstLoadFlag = modeFlag;
    }

    getFistLoadFlag() {
        return AccountService.firstLoadFlag;
    }

    getSwitchPage() :boolean {
         return AccountService.switchFlag;
    }

    setSwitchPage(modeFlag:boolean = true){
        AccountService.switchFlag = modeFlag;
    }

    getProfileComplete() : any {

        if(this.getCheckEmployer()){
            return true;
        }
        else{
            if(!AccountService.profileCache){
                return false;
            }
            else {
                let profile = AccountService.profileCache;
                if(profile["current_step"] != 3){
                    return false;
                }
                else
                    return true;
            }
        }

    }


    sendForgetPasswordEmail (postData:any) {
        return this._http.post(ConfigService.getAPI() + this._forget_password_email_url, postData).map(res => res.json());
    }

    changePassword (postData:any) {
        return this._http.put(ConfigService.getAPI() + this._change_password_url, postData).map(res => res.json());
    }



    getMakeSwitch(){
        this.setSwitchPage(true);
    }

    getLoginUser(userCredentials) {

        // ToDo: This section  uses the  static auth key.This will prevent a new auth key from being produced . (bloovo.co using a static auth key)
        let username : string = userCredentials.username.trim();
        let password : string = userCredentials.user_password;
        let rememberme : string = userCredentials.rememberme;
        let headers = new Headers();

        //ToDo: This section will be activated once logic section has been implememted

        // Not used for the time being
        headers.append("Authorization", "Basic " + btoa(username + ":" + password));
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        return this._http.post(ConfigService.getAPI()+this._url+'sign_in','', {headers: headers})
            .map(res=>res.json())
            .map(res=> {

                if(res["auth_token"])
                {

                    if(rememberme){
                        AccountService.rememberme = true;
                        this._cookieService.setCookie('authKey',res["auth_token"]);
                    }
                    else {
                        this._cookieService.setCookie('authKey',res["auth_token"], ConfigService.expiremin);

                    }
                    let cvalue = this.getAuthToken();
                    // localStorage.setItem('authKey', res["auth_token"]);
                    localStorage.setItem('user_name', userCredentials.username);
                    localStorage.setItem('userId',res["user_id"]);
                    localStorage.setItem('company_id', res["company_id"]);
                    localStorage.setItem('employer_id', res["employer_id"]);
                    localStorage.setItem('permissions', res["permissions"]);
                    localStorage.setItem('role', res["role"]);

                    this.loadProfile();
                    if(res["role"] == "jobseeker") {
                        console.log('/'+ConfigService.jobseekerPath+'/profile');
                        this.router.navigateByUrl('/'+ConfigService.jobseekerPath+'/profile');
                            this.getMakeSwitch();
                    }
                    else {
                        this.router.navigateByUrl('/employer/profile');
                            this.getMakeSwitch();

                    }
                }
                return true;

            });
    }



    getManageBlog() {
        let permissions = this.getPermissions();
        if (permissions.indexOf("manage_blog") == -1) {
            return false;
        }
        else {
            return true;
        }
    }


      getCreateBlog() {
          let permissions = this.getPermissions();
        if (permissions.indexOf("create_blog") == -1) {
            return false;
        }
        else {
            return true;
        }
    }


      getSearchJobSeekers() {
          let permissions = this.getPermissions();
        if (permissions.indexOf("search_jobseekers") == -1) {
            return false;
        }
        else {
            return true;
        }
    }

      getDestroyJob() {
          let permissions = this.getPermissions();
        if (permissions.indexOf("destroy_job") == -1) {
            return false;
        }
        else {
            return true;
        }
    }


      getPermissions(){
        return (localStorage.getItem("permissions"))?localStorage.getItem("permissions").split(','):[];
      }

      getJobApplicationStatus() {
        let permissions = this.getPermissions();
        if (permissions.indexOf("edit_job_application_status") == -1) {
            return false;
        }
        else {
            return true;
        }
    }

      getCreateJob() {
          let permissions = this.getPermissions();
        if (permissions.indexOf("create_job") == -1) {
            return false;
        }
        else {
            return true;
        }
    }




      getCompanyUser(){

          if(localStorage.getItem("role") == "company_user"){
              return true;
          }
          else {
              return false;
          }
      }

      getCompanyOwner(){

          if(localStorage.getItem("role") == "company_owner"){
              return true;
          }
          else {
              return false;
          }
      }

      getInviteFriends() {
          let permissions = this.getPermissions();
        if (permissions.indexOf("invite_connection") == -1) {
            return false;
        }
        else {
            return true;
        }
    }

    getEditCompany() {
        let permissions = this.getPermissions();

        if (permissions.indexOf("edit_company") == -1) {
          return false;
        }else {
          return true;
        }
    }

    getAuthToken() {
        return this.getAuthKey()
    }


    public loadProfile() {
        if (this.getAuth()) {
            if (this.getCheckEmployer()) {

                this.getEmployerProfile().subscribe(res => { }, err => {
                   this._errorHandling.errorHandling(err);
                })
            }
            else {

                this.getJobseekerProfile().subscribe(res => {}, err => {
                    this._errorHandling.errorHandling(err);
                })
            }
        }
    }

    public getEmployerProfile(): Observable<any[]> {

        let url = ConfigService.getAPI() + 'company_users/' + this.getEmployerId() + '/employer_details';

        return this._http.get(url, this.AuthHeader())
            .map(res => {
                let profile = res.json();
                let full_name = profile["user"]["first_name"] + " " + profile["user"]["last_name"];
                let company_name = profile["user"]["company"]["name"];
                this.setProfileHeader(full_name, profile["user"]["company"]["avatar"],company_name);
                return profile;
            });
    }

    public getJobseekerProfile() : Observable<any[]>{

        let url =   ConfigService.getAPI()+'jobseekers/'+this.getUserId()+'/display_profile';
        return this._http.get(url, this.AuthHeader())
            .map(res => {


                let profile = res.json();

                if(profile == null){
                    this.router.navigate(['/unauthorized']);
                }

                AccountService.profileCache = profile;

                let full_name = profile["first_name"] + " " + profile["last_name"];
                this.setProfileHeader(full_name, profile["avatar"]);
                return profile;
            })

    }


    getProfileHeader() : any {
        if(AccountService.profileHeader == null || AccountService.profileCacheDirty == true ) {
            AccountService.profileHeader = {}
            AccountService.profileCacheDirty = false;
            this.loadProfile();
        }
        return AccountService.profileHeader;
    }

    setProfileHeader(full_name:string, avatar:string,company_name =""){
        let names = full_name.split(" ");
        AccountService.profileHeader = {
            full_name: full_name,
            company_name: company_name,
            avatar: avatar,
            first_name: names[0],
            last_name: names[1]
        };
    }


    getSpaceToDash(title:string){

          return title.trim().replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, '-');

    }

    getPath(){

        if (this.isPublic) {
            return 'home';
        }

        if(localStorage.getItem('role') == "jobseeker")
            return ConfigService.jobseekerPath;
        else
            return "employer";
    }

    getUserType() {

        if (localStorage.getItem('role') == null || localStorage.getItem('role') == undefined) {
            return "home";
        }
        else if(localStorage.getItem('role') == "jobseeker"){
            return "jobseeker";
        }
        else{
            return "employer";
        }
    }


    getEmployerDetails(id) : Observable<any>{

        let url = ConfigService.getAPI()+'company_users/'+id+'/employer_details';

       return this._http.get(url,this.AuthHeader()).map(res=>res.json());


    }


    getDeactivate():Observable<any[]> {

        let postList = '';
        return this._http.put(ConfigService.getAPI()+this._url+this.getUserId()+'/deactivate',postList ,this.AuthHeader2())
            .map(res=>res.json());

    }

    getNotification():Observable<any[]> {

        let url = ConfigService.getAPI()+this._url+this.getUserId()+'/get_notification';
        let header  = this.AuthHeaderSpl();
        return this._http.get(url,header)
            .map(res => res.json())
            .map(res => res["notification"]);

    }


    getEmployerUserDetails(employerId){

        let url = ConfigService.getAPI()+'company_users/'+employerId;
        let header  = this.AuthHeaderSpl();
        return this._http.get(url,header).map(res => res.json());


    }

    getActiveEmployerPermissionList():Observable<any>  {

        if(localStorage.getItem('permissions')){
            return Observable.of(localStorage.getItem('permissions'));
        }
        else
        {
            return this.getEmployerUserDetails(this.getEmployerId()).map(res=>{
                localStorage.setItem('permissions', res["user"]["permissions"]);
                return res["user"]["permissions"];  });

        }

    }


    deleteProfileVideo():Observable<any[]>  {

        let authHeader =this.AuthHeader3();
        return this._http.delete(ConfigService.getAPI()+this._url+this.getUserId()+'/delete_video/',authHeader).
        map(res=>res.json());
    }

    deleteProfileImage():Observable<any[]>  {

        let authHeader =this.AuthHeader3();
        return this._http.delete(ConfigService.getAPI()+this._url+this.getUserId()+'/delete_video/',authHeader).
        map(res=>res.json());
    }


    getUpdateNotifications(notificationObj:any):Observable<any[]> {


        let postList = JSON.stringify({notification: notificationObj});

        return this._http.put(ConfigService.getAPI()+this._url+this.getUserId()+'/update_notification',postList ,this.AuthHeader2())
            .map(res=>res.json());
    }

    getUpdateNewsLetter(flag:boolean):Observable<any[]> {

        let postList = JSON.stringify({notification:{newsletter:flag}});

        return this._http.put(ConfigService.getAPI()+this._url+this.getUserId()+'/update_notification',postList ,this.AuthHeader2())
            .map(res=>res.json());
    }



    getUpdateCredentials(values):Observable<any[]> {

        let postList = JSON.stringify({user:{email:values["username"],current_password:values["current_password"],password:values["new_password"],password_confirmation:values["new_password2"]}});


        return this._http.put(ConfigService.getAPI()+this._url+this.getUserId(),postList ,this.AuthHeader2())
                    .map(res=>res.json());

    }


    getLogOutUser() {

        this.getMakeSwitch();
        this._errorHandling.getLogOutUser();
    }


    getErrorCheck(error){
        this._errorHandling.errorHandling(error);
    }

    getAuth():boolean{
        return this._cookieService.cookieExisits('authKey');
    }

    getUsername() {

        return  localStorage.getItem('user_name');

    }

    getCheckEmployer(){
        if(localStorage.getItem('role') == "jobseeker")
            return false;
        else
            return true;
    }

    getCompanyId() {
        return parseInt(localStorage.getItem('company_id'));
    }



    getEmployerId(){
        return parseInt(localStorage.getItem('employer_id'));
    }

    getUserId() {

        return parseInt(localStorage.getItem('userId'));
    }

    getAuthKey() {

        if(this._cookieService.getCookie('authKey') == ""){
            this._errorHandling.getClearStorage();
            this.setSwitchPage(false);
        }
        else {
            this. getRefreshCookie();
        }
        return this._cookieService.getCookie('authKey');
    }



    getRefreshCookie(){

        if(!AccountService.rememberme)
        this._cookieService.setCookie('authKey',this._cookieService.getCookie('authKey'), ConfigService.expiremin);

    }

    getClearStorage(){

        this._errorHandling.getClearStorage();
    }


    AuthHeader() {


        let headers = new Headers();
        headers.append('Authorization', this.getAuthKey());
        // headers.append('Content-Type', "application/json");
        return {headers: headers};
    }

    AuthHeaderSpl() {
        let headers = new Headers();
        headers.append('Authorization', this.getAuthKey());
        // headers.append('Content-Type', "application/json");
        return {headers: headers};
    }


    AuthHeaderPDF() {
        let headers = new Headers();
        headers.append('Authorization', this.getAuthKey());
        headers.append('Accept', 'application/pdf');
        return {headers: headers};
    }

    AuthHeader2() {


        let headers = new Headers();
        headers.append('Authorization', this.getAuthKey());
        headers.append('Content-Type', "application/json");
        return {headers: headers};
    }

    AuthHeader3() {
        let headers = new Headers();
        headers.append('Authorization', this.getAuthKey());
        headers.append('Content-Type', "application/json");
        return {headers: headers, body: ''};
    }


  public  _getUserDetails(data) {

        let account = new Account();
        account.id = data.id;
        account.authenticationKey = data.authentication_key;
        account.username = data.username;
        account.firstname = data.firstname;
        account.lastname = data.lastname;
        account.activated = data.activated;
        account.suggestedJobNotification = data.suggested_job_notification;
        account.blogPostNotification = data.blog_post_notification;
        account.pollNotification = data.poll_notification;
        account.visibletoCurrentEmployer = data.visible_to_current_employer;
        account.profile_image = data.profile_image;
        account.profile_image_icon = data.profile_image_icon;
        account.googlePlusUrl = data.google_plus_page_url;
        account.linkedInUrl = data.linkedin_page_url;
        account.facebookUrl = data.facebook_page_url;
        account.twitterUrl = data.twitter_page_url;
        account.subscribeNewsLetter = data.subscribed_newsletter;
        return account;

    }
}
