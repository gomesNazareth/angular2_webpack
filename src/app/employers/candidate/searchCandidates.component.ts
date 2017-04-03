import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import {Location} from '@angular/common';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Router,ActivatedRoute} from '@angular/router';


//services
import { AccountService } from '../../core/account/services/account.service';
import {CompanyService} from "../../core/services/company.service";
import {LoaderService} from "../../shared/services/loader.service";
import {GeneralService} from "../../shared/services/general.service";
import {ConfigService} from '../../shared/config.service';

//Models
import {City} from '../../shared/models/City';


@Component({

    selector: "search-candidates-employer",
    templateUrl: "searchCandidates.component.html"
})


export class SearchCandidatesComponent implements OnInit {

    public loadedData:boolean = false;
    public countryList$:BehaviorSubject<any>= new BehaviorSubject(null);
    public nationalityList$:BehaviorSubject<any>= new BehaviorSubject(null);
    public functionalAreaList$:BehaviorSubject<any>= new BehaviorSubject(null);
    public sectors$:BehaviorSubject<any>= new BehaviorSubject(null);
    public expLevelList$:BehaviorSubject<any>= new BehaviorSubject(null);
    public expRange$:BehaviorSubject<any>= new BehaviorSubject(null);
    public educationList$:BehaviorSubject<any>= new BehaviorSubject(null);
    public salary_range$:BehaviorSubject<any>= new BehaviorSubject(null);
    public salary_range_expected$:BehaviorSubject<any>= new BehaviorSubject(null);
    public ageGroup$:BehaviorSubject<any>= new BehaviorSubject(null);
    public languagesList$:BehaviorSubject<any>= new BehaviorSubject(null);
    public genderList$:BehaviorSubject<any>= new BehaviorSubject(null);
    public lastActiveList$:BehaviorSubject<any>= new BehaviorSubject(null);
    public noticePeriodList$:BehaviorSubject<any>= new BehaviorSubject(null);
    public visaStatusList$:BehaviorSubject<any>= new BehaviorSubject(null);
    public jobTypeList$:BehaviorSubject<any>= new BehaviorSubject(null);
    public candidateForm:FormGroup;
    public candidateNameForm:FormGroup;
    public someThingSelected = false;

    //Model
    public cityObj:City = new City();
    public currentSalaryList = [];
    public expectedSalaryList = [];
    public activeRouteObs;
    public firstcome = false;
    public formList = {};

    ngOnInit(){

        this.loader();
    }

    constructor(private _accountService:AccountService,private _fb:FormBuilder,
                private _companyService:CompanyService,
                private _loaderService:LoaderService,
                private _generalService:GeneralService,
                private _activeRoute:ActivatedRoute,
                private _router:Router) {


        this.cityObj.id = null
        this.cityObj.name = "";
        this.cityObj.text = "";
        this.cityObj.country_id = null;


        this._buildForm();



        this.candidateNameForm = this._fb.group({
            cand_name:[''],
            search_mode:['1']
        });

        this.candidateNameForm.controls["cand_name"].valueChanges.subscribe(res => {

            this.validateData();

        })



        this.candidateForm.valueChanges.subscribe(res => {


            this.validateData();




        })

    }



    public validateData(){

        this.someThingSelected = false;
        for (let myvar in this.candidateForm.value) {
            if (this.formList.hasOwnProperty(myvar)) {
                if(this.candidateForm.value[myvar]){
                    this.someThingSelected = true;
                }
            }
        }

        if(this.candidateNameForm.controls["cand_name"].value){
            this.someThingSelected = true;
        }


    }

    private _buildForm(){

        this.formList = {
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
            jobtypes:[''],
        }

        this.candidateForm = this._fb.group(this.formList);
    }

    public onReset(){

        this.candidateForm.reset();

    }


    public searchCandidate(){

        if(this.candidateForm.valid && this.candidateNameForm.valid){



            let params = {};

            for (var key in this.candidateForm.value) {
                if (this.candidateForm.value.hasOwnProperty(key)) {
                    if(this.candidateForm.value[key] != '' && this.candidateForm.value[key] != null)
                    params[key] = this.candidateForm.value[key];
                }
            }
            for (var key in this.candidateNameForm.value) {
                if (this.candidateNameForm.value.hasOwnProperty(key)) {
                    if(this.candidateNameForm.value[key] != '' && this.candidateNameForm.value[key] != null && this.candidateNameForm.value['cand_name'] != '')
                    params[key] = this.candidateNameForm.value[key];
                }
            }


            if(this.someThingSelected){
                this._router.navigate(['/'+this._accountService.getPath()+'/candidate/list'],{queryParams:params});
            }
        }



    }


    public ngOnDestroy() {

        this.activeRouteObs.unsubscribe();
    }


