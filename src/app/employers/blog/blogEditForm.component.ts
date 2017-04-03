import {Component, OnInit, AfterViewInit, OnDestroy, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup,Validators} from '@angular/forms';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Router, ActivatedRoute} from '@angular/router';
import {CropperSettings} from 'ng2-img-cropper/src/cropperSettings';
import {ImageCropperComponent} from 'ng2-img-cropper/src/imageCropperComponent';

//service
import {BlogService} from '../../core/blog/services/blog.service';
import {AccountService} from "../../core/account/services/account.service";
// var jquery = require('jquery');
var tinymce = require('tinymce');
var modern = require('modern');

declare var tinymce: any;
@Component({

    selector: "blog-edit-form",
    templateUrl: "blogEditForm.component.html"
})


export class BlogEditFormComponent implements OnInit, AfterViewInit, OnDestroy {


    public blogId = 0;
    public blogId$:BehaviorSubject<any> = new BehaviorSubject(null);
    public selectedBlog$:BehaviorSubject<any> = new BehaviorSubject(null);
    public selectImageDone$:BehaviorSubject<any> = new BehaviorSubject(false);
    public submitForm$:BehaviorSubject<any> = new BehaviorSubject(false);
    public selectedBlog;
    public blogForm:FormGroup;
    public tagarry = [];
    public pristineFlag$:BehaviorSubject<any> = new BehaviorSubject(true);
    public postSuccessFull:boolean = false;
    public chooseImage : File;
    public selectedImage : File;

    public selectedImage$:BehaviorSubject<any> = new BehaviorSubject(null);
    public tagetFile:any = null;
    public cropperSettings: CropperSettings;
    @ViewChild('cropper', undefined) cropper:ImageCropperComponent;

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.blogId = +params['id'];
            this.blogId$.next(this.blogId);
        });

        this.blogId$.subscribe(res => {
            if (this.blogId <= 0) return;

            this._blogservice.getBlogDetails(this.blogId).subscribe(res => {
                this.selectedBlog = res.selectedBlog;
                this.tagarry = this.selectedBlog.tags;
                this.selectedBlog$.next(this.selectedBlog);
                this.selectedImage$.next(this.selectedBlog.image);

                let foundImg = (this.selectedBlog.image)?'found':'';
                this.blogForm = this._fb.group({
                    id: [''],
                    title: [this.selectedBlog.name,[Validators.required,Validators.maxLength(1200)]],
                    tags:[this.tagarry,Validators.required],
                    description: [this.selectedBlog.description,[Validators.required,Validators.minLength(2000),Validators.maxLength(20000)]],
                    avatar: [foundImg,Validators.required]
                });

                tinymce.get('edit-blog-area').setContent(this.selectedBlog.description);

            });
        })
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
            if (file) {
                formData.append('blog[avatar]', file, file.name);
            }

            formData.append('blog[title]', this.blogForm.value["title"]);
            formData.append('blog[description]', this.blogForm.value["description"]);
            formData.append('blog[is_active]', true);
            formData.append('blog[is_deleted]', false);

            this._blogservice.postBlogWithImage(this.blogId, formData).subscribe(res => {

                this.postSuccessFull = true;
                window.scroll(0,0);
            })
        }
    }

    updateBlog() {
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
            this._blogservice.updateBlog(this.blogId, postDate).subscribe(res => {
                this.submitForm$.next(false);

                this.postSuccessFull = true;
                window.scroll(0,0);
                this._router.navigate(['employer/blog/manage'],{});
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

    fileChange(event) {
        if (!event.target.files[0]) return;
        this.selectImageDone$.next(true);
        var image:any = new Image();

        this.chooseImage = event.target.files[0];
        this.tagetFile = this.chooseImage;
        var file:Blob = event.target.files[0];
        var myReader:FileReader = new FileReader();
        var that = this;
        myReader.onloadend = function (loadEvent:any) {
            image.src = loadEvent.target.result;

            that.selectedBlog.image = loadEvent.target.result;
            that.selectedBlog$.next(that.selectedBlog);
            that.cropper.setImage(image);
        };

        myReader.readAsDataURL(file);
    }

    constructor(public _blogservice:BlogService, public _fb:FormBuilder, public route:ActivatedRoute, public _router:Router,public _accountService:AccountService) {
        this.blogForm = this._fb.group({
            id: [''],
            title: ['',Validators.required],
            description: ['',Validators.required],
            tags:['',Validators.required],
            avatar: ['',Validators.required]
        });


        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;

        //780x340
        this.cropperSettings.width = 500;
        this.cropperSettings.height = 300;

        this.cropperSettings.croppedWidth = 780;
        this.cropperSettings.croppedHeight = 340;

        this.cropperSettings.canvasWidth = 500;
        this.cropperSettings.canvasHeight = 300;

        this.cropperSettings.minWidth = 100;
        this.cropperSettings.minHeight = 100;
        this.cropperSettings.rounded = false;

        this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
        this.cropperSettings.cropperDrawSettings.strokeWidth = 2;

        this.dataCrop = {};
    }
}
