import {Component,Input,OnInit,Inject,Output,EventEmitter,ViewChild} from '@angular/core';
import {ConfigService} from '../../shared/config.service';
import {UploadService} from '../../shared/services/upload.service';
import {AccountService} from  '../../core/account/services/account.service';
import {Observable} from "rxjs/Observable";


import {CropperSettings} from 'ng2-img-cropper/src/cropperSettings';
import {ImageCropperComponent} from 'ng2-img-cropper/src/imageCropperComponent';
import {Bounds} from 'ng2-img-cropper/src/model/bounds';



import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';


//Model
import {File} from '../models/File';
import {FileUploader} from 'ng2-file-upload/ng2-file-upload';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

declare var jQuery:any;

@Component({
    selector: 'up-load',

    providers: [ConfigService,UploadService],
    templateUrl: 'upload.component.html'
})

export class UploadComponent  implements OnInit{

    public URL;
    public userId;
    public AUTH;
    public MULTI_PATH = false;
    public progress$:BehaviorSubject<any> = new BehaviorSubject(0);

    // public uploader:FileUploader = new FileUploader({url: URL,authToken:"cleve"});
    public uploader:FileUploader;
    public upload_forms:FormGroup;
    public successFlag$:BehaviorSubject<any> = new BehaviorSubject(false);
    public errorFlag$:BehaviorSubject<any> = new BehaviorSubject(false);
    public errorFile$:BehaviorSubject<any> = new BehaviorSubject(false);
    public errorFileString$:BehaviorSubject<any> = new BehaviorSubject(null);
    public customErrorFlag:boolean = false;
    public formParams = {};
    @Input() file:File;
    @Input() mode:String = "normal";

    public tagetFile:any = null;
    public showUploadFlag:boolean = true;
    public cropperSettings: CropperSettings;
    public data: any;
    public fileuploadFlag:boolean = false;

    @ViewChild('cropper', undefined) cropper:ImageCropperComponent;

    @Output() onUpload = new EventEmitter();


    resetUpload(){
        this.successFlag$.next(false);
        this.errorFlag$.next(false);
        this.errorFile$.next(false);
        this.tagetFile = null;
    }

    uploadImage() {


        if(this.data.image || this.file.file_optional)
        {


            this._uploadService.progressObserver.subscribe(val=>{
                this.progress$.next(val);
            })

            let invalidData = false;
            this.file.formParams.forEach(selInput=>{
                if(this.formParams[selInput.title] == ""){
                    invalidData = true;


                }});

                if(invalidData){
                    this.customErrorFlag=true;
                    return;
                }
            this._uploadService.makeFileRequest(this.URL,this.data.image,this.AUTH,this.file.root,this.formParams,this.file.method,this.file.rootTag,this.file.file_optional).subscribe(res => {


                this.successFlag$.next(true);
                this.fileuploadFlag = false;
                this.tagetFile = null;
                this.onUpload.emit({id:this.file.index,result:res});
                this.showUploadFlag = false;
                Observable.of(1).delay(2000)
                    .subscribe(x => {
                        this.onSelectFile();
                        this.clearQueue();
                        jQuery('.file_upload_popup_close').modal('hide');
                    });
            });
        }
    }

    fileChangeListener($event) {
        this.successFlag$.next(false);
        this.errorFlag$.next(false);
        this.errorFile$.next(false);

        this.tagetFile = $event.target.files[0];
        this.fileuploadFlag = true;
        this.progress$.next(0);

        this.errorFileString$.next(null);
        //Checking for file errors
        if((this.file.file_size*1048576)  < this.tagetFile.size )
        {
            this.errorFileString$.next("File is too Large.");
            this.errorFile$.next(true);
            return;
        }
        if((this.tagetFile.type && this.file.file_format_list.indexOf(this.tagetFile.type) == -1)){

            this.errorFileString$.next("File type is Not Supported.");
            this.errorFile$.next(true);
            return;
        }


        var image:any = new Image();
        var file:Blob = $event.target.files[0];
        var myReader:FileReader = new FileReader();
        var that = this;
        myReader.onloadend = function (loadEvent:any) {
            image.src = loadEvent.target.result;
            that.cropper.setImage(image);

        };

        myReader.readAsDataURL(file);
    }


    public clearQueue(){
        this.uploader.clearQueue();
    }

    onSelectFile(){
        this.uploader.clearQueue();
        this.progress$.next(0);
        this.successFlag$.next(false);
        this.errorFlag$.next(false);
    }

