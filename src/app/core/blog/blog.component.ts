import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import { Title } from '@angular/platform-browser';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ActivatedRoute} from '@angular/router';

//services
import {ConfigService} from '../../shared/config.service';
import {BlogService} from './services/blog.service';
import {Blog} from "./models/blog";
import {AccountService} from "../account/services/account.service";


@Component({
    selector: "blog-page",
    templateUrl: "blog.component.html"
})


export class BlogComponent{
// export class BlogComponent implements OnInit,OnDestroy {
  //   // Observables
  //   public generalBlogs$:Observable<any>;
  //   public loadEvent$:BehaviorSubject<any> = new BehaviorSubject(null);
  //   public totalRecords$:BehaviorSubject<any> = new BehaviorSubject(0);
  //   public  url$:BehaviorSubject<any> = new BehaviorSubject(ConfigService.getDomain());
  //
  //
  //   //Variables
  //   public generalBlogs:Array<Blog>;
  //   public selTag:number[] = [];
  //   public blogId:number;
  //   public currentPage = 1;
  //
  //   //Flags
  //   public blogDetailFlag = false;
  //   public loadingFlagList$:BehaviorSubject<any> = new BehaviorSubject(false);
  //
  //   //Route sub
  // public sub;
  // public activeRoute$:Observable<any>;
  //
  //   public activeRouterObs;

    @Input() companyId:number = 0;
    @Input() newBlog = {};
  //
  //
  //   ngOnInit() {
  //
  //       this.blogDetailFlag = false;
  //       this.activeRoute$ =  this._activeRoute.queryParams;
  //
  //       this.activeRoute$.subscribe(params=>{
  //           this.selTag = [];
  //           this.selTag.push((params['tag'])?params['tag']:null);
  //           this.loadEvent$.next(this.selTag);
  //       });
  //
  //       this.sub = this._activeRoute.params.subscribe(params => {
  //           let id = +params['id'];
  //           if (id)
  //               this.getBlogDetails(id);
  //
  //       });
  //   }
  //
  //   ngOnChanges() {
  //       if(this.newBlog[0]){
  //           this.generalBlogs$["value"].unshift(this.newBlog[0]);
  //       }
  //
  //   }
  //
  //
  //
  //
  //   ngOnDestroy() {
  //       this.sub.unsubscribe();
  //   }
  //
  //   public getUnLike(blogIndex:number) {
  //       if (this.generalBlogs[blogIndex].liked) {
  //           this._blogservice.getBlogUnLike(this.generalBlogs[blogIndex].id).subscribe(res => {
  //
  //               this.generalBlogs[blogIndex].likes--;
  //               this.generalBlogs[blogIndex].liked = false;
  //           })
  //       }
  //
  //       this.generalBlogs$ = Observable.of(this.generalBlogs);
  //   }
  //
  //   public getLike(blogIndex:number) {
  //       if (!this.generalBlogs[blogIndex].liked) {
  //           this._blogservice.getBlogLike(this.generalBlogs[blogIndex].id).subscribe(res => {
  //
  //               this.generalBlogs[blogIndex].likes++;
  //               this.generalBlogs[blogIndex].liked = true;
  //           })
  //       }
  //
  //       this.generalBlogs$ = Observable.of(this.generalBlogs);
  //   }
  //
  //   public getBlogDetails(id:number) {
  //       this.blogId = id;
  //       this.blogDetailFlag = true;
  //   }
  //
  //   public getBlogsList() {
  //       this.loadingFlagList$.next(false);
  //       Observable.merge(
  //           this.loadEvent$
  //       )
  //       .switchMap(dataVal => {
  //           return this._blogservice.getBlogList("all", "short",this.selTag, this.currentPage, dataVal);
  //       })
  //       .subscribe(res => {
  //
  //           this.generalBlogs = res.general;
  //
  //           this.generalBlogs$ = Observable.of(this.generalBlogs);
  //
  //           this.totalRecords$.next(res["meta"]["total_count"]);
  //           this.loadingFlagList$.next(true);
  //       });
  //   }
  //
  //
  //   constructor(public _blogservice:BlogService, public _activeRoute:ActivatedRoute,public _title:Title,public _accountService:AccountService) {
  //       this._title.setTitle(ConfigService.titles["blogs"]);
  //       //URL Params Fetch
  //       this.activeRouterObs = this._activeRoute.queryParams.subscribe(params => {
  //          this.currentPage = (params["page"])?params["page"]:1;
  //       });
  //
  //       this.getBlogsList();
  //   }
}
