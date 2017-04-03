
import {OnInit,Output,EventEmitter,Component} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import {BehaviorSubject} from 'rxjs/Rx';

import {ActivatedRoute} from '@angular/router';


//Service
import {JobService} from './services/job.service';
import {AccountService} from "../../core/account/services/account.service";

declare var jQuery;

@Component({

    selector: "saved-jobs",
    templateUrl: "savedJobs.component.html"
})

export class SavedJobsComponent implements OnInit {

    //observables
    public jobs$:BehaviorSubject<any> = new BehaviorSubject(null);
    public order_name$: BehaviorSubject<any> = new BehaviorSubject('Date Posted');
    public loadEvent$: BehaviorSubject<any> = new BehaviorSubject(null);
    public totalRecords$:BehaviorSubject<any> = new BehaviorSubject(0);

    public currentPage:number = 1;
    public activeRouterObs;

    //forms
    public form1:FormGroup;

    //members
    public jobs:any = null;
    public order_string:any = null;

    //Flags
    public checkallFlag:boolean = false;
    public displaySpinner$:BehaviorSubject<any> = new BehaviorSubject(true);
    public savedJobsPagination$: BehaviorSubject<any> = new BehaviorSubject(null);


    @Output() jobDetailsClick = new EventEmitter();


    onClickJobDetail(id:number) {
        this.jobDetailsClick.emit({"id": id,"fromPage":"savedJobs"});
    }



    onSelectOrder(mode= null,name='None') {
        this.order_name$.next(name);

        this.displaySpinner$.next(true);
        this.order_string = mode;
        this.savedJobsPagination$.next(null);
    }

    constructor(public _jobservice:JobService,public fb:FormBuilder,public _activeRoute:ActivatedRoute,public _accountService:AccountService){


    }

    onDeleteJobs(){
      let jobsIdsListDelete = [];
      let jobsIdsListDeleteIndex = [];


        this.jobs.forEach((seljob,index)=>{

           if(seljob.checkedFlag){
               jobsIdsListDelete.push(seljob.id);
               jobsIdsListDeleteIndex.push(index);
           }
        });

        if(jobsIdsListDelete.length >0){
            this.displaySpinner$.next(true);
            this._jobservice.getDeleteSavedJobList(jobsIdsListDelete)
                .subscribe(res => {
                    jobsIdsListDeleteIndex.forEach(selIndex=>{
                        this.jobs.splice(selIndex,1);
                        jQuery('.close_delete').modal('hide');

                    });

                    this.jobs$.next(this.jobs)
                    this.displaySpinner$.next(false);
                })
        }
        else {
            jQuery('.close_delete').modal('hide');
        }
    }

    onSelectJob(index:number){
        this.jobs[index].checkedFlag = (this.jobs[index].checkedFlag)?false:true;
        this.jobs$.next(this.jobs);

        let isDeletedChecked = false;
        this.jobs.forEach(selJob => {isDeletedChecked =(selJob.checkedFlag || isDeletedChecked == true)?true:false;});
        if(isDeletedChecked == false) {
            this.checkallFlag = false;
            this.form1.controls["check_all"].setValue(false);
        }
        else {
            this.checkallFlag = true;
        }
    }

    filterByDate() {
        this.checkallFlag = true;
    }

    ngOnInit() {
        let elements1 = {
            check_all:['',Validators.required],
            sortby_today:['',Validators.required]
        }
        this.form1 = this.fb.group(elements1);

        //URL Params Fetch
        this.activeRouterObs = this._activeRoute.queryParams.subscribe(params => {
            this.displaySpinner$.next(true);
            this.currentPage = (params["page"])?params["page"]:1;
            this.savedJobsPagination$.next(false);
        });

        let clickEvent = this.form1.controls["check_all"].valueChanges;
        let dateEvent = this.form1.controls["sortby_today"].valueChanges;

        Observable.merge(
            clickEvent,
            this.savedJobsPagination$,
            dateEvent
        )
        .switchMap(flag =>{
            this.checkallFlag = flag;
            return this._jobservice.getSavedJobList(this.currentPage,flag,this.order_string);
        })
        .subscribe(res => {
            this.displaySpinner$.next(false);
            this.jobs = res.jobs;
            this.jobs$.next(this.jobs);

            this.totalRecords$.next(res["meta"]["total_count"]);
        })
    }
}
