import {CanDeactivate, Router, Params} from '@angular/router';
import {Input,OnInit,Output,EventEmitter,Component} from '@angular/core'
import {FormBuilder, FormGroup, FormControl,Validators} from '@angular/forms';




//Services
import {ProfileService} from '../../core/services/profile.service';
import {ResumeCoverService} from  './services/resume_cover.services';
import {LoaderService} from  '../../shared/services/loader.service';


//Directives

import {BehaviorSubject} from "rxjs/BehaviorSubject";




//models
import {File1,File} from '../../shared/models/File';
import {AccountService} from "../../core/account/services/account.service";



@Component({

    selector: "address_contact_resume",
    templateUrl: "address_contact_resume.html"

})


export class AddressContactResume  implements OnInit{

    @Input() jobSeekerContact;
    @Input() cachedProfile:BehaviorSubject<any>;
    @Input() jobSeekerAddress;
    @Input() contactList;
    @Input() address;
    @Input() contact;
    @Input() cover_letters;
    @Input() resumes;
    @Input() commonData;
    @Output() onUpdateProfileStatus = new EventEmitter();

    //Observables
    public resumes2$:BehaviorSubject<any> = new BehaviorSubject(null);
    public cover_letters2$:BehaviorSubject<any> = new BehaviorSubject(null);
    public loadSpinner$:BehaviorSubject<any> = new BehaviorSubject(false);

    //members
    public resumes2:File1[] = [];
    public resumes_previous:File1[] = [];
    public file:File;
    public profileCacheDirty = false;

    public cover_letters2:File1[] = [];
    public cover_letters_previous:File1[] = [];

    public file1:File;
    public default_coverletter:number = null;
    public default_resume:number = null;

    contact_form: FormGroup;
    address_form: FormGroup;
    public countryList =  [];
    public cityList =[];
    public phoneCodeList =[];
    public delResumeList = [];
    public delCoverLetterList = [];


    //flags
    public status2 = "read";
    public status3 = "read";
    public status4 = "read";
    public tab = "resume";
    public setDefaultResume:boolean = false;
    public setDefaultCoverLetter:boolean = false;
    public deleteResume:boolean = false;
    public deleteCoverLetter:boolean = false;

    public status3$:BehaviorSubject<any>  = new BehaviorSubject("read");
    public status4$:BehaviorSubject<any>  = new BehaviorSubject("read");



    public addressLoader = false;


    ngOnDestroy() {
        if(this.profileCacheDirty){
            AccountService.profileCacheDirty = true;
        }
    }


