
import {OnInit,Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Router,ActivatedRoute} from '@angular/router';


//Service
import {JobService} from './services/job.service';
import {GeneralService} from  '../../shared/services/general.service';
import {AccountService} from "../../core/account/services/account.service";
declare var jQuery:any;


@Component({

    selector: "saved-search",
    templateUrl: "savedSearch.component.html"
})

export class SavedSearchComponent implements OnInit {
    public form1:FormGroup;

    //Observable
    public jobs$:BehaviorSubject<any> = new BehaviorSubject(null);
    public alertTypes$:BehaviorSubject<any> = new BehaviorSubject(null);
    public savedSearchPagination$: BehaviorSubject<any> = new BehaviorSubject(null);
    public totalRecords$:BehaviorSubject<any> = new BehaviorSubject(0);
    public activeRouterObs;
    public listJobsIds = [];

    //flags
    public displaySpinner$:BehaviorSubject<any> = new BehaviorSubject(true);

    //members
    public jobs;
    public flag = false;
    public page:number = 1;

    public displayDelete:boolean = false;
    public displayDelete$:BehaviorSubject<any> = new BehaviorSubject(false);

    constructor(public _jobservice:JobService, public fb:FormBuilder, public _accountService:AccountService,public _router:Router,
                public _activeRoute:ActivatedRoute, public _generalservice:GeneralService) {
        let elements1 = {
            check_all: ['', Validators.required]
        }
        this.form1 = fb.group(elements1);

        let clickEvent = this.form1.controls["check_all"].valueChanges;
        let loadEvent = new BehaviorSubject(null);


        //URL Params Fetch
        this.activeRouterObs = this._activeRoute.queryParams.subscribe(params => {
            this.displaySpinner$.next(true);

            this.page = (params["page"]) ? params["page"] : 1;
            this.savedSearchPagination$.next(false);
        });

        Observable.merge(
            clickEvent,
            this.savedSearchPagination$
        )
        .switchMap(flag =>{
            this.flag = flag;this.displayDelete = flag;
            this.displayDelete$.next(this.displayDelete);
            return this._jobservice.getSavedSearchJobList(this.page,this.flag);
        })
        .subscribe(res => {
            this.displaySpinner$.next(false);

            this.totalRecords$.next(res["meta"]["total_count"]);
            if (this.page >1 && res["meta"]["total_pages"] < this.page){
                this.page = this.page - 1;
                this._router.navigate([this._accountService.getPath() + '/jobs/saved-searches'], { queryParams: {page:this.page} });
            }

            this.jobs = res["jobs"];

           this.jobs$.next(this.jobs);
        });
    }

    reloadData($event) {
        let selIndex = null;

        this.jobs.forEach((seljob,index) => {
            if(seljob.id == $event.id){

                seljob.title = $event.title;

               seljob.alertType =   $event.alert_type_name;

               seljob.alertTypeId = $event.alert_type_id;
            }
        });

        this.jobs$.next(this.jobs);
    }

    toggleCheckbox(index:number){
        this.jobs[index]["checked"] = (this.jobs[index]["checked"])? false:true;

        if(this.jobs[index]["checked"]){

            if(this.listJobsIds.indexOf(this.jobs[index]["id"]) == -1){
                this.listJobsIds.push(this.jobs[index]["id"]);
            }
        }
        else {
            let selIndex = this.listJobsIds.indexOf(this.jobs[index]["id"]);
            if(selIndex != -1){
                this.listJobsIds.splice(selIndex,1);
            }
        }


    }

    deleteAllSavedSearch() {
        let listJobsIds = [];
        if(this.jobs.length >0){
            this.jobs.forEach((selectedjob,index)=>{

               if(selectedjob["checked"] == true){
                   listJobsIds.push(selectedjob.id);
               }
            })
        }

        this.displaySpinner$.next(true);
        this.listJobsIds = [];
        this.displayDelete$.next(false);
        this.form1.controls["check_all"].setValue(false);
        this._jobservice.getDeleteAllSavedSearchJobList(this.page,listJobsIds)
            .subscribe(res => {
                jQuery('.close_delete').modal('hide');
                Observable.timer(1000).subscribe(val=>{

                    this.listJobsIds = [];


                    let totalcnt = Math.ceil(res["jobs"]["length"]/10);
                    if(totalcnt < this.page && this.page > 1) {
                        this.page = this.page -1;
                        this._router.navigate([this._accountService.getPath() + '/jobs/saved-searches'], { queryParams: {page:this.page} });
                    }
                    else {
                        this._jobservice.getSavedSearchJobList(this.page,this.flag).subscribe(jobres => {

                            this.totalRecords$.next(jobres["meta"]["total_count"]);
                            this.jobs = jobres["jobs"];
                            this.jobs$.next(this.jobs);
                        })
                    }
                });




            })
    }



    deleteSavedSearch(id:number){

        jQuery('.close_delete').modal('hide');
        this.displaySpinner$.next(true);
        this._jobservice.getDeleteSavedSearchJobList(this.page,id)
            .subscribe(res => {



                this.displaySpinner$.next(false);

                this.jobs = res["jobs"];
                this.jobs$.next(this.jobs);
            })
    }


    ngOnDestroy() {
        this.activeRouterObs.unsubscribe();

    }

    ngOnInit() {
        this._generalservice.getAlertTypes().subscribe(res=>{

            this.alertTypes$.next(res["alert_types"]);
        })
    }
}