    ngOnInit(): void {

        this.file.formParams.forEach(selval=>{
            this.formParams[selval.title] = selval.value;
        });


        this.cropperSettings.width = this.file.cropperSettings_width;
        this.cropperSettings.height = this.file.cropperSettings_height;
        this.cropperSettings.touchRadius = 60;
        this.cropperSettings.croppedWidth = this.file.cropperSettings_croppedWidth;
        this.cropperSettings.croppedHeight = this.file.cropperSettings_croppedHeight;

        this.cropperSettings.canvasWidth = this.file.cropperSettings_canvasWidth;
        this.cropperSettings.canvasHeight = this.file.cropperSettings_canvasHeight;

        this.URL = ConfigService.getAPI()+'jobseekers/'+this.userId+'/'+this.file.post_url+'/'+this.file.id+'/upload_document';

        if(this.file.mode =="resume" || this.file.mode =="coverletter" || this.file.mode =="video")
        {
            this.URL = ConfigService.getAPI()+'jobseekers/'+this.userId+'/'+this.file.post_url;
        }

        if(this.file.mode =="company_cover") {

            this.URL = ConfigService.getAPI()+'companies/'+this.authService.getCompanyId()+'/upload_cover';
        }

        if(this.file.mode =="video" || this.file.mode =="profile")
        {
            if(this.authService.getCheckEmployer()) {
                this.URL = ConfigService.getAPI()+'companies/'+this.authService.getCompanyId()+'/upload_avatar';
            }
            else
            {
                this.URL = ConfigService.getAPI()+'users/'+this.userId+'/'+this.file.post_url;

            }

        }
        if(this.file.mode =="profile_member"){
            if(this.authService.getCheckEmployer()) {
                this.URL = ConfigService.getAPI()+'companies/'+this.authService.getCompanyId()+'/company_members/'+this.file.selId;
            }
        }
        if(this.file.mode =="company_culture") {

            if(this.authService.getCheckEmployer()) {
                this.URL = ConfigService.getAPI()+'companies/'+this.authService.getCompanyId()+'/cultures/'+this.file.selId;
            }
        }


        this.uploader = new FileUploader({url: this.URL,authToken:this.AUTH});
        this.uploader.options.method = this.file.method;

        this.uploader.onBuildItemForm = (fileItem, form) => {

            form.append(this.file.root, fileItem._file, fileItem._file.name);
            if(this.file.file_default && this.file.mode == "coverletter")
            {
                form.append("jobseeker_coverletter[default]", fileItem._file, this.file.file_default);
            }
            if(this.file.file_default && this.file.mode == "resume")
            {
                form.append("jobseeker_resume[default]", fileItem._file, this.file.file_default);
            }
            if(this.file.mode =="company_culture"){

                this.file.formParams.forEach(selInput=>{
                    if(this.formParams[selInput.title]){
                        form.append("culture["+selInput.title+"]",this.formParams[selInput.title]);
                    }

                });

            }
        };

        this.uploader.onSuccessItem = (item, response, status, headers)  => {
            Observable.of(1).delay(2000)
                .subscribe(x => {
                    this.onSelectFile();
                    this.clearQueue();
                    jQuery('.file_upload_popup_close').modal('hide');

                });

            this.successFlag$.next(true);
            this.onUpload.emit({id:this.file.index,result:JSON.parse(response)});
        }

        this.uploader.onProgressItem = (fileItem,progress) => {
            this.progress$.next(progress);
        }


        this.uploader.onErrorItem = (item,response,status,headers) => {

            this.errorFlag$.next(true);
            this.uploader.clearQueue();

            Observable.of(1).delay(3000)
                .subscribe(x => {
                    this.errorFlag$.next(false);
                    this.onSelectFile();
                });
        }
    }


    getValue(selInput) {


        this.formParams[selInput.name] = selInput.value;



    }
    ngOnDestroy() {  }

    resetUploader() {

        // this.uploader.clearQueue();
        // this.successFlag$.next(false);
        // this.errorFlag$.next(false);
    }




    constructor(@Inject(AccountService) public authService:AccountService,public _uploadService:UploadService) {

        this.AUTH = authService.getAuthKey();
        this.userId = authService.getUserId();

        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;
        this.data = {};

        this.cropperSettings.width = 190;
        this.cropperSettings.height = 230;

        this.cropperSettings.croppedWidth = 500;
        this.cropperSettings.croppedHeight = 500;
        this.cropperSettings.touchRadius = 60;

        this.cropperSettings.canvasWidth = 500;
        this.cropperSettings.canvasHeight = 500;

        this.cropperSettings.minWidth = 100;
        this.cropperSettings.minHeight = 100;
        this.cropperSettings.rounded = false;
    }
}
