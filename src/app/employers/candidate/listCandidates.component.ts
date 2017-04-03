import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Router,ActivatedRoute} from '@angular/router';


//services
import { AccountService } from '../../core/account/services/account.service';
import {CompanyService} from "../../core/services/company.service";

@Component({
    
    selector: "list-candidates-employer",
    templateUrl: "listCandidates.component.html"
})


export class ListCandidatesComponent implements OnInit {

    public loadedData:boolean = false;
    public activeRouterObs;
    public currentPage:number = 1;
    public search_string:string = '';
    public search_mode:number = 1;
    public paramsList = {};
    public orderBy = "viewers";
    public orderByName = "No. of Viewers";


    //Observables

    public jobSeekers$:BehaviorSubject<any> = new BehaviorSubject(null);
    public totalRecords$:BehaviorSubject<any> = new BehaviorSubject(0);
    public showSpinner$:BehaviorSubject<any> = new BehaviorSubject(false);
    public search_tags$= new BehaviorSubject(null);
    public title$= new BehaviorSubject(null);
    public showFilter:boolean = false;

    //Form
    public candidateNameForm:FormGroup;
    public candidateForm:FormGroup;


    //post hash map
    public postHash = {locations:"q[loc_co_in]",
                        cities:"q[loc_ci_in]",
                        sectors:"q[se_in]",
                        fareas:"q[fa_in]",
                        current_sal:"q[cur_sal_in]",
                        expect_sal:"q[exp_sal_in]",
                        edulevels:"q[je_in]",
                        explevels:"q[yoe_in]",
                        exprange:"q[exp_in]",
                        age_group:"q[age_in]",
                        language: "q[la_in]",
                        gender: "q[ge_in]",
                        notice_period: "q[not_in]",
                        visa_status: "q[vi_in]",
                        job_type:"q[jt_in]",
                        jobtypes:"q[jt_in]",
                        nationality:"q[nat_in]"
                      };


    public postHashEq = {last_active: "q[act_lteq]",job_title:"q[pos_cont]"};

    public searchCandidate(){

        if(this.candidateNameForm.valid){

            let params = this.paramsList;

            for (var key in this.candidateNameForm.value) {
                if (this.candidateNameForm.value.hasOwnProperty(key)) {
                        params[key] = this.candidateNameForm.value[key];
                }
            }

            this._router.navigate(['/'+this._accountService.getPath()+'/candidate/list'],{queryParams:params});
        }
    }

    ngOnInit(){

        this.loadedData = true;
        let search_tags = {};
        search_tags["locations"] = {};



        //URL Params Fetch
        this.activeRouterObs = this._activeRoute.queryParams.subscribe(params => {

            let postQuery =  "";
            this.paramsList = {};
            if(params) {

                Object.assign(this.paramsList, params);
            }
            this.showSpinner$.next(true);

            this.currentPage = (params["page"])?params["page"]:1;
            this.orderBy = (params["order_by"])?params["order_by"]:"viewers";
            this.search_string = (params["cand_name"])?params["cand_name"]:"";
            this.search_mode = (params["search_mode"])?params["search_mode"]:1;


            this.search_tags$.next(this.paramsList);


            for (var key in this.candidateNameForm.value) {
                if (params.hasOwnProperty(key)) {
                    this.candidateNameForm.controls[key].setValue(params[key]);
                }
            }


            for (var key in this.paramsList) {
                if (params.hasOwnProperty(key)) {
                    let paramSplit = params[key].split(',');
                    paramSplit.forEach(selVal => {
                        if(this.postHash[key]) {
                            postQuery += "&"+this.postHash[key]+"[]="+selVal;
                        }
                        if(this.postHashEq[key]){
                            postQuery += "&"+this.postHashEq[key]+"="+selVal;
                        }

                    });

                }
            }

            this._companyService.getJobseekers(this.currentPage,this.search_string,this.orderBy,postQuery,this.search_mode).subscribe(res=>{
                this.jobSeekers$.next(res);

                // this.followingProfiles$.next(res);
                this.showSpinner$.next(false);
                this.totalRecords$.next(res["meta"]["total_count"]);
            });

        });
    }


    sortBy(orderBy,orderName) {
        this.orderByName = orderName;
        this.paramsList['order_by'] = orderBy;
        this._router.navigate(['/'+this._accountService.getPath()+'/candidate/list'],{queryParams:this.paramsList})
    }

    onBack(){
       this._router.navigate(['/'+this._accountService.getPath()+'/candidate'],{queryParams:{}})
    }

    constructor(private _accountService:AccountService,private _fb:FormBuilder,
                private _companyService:CompanyService,
                private _activeRoute:ActivatedRoute,
                private _router:Router) {

        this.candidateNameForm = this._fb.group({
            cand_name:[''],
            search_mode:['1']
        });

        this.candidateForm = this._fb.group({
            locations:[''],
            cities:[''],
            job_title:[''],
            fareas:[''],
            sectors:[''],
            explevels:[''],
            exprange:[''],
            edulevels:[''],
            current_sal:[''],
            expect_sal:[''],
            nationality:[''],
            age_group:[''],
            language:[''],
            gender:[''],
            notice_period:[''],
            last_active:[''],
            visa_status:[''],
            job_type:[''],
        });
    }
}
