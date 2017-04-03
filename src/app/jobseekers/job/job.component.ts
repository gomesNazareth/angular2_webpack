import {OnInit,Component} from '@angular/core';
import { Title } from '@angular/platform-browser';

//services
import {ActivatedRoute, Router} from '@angular/router';
import {ConfigService} from '../../shared/config.service'
import {AccountService} from "../../core/account/services/account.service";
import {Location} from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

var moment = require('moment');
require('localrepo/scrolltab');



declare var jQuery;

@Component({

    selector: "job-listing",
    templateUrl: "job.component.html"
})

export class JobComponent implements OnInit {

    //Flags
    public allJobsFlag:boolean = true;
    public suggestJobsFlag:boolean = false;
    public myJobsFlag:boolean = false;
    public savedSearchFlag:boolean = false;
    public savedJobsFlag:boolean = false;
    public jobDetailsFlag:boolean = false;

    public isPublic$:BehaviorSubject<any> = new BehaviorSubject(null);

    //Variables
    public jobId:number;
    public fromPage:string;
    public locations = [];

    //Observable
    public parameterObz;

    public onReset() {

        this.allJobsFlag = false;
        this.suggestJobsFlag = false;
        this.myJobsFlag = false;
        this.savedSearchFlag = false;
        this.savedJobsFlag = false;
        this.jobDetailsFlag = false;
    }

    public onClickAllJobs(){

        this.allJobsFlag = true;
        this.suggestJobsFlag = false;
        this.myJobsFlag = false;
        this.savedSearchFlag = false;
        this.savedJobsFlag = false;
        this.jobDetailsFlag = false;
    }

    public onClickSuggestJobs(){
        this.allJobsFlag = false;
        this.suggestJobsFlag = true;
        this.myJobsFlag = false;
        this.savedSearchFlag = false;
        this.savedJobsFlag = false;
        this.jobDetailsFlag = false;
    }

    public onClickMyJobs(){

        this.allJobsFlag = false;
        this.suggestJobsFlag = false;
        this.myJobsFlag = true;
        this.savedSearchFlag = false;
        this.savedJobsFlag = false;
        this.jobDetailsFlag = false;
    }

    public onClickSavedSearch(){

        this.allJobsFlag = false;
        this.suggestJobsFlag = false;
        this.myJobsFlag = false;
        this.savedSearchFlag = true;
        this.savedJobsFlag = false;
        this.jobDetailsFlag = false;
    }

    public onClickSavedJobs(){

        this.allJobsFlag = false;
        this.suggestJobsFlag = false;
        this.myJobsFlag = false;
        this.savedSearchFlag = false;
        this.savedJobsFlag = true;
        this.jobDetailsFlag = false;
    }

    public onClickjobDetail($event){

        if($event.id) {
            this.jobId = $event.id;
            this.fromPage = $event.fromPage;
        }

        this.allJobsFlag = false;
        this.suggestJobsFlag = false;
        this.myJobsFlag = false;
        this.savedSearchFlag = false;
        this.savedJobsFlag = false;
        this.jobDetailsFlag = true;
    }


    public onClickjobDetails(id:number){

        this.fromPage ="";
        this.jobId = id;
        this.allJobsFlag = false;
        this.suggestJobsFlag = false;
        this.myJobsFlag = false;
        this.savedSearchFlag = false;
        this.savedJobsFlag = false;
        this.jobDetailsFlag = true;
    }

    public onClickBack($event){

        if($event.type)
        {
            if($event.type == "savedJobs")
            {
                this.onClickSavedJobs();
            }
            else if($event.type == "allJobs")
            {
                this.onClickAllJobs()
            }
            else if($event.type == "suggestedJobs")
            {
                this.onClickSuggestJobs()
            }
            else {

                this.onClickAllJobs();
            }


        }
    }

    constructor(public route:ActivatedRoute,public _title:Title,public _accountService:AccountService,
                public _router: Router, public _location:Location) {

        this._title.setTitle(ConfigService.titles["jobs"]);
    }


    ngAfterViewInit() {


        jQuery(document).scroll(function(e){
            var curScroll = jQuery(window).scrollTop();
            var docHeight = jQuery(document).height();
            var winHeight = jQuery(window).height();
            if(curScroll >= (docHeight - winHeight)*0){
                jQuery('#filter').fadeIn().show();
            }
            else{
                jQuery('#filter').fadeOut().hide();
            }
        });

        jQuery(document).ready(function(){
          jQuery('#tabs2').scrollTabs();
        });
    }

    ngOnDestroy() {
        this.parameterObz.unsubscribe();
    }


    ngOnInit() {

        this.parameterObz = this.route.params;
        this.parameterObz.subscribe(params => {
            this.onReset();
            let mode = params['mode'];
            let id = params['id'];
            let search_string = params['search_string'];
            if (mode == "suggested-jobs")
            {
                this.onClickSuggestJobs();
            }
            else if (mode == "all" || mode == "search" )
            {
                this.locations = params['locations'];


                this.onClickAllJobs();
            }
            else if (mode == "saved-searches")
            {
                this.onClickSavedSearch();
            }
            else if (mode == "saved-jobs")
            {
                this.onClickSavedJobs();
            }
            else if (mode == "my-jobs")
            {
                this.onClickMyJobs();
            }
            else if(id)
            {
                this.onClickjobDetails(id);
            }
            else {
                this.onClickAllJobs();
            }
        });

        this._router.events.subscribe(params => {
            this.isPublic$.next(this._location.path().indexOf('/home/') != -1);
        });

    }
}