    public numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    private loader() {




        this.firstcome = true;

       this.activeRouteObs =  this._activeRoute.queryParams.subscribe(params=>{


           for (var key in this.candidateForm.value) {
               if (params.hasOwnProperty(key)) {
                   this.candidateForm.controls[key].setValue(params[key]);
               }
           }
        });

        this._loaderService.getCountries(null).subscribe(country=> {


            this.countryList$.next({countries: country});
            this.nationalityList$.next({countries: country});

        });

        // //need cities
        // //need job title
        this._loaderService.getFunctionalArea().subscribe(res=>{

            // res.unshift({id:"",name:"Select Functional Area"});
            this.functionalAreaList$.next(res);
        })
        this._loaderService.getSectors('alphabetical').subscribe(sectors=> {

            // sectors.unshift({id:"",name:"Select Sector"});
            this.sectors$.next(sectors);
        });



        this._generalService.getJobExperienceLevels().subscribe(res=>{
            // res.unshift({id:"",name:"Select experience"});
            this.expLevelList$.next(res);
        })

        // this.expRange$.next([{id:1,name:"0 - 1 years"},{id:2,name:"2 - 3 years"},{id:3,name:"3 - 4 years"}]);



        this._generalService.getExpRange().subscribe(exprg => {

            let expRangeList =[];

            exprg.forEach(res=>{

                if(res["experience_to"] != 100)
                    expRangeList.push({id:res["id"],name:" "+res["experience_from"]+" - "+res["experience_to"]+ ' years'});
                else
                    expRangeList.push({id:res["id"],name:" "+res["experience_from"]+"+ years"});
            });

            // this.expRange$.next([{id:1,name:"0 - 1 years"},{id:2,name:"2 - 3 years"},{id:3,name:"3 - 4 years"}]);

            this.expRange$.next(expRangeList);
        });





        this._generalService.getJobEducations().subscribe(education=> {
            // education.unshift({id:"",name:"Select Higher Education"});
            this.educationList$.next({education: education});
        });



        this._generalService.getSalaryRanges().subscribe(salary_range=> {

            let salaryRange = [];
            let expectedSalaryRange = [];

            salary_range.forEach(selRange=>{

                if(selRange['salary_to'] > 10000){

                    salaryRange.push({id:selRange['id'],"name":'10,000+'});
                    expectedSalaryRange.push({id:selRange['id'],"name":'10,000+'});

                }
                else {
                    salaryRange.push({id:selRange['id'],"name":this.numberWithCommas(selRange['salary_from'])+'-'+this.numberWithCommas(selRange['salary_to'])});
                    expectedSalaryRange.push({id:selRange['id'],"name":this.numberWithCommas(selRange['salary_from'])+'-'+this.numberWithCommas(selRange['salary_to'])});
                }

            })
            // salaryRange.unshift({id:"",name:"Select Current Salary"});
            // expectedSalaryRange.unshift({id:"",name:"Select Expected Salary"});
            this.salary_range$.next({salary_range: salaryRange});
            this.salary_range_expected$.next({salary_range: expectedSalaryRange});
        });

         //need expected salary


        this._generalService.getAgeGroups().subscribe(res => {

            let ageGroupList = [];
            res.forEach(selAge => {

                if(selAge.max_age == 1000){
                    ageGroupList.push({id:selAge.id,name:selAge.min_age+'+'})
                }
                else {
                    ageGroupList.push({id:selAge.id,name:selAge.min_age+'-'+selAge.max_age});
                }


            })
            // ageGroupList.unshift({id:"",name:"Select Age Group"});
            this.ageGroup$.next(ageGroupList);
        });



        this._generalService.getLanguages().subscribe(languages=> {
            // languages.unshift({id:"",name:"Select Language"});
            this.languagesList$.next({languages: languages});
        });

        let resGender = [{id:"1",name:"Male",code:"male"},{id:"2",name:"Female",code:"female"}];
        this.genderList$.next(resGender);
        this.lastActiveList$.next(this._generalService.getLastActive());

        let noticePeriod = [];
        this._generalService.getNoticePeriod().forEach(res=>{
            noticePeriod.push({name:res.name,id:res.id})
        });
        this.noticePeriodList$.next(noticePeriod);



        // //need last active
        this._generalService.getVisaStatus()
            .subscribe( visa_statuses => {
                // visa_statuses.unshift({id:"",name:"Select Visa Status"});
                    this.visaStatusList$.next(visa_statuses);
                }
            );




        this._generalService.getJobTypes().subscribe(jobtypes=> {
            // jobtypes.unshift({id:"",name:"Select Job Type"});
            this.jobTypeList$.next({job_types:jobtypes});
        });

        this.loadedData = true;


        }





}
