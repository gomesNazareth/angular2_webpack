import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {BlogService} from './services/blog.service';
import {AccountService} from "../account/services/account.service";


@Component({
    selector: "top-viewed-blog",
    templateUrl: "topViewedBlog.component.html"
})


export class TopViewedBlogComponent implements OnInit {

    public topViewedBlogs$:Observable<any>;
    public loadingtags$:BehaviorSubject<any> = new BehaviorSubject(false);
    public tags$:BehaviorSubject<any> = new BehaviorSubject(null);
    public loadingFlagList$:BehaviorSubject<any> = new BehaviorSubject(false);

    ngOnInit() {
        this.getTags();

        this.getTopBlogs();
    }

     getTags(){
        this.loadingtags$.next(true);

        this._blogservice.getBlogTags().subscribe(res => {
            this.loadingtags$.next(false);
            this.tags$.next(res);
        })
    }

    getTopBlogs() {
        this.loadingFlagList$.next(false);
        this._blogservice.getTopBlogList("all", "short").subscribe(res=>{
            this.loadingFlagList$.next(true);
            this.topViewedBlogs$ = Observable.of(res.top);
        });
    }

    constructor(public _blogservice:BlogService,public _accountService:AccountService) {

    }
}