    ngOnInit()  {
        this.file = new File("Upload Your CV","resume","PDF, TXT, DOC", 4, 'MB',true);
        this.file.file_format_list =  ['text/plain','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        this.file.classMap = "resume_block";

        this.loadSpinner$.next(true);
        this.cachedProfile.subscribe(res => {

            if(res) {
                if(res["resumes"]) {
                    res["resumes"].forEach((selResume,resumeId) => {
                        let file1 = new File1();
                        file1.name = selResume.document_file_name || selResume.title;
                        file1.default = selResume.default;
                        file1.url = selResume.document;
                        file1.id = selResume.id;
                        this.resumes2.push(file1);
                    });

                    this.resumes_previous = this.resumes2.slice();

                    this.resumes2$.next(this.resumes2);
                }

                if(res["coverletters"]) {
                    res["coverletters"].forEach((selCoverletter) => {
                        let file1 = new File1();
                        file1.name = selCoverletter.document_file_name || selCoverletter.title;
                        file1.default = selCoverletter.default;
                        file1.url = selCoverletter.document;
                        file1.id = selCoverletter.id;
                        this.cover_letters2.push(file1);
                    });


                    this.cover_letters_previous = this.cover_letters2.slice();

                    this.cover_letters2$.next(this.cover_letters2);
                }

                this.loadSpinner$.next(false);
            }
        })

        this.file1 = new File("Upload Your Cover Letter","coverletter", "PDF, TXT, DOC", 4, 'MB',true);
        this.file1.file_format_list =  ['text/plain','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        this.file1.classMap = "coverletter";
    }

    onReadAddress() {
        this.status2 = "read";
    }

    onEditAddress(){
        this.status2 = "edit";
    }


    onReadResume(){
        if(this.deleteResume == true){
            this.resumes2 = this.resumes_previous.slice();
            this.resumes2$.next(this.resumes2);
            this.deleteResume = false;
        }

        this.status3 = "read";
        this.status3$.next("read");
    }

    onEditResume() {
        this.status3 = "edit";
        this.status3$.next("edit");
    }


    onDeleteCoverLetter(index:number,id:number){
        this.deleteCoverLetter = true;
        this.delCoverLetterList.push(id);

        this.cover_letters2.splice(index,1);
        this.cover_letters2$.next(this.cover_letters2);
    }

    onDeleteResume(index:number,id:number){
        this.deleteResume = true;
        this.delResumeList.push(id);

        this.resumes2.splice(index,1);
        this.resumes2$.next(this.resumes2);
    }

    onReadCover(){
        if(this.deleteCoverLetter == true) {
            this.cover_letters2 = this.cover_letters_previous.slice();
            this.cover_letters2$.next(this.cover_letters2);
            this.deleteCoverLetter = false;
        }
        this.status4 = "read";
        this.status4$.next("read");
    }

    onEditCover() {
        this.status4 = "edit";
        this.status4$.next("edit");
    }

    showResume() {
        this.tab = "resume";

    }
    showCoverLetter(){
        this.tab = "cover";

    }

    saveAddressDetails(){
        if(this.address_form.valid) {

            this.addressLoader = true;
            let result = this._profileService.updateContactDetails(this.jobSeekerContact);

            result.subscribe(
                x => {
                    this.profileCacheDirty = true;
                    this.addressLoader = false;
                    this.status2 = 'read';
                    this.onUpdateProfileStatus.emit({"update":true});

                },
                response => {
                    if (response.status == 404) {

                        this._router.navigate(['NotFound']);
                    }
                    if (response.status == 401) {
                        this._router.navigate(['Login']);
                    }
                });
        }
    }

    setResumeDefault(id:number)
    {
        this.setDefaultResume = true;

        this.default_resume = this.resumes2[id].id;
        this.resumes2.forEach(resume=>{
            resume.default = false;
        });
        this.resumes2[id].default  = true;
        this.resumes2$.next(this.resumes2);
    }

    updateCoverLetterList($event)
    {
        if($event["result"]) {

            let selCoverletter =  $event["result"]["jobseeker_coverletter"]


                let file1 = new File1();
                file1.name = selCoverletter.document_file_name;
                file1.default = selCoverletter.default;
                file1.url = selCoverletter.document;
                file1.id = selCoverletter.id;
                this.cover_letters2.push(file1);
                this.setCoverLetterDefault((this.cover_letters2.length -1));


            this.cover_letters2$.next(this.cover_letters2);
        }
    }

    updateResumeList($event){

        if($event["result"]) {

            let selResume =  $event["result"]["jobseeker_resume"];

                let file1 = new File1();
                file1.name = selResume.document_file_name;
                file1.default = selResume.default;
                file1.url = selResume.document;
                file1.id = selResume.id;
                this.resumes2.push(file1);
                this.onUpdateProfileStatus.emit({"update":true});
                this.setResumeDefault((this.resumes2.length -1));

            this.resumes2$.next(this.resumes2);
        }
    }

    onSaveCover() {
        if(this.deleteCoverLetter == true){
            this._profileService.deleteCoverLetterList(this.delCoverLetterList).
            subscribe(val =>{
                    this.profileCacheDirty = true;
                    this.deleteCoverLetter = false;
                    this.onReadCover();
                    this.onUpdateProfileStatus.emit({"update":true});
                },
                error => {
                    this.cover_letters2 = this.cover_letters_previous.slice();
                    this.cover_letters2$.next(this.cover_letters2);
                    console.error("Error in deleting resume")}
            );
        }
        else if(this.setDefaultCoverLetter == true){

            this.setDefaultCoverLetter = false;
            this._profileService.setDefaultCoverLetter(this.default_coverletter).
            subscribe(val =>{this.onReadCover();
                    this.profileCacheDirty = true;
                    this.onUpdateProfileStatus.emit({"update":true});
            },
                error => {
                console.error("Error in updating coverletter")

            }
            );
        }
        else {
            this.status4 = "read";
            this.status4$.next("read");
        }
    }

    onSaveResume() {

        if(this.deleteResume == true){
            this._profileService.deleteResumeList(this.delResumeList).
            subscribe(val =>{
                    this.profileCacheDirty = true;
                    this.deleteResume = false;
                    this.onReadResume();
                    this.onUpdateProfileStatus.emit({"update":true});
            },
                error => {

                    this.resumes2 = this.resumes_previous.slice();
                    this.resumes2$.next(this.resumes2);
                console.error("Error in deleting resume")
            }
            );
        }
        else if(this.setDefaultResume == true) {

            this.setDefaultResume =false;
            this._profileService.setDefaultResume(this.default_resume).
            subscribe(val =>{ this.onReadResume();
                    this.profileCacheDirty = true;
                    this.onUpdateProfileStatus.emit({"update":true});
            },
                error => {console.error("Error in updating resume")}
            );
        }
        else {
            this.status3 = "read";
            this.status3$.next("read");
        }
    }

    onDownloadFile(url:string) {
        open(url, '_blank');
    }

    setCoverLetterDefault(id:number)
    {
        this.setDefaultCoverLetter = true;
        this.default_coverletter = this.cover_letters2[id].id;

        this.cover_letters2.forEach(cover_letters=>{
            cover_letters.default = false;
        });
        this.cover_letters2[id].default  = true;
        this.cover_letters2$.next(this.cover_letters2);
    }

    constructor(
        public _profileService: ProfileService,
        public _router: Router) {

    }
}
