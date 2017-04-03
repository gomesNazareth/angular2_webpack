import {Component, OnInit, Input, EventEmitter, Output,ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import {Location} from '@angular/common';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Router,ActivatedRoute} from '@angular/router';

//Services
import { AccountService } from '../../core/account/services/account.service';
import {CompanyService} from "../../core/services/company.service";
import {LoaderService} from "../../shared/services/loader.service";
import {GeneralService} from "../../shared/services/general.service";
import {ConfigService} from "../../shared/config.service";
import {JobService} from "../../core/services/job.service";

//Components
import {CropperSettings} from 'ng2-img-cropper/src/cropperSettings';
import {ImageCropperComponent} from 'ng2-img-cropper/src/imageCropperComponent';

declare var jQuery:any;
@Component({

    selector: "build-file",
    templateUrl: "buildFileUpload.component.html"

})


export class BuildFileUploadComponent implements OnInit {

    @Input() popupClass = "custom_popup";
    @Input() custromfileInfo = {};
    @Output() selectedFile = new EventEmitter();

    public tagetFile:any = null;
    public targetFileBase64 : any;
    public tagetFileCover:any = null;
    public cropperSettings: CropperSettings;
    public dataCropAvatar:any = {};
    public selectImageDone$:BehaviorSubject<any> = new BehaviorSubject(false);
    public avatarImage$:BehaviorSubject<any> = new BehaviorSubject(null);
    public selectedImageAvatar : File;

    public signupThirdForm:FormGroup;


    @ViewChild('cropperAvatar', undefined) cropperAvatar:ImageCropperComponent;

    //Mode normal or cropper
    public modesHash = {normal:'normal',cropper:'cropper'};


    public fileInfo:any = {
        size: 2,
        format_list: ['image/jpeg','image/png'],
        title: "Profile Picture",
        sizeUnit: "MB",
        mode:this.modesHash['cropper'],
        fileExtentions: ['.png, .jpg, .jpeg']
    };

    ngOnInit() {

        for(var key in this.custromfileInfo){

            if(this.custromfileInfo.hasOwnProperty(key)){
                this.fileInfo[key] = this.custromfileInfo[key];
            }
        }

        this.signupThirdForm = this._fb.group({
            avatar: [""],
            cover: [""]
        })
    }


    constructor(public _fb:FormBuilder) {

        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;

        //780x340
        this.cropperSettings.width = 142;
        this.cropperSettings.height = 142;

        this.cropperSettings.croppedWidth = 500;
        this.cropperSettings.croppedHeight = 500;

        this.cropperSettings.canvasWidth = 500;
        this.cropperSettings.canvasHeight = 500;

        this.cropperSettings.minWidth = 100;
        this.cropperSettings.minHeight = 100;
        this.cropperSettings.rounded = false;

        this.dataCropAvatar = {};
    }



    fileChange(event) {
        this.selectImageDone$.next(true);
        var image:any = new Image();

        this.tagetFile = event.target.files[0];

        // this.tagetFile[select_type] = event.target.files[0];
        var file:Blob = event.target.files[0];
        var myReader:FileReader = new FileReader();
        var that = this;
        myReader.onloadend = function (loadEvent:any) {
            image.src = loadEvent.target.result;
            that.cropperAvatar.setImage(image);
        };

        myReader.readAsDataURL(file);
    }


    createImage (event) {
        this.tagetFile = event.target.files[0];

        var file:Blob = event.target.files[0];
        var myReader:FileReader = new FileReader();
        var that = this;
        myReader.onload = function (loadEvent:any) {
            that.targetFileBase64 = loadEvent.target.result;
        };

        myReader.readAsDataURL(file);
    }


    selectImage() {



        if(this.fileInfo.mode == this.modesHash['normal']){
            this.selectedFile.emit({file:this.targetFileBase64});
        }
        else if(this.fileInfo.mode == this.modesHash['cropper']) {
            this.selectedFile.emit({file:this.dataCropAvatar.image});

        }
    }


}
