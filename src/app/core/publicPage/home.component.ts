import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

//Services
import {LoaderService} from "../../shared/services/loader.service";
import {BlogService} from "../../core/blog/services/blog.service";
import {Blog} from "../../core/blog/models/blog";
import {AccountService} from "../account/services/account.service";

// import * as Swiper from 'localrepo/swiper'
import * as jQuery from 'jquery'
var Swiper = require('./../../../assets/local_modules/swiper.js');
declare var Swiper:any;

// var moment = require('jquery');

// var bootstrap = require('bootstrap');
// SystemJS.import('swiper');

// declare var jQuery:any;
@Component({
    selector: "home",
    templateUrl: "home.component.html"
})


export class HomeComponent implements OnInit {

    public commonData$:BehaviorSubject<any> = new BehaviorSubject(null);
    public sectors$:BehaviorSubject<any> = new BehaviorSubject(null);
    public featuredCompanyList$:BehaviorSubject<any> = new BehaviorSubject(null);
    public loadEvent$:BehaviorSubject<any> = new BehaviorSubject(null);
    public totalRecords$:BehaviorSubject<any> = new BehaviorSubject(0);
    public loadingFlagList$:BehaviorSubject<any> = new BehaviorSubject(false);
    public pristineFlag$:BehaviorSubject<any> = new BehaviorSubject(true);
    public profileHeader$:BehaviorSubject<any> = new BehaviorSubject(null);
    public form1:FormGroup;
    public form2:FormGroup;
    public errorFlag = false;
    public errorMode = 1;
    public countryList = [];

    public selTag:number[] = [];
    public generalBlogs:Array<Blog>;
    public generalBlogs$:Observable<any>;
    public currentPage = 1;

    logout() {
        this._accountservice.getLogOutUser();

    }

    ngOnInit(){
        this._loaderService.getCountriesNonZero().subscribe(country=> {
            this.commonData$.next({countries: country.slice(0, 6)});
        });

        this._loaderService.getFeaturedCompanies().subscribe(featured_companies=> {
            let new_featured_companies = [];
            for (var i = 0; i < featured_companies.length; i += 2) {
                let hash = {first: featured_companies[i]};
                if (i + 1 < featured_companies.length) hash["second"] = featured_companies[i + 1];

                new_featured_companies.push(hash);
            }
            this.featuredCompanyList$.next(new_featured_companies);

        });

        this._loaderService.getSectors().subscribe(sectors=> {
            this.sectors$.next(sectors.slice(0, 6));
        });

        this.getBlogsList();
    }

    public getBlogsList() {
        this.loadingFlagList$.next(false);
        Observable.merge(
            this.loadEvent$
        )
        .switchMap(dataVal => {
            return this._blogservice.getBlogList("all", "short", this.selTag, this.currentPage, dataVal);
        })
        .subscribe(res => {

            this.generalBlogs = res.general;
            let newArr = [];
            for (var i = 0; i < this.generalBlogs.length; i += 2) {
                newArr.push({first: this.generalBlogs[i], second: this.generalBlogs[i + 1]});
            };

            this.generalBlogs$ = Observable.of(newArr);

            this.totalRecords$.next(res["meta"]["total_count"]);
            this.loadingFlagList$.next(true);
        });
    }

    public resetSignForm() {
        this.errorFlag = false;
        this.pristineFlag$.next(true);
        this.form1.reset()
    }

    ngAfterViewInit()  {
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            spaceBetween: 30,
        });


        jQuery(document).ready(function(){
            jQuery(document).scroll(function(e){
                var curScroll = jQuery(window).scrollTop();
                var docHeight = jQuery(document).height();
                var winHeight = jQuery(window).height();
                if(curScroll >= (docHeight - winHeight)*0.10)
                {

                    jQuery('#header_one').fadeOut().hide();
                    jQuery('#header_two').fadeIn().show();
                }
                else
                {
                    jQuery('#header_one').fadeIn().show();
                    jQuery('#header_two').fadeOut().hide();
                }

            });
        });
    }

    killAllModals() {

        jQuery('.modal').modal('hide');
        jQuery('#sign-up-home').modal('hide');
        jQuery('#sign-in-home').modal('hide');
        jQuery('body').removeClass('modal-open');
        jQuery('.modal-backdrop').remove();
    }

    openSignup(){
        this.killAllModals();
        jQuery('#sign-up-home').modal('show');
    }

    redirectPage(url) {
        this.killAllModals();
        this._router.navigate([url]);
    }

    openSignin(){
        this.killAllModals();
        jQuery('#sign-in-home').modal('show');
    }

    ngDoCheck() {
        let new_profile_header = this._accountservice.getProfileHeader();
        this.profileHeader$.next(new_profile_header);
    }

    searchJobs() {

        if(this._accountservice.getCheckEmployer() && this._accountservice.getAuth()){
            this._router.navigate(["/employer/dashboard/stats"]);
        }
        else {
            let sel_params = {};

            if(this.form2.value['title'] != "") {
                sel_params['title'] = this.form2.value['title'];
            }

            if(this.form2.value['location'] != "") {
                sel_params['loctitle'] = this.form2.value['location'];
            }


            if(this._accountservice.getAuth()){
                this._router.navigate(['/'+this._accountservice.getPath()+'/jobs/all']);
            }
            else {
                this._router.navigate(['home/jobs/all'],{queryParams: sel_params});

            }
        }
    }

    loginUser() {


        this.pristineFlag$.next(false);
        if (this.form1.valid) {


            this._accountservice.getLoginUser(this.form1.value).subscribe(res => {
                jQuery('.modal').modal('hide');
                this.errorFlag = false;
            }, error => {
                this.errorFlag = true;
                let errorJson = JSON.parse(error._body);
                if(errorJson["msg"] == "deactivated"){
                    this.errorMode = 2;
                }
                else {
                    this.errorMode = 1;
                }
            });
        }
    }

    goForgetPassword() {
        jQuery('.modal').modal('hide');
        jQuery('#sign-up-home').modal('hide');
        jQuery('#sign-in-home').modal('hide');
        this._router.navigate(["/home/forget-password"]);
    }


    constructor( public _loaderService:LoaderService,public _accountservice:AccountService, public _blogservice:BlogService,public fb:FormBuilder,public _router:Router) {

        let elements1 = {
            username: ['', Validators.required],
            rememberme: [false],
            user_password: ['', Validators.required]
        };
        this.form1 = fb.group(elements1);


        let elements2 = {
            title:[''],
            location:['']
        };

        this.form2 = fb.group(elements2);
    }
}
