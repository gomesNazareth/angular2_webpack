import {Http,Headers} from '@angular/http';
import {ConfigService} from '../../../shared/config.service';
import {JobSeekerContact} from '../models/JobSeekerContact';

import {Injectable,Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';

//Model
import {File1} from '../../../shared/models/File';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AccountService} from  '../../../core/account/services/account.service';


@Injectable()
export class ResumeCoverService {

    private _url_resume ="resume.html";
    private _url_cover ="cover.html";
    
    public resumeFileObs: BehaviorSubject<File1[]> =  new BehaviorSubject(null);
    public coverletterFileObs: BehaviorSubject<File1[]> =  new BehaviorSubject(null);

    public fileList:File1[] = new Array();


    //members
    private AuthHeader;
    private AuthHeader2;
    private AuthHeader3;
    private userId;
    
    constructor(private _http: Http,@Inject(AccountService) authService:AccountService) {

        this.AuthHeader = authService.AuthHeader();
        this.AuthHeader2 = authService.AuthHeader2();
        this.AuthHeader3 = authService.AuthHeader3();
        this.userId = authService.getUserId();
    }

    getCoverLetterList() : BehaviorSubject<File1[]>{


        let url = ConfigService.getAPI()+'jobseekers/'+this.userId+ '/jobseeker_coverletters';


        this._http.get(url,this.AuthHeader)
            .map(res => res.json())
            .subscribe(file=> {


                this.fileList = [];

                file["jobseeker_coverletters"].forEach(selFile=>{
                    let fileNew = new File1();
                    fileNew.id = selFile.id;
                    fileNew.name = selFile.document_file_name;
                    fileNew.desc = selFile.document_file_name;
                    fileNew.url = selFile.document;
                    fileNew.size = null;
                    fileNew.default = false;
                    if(selFile.default)
                    {
                        fileNew.default = true;
                    }

                    this.fileList.push(fileNew);

                });
                this.coverletterFileObs.next(this.fileList);

            });

        return this.coverletterFileObs;
    }



    getResumeList() : BehaviorSubject<File1[]>{

        let url = ConfigService.getAPI()+'jobseekers/'+this.userId+ '/jobseeker_resumes';
        this._http.get(url,this.AuthHeader)
            .map(res => res.json())
            .subscribe(file=> {

                this.fileList = [];

                file["jobseeker_resumes"].forEach(selFile=>{
                    let fileNew = new File1();
                    fileNew.id = selFile.id;
                    fileNew.name = selFile.document_file_name;
                    fileNew.desc = selFile.document_file_name;
                    fileNew.url = selFile.document;
                    fileNew.size = null;
                    fileNew.default = false;
                    if(selFile.default)
                    {
                        fileNew.default = true;
                    }

                    this.fileList.push(fileNew);
                   
                });
                this.resumeFileObs.next(this.fileList);

            });

                return this.resumeFileObs;
    }




}