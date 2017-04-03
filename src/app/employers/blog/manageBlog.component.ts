import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ActivatedRoute} from '@angular/router';

import {BlogService} from '../../core/blog/services/blog.service';
// import any = jasmine.any;
import {AccountService} from "../../core/account/services/account.service";

declare var jQuery:any;

@Component({

    selector: "manage-blog",
    templateUrl: "manageBlog.component.html"
})

export class ManageBlogComponent implements OnInit {

    public generalBlogs$:Observable<any>;
    public totalRecords$:BehaviorSubject<any> = new BehaviorSubject(0);
    public showSpinner$:BehaviorSubject<any> = new BehaviorSubject(true);
    public currentPage = 1;

    //Route sub
    public activeRoute$:Observable<any>;

    ngOnInit() {
        this.activeRoute$ =  this._activeRoute.queryParams;

        this.getBlogsList();
    }

    public getBlogsList() {
        // []: No filter by tag & No query
        this.showSpinner$.next(true);
        this._blogservice.getBlogList("all", "short",[], this.currentPage, "").subscribe(res => {

            this.generalBlogs$ = Observable.of(res.general);

            this.totalRecords$.next(res["meta"]["total_count"]);
            this.showSpinner$.next(false);
        });
    }

    deleteBlog(blogId:number) {
        this._blogservice.deleteBlog(blogId).subscribe(res =>{

            jQuery('.close_delete').modal('hide');
            Observable.of(1).delay(2000)
            .subscribe(x => {
                this.getBlogsList();
            });
        });
    }

    constructor(public _blogservice:BlogService, public _activeRoute:ActivatedRoute,public _accountService:AccountService) {
        //URL Params Fetch
        this._activeRoute.queryParams.subscribe(params => {
            this.currentPage = (params["page"]) ? params["page"] : 1;
            this.getBlogsList();
        });
    }
}
