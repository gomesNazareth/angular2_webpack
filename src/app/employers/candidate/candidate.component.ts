import { Directive, Component, OnInit, ElementRef, Inject,Input, AfterViewChecked } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Router, ActivatedRoute} from '@angular/router';
import {ErrorHandling} from "../../core/services/errorHandling.service";

//services
import { AccountService } from '../../core/account/services/account.service';
import {ProfileService} from '../../core/services/profile.service';



@Component({

    selector: "candidate-employer",
    templateUrl: "candidate.component.html"
})


export class CandidateComponent implements OnInit, AfterViewChecked {

    public companyId:number = null;
    public candidateName:string = "";
    public candidateDetailsObs:BehaviorSubject<any> = new BehaviorSubject(null);
    public social_media_video$:BehaviorSubject<any> = new BehaviorSubject(null);
    public profileFormValidateFlag$:BehaviorSubject<any> = new BehaviorSubject(false);
    public loadSpinner$:BehaviorSubject<any> = new BehaviorSubject(false);

    public video_screenshot$:BehaviorSubject<any> = new BehaviorSubject(null);

    public profileFormValidateFlag:boolean = true;
    public showDownloadSpinner = false;
    public age;
    public is_applied;
    public noDefaultCover:boolean = false;
    public matchingPercentage:number = null;
    public defaultResume = null;
    public defaultCoverLetter = null;
    public genderHash = {"female":"Female","male":"Male"};
    public marryHash = {"single":"Single","married":"Married"};


    @Input() candidateId:number = null;
    @Input() jobId:number = null;
    @Input() appliedFlag:boolean = false
    @Input() headerString:string = " Candidate Detail "

    constructor(public _accountService:AccountService,public _profileService:ProfileService,public _router:Router,public _errorHandling: ErrorHandling,){

        if(this.companyId == null){
            this.companyId = this._accountService.getCompanyId();

        }
    }


    onBackJobApplicants() {
        // this._router.navigate(['/'+this._accountService.getPath()+'/jobs/'+this.jobId+'/applicants']);
        window.history.back();
    }

    ngOnInit():void {

        this.loadSpinner$.next(true);

        if(this.jobId != null){
            this._profileService.getMatchingPercentage(this.jobId).subscribe(res=>{
                this.matchingPercentage = res;
            });
        }
        this._profileService.getProfile(this.candidateId,this.jobId).subscribe(res => {

                if(res["resumes"] && res["resumes"].length){

                    res["resumes"].forEach(selRes =>{

                        if(selRes.default){

                            this.defaultResume = selRes;
                        }

                    });
                }

                if(res["coverletters"] && res["coverletters"].length){

                    res["coverletters"].forEach(selCover =>{

                        if(selCover.default){

                            this.defaultCoverLetter = selCover;
                        }

                    });
                }


            this.candidateName = res['first_name']+' '+res['last_name'];
            this.candidateDetailsObs.next(res);


            this.age = new Number((new Date().getTime() - new Date(res["general_info"]["dob"]["year"], res["general_info"]["dob"]["month"], res["general_info"]["dob"]["day"]).getTime()) / 31536000000).toFixed(0);

            this.is_applied = res["is_applied"];
            this.social_media_video$.next(res["video"]);
            this.video_screenshot$.next(res["video_screenshot"]);
            this.loadSpinner$.next(false);

        },
        error=>{
            this._errorHandling.errorHandling(error);
        });


    }

    onSavePDF(){

        this.showDownloadSpinner = true;
        this.profileFormValidateFlag$.next(false);
        this._profileService.getProfilePdf(this.candidateId).subscribe(res=> {
            if(res == 'success')
            {
                this.profileFormValidateFlag$.next(true);
                this.showDownloadSpinner = false;
            }
        });
        this.profileFormValidateFlag = false;

    }

    onBack(){

        window.history.back();
    }

    ngAfterViewChecked():void {
    }

}
