
import {OnInit,Output,EventEmitter,Input,Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {FormBuilder, FormGroup, FormControl,Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import  {GeneralService} from '../../shared/services/general.service';



//Directives


import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Router} from '@angular/router';




@Component({

     selector: "search-tag-module",
    template:`
<div class="row hidden-xs hidden-sm" *ngIf="(filterList$ |async )!= null && 
                ( 
                (filterList$ |async )?.locations?.length  >0 || 
                (filterList$ |async )?.cities?.length   >0 ||
                (filterList$ |async )?.sectors?.length   >0 ||
                (filterList$ |async )?.fareas?.length   >0 ||
                (filterList$ |async )?.jobtypes?.length   >0 ||
                (filterList$ |async )?.job_type?.length   >0 ||
                (filterList$ |async )?.expect_sal?.length   >0 ||
                (filterList$ |async )?.current_sal?.length   >0 ||
                (filterList$ |async )?.salarylevels?.length   >0 ||
                (filterList$ |async )?.edulevels?.length   >0 ||
                (filterList$ |async )?.explevels?.length   >0 ||
                (filterList$ |async )?.nationality?.length   >0 ||
                (filterList$ |async )?.notice_period?.length   >0 ||
                (filterList$ |async )?.last_active?.length   >0 ||
                (filterList$ |async )?.exprange?.length   >0 ||
                (filterList$ |async )?.gender?.length   >0 ||
                (filterList$ |async )?.age_group?.length   >0 ||
                (filterList$ |async )?.visa_status?.length   >0 ||
                (filterList$ |async )?.language?.length   >0 ||
                (filterList$ |async )?.companies?.length   >0
                ) || (titleObs| async) != null || (loctitleObs | async) != null "   >
<div class="block-contant" id="tag-job">
                 <div *ngIf="(titleObs| async)" class="Profile-tag" >
                            <span class="tage-name">{{(titleObs| async)}}</span>
                            <span ><i (click)="onClickTag(null,'title')" class="zmdi zmdi-close"></i></span>
                            </div>
                            
                 <div *ngIf="(loctitleObs| async)" class="Profile-tag" >
                            <span class="tage-name">{{(loctitleObs| async)}}</span>
                            <span ><i (click)="onClickTag(null,'loctitle')" class="zmdi zmdi-close"></i></span>
                            </div>
         

                <span *ngIf="(filterList$ |async )!= null && 
                ( 
                (filterList$ |async )?.locations?.length  >0 || 
                (filterList$ |async )?.cities?.length   >0 ||
                (filterList$ |async )?.sectors?.length   >0 ||
                (filterList$ |async )?.expect_sal?.length   >0 ||
                (filterList$ |async )?.current_sal?.length   >0 ||
                (filterList$ |async )?.fareas?.length   >0 ||
                (filterList$ |async )?.jobtypes?.length   >0 ||
                (filterList$ |async )?.job_type?.length   >0 ||
                (filterList$ |async )?.salarylevels?.length   >0 ||
                (filterList$ |async )?.edulevels?.length   >0 ||
                (filterList$ |async )?.explevels?.length   >0 ||
                (filterList$ |async )?.visa_status?.length   >0 ||
                (filterList$ |async )?.nationality?.length   >0 ||
                (filterList$ |async )?.notice_period?.length   >0 ||
                (filterList$ |async )?.last_active?.length   >0 ||
                (filterList$ |async )?.exprange?.length   >0 ||
                (filterList$ |async )?.gender?.length   >0 ||
                (filterList$ |async )?.age_group?.length   >0 ||
                (filterList$ |async )?.language?.length   >0 ||
                (filterList$ |async )?.companies?.length   >0
                ) ">
                           
              
                            <div *ngFor="let selectedObj of (filterList$ |async).locations,let i =index" class="Profile-tag" >
                     
                            <span class="tage-name">{{selectedObj.name}}</span>
                            <span ><i (click)="onClickTag(i,'locations')" class="zmdi zmdi-close"></i></span>
                            </div>
                            <div *ngFor="let selectedObj of (filterList$ |async).cities,let i =index" class="Profile-tag" >
                            <span class="tage-name">{{selectedObj.name}}</span>
                            <span ><i (click)="onClickTag(i,'cities')" class="zmdi zmdi-close"></i></span>
                            </div>
                            <div *ngFor="let selectedObj of (filterList$ |async).sectors,let i =index" class="Profile-tag" >
                            <span class="tage-name">{{selectedObj.name}}</span>
                            <span ><i (click)="onClickTag(i,'sectors')" class="zmdi zmdi-close"></i></span>
                            </div>
                            
                            <div *ngFor="let selectedObj of (filterList$ |async).gender,let i =index" class="Profile-tag" >
                            <span class="tage-name">{{selectedObj.name}}</span>
                            <span ><i (click)="onClickTag(i,'gender')" class="zmdi zmdi-close"></i></span>
                            </div>
                            
                            <div *ngFor="let selectedObj of (filterList$ |async).notice_period,let i =index" class="Profile-tag" >
                            <span class="tage-name">{{selectedObj.name}}</span>
                            <span ><i (click)="onClickTag(i,'notice_period')" class="zmdi zmdi-close"></i></span>
                            </div>
                            
                            
                            
                            <div *ngFor="let selectedObj of (filterList$ |async).last_active,let i =index" class="Profile-tag" >
                            <span class="tage-name">{{selectedObj.name}}</span>
                            <span ><i (click)="onClickTag(i,'last_active')" class="zmdi zmdi-close"></i></span>
                            </div>
                            
                            
                            <div *ngFor="let selectedObj of (filterList$ |async).exprange,let i =index" class="Profile-tag" >
                            <span class="tage-name">{{selectedObj.name}}</span>
                            <span ><i (click)="onClickTag(i,'exprange')" class="zmdi zmdi-close"></i></span>
                            </div>
                            
                            <div *ngFor="let selectedObj of (filterList$ |async).expect_sal,let i =index" class="Profile-tag" >
                            <span class="tage-name">{{selectedObj.name}}</span>
                            <span ><i (click)="onClickTag(i,'expect_sal')" class="zmdi zmdi-close"></i></span>
                            </div>
                            
                            <div *ngFor="let selectedObj of (filterList$ |async).current_sal,let i =index" class="Profile-tag" >
                            <span class="tage-name">{{selectedObj.name}}</span>
                            <span ><i (click)="onClickTag(i,'current_sal')" class="zmdi zmdi-close"></i></span>
                            </div>
                            
                            <div *ngFor="let selectedObj of (filterList$ |async).language,let i =index" class="Profile-tag" >
                            <span class="tage-name">{{selectedObj.name}}</span>
                            <span ><i (click)="onClickTag(i,'language')" class="zmdi zmdi-close"></i></span>
                            </div>
                            
                             <div *ngFor="let selectedObj of (filterList$ |async).visa_status,let i =index" class="Profile-tag" >
                            <span class="tage-name">{{selectedObj.name}}</span>
                            <span ><i (click)="onClickTag(i,'visa_status')" class="zmdi zmdi-close"></i></span>
                            </div>
                            
                            <div *ngFor="let selectedObj of (filterList$ |async).age_group,let i =index" class="Profile-tag" >
                            <span class="tage-name">{{selectedObj.name}}</span>
                            <span ><i (click)="onClickTag(i,'age_group')" class="zmdi zmdi-close"></i></span>
                            </div>
                            
                            
                            <div *ngFor="let selectedObj of (filterList$ |async).job_type,let i =index" class="Profile-tag" >
                            <span class="tage-name">{{selectedObj.name}}</span>
                            <span ><i (click)="onClickTag(i,'job_type')" class="zmdi zmdi-close"></i></span>
                            </div>
                            
                            
                            
                            <div *ngFor="let selectedObj of (filterList$ |async).fareas,let i =index" class="Profile-tag" >
                            <span class="tage-name">{{selectedObj.name}}</span>
                            <span ><i (click)="onClickTag(i,'fareas')" class="zmdi zmdi-close"></i></span>
                            </div>
                            <div *ngFor="let selectedObj of (filterList$ |async).jobtypes,let i =index" class="Profile-tag" >
                            <span class="tage-name">{{selectedObj.name}}</span>
                            <span ><i (click)="onClickTag(i,'jobtypes')" class="zmdi zmdi-close"></i></span>
                            </div>
                            
                            
                            
                            <div *ngFor="let selectedObj of (filterList$ |async).salarylevels,let i =index" class="Profile-tag" >
                            <span class="tage-name" *ngIf="selectedObj.salary_to <= 10000">{{selectedObj.salary_from | number}}-{{selectedObj.salary_to | number}}</span>
                            <span class="tage-name" *ngIf="selectedObj.salary_to > 10000">{{selectedObj.salary_from | number}}+</span>
                            <span ><i (click)="onClickTag(i,'salarylevels')" class="zmdi zmdi-close"></i></span>
                            </div>
                            
                            
                            <div *ngFor="let selectedObj of (filterList$ |async).edulevels,let i =index" class="Profile-tag" >
                            <span class="tage-name">{{selectedObj.name}}</span>
                            <span ><i (click)="onClickTag(i,'edulevels')" class="zmdi zmdi-close"></i></span>
                            </div>
                            
                            
                            <div *ngFor="let selectedObj of (filterList$ |async).explevels,let i =index" class="Profile-tag" >
                            <span class="tage-name">{{selectedObj.name}}</span>
                            <span ><i (click)="onClickTag(i,'explevels')" class="zmdi zmdi-close"></i></span>
                            </div>
                            
                            
                            <div *ngFor="let selectedObj of (filterList$ |async).companies,let i =index" class="Profile-tag" >
                            <span class="tage-name">{{selectedObj.name}}</span>
                            <span ><i (click)="onClickTag(i,'companies')" class="zmdi zmdi-close"></i></span>
                            </div>
                            
                           
                            
                            
                            <div *ngFor="let selectedObj of (filterList$ |async).nationality,let i =index" class="Profile-tag" >
                            <span class="tage-name">{{selectedObj.name}}</span>
                            <span ><i (click)="onClickTag(i,'nationality')" class="zmdi zmdi-close"></i></span>
                            </div>
                            
                        </span>

    </div>

    </div>
`
})

export class SearchTagComponent implements OnInit {

    //Observables
    public queryParams$;
    public activeRouterObs;
    public currentPageObs:BehaviorSubject<any> = new BehaviorSubject(null);
    public pages$:BehaviorSubject<any> = new BehaviorSubject(null);
    public totalPages$:BehaviorSubject<any> = new BehaviorSubject(null);
    public maxPages$:BehaviorSubject<any> = new BehaviorSubject(null);
    public filterList$:BehaviorSubject<any> = new BehaviorSubject(null);

    //hash keys
    public paramsHash = {
        locations: "locations",
        cities: "cities",
        sectors: "sectors",
        fareas: "fareas",
        jobtypes: "jobtypes",
        salarylevels: "salarylevels",
        edulevels: "edulevels",
        explevels: "explevels",
        companies: 'companies',
        nationality: 'nationality',
        job_type: 'job_type',
        visa_status: 'visa_status',
        language: 'language',
        age_group: 'age_group',
        expect_sal: 'expect_sal',
        current_sal: 'current_sal',
        gender: 'gender',
        notice_period: 'notice_period',
        last_active: 'last_active',
        exprange: 'exprange'
    };


    public paramsList = ["locations","cities", "sectors", "fareas", "jobtypes", "salarylevels", "edulevels", "explevels", "companies", "nationality", "job_type", "visa_status", "language", "age_group", "expect_sal", "current_sal", "gender", "notice_period", "last_active", "exprange"];
    public filterList = {
        locations: [],
        cities: [],
        sectors: [],
        fareas: [],
        jobtypes: [],
        salarylevels: [],
        edulevels: [],
        explevels: [],
        companies: [],
        nationality: [],
        job_type: [],
        visa_status: [],
        language: [],
        age_group: [],
        expect_sal: [],
        current_sal: [],
        gender: [],
        notice_period: [],
        last_active: [],
        exprange: []
    };
    public countryWithCities = {};



    public pagination_url = {};
    public pages = [];
    public maxPages = 5;


    //Input
    @Input() url:string ='/jobs/all';
    @Input() currentPage:number = 1;
    @Input() totalPages:number = 0;
    @Input() titleObs:BehaviorSubject<any>;
    @Input() loctitleObs:BehaviorSubject<any>;
    @Input() search_tagsObs:BehaviorSubject<any>;

    public constructor( public _router: Router,
                        public _activeRoute:ActivatedRoute,
                        public _generalservice : GeneralService,
                        fb: FormBuilder){



    }




    public _rebuildPageURL(type){
        let arryList = [];
        this.filterList[this.paramsHash[type]].forEach(selFilter =>{
            arryList.push(selFilter.id);
        });

        if(arryList.length == 0){
            delete this.pagination_url[this.paramsHash[type]];
        }
        else{
            this.pagination_url[this.paramsHash[type]] = arryList;

        }
    }

    public onClickTag(index:number,type:string){


        if(type == "loctitle"){
            this.titleObs.next("");
            delete this.pagination_url["loctitle"];

        }
        else if(type == "title"){
            this.titleObs.next("");
            delete this.pagination_url["title"];

        }
        else
        {


            if(type == "locations") {
                let citesToRemove = [];
                let newCityList = [];
                this.filterList[this.paramsHash["cities"]].forEach((selFilter,city_index) =>{

                    if(selFilter.country.id != this.filterList[this.paramsHash[type]][index].id) {
                        newCityList.push(selFilter);
                    }
                });

                this.filterList[this.paramsHash["cities"]] = newCityList;
                this.filterList$.next(this.filterList);
                this._rebuildPageURL("cities");
            }

            this.filterList[this.paramsHash[type]].splice(index,1);
            this.filterList$.next(this.filterList);
            this._rebuildPageURL(type);


        }


        this._router.navigate([this.url],{queryParams:this.pagination_url});


    }



    ngOnDestroy() {
        this.queryParams$.unsubscribe();
    }


    public _restFilter(selparams){

        // this.filterList = {locations:[],cities:[],sectors:[],fareas:[],jobtypes:[],salarylevels:[],edulevels:[],explevels:[],companies:[]};
        this.filterList[selparams] = [];
        this.filterList$.next(this.filterList);
    }


    ngOnInit(){


        this.search_tagsObs.subscribe(res => {

            this.paramsList.forEach(selparams => {



                if(res[this.paramsHash[selparams]] && res[this.paramsHash[selparams]].length >0) {



                    if(selparams == "locations")
                        this._generalservice.getCountries("auto", res,'').subscribe(res2 => {

                            this.filterList.locations = res2;
                            this.filterList$.next(this.filterList);


                        });



                    if(selparams == "nationality")
                        this._generalservice.getNationality("auto",res,'').subscribe(res2 => {
                            this.filterList.nationality = res2;
                            this.filterList$.next(this.filterList);

                        });


                    if(selparams == "cities")
                        this._generalservice.getCitiesList([],res,10,'').subscribe(res2 => {

                            this.filterList.cities = res2;
                            this.filterList$.next(this.filterList);

                        });


                    if(selparams == "sectors"){
                        this._generalservice.getSectorTags("auto",res).subscribe(res2 => {
                            this.filterList.sectors = res2;
                            this.filterList$.next(this.filterList);

                        });
                    }



                    if(selparams == "gender") {

                        let genderSelList = [];
                        let postgenderList = res["gender"].split(',');

                        let genderList = [{id:1,name:"Male",code:"male"},{id:2,name:"Female",code:"female"}]
                        genderList.forEach(selGender=>{

                            if( postgenderList.indexOf(selGender['id'].toString()) != -1 ){
                                genderSelList.push(selGender);
                            }

                        });
                        this.filterList.gender = genderSelList;
                        this.filterList$.next(this.filterList);
                    }


                    if(selparams == 'exprange'){


                        let exprangeSelList = [];
                        let exprangeList =[];
                        let postexprangeList = res["exprange"].split(',');

                        this._generalservice.getExpRange().subscribe(exprg => {


                            exprg.forEach(res=>{

                                if(res["experience_to"] != 100)
                                    exprangeList.push({id:res["id"],name:" "+res["experience_from"]+" - "+res["experience_to"]+ ' years'});
                                else
                                    exprangeList.push({id:res["id"],name:" "+res["experience_from"]+"+ years"});
                            });


                            exprangeList.forEach(selRange => {

                                if( postexprangeList.indexOf(selRange['id'].toString()) != -1 ){
                                    exprangeSelList.push(selRange);
                                }
                            });



                            this.filterList.exprange = exprangeSelList;
                            this.filterList$.next(this.filterList);

                        });




                    }



                    if(selparams == "notice_period") {

                        let noticePeriodSelList = [];
                        let postNoticePeriodList = res["notice_period"].split(',');

                        let noticePeriodList =   this._generalservice.getNoticePeriod();
                        noticePeriodList.forEach(selNoticePeriod=>{

                            if( postNoticePeriodList.indexOf(selNoticePeriod["id"]) != -1 ){
                                selNoticePeriod["name"] = selNoticePeriod["name"]
                                noticePeriodSelList.push(selNoticePeriod);
                            }

                        });
                        this.filterList.notice_period = noticePeriodSelList;
                        this.filterList$.next(this.filterList);
                    }


                    if(selparams == "last_active") {

                        let noticeLastActiveSelList = [];
                        let postLastActiveList = res["last_active"].split(',');

                        let noticeLastActiveList =   this._generalservice.getLastActive();
                        noticeLastActiveList.forEach(selLastActice=>{
                            if( postLastActiveList.indexOf(selLastActice["id"]) != -1 ){
                                noticeLastActiveSelList.push(selLastActice);
                            }

                        });
                        this.filterList.last_active = noticeLastActiveSelList;
                        this.filterList$.next(this.filterList);
                    }




                    if(selparams == "expect_sal" || selparams == "current_sal")
                        this._generalservice.getSalaryRanges(res).subscribe(res2 => {

                            if(selparams == "expect_sal"){

                                this.filterList.expect_sal = this._buildSalaryList(res,res2,"expect_sal");
                            }
                            if(selparams == "current_sal"){

                                this.filterList.current_sal = this._buildSalaryList(res,res2,"current_sal");
                            }

                            this.filterList$.next(this.filterList);

                        });



                    if(selparams == "language")
                        this._generalservice.getLanguages("auto",res).subscribe(res2 => {
                            this.filterList.language = res2;
                            this.filterList$.next(this.filterList);

                        });



                    if(selparams == "age_group")
                        this._generalservice.getAgeGroups("auto",res).subscribe(res2 => {

                            let ageList=[];
                            res2.forEach(selval => {
                                if(selval.max_age == 1000){
                                    ageList.push({id:selval.id,name:selval.min_age+'+'})
                                }
                                else {
                                    ageList.push({id:selval.id,name:selval.min_age+'-'+selval.max_age})
                                }
                            });


                            this.filterList.age_group = ageList;
                            this.filterList$.next(this.filterList);

                        });


                    if(selparams == "visa_status") {

                        this._generalservice.getVisaStatus("auto", res).subscribe(res2 => {
                            this.filterList.visa_status = res2;

                            this.filterList$.next(this.filterList);

                        });
                    }



                    if(selparams == "job_type") {
                        this._generalservice.getJobTypes("auto", res,true).subscribe(res2 => {
                            this.filterList.job_type = res2;
                            this.filterList$.next(this.filterList);

                        });
                    }


                    if(selparams == "fareas")
                        this._generalservice.getFunctionalAreas("auto",res).subscribe(res2 => {
                            this.filterList.fareas = res2;
                            this.filterList$.next(this.filterList);

                        });

                    if(selparams == "jobtypes"){
                        this._generalservice.getJobTypes("auto",res,true).subscribe(res2 => {
                            this.filterList.jobtypes = res2;
                            this.filterList$.next(this.filterList);

                        });

                    }



                    if(selparams == "salarylevels")
                        this._generalservice.getSalaryRanges(res).subscribe(res2 => {

                            console.log(res2);

                            this.filterList.salarylevels = res2;
                            this.filterList$.next(this.filterList);

                        });

                    if(selparams == "edulevels")
                        this._generalservice.getJobEducations("auto",res).subscribe(res2 => {
                            this.filterList.edulevels = res2;
                            this.filterList$.next(this.filterList);

                        });

                    if(selparams == "explevels")
                        this._generalservice.getJobExperienceLevels("auto",res).subscribe(res2 => {
                            this.filterList.explevels = res2;
                            this.filterList$.next(this.filterList);

                        });

                    if(selparams == "companies")
                        this._generalservice.getCompanies("auto",res).subscribe(res2 => {
                            this.filterList.companies = res2;
                            this.filterList$.next(this.filterList);

                        });
                }
                else
                {
                    this._restFilter(selparams);
                }


            });



        });
        this.buildPages();
    }




    public numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    public _buildSalaryList(res,res2,key) {

        let salIdList = res[key].split(',');

        let  Sal = [];
        res2.forEach(selSal=>{
            if(salIdList.indexOf(selSal.id.toString()) != -1 ){


                if(selSal.salary_to > 10000){
                    Sal.push({id:selSal.id,name:this.numberWithCommas(10000)+'+'})
                }
                else {
                    Sal.push({id:selSal.id,name:this.numberWithCommas(selSal.salary_from)+'-'+this.numberWithCommas(selSal.salary_to)})

                }

            }
        });

       return Sal;

    }

    public buildPages() {
        this.queryParams$ = this._activeRoute.queryParams.subscribe(params => {
            this.pagination_url = {};
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    this.pagination_url[key] = params[key];
                }

            }

        });
    }
}
