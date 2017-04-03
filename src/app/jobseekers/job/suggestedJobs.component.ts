import {OnInit, EventEmitter, Output, Input,Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';




//Service
import {JobService} from './services/job.service';
import {AccountService} from "../../core/account/services/account.service";

@Component({

    selector: "suggested-jobs",
    templateUrl: "suggestedJobs.component.html"
})

export class SuggestedJobsComponent implements OnInit {

    public form1: FormGroup;
    public checkallFlag: boolean = false;
    public order_string ="";
    public order_name$:BehaviorSubject<any> = new BehaviorSubject("Date Posted");
    public totalRecords$:BehaviorSubject<any> = new BehaviorSubject(0);

    public currentPage:number = 1;
    public activeRouterObs;

    //flags
    public displaySpinner$: BehaviorSubject<any> = new BehaviorSubject(true);

    @Output() jobDetailsClick = new EventEmitter();
    @Input() fromPage: string;

    public jobs$: BehaviorSubject<any> = new BehaviorSubject(null);
    public dateEvent$: BehaviorSubject<any> = new BehaviorSubject(null);
    public suggestedPagination$: BehaviorSubject<any> = new BehaviorSubject(null);


    onClickJobDetail(id: number) {
        this.jobDetailsClick.emit({"id": id, "fromPage": "suggestedJobs"});
    }

    onSelectOrder(mode= null,name='None') {

        this.order_name$.next(name);
        this.displaySpinner$.next(true);
        this.order_string = mode;
        this.suggestedPagination$.next(this.currentPage);
    }


    constructor(public _jobservice: JobService, public fb: FormBuilder,public _activeRoute:ActivatedRoute,public _accountService:AccountService) {


        let elements1 = {
            sortby_today: ['', Validators.required]
        }
        this.form1 = fb.group(elements1);

        let loadEvent = new BehaviorSubject(null);

        //URL Params Fetch
        this.activeRouterObs = this._activeRoute.queryParams.subscribe(params => {
            this.displaySpinner$.next(true);
            this.currentPage = (params["page"])?params["page"]:1;
            this.suggestedPagination$.next(this.currentPage);
        });

        Observable.merge(

            this.suggestedPagination$
        )
        .switchMap(flag => this._jobservice.getSuggestedJobList(this.currentPage,this.order_string)).subscribe(res => {
            this.displaySpinner$.next(false);
            this.jobs$.next(res.jobs);

            this.totalRecords$.next(res["meta"]["total_count"]);
        })
    }

    ngOnInit() {

    }

}
