import {Component, OnInit, EventEmitter, Output, Input, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup,Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ActivatedRoute, Router} from '@angular/router';
//models
import {Blog} from "./models/blog";

//service
import {BlogService} from './services/blog.service';
import {AccountService} from "../account/services/account.service";
import {ConfigService} from "../../shared/config.service";

@Component({
    selector: "blog-details",
    templateUrl: "blogDetails.component.html"
})

export class BlogDetailsComponent implements OnInit,OnDestroy {
    //Flags
    public loadingFlagsArray = Array();
    public postFormLoaderFlags$:BehaviorSubject<any> = new BehaviorSubject(false);
    public postsuccessFlag$:BehaviorSubject<any> = new BehaviorSubject(false);
    public filedDownloadFlag$:BehaviorSubject<any> = new BehaviorSubject(false);
    public  url$:BehaviorSubject<any> = new BehaviorSubject(ConfigService.getDomain());

    //Forms
    public commentForm:FormGroup;


    //Variables
    public blogs:Blog;
    public selectedBlog;

    //Observables
    public selectedBlog$:BehaviorSubject<any> = new BehaviorSubject(null);
    public loadEvent:BehaviorSubject<any> = new BehaviorSubject(null);
    public pristineFlag$:BehaviorSubject<any> = new BehaviorSubject(true);

    //Route sub
  public sub;
  public token;
  public fragmentflag = false;


    @Output() backClick = new EventEmitter();
    @Input() blogId:number;

    onClickBack(id:number) {
        this.backClick.emit({"fromPage": "blogDetails"});
    }

    onSavePDF(){
        this.filedDownloadFlag$.next(true);
        this._blogservice.getBlogPdf(this.blogId, this.selectedBlog$.getValue()["name"]).subscribe(res=> {
            if(res == 'success')
            this.filedDownloadFlag$.next(false);
        });
    }

    public  onPostComment() {
        this.postsuccessFlag$.next(false);
        this.pristineFlag$.next(false);


        if (this.commentForm.valid) {

            this.postFormLoaderFlags$.next(true);

            this._blogservice.getPostBlog(this.commentForm.value.comment_string, this.blogId).subscribe(res => {
                this.postFormLoaderFlags$.next(false);
                    this.postsuccessFlag$.next(true);
                    this.pristineFlag$.next(true);
                    this.commentForm.reset();
            },error => {
                this.postFormLoaderFlags$.next(true);
            });
        }
    }


    public getBlogDetails(id:number) {
        this.backClick.emit({"fromPage": "blogDetails", "blogId": id});
    }



    public getUnLike() {

        if (this.selectedBlog.liked) {

            this._blogservice.getBlogUnLike(this.selectedBlog.id).subscribe(res => {

                this.selectedBlog.liked = false;
                this.selectedBlog.likes--;
            })
        }
    }

    public getLike() {

        if (!this.selectedBlog.liked) {

            this._blogservice.getBlogLike(this.selectedBlog.id).subscribe(res => {

                this.selectedBlog.liked = true;
                this.selectedBlog.likes++;
            })
        }
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.token.unsubscribe();
    }



    ngOnInit() {

        this.token = this.route .fragment.subscribe(fragment =>{

            if(fragment == "comment"){
                this.fragmentflag = true;
            }
        });

        this.sub = this.route.params.subscribe(params => {
            this.blogId = +params['id'];
            this.loadEvent.next(this.blogId);

        });

        let commentElements = {
            comment_string: ['', Validators.compose([Validators.required, Validators.minLength(25), Validators.maxLength(1500)])]
        };

        this.commentForm = this.fb.group(commentElements);

        Observable.merge(
            this.loadEvent
        )
        .switchMap(dataVal => this._blogservice.getBlogDetails(this.blogId))
        .subscribe(res => {

            this.loadingFlagsArray['companyLoader'] = false;
            this.selectedBlog = res.selectedBlog;
            this.selectedBlog$.next(this.selectedBlog);

            this._router.navigate(['/'+this._accountService.getPath()+'/blog/'+this.blogId+'/'+this._accountService.getSpaceToDash(res["selectedBlog"]["name"])]);
            Observable.timer(1000).subscribe(res=>{
               if(this.fragmentflag){
                   this.fragmentflag = false;
                   window.scrollTo(0,document.body.scrollHeight);
               }
            });


        });
    }



    constructor(public _blogservice:BlogService, public fb:FormBuilder, public route:ActivatedRoute,public _router:Router,public _accountService:AccountService) {


    }


}
