import {Http,Headers,RequestOptions} from '@angular/http';
import {Router} from '@angular/router';
import {ConfigService} from '../../shared/config.service';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';


import {Injectable,Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {ErrorHandling} from "../../core/services/errorHandling.service";
import {AccountService} from  '../account/services/account.service';

var moment = require('moment');
declare var moment

@Injectable()
export class ProfileService {

    private _url ="jobseekers/";
    private _contact_url ="profile.html";
    private _address_url ="profile.html";
    private _status_url ="jobseekers/";
    private _update_jobseeker_url ="jobseekers/";
    private AuthHeader;
    private AuthHeader2;
    private AuthHeaderPdf;
    private AuthHeader3;
    private userId;
    private authId;


    //Cache
    public static profileCache : any = null;
    public static profileHeader : any = null;
    public currentTime : number = null;
    public errorHandling;


    constructor(private _http: Http,private _router: Router,  @Inject(AccountService) private authService:AccountService,@Inject(ErrorHandling) errorHandling:ErrorHandling) {
        this.AuthHeader = this.authService.AuthHeader();
        this.AuthHeader2 = this.authService.AuthHeader2();
        this.AuthHeaderPdf = this.authService.AuthHeaderPDF()
        this.AuthHeader3 = this.authService.AuthHeader3();
        this.userId = this.authService.getUserId();
        this.authId = this.authService.getAuthKey();
        this.errorHandling = errorHandling;
    }

    getProfileObj() : any {
        this.authService.getSwitchOffLoader();
        return AccountService.profileCache;
    }

    getProfileHeader() : any {
        return AccountService.profileHeader;
    }

    setProfileHeader(full_name:string, avatar:string){
        let names = full_name.split(" ");
        AccountService.profileHeader = {
            full_name: full_name,
            avatar: avatar,
            first_name: names[0],
            last_name: names[1]
        };
    }


    getMatchingPercentage(jobId:number):Observable<any> {

        return Observable.of(26);

    }




    getChangeStatusList(jobAppId= null){

        let url =   ConfigService.getAPI()+'job_applications/'+jobAppId+'/job_application_status_changes';
        return this._http.get(url,this.AuthHeader).map(res=>res.json());

    }

    getNoteList(jobAppId= null){


        let url =   ConfigService.getAPI()+'job_applications/'+jobAppId+'/notes';
        return this._http.get(url,this.AuthHeader).map(res=>res.json());

    }

    postApplicationFeedBack(jobId,status,comment) :Observable<any> {

        let url = ConfigService.getAPI()+'job_applications/'+jobId+'/job_application_status_changes';
        let postParams = {job_application_status_change:{job_application_status_id:status,comment:comment}}
        this.AuthHeader2 = this.authService.AuthHeader2();
        return this._http.post(url,JSON.stringify(postParams),this.AuthHeader2).map(res=>res.json());
    }


    postApplicationGenerateOfferLetter(jobId,status,comment,title,content) :Observable<any> {

        let url = ConfigService.getAPI()+'job_applications/'+jobId+'/job_application_status_changes';
        let postParams = {job_application_status_change:{job_application_status_id:status,comment:comment,offer_letter_attributes:{title:title,content:content}}};
        return this._http.post(url,JSON.stringify(postParams),this.AuthHeader2).map(res=>res.json());
    }


    postApplicationOfferLetter(jobId,status,comment,file){



        return Observable.create(observer => {


            let formData:FormData = new FormData();

            formData.append('job_application_status_change[job_application_status_id]',status);
            formData.append('job_application_status_change[comment]',comment);
            if (file) formData.append('job_application_status_change[offer_letter_attributes][document]', file, file);




            let headers = new Headers();
            headers.append('Content-Type', 'multipart/form-data');
            // headers.append('Accept', 'application/json');
            headers.append('Authorization',this.authId);
            let options = new RequestOptions({ headers: headers });


            let xhr: XMLHttpRequest = new XMLHttpRequest();

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };

            let url = ConfigService.getAPI()+'job_applications/'+jobId+'/job_application_status_changes';
            let method = "POST";

            xhr.open(method, url, true);
            xhr.setRequestHeader("Authorization",this.authId);
            xhr.send(formData);
        });


    }

    postApplicationInterview(jobId,status,comment,date,time,timeZone,additionalComment,mode,modevalue) :Observable<any> {

        let url = ConfigService.getAPI()+'job_applications/'+jobId+'/job_application_status_changes';
        let postParams = {job_application_status_change:
            {job_application_status_id:status,comment:comment,
                interview_attributes: {
                    appointment: date+' '+time,
                    time_zone: timeZone,
                    comment: additionalComment,
                    channel: mode,
                    contact: modevalue,
                    status:"invite"
                }}
        }
        return this._http.post(url,JSON.stringify(postParams),this.AuthHeader2).map(res=>res.json());
    }



    postNote(jobAppId= null,note = ""){


        let url = ConfigService.getAPI()+'job_applications/'+jobAppId+'/notes';
        return this._http.post(url,JSON.stringify({note:{note:note}}),this.AuthHeader2).map(res => { return res.json()});

    }

    getProfile(userId:number = null,jobId:number = null) : Observable<any[]>{


        let url = "";
        if(userId == null){
            url = ConfigService.getAPI()+this._url+this.userId+'/display_profile';
        }
        else {
            url = ConfigService.getAPI()+this._url+userId+'/display_profile';
        }

        let  urlJob = '';
        if(jobId != null){
            urlJob ='?job_id='+jobId;
        }

        this.AuthHeader = this.authService.AuthHeader();

        return this._http.get(url+urlJob, this.AuthHeader)
            .map(res => {

                let profile = res.json();

                if(profile == null){
                    let error = {status:404}
                    this.errorHandling.errorHandler(error);
                }

                if(!this.authService.getCheckEmployer()){
                    AccountService.profileCache = profile;
                }


                if(!this.authService.getCheckEmployer()) {
                    let full_name = profile["first_name"] + " " + profile["last_name"];
                    this.setProfileHeader(full_name, profile["avatar"]);
                }
                return profile;
            });
    }


    updateMyInformation(info :any): Observable<any[]> {
        return this._http.put(ConfigService.getAPI()+this._update_jobseeker_url+this.userId, JSON.stringify({jobseeker: info}), this.AuthHeader2)
            .map(res => res.json());
    }


    setDefaultCoverLetter(id:number) :Observable<any[]>{
        return this._http.put(ConfigService.getAPI()+this._update_jobseeker_url+this.userId+'/jobseeker_coverletters/'+id, JSON.stringify({jobseeker_coverletter:{default:true}}), this.AuthHeader2)
            .map(res => res.json());
    }



    setDefaultResume(id:number) :Observable<any[]>{
        return this._http.put(ConfigService.getAPI()+this._update_jobseeker_url+this.userId+'/jobseeker_resumes/'+id, JSON.stringify({jobseeker_resume:{default:true}}), this.AuthHeader2)
            .map(res => res.json());
    }


    updateContactDetails(contact :any): Observable<any[]> {
        return this._http.put(ConfigService.getAPI()+this._update_jobseeker_url+this.userId, JSON.stringify(contact), this.AuthHeader2)
            .map(res => res.json())
    }



    updateTags(tags :any): Observable<any[]> {
        return this._http.post(ConfigService.getAPI()+this._url+this.userId+"/update_tags",
            JSON.stringify({jobseeker: tags}), this.AuthHeader2)
            .map(res => res.json())
    }



    updateSummary(summary :string): Observable<any[]> {
        return this._http.put(ConfigService.getAPI()+this._url+this.userId,
            JSON.stringify({jobseeker: summary}), this.AuthHeader2)
            .map(res => res.json())
    }


    updateAddressDetails(address :any): Observable<any[]> {
        return this._http.put(ConfigService.getAPI()+this._url+this.userId, JSON.stringify({jobseeker:address}),this.AuthHeader2)
            .map(res => res.json());
    }

    updatSkills(skills:any){
        return this._http.post(ConfigService.getAPI()+this._url+this.userId+'/update_skills', JSON.stringify(skills),this.AuthHeader2)
            .map(res => res.json());
    }

    postWorkExperience(jobseeker_experience): Observable<any[]> {
        let postData = JSON.stringify({jobseeker_experience:jobseeker_experience});

        return this._http.post(ConfigService.getAPI()+this._url+this.userId+'/jobseeker_experiences',postData,this.AuthHeader2)
            .map(res=>res.json());
    }

    putWorkExperience(jobId,jobseeker_experience): Observable<any[]> {
        let postData = JSON.stringify({jobseeker_experience:jobseeker_experience});

        return this._http.put(ConfigService.getAPI()+this._url+this.userId+'/jobseeker_experiences/'+jobId,postData,this.AuthHeader2)
            .map(res=>res.json());
    }

    deleteCoverLetterList(ids:any[]):Observable<any[]> {
        let postData = JSON.stringify({jobseeker_coverletter_ids:ids});

        let authHeader =this.AuthHeader3;
        authHeader.body=postData;

        return this._http.delete(ConfigService.getAPI()+this._url+this.userId+'/jobseeker_coverletters/delete_bulk/',authHeader).
        map(res=>res.json());
    }


    deleteResumeList(ids:any[]):Observable<any[]> {
        let postData = JSON.stringify({jobseeker_resume_ids:ids});

        let authHeader =this.AuthHeader3;
        authHeader.body=postData;

        return this._http.delete(ConfigService.getAPI()+this._url+this.userId+'/jobseeker_resumes/delete_bulk/',authHeader).
        map(res=>res.json());
    }


    deleteWorkExperience(id:any):Observable<any[]>  {
        return this._http.delete(ConfigService.getAPI()+this._url+this.userId+'/jobseeker_experiences/'+id,this.AuthHeader3).
        map(res=>res.json());
    }


    postEducation(jobseeker_education): Observable<any[]> {
        let postData = JSON.stringify({jobseeker_education:jobseeker_education});

        return this._http.post(ConfigService.getAPI()+this._url+this.userId+'/jobseeker_educations',postData,this.AuthHeader2)
            .map(res=>res.json());
    }

    deleteEduFile(id:any):Observable<any[]> {
        return this._http.delete(ConfigService.getAPI()+this._url+this.userId+'/jobseeker_educations/'+id+'/delete_document',this.AuthHeader3).
        map(res=>res.json());
    }

    deleteWorkFile(id:any):Observable<any[]> {
        return this._http.delete(ConfigService.getAPI()+this._url+this.userId+'/jobseeker_experiences/'+id+'/delete_document',this.AuthHeader3).
        map(res=>res.json());
    }

    deleteCertificateFile(id:any):Observable<any[]> {
        return this._http.delete(ConfigService.getAPI()+this._url+this.userId+'/jobseeker_certificates/'+id+'/delete_document',this.AuthHeader3).
        map(res=>res.json());
    }

    deleteCertificate(id:any):Observable<any[]>  {
        return this._http.delete(ConfigService.getAPI()+this._url+this.userId+'/jobseeker_certificates/'+id,this.AuthHeader3).
        map(res=>res.json());
    }

    deleteEducation(id:any):Observable<any[]>{
        return this._http.delete(ConfigService.getAPI()+this._url+this.userId+'/jobseeker_educations/'+id,this.AuthHeader3).
        map(res=>res.json());
    }

    updateEducation(jobseeker_education):Observable<any[]> {
        let postData = JSON.stringify({jobseeker_education:jobseeker_education});

        return this._http.put(ConfigService.getAPI()+this._url+this.userId+'/jobseeker_educations/'+jobseeker_education.id,postData,this.AuthHeader2)
            .map(res=>res.json());
    }



    updateCertificate(jobseeker_certificate):Observable<any[]>{

        let postData = JSON.stringify({jobseeker_certificate:jobseeker_certificate});

        return this._http.put(ConfigService.getAPI()+this._url+this.userId+'/jobseeker_certificates/'+jobseeker_certificate.id,postData,this.AuthHeader2)
            .map(res => res.json());
    }

    postCertificate(jobseeker_certitficate):Observable<any[]>{

        let postData = JSON.stringify({jobseeker_certificate:jobseeker_certitficate});
        return this._http.post(ConfigService.getAPI()+this._url+this.userId+'/jobseeker_certificates',postData,this.AuthHeader2)
            .map(res => res.json());
    }


    updateWorkExperience(jobseeker_experience): Observable<any[]> {

        let postData = JSON.stringify({jobseeker_experience:jobseeker_experience});

        return this._http.put(ConfigService.getAPI()+this._url+this.userId+'/jobseeker_experiences/'+jobseeker_experience.id,postData,this.AuthHeader2)
            .map(res=>res.json());
    }


    getProfilePdf(userId = null){

        let returnObs = new BehaviorSubject(null);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                return returnObs.next("success");
            }
            else if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 500) {
                return returnObs.next("error");
            }
        };

        var url = "";
        if(userId == null) {
            url = ConfigService.getAPI()+this._url+this.userId+'/display_profile_pdf';
        }
        else{
            url = ConfigService.getAPI()+this._url+userId+'/display_profile_pdf';
        }


        xhr.open('GET', url, this.AuthHeaderPdf);

        xhr.setRequestHeader("Authorization",this.authService.getAuthKey());
        xhr.responseType = 'arraybuffer';
        xhr.onload = function(e) {
            if (this["status"] == 200) {
                let fileName= "My_Resume_"+moment().format('DD_MMM_YYYY');
                var blob=new Blob([this["response"]], {type:"application/pdf"});
                var link=document.createElement('a');
                link.href=window.URL.createObjectURL(blob);
                link["download"]=fileName+".pdf";
                link.click();
            }
        };

        xhr.send();

        return returnObs;
    }

    updateProfile(profile_data) : Observable<any[]>{

        return this._http.put(ConfigService.getAPI()+this._url+this.userId,JSON.stringify({jobseeker: profile_data}),this.AuthHeader2)
            .map(res => {
                let profile = res.json();
                let full_name = profile["jobseeker_profile"]["first_name"] + " " + profile["jobseeker_profile"]["last_name"];
                this.setProfileHeader(full_name, profile["jobseeker_profile"]["avatar"]);
                return profile;
            });

    }

    getProfileStatus() : Observable<number>{
        return this._http.get(ConfigService.getAPI()+this._url+this.userId+'/completion_percentage',this.AuthHeader)
            .map(res => res.json())
            .map(res => res["jobseeker"]["completion_percentage"]);
    }
}
