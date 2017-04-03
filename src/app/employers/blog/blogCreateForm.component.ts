import {Component, OnInit, OnDestroy, AfterViewInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup,Validators } from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {CropperSettings} from 'ng2-img-cropper/src/cropperSettings';
import {ImageCropperComponent} from 'ng2-img-cropper/src/imageCropperComponent';

import {BlogService} from '../../core/blog/services/blog.service';
import {AccountService} from "../../core/account/services/account.service";



// var jquery = require('jquery');
var tinymce = require('tinymce');
var modern = require('modern');
declare var tinymce: any;

@Component({

    selector: "blog-create-form",
    templateUrl: "blogCreateForm.component.html"
})


export class BlogCreateFormComponent implements OnInit, AfterViewInit, OnDestroy {

    public totalRecords$:BehaviorSubject<any> = new BehaviorSubject(0);
    public tags;
    public blogId:number;
    public newBlog = {};
    public currentPage = 1;

    //Flags
    public blogDetailFlag = false;
    public tagarry = [];
    public pristineFlag$:BehaviorSubject<any> = new BehaviorSubject(true);
    public selectImageDone$:BehaviorSubject<any> = new BehaviorSubject(false);
    public submitForm$:BehaviorSubject<any> = new BehaviorSubject(false);
    public companyId:number = 1;
    public companyId$:BehaviorSubject<any> = new BehaviorSubject(this.companyId);
    public blogForm:FormGroup;
    public postSuccessFull:boolean = false;
    public chooseImage : File;
    public selectedImage : File;

    public selectedImage$:BehaviorSubject<any> = new BehaviorSubject(null);
    public tagetFile:any = null;
    public cropperSettings: CropperSettings;
    @ViewChild('cropper', undefined) cropper:ImageCropperComponent;

    ngOnInit() {
        this.companyId = this._blogservice.companyId;
        this.companyId$.next(this.companyId);
    }

    editor;

    ngAfterViewInit() {
        var that = this;

        tinymce.init({
            selector: '#edit-blog-area',
            skin_url: '../assets/skins/lightgray',
            // plugins: ['link', 'paste', 'table'],
            content_style: 'body {color:#7ba1b2 !important;helvetica,sans-serif !important;font-size:14px;}',
            font_formats: 'helvetica,sans-serif !important;',
            toolbar: 'undo redo | bold italic |',
            menubar: false,
            statusbar: false,
            setup: editor => {
                this.editor = editor;
                editor.on('Change', () => {
                    that.blogForm.controls["description"].setValue(editor.getContent());
                });
            },
        });

    }

    ngOnDestroy() {
        tinymce.remove(this.editor);
    }

    onAddElement($event) {
        this.tagarry.push({id: $event.id,name: $event.name});
        this.blogForm.controls['tags'].setValue($event.name);
    }

    onRemoveElement(index) {
        if (index > -1)
            this.tagarry.splice(index, 1);

        if(this.tagarry.length == 0) {
            this.blogForm.controls['tags'].setValue('');
        }
    }

    createBlog() {
        this.pristineFlag$.next(false);
        if(this.blogForm.valid){

            var postDate = {
                blog: {
                    title: this.blogForm.value["title"],
                    description: this.blogForm.value["description"],
                    is_active: true,
                    is_deleted: false,
                    avatar: this.selectedImage,
                    tags: []
                }
            };
            if (this.tagarry && this.tagarry.length > 0){
                for (var index in this.tagarry) {
                    postDate.blog.tags.push({id: this.tagarry[index].id, name: this.tagarry[index].name});
                }
            }
            this.submitForm$.next(true);

            this._blogservice.updateBlog(null, postDate).subscribe(res => {
                this.submitForm$.next(false);
                this.newBlog = res;
                this.postSuccessFull = true;
                window.scroll(0,0);
            })
        }
    }

    saveBlog() {

        this.pristineFlag$.next(false);
        if(this.blogForm.valid){
            let file = this.selectedImage;
            let formData:FormData = new FormData();
            if (this.tagarry && this.tagarry.length > 0){
                for (var index in this.tagarry) {
                    formData.append('blog[tags][][id]', this.tagarry[index].id);
                    formData.append('blog[tags][][name]', this.tagarry[index].name);
                }
            }
            if (file) formData.append('blog[avatar]', file, file.name);


            if (this.tagarry && this.tagarry.length > 0){
                for (var index in this.tagarry) {
                    formData.append('blog[tags][][id]', this.tagarry[index].id);
                    formData.append('blog[tags][][name]', this.tagarry[index].name);
                }
            }

            formData.append('blog[title]', this.blogForm.value["title"]);
            formData.append('blog[description]', this.blogForm.value["description"]);
            formData.append('blog[is_active]', true);
            formData.append('blog[is_deleted]', false);

            this._blogservice.postBlogWithImage(this.blogForm.value["id"], formData).subscribe(res => {


                this.postSuccessFull = true;
                window.scroll(0,0);
                Observable.of(1).delay(2000)
                .subscribe(x => {
                    this.companyId$.next(1);
                });
            })
        }
    }

    public dataCrop:any = {};

    public fileInfo:any = {
        size: 2,
        format_list: ['image/jpeg','image/png'],
        file_types:['JPG',' PNG'],
        sizeUnit: "MB"
    };

    selectImage() {
        this.selectedImage = this.dataCrop.image;
        this.selectedImage$.next(this.selectedImage);
        this.blogForm.controls['avatar'].setValue(true);
    }

    removeImage() {
        this.selectImageDone$.next(false);
        this.tagetFile = null;
        this.chooseImage = null;
        this.selectedImage = null;
        this.selectedImage$.next(null);
        this.blogForm.controls['avatar'].setValue('');
    }

    fileChange(event) {
        this.selectImageDone$.next(true);
        var image:any = new Image();

        this.chooseImage = event.target.files[0];
        this.tagetFile = this.chooseImage;
        var file:Blob = event.target.files[0];
        var myReader:FileReader = new FileReader();
        var that = this;
        myReader.onloadend = function (loadEvent:any) {
            image.src = loadEvent.target.result;
            that.cropper.setImage(image);
        };

        myReader.readAsDataURL(file);
    }

    constructor(public _blogservice:BlogService,
                public _accountService:AccountService,
                public _fb:FormBuilder) {
        this.blogForm = this._fb.group({
            id: [''],
            title: ['',[Validators.required,Validators.maxLength(1200)]],
            tags:['',Validators.required],
            description: ['',[Validators.required,Validators.minLength(2000),Validators.maxLength(20000)]],
            avatar: ['',Validators.required]
        });

        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;

        //780x340
        this.cropperSettings.width = 500;
        this.cropperSettings.height = 300;

        this.cropperSettings.croppedWidth = 920;
        this.cropperSettings.croppedHeight = 500;

        this.cropperSettings.canvasWidth = 920;
        this.cropperSettings.canvasHeight = 500;

        this.cropperSettings.minWidth = 100;
        this.cropperSettings.minHeight = 100;
        this.cropperSettings.rounded = false;

        this.dataCrop = {};
    }
}
