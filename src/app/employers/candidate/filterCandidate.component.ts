import {OnInit,Output,EventEmitter,Input,Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';



//service
import  {GeneralService} from '../../shared/services/general.service';
import  {LoaderService} from '../../shared/services/loader.service';
import {Router} from '@angular/router';

//Models
import  {Sector} from '../../shared/models/Sector';
import {FunctionalArea} from '../../shared/models/FunctionalArea';
import {Education} from "../../shared/models/Education";
import {Experience} from "../../shared/models/Experience";
import {JobType} from '../../shared/models/JobType';
import {Country} from "../../shared/models/Country";
import {City} from "../../shared/models/City";
import {Company} from "../../shared/models/Company";
import {SalaryRange} from "../../shared/models/SalaryRange";
import {FilterElement} from '../../shared/models/FilterElement';


@Component({

    selector: "filter-area-candidate",
    templateUrl:"filterCandidate.component.html"
})

export class FilterCandidateComponent implements OnInit {

    //Observables
    public queryParams$;
    public minShowMoreCount = 5;
    public resetFilter = false;
    public orderBy = null;
    public paramsList = {};
    public locations$:BehaviorSubject<any> = new BehaviorSubject(null);
    public fareas$:BehaviorSubject<any> = new BehaviorSubject(null);
    public sectors$:BehaviorSubject<any> = new BehaviorSubject(null);
    public exprange$:BehaviorSubject<any> = new BehaviorSubject(null);
    public cities$:BehaviorSubject<any> = new BehaviorSubject(null);
    public jobTypes$:BehaviorSubject<any> = new BehaviorSubject(null);
    public current_sal$:BehaviorSubject<any> = new BehaviorSubject(null);
    public expect_sal$:BehaviorSubject<any> = new BehaviorSubject(null);
    public edulevels$:BehaviorSubject<any> = new BehaviorSubject(null);
    public explevels$:BehaviorSubject<any> = new BehaviorSubject(null);
    public companies$:BehaviorSubject<any> = new BehaviorSubject(null);
    public age_group$:BehaviorSubject<any> = new BehaviorSubject(null);
    public language$:BehaviorSubject<any> = new BehaviorSubject(null);
    public gender$:BehaviorSubject<any> = new BehaviorSubject(null);
    public notice_period$:BehaviorSubject<any> = new BehaviorSubject(null);
    public last_active$:BehaviorSubject<any> = new BehaviorSubject(null);
    public visa_status$:BehaviorSubject<any> = new BehaviorSubject(null);
    public job_type$:BehaviorSubject<any> = new BehaviorSubject(null);
    public nationality$:BehaviorSubject<any> = new BehaviorSubject(null);
    public sector;
    public selval;


    public salaryLevels =[];



    //hash keys
    public paramsHash = {locations:"locations",cities:"cities",sectors:"sectors",fareas:"fareas",jobtypes:"jobtypes",expect_sal:"expect_sal",current_sal:"current_sal",edulevels:"edulevels",explevels:"explevels",companies:'companies',age_group:'age_group',language:'language',gender:'gender',notice_period:'notice_period',last_active:'last_active',visa_status:'visa_status',job_type:'job_type',nationality:"nationality",exprange:"exprange"};
    public expRangeList =[
        {id:2,name:"0 - 2 years"},
        {id:4,name:"2 - 4 years"},
        {id:6,name:"4 - 6 years"},
        {id:8,name:"6 - 8 years"},
        {id:10,name:"8 - 10 years"},
        {id:11,name:"10+ years"}
        ];


    @Input() page:string;

    //Members
    public elementList = [];
    public filters = ["locations","cities","sectors","fareas","jobtypes","current_sal","expect_sal","edulevels","explevels","companies","age_group","language","gender","notice_period","last_active","visa_status","job_type","nationality","exprange"];
    public specialCaseList = ["gender",'last_active'];
    public singleCheckList = ["last_active"];



    public constructor(public _generalservice : GeneralService,
                       public _loaderService: LoaderService,
                       public _router: Router,
                       public _activeRoute:ActivatedRoute,
                       fb: FormBuilder){

        this._getInitialize();

    }


    public _getInitialize(){

        this.filters.forEach(selfilter => {
            this.elementList[selfilter] = new FilterElement();
        })


    }




    public _getBuildParamsUrl(params,selfilter) {

        let  ary = [];


        if (params != null && params) {

            //Special Case
            if(this.specialCaseList.indexOf(selfilter) == -1)
            {
                ary = params.split(",").map(Number);
            }
            else {
                ary = params.split(",");
            }

        }
        return ary;
    }


    public _loadCitis() {
        this._generalservice.getCitiesList(this.elementList["locations"].elementsChecked,this.elementList["cities"].elementsSearchString,"auto","").subscribe(res => {

            this.elementList["cities"].showAddmoreFlag = (this.elementList["cities"].elementsChecked.length >0 || res.length >= this.minShowMoreCount)?true :false;

            this.elementList["cities"].elements = [];
            this.elementList["cities"].elementsMapper = [];
            res.forEach(selval => {
                let city = new City();
                city.id = selval.id;
                city.name = selval.name;
                city.selectedFlag = false;
                if(this.elementList["cities"].elementsChecked.indexOf(selval.id) != -1){
                    city.selectedFlag = true;
                }
                this.elementList["cities"].elements.push(city);
                this.elementList["cities"].elementsMapper.push(city.id);
            });


            this.cities$.next(this.elementList["cities"]);

        });
    }

    public onSelectElement(id,key) {


        if(this.elementList[key].elementsChecked.indexOf(id) == -1)
        {
            if(this.singleCheckList.indexOf(key) != -1){

                this.elementList[key].elementsChecked = [];
                this.elementList[key].elementsChecked.push(id);
            }
            else {
                this.elementList[key].elementsChecked.push(id);

            }
        }
        else
        {
            this.elementList[key].elementsChecked.splice(this.elementList[key].elementsChecked.indexOf(id),1);
        }

        if(key == "locations")
        {

            this._loadCitis();
        }

        delete  this.paramsList[key];
        this.onApply();

    }

    public onAddElement($event,key = "locations") {

        if($event.id) {
            let selElement = null;
            if(key == "locations"){selElement = new Country();}
            if(key == "sectors"){selElement = new Sector();}
            if(key == "age_group"){selElement = {id:null,name:'',selectedFlag:false} }
            if(key == "exprange"){selElement = {id:null,name:'',selectedFlag:false} }
            if(key == "language"){selElement = {id:null,name:'',selectedFlag:false} }
            if(key == "gender"){selElement = {id:null,name:'',selectedFlag:false} }
            if(key == "notice_period"){selElement = {id:null,name:'',selectedFlag:false} }
            if(key == "last_active"){selElement = {id:null,name:'',selectedFlag:false} }
            if(key == "nationality"){selElement = {id:null,name:'',selectedFlag:false} }
            if(key == "exprange"){selElement = {id:null,name:'',selectedFlag:false} }
            if(key == "current_sal"){selElement = new SalaryRange();}
            if(key == "expect_sal"){selElement = new SalaryRange();}
            if(key == "fareas"){selElement = new FunctionalArea();}
            if(key == "jobtypes"){selElement = new JobType();}
            if(key == "edulevels"){selElement = new Education()}
            if(key == "companies"){selElement = new Company()}
            if(key == "explevels"){selElement = new Experience()}
            if(key == "cities"){
                selElement = new City();

            }


            selElement.id = $event.id;
            selElement.name = $event.name;
            selElement.selectedFlag = false;
            selElement.selectedFlag = true;
            this.elementList[key].elementsChecked.push(selElement.id)
            this.elementList[key].elements.push(selElement);
            this.elementList[key].elementsMapper.push(selElement.id);


            if(key == "locations")this._loadCitis();




        }

        this.onApply();

    }
    public customAdd(key ="locations") {


        this.elementList[key].expendAddmoreFlag = (this.elementList[key].expendAddmoreFlag)?false:true;
        this.locations$.next(this.elementList["locations"]);
    }


    public _getFetchCountries(minShowMoreCount,modeList =[]) {

        this._generalservice.getCountries(minShowMoreCount,'','').subscribe(res => {

            modeList.forEach(mode => {

                this.elementList[mode].elements = [];
                this.elementList[mode].showAddmoreFlag = (this.elementList[mode].elementsChecked.length >0 || res.length >= this.minShowMoreCount)?true :false;
                this.elementList[mode].elementsMapper = [];
                res.forEach(selval => {
                    let selElement = new Country();
                    this._buildElementBody(selElement,selval,mode);
                });
            });

            this.locations$.next(this.elementList["locations"]);
            this.nationality$.next(this.elementList["nationality"]);
        });
    }

    public _getFetchData() {

        if(!this.elementList["locations"].elementsSearchString.locations && !this.elementList["nationality"].elementsSearchString.nationality && this.elementList["locations"].loadedDataFlag == false && this.elementList["nationality"].loadedDataFlag == false) {


            this.elementList["locations"].loadedDataFlag = true;
            this.elementList["nationality"].loadedDataFlag = true;
            let modeList = ["locations","nationality"];
            this._getFetchCountries(this.minShowMoreCount,modeList);
        }
        else {

            if(this.elementList["locations"].loadedDataFlag == false) {
                this.elementList["locations"].loadedDataFlag = true;
                this._generalservice.getCountries(this.minShowMoreCount,this.elementList["locations"].elementsSearchString,'').subscribe(res => {



                    this.elementList["locations"].elements = [];
                    this.elementList["locations"].showAddmoreFlag = (this.elementList["locations"].elementsChecked.length >0 || res.length >= this.minShowMoreCount)?true :false;
                    this.elementList["locations"].elementsMapper = [];
                    res.forEach(selval => {
                        let selElement = new Country();
                        this._buildElementBody(selElement,selval,"locations");
                    });
                    this.locations$.next(this.elementList["locations"]);


                    //Loading Cities
                    this._loadCitis();





                });
            }

            if(this.elementList["nationality"].loadedDataFlag == false){
                this.elementList["nationality"].loadedDataFlag =true;
                this._generalservice.getNationality(this.minShowMoreCount,this.elementList["nationality"].elementsSearchString,'').subscribe(res => {


                    this.elementList["nationality"].elements = [];
                    this.elementList["nationality"].showAddmoreFlag = (this.elementList["nationality"].elementsChecked.length >0 || res.length >= this.minShowMoreCount)?true :false;
                    this.elementList["nationality"].elementsMapper = [];

                    res.forEach(selval => {
                        let selElement = {id:null,name:'',selectedFlag:false};
                        this._buildElementBody(selElement,selval,"nationality");
                    });

                    this.nationality$.next(this.elementList["nationality"]);




                });
            }
        }





        if(this.elementList["sectors"].loadedDataFlag == false){
            this.elementList["sectors"].loadedDataFlag =true;

            //Loading sectors
            this._generalservice.getSectors(this.minShowMoreCount,this.elementList["sectors"].elementsSearchString).subscribe(res => {

                this.elementList["sectors"].elements = [];
                this.elementList["sectors"].showAddmoreFlag = (this.elementList["sectors"].elementsChecked.length >0 || res.length >= this.minShowMoreCount)?true :false;
                this.elementList["sectors"].elementsMapper = [];
                res.forEach(selval => {
                    let selElement = new Sector();
                    this._buildElementBody(selElement,selval,"sectors");

                });
                this.sectors$.next(this.elementList["sectors"]);




            });


        }



        if(this.expRangeList.length >0){


            this.elementList["exprange"].elements = [];
            this.elementList["exprange"].showAddmoreFlag = false;
            this.elementList["exprange"].elementsMapper = [];




            this._generalservice.getExpRange().subscribe(exprg => {

                let expRangeList =[];

                exprg.forEach(res=>{

                    if(res["experience_to"] != 100)
                        expRangeList.push({id:res["id"],name:" "+res["experience_from"]+"-"+res["experience_to"]+ ' Years'});
                    else
                    expRangeList.push({id:res["id"],name:" "+res["experience_from"]+"+ Years"});
                });

                expRangeList.forEach(selval=>{
                    let selElement = new Sector();
                    this._buildElementBody(selElement,selval,"exprange");

                });
                this.exprange$.next(this.elementList["exprange"]);
            });

        }







        if(this.elementList["fareas"].loadedDataFlag == false){
            this.elementList["fareas"].loadedDataFlag =true;

            //Loading fareas
            this._generalservice.getFunctionalAreas(this.minShowMoreCount,this.elementList["fareas"].elementsSearchString).subscribe(res => {

                this.elementList["fareas"].elements = [];
                this.elementList["fareas"].showAddmoreFlag = (this.elementList["fareas"].elementsChecked.length >0 || res.length >= this.minShowMoreCount)?true :false;
                this.elementList["fareas"].elementsMapper = [];
                res.forEach(selval => {
                    let selElement = new FunctionalArea();
                    this._buildElementBody(selElement,selval,"fareas");

                });
                this.fareas$.next(this.elementList["fareas"]);




            });


        }



        if(this.elementList["jobtypes"].loadedDataFlag == false){
            this.elementList["jobtypes"].loadedDataFlag =true;


            //Loading jobTypes
            // this._generalservice.getJobTypes("auto",this.elementList["jobtypes"].elementsSearchStr ing).subscribe(res => {
            this._generalservice.getJobTypes("auto",null).subscribe(res => {


                this.elementList["jobtypes"].elements = [];
                this.elementList["jobtypes"].showAddmoreFlag = (this.elementList["jobtypes"].elementsChecked.length >0 || res.length >= this.minShowMoreCount)?true :false;
                this.elementList["jobtypes"].elementsMapper = [];
                res.forEach(selval => {
                    let selElement = new JobType();
                    this._buildElementBody(selElement,selval,"jobtypes");

                });
                this.jobTypes$.next(this.elementList["jobtypes"]);
            });
        }

        if(this.elementList["edulevels"].loadedDataFlag == false){
            this.elementList["edulevels"].loadedDataFlag =true;

            //Loading edulevels
            this._generalservice.getJobEducations(this.minShowMoreCount,this.elementList["edulevels"].elementsSearchString).subscribe(res => {

                this.elementList["edulevels"].elements = [];
                this.elementList["edulevels"].showAddmoreFlag = (this.elementList["edulevels"].elementsChecked.length >0 || res.length >= this.minShowMoreCount)?true :false;
                this.elementList["edulevels"].elementsMapper = [];
                res.forEach(selval => {
                    let selElement = new Education();
                    this._buildElementBody(selElement,selval,"edulevels");

                });
                this.edulevels$.next(this.elementList["edulevels"]);




            });


        }


        if(this.elementList["explevels"].loadedDataFlag == false){
            this.elementList["explevels"].loadedDataFlag =true;

            //Loading explevels
            this._generalservice.getJobExperienceLevels(this.minShowMoreCount,this.elementList["explevels"].elementsSearchString).subscribe(res => {

                this.elementList["explevels"].elements = [];
                this.elementList["explevels"].showAddmoreFlag = (this.elementList["explevels"].elementsChecked.length >0 || res.length > this.minShowMoreCount)?true :false;
                this.elementList["explevels"].elementsMapper = [];
                res.forEach(selval => {
                    let selElement = new Experience();
                   this._buildElementBody(selElement,selval,"explevels");

                });
                this.explevels$.next(this.elementList["explevels"]);




            });


        }


        if(this.elementList["age_group"].loadedDataFlag == false){
            this.elementList["age_group"].loadedDataFlag =true;

            //Loading explevels
            this._generalservice.getAgeGroups().subscribe(res => {

                this.elementList["age_group"].elements = [];
                this.elementList["age_group"].showAddmoreFlag = (this.elementList["age_group"].elementsChecked.length >0 || res.length >= this.minShowMoreCount)?true :false;
                this.elementList["age_group"].elementsMapper = [];

                res.forEach(selval => {
                    let selElement = {id:null,name:'',selectedFlag:false};
                    this._buildElementBody(selElement,selval,"age_group");

                });
                this.age_group$.next(this.elementList["age_group"]);




            });


        }

        if(this.elementList["language"].loadedDataFlag == false){
            this.elementList["language"].loadedDataFlag =true;

            //Loading explevels
            this._generalservice.getLanguages(this.minShowMoreCount).subscribe(res => {


                this.elementList["language"].elements = [];
                this.elementList["language"].showAddmoreFlag = (this.elementList["language"].elementsChecked.length >0 || res.length >= this.minShowMoreCount)?true :false;
                this.elementList["language"].elementsMapper = [];
                res.forEach(selval => {
                    let selElement = {id:null,name:'',selectedFlag:false};
                    this._buildElementBody(selElement,selval,"language");
                });
                this.language$.next(this.elementList["language"]);




            });


        }

        if(this.elementList["gender"].loadedDataFlag == false){
            this.elementList["gender"].loadedDataFlag =true;



                let res = [{id:"1",name:"Male",code:"male"},{id:"2",name:"Female",code:"female"}];
                this.elementList["gender"].elements = [];
                this.elementList["gender"].showAddmoreFlag = (this.elementList["gender"].elementsChecked.length >0 || res.length >= this.minShowMoreCount)?true :false;
                this.elementList["gender"].elementsMapper = [];
                res.forEach(selval => {
                    let selElement = {id:null,name:'',selectedFlag:false};
                    this._buildElementBody(selElement,selval,"gender");
                });
                this.gender$.next(this.elementList["gender"]);




        }


        if(this.elementList["notice_period"].loadedDataFlag == false){

            this.elementList["notice_period"].loadedDataFlag =true;



                let res = [];
            this._generalservice.getNoticePeriod().forEach(selv=>{
                res.push({id: parseInt(selv.id),name:selv.name});
            });
                this.elementList["notice_period"].elements = [];
                this.elementList["notice_period"].showAddmoreFlag = (this.elementList["notice_period"].elementsChecked.length >0 || res.length >= this.minShowMoreCount)?true :false;
                this.elementList["notice_period"].elementsMapper = [];
                res.forEach(selval => {
                    let selElement = {id:null,name:'',selectedFlag:false};
                    this._buildElementBody(selElement,selval,"notice_period");
                });

                this.notice_period$.next(this.elementList["notice_period"]);




        }


        if(this.elementList["last_active"].loadedDataFlag == false){

            this.elementList["last_active"].loadedDataFlag =true;



                let res = [{id:"1 week",name:"1 Week"},{id:"1 month",name:"1 Month"},{id:"3 months",name:"3 Months"},{id:"6 months",name:"6 Months"},{id:"6+ months",name:"Over 6 months"}];

                this.elementList["last_active"].elements = [];
                this.elementList["last_active"].showAddmoreFlag = (this.elementList["last_active"].elementsChecked.length >0 || res.length >= this.minShowMoreCount)?true :false;
                this.elementList["last_active"].elementsMapper = [];
                res.forEach(selval => {
                    let selElement = {id:null,name:'',selectedFlag:false};
                    this._buildElementBody(selElement,selval,"last_active");
                });

                this.last_active$.next(this.elementList["last_active"]);




        }


        if(this.elementList["visa_status"].loadedDataFlag == false){

            this.elementList["visa_status"].loadedDataFlag =true;

            this._generalservice.getVisaStatus().subscribe(res => {

                this.elementList["visa_status"].elements = [];
                this.elementList["visa_status"].showAddmoreFlag = (this.elementList["visa_status"].elementsChecked.length >0 || res.length >= this.minShowMoreCount)?true :false;
                this.elementList["visa_status"].elementsMapper = [];

                res.forEach(selval => {
                    let selElement = {id:null,name:'',selectedFlag:false};
                    this._buildElementBody(selElement,selval,"visa_status");
                });

                this.visa_status$.next(this.elementList["visa_status"]);


            });


        }


        if(this.elementList["job_type"].loadedDataFlag == false){

            this.elementList["job_type"].loadedDataFlag =true;


            this._generalservice.getJobTypes().subscribe(res => {

                this.elementList["job_type"].elements = [];
                this.elementList["job_type"].showAddmoreFlag = (this.elementList["job_type"].elementsChecked.length >0 || res.length >= this.minShowMoreCount)?true :false;
                this.elementList["job_type"].elementsMapper = [];

                res.forEach(selval => {
                    let selElement = {id:null,name:'',selectedFlag:false};
                    this._buildElementBody(selElement,selval,"job_type");
                });

                this.job_type$.next(this.elementList["job_type"]);


            });


        }



        if(this.elementList["current_sal"].loadedDataFlag == false || this.elementList["expect_sal"].loadedDataFlag == false){

            this._getSalaryRange().subscribe(res => {


                if(this.elementList["current_sal"].loadedDataFlag == false){
                    this.elementList["current_sal"].loadedDataFlag =true;

                    //Loading jobTypes

                        this.elementList["current_sal"].elements = [];
                        this.elementList["current_sal"].showAddmoreFlag = (this.elementList["current_sal"].elementsChecked.length >0 || res.length >= this.minShowMoreCount)?true :false;
                        this.elementList["current_sal"].elementsMapper = [];
                        res.forEach(selval => {
                            let selElement = new SalaryRange();
                            this._buildElementBody(selElement,selval,"current_sal");

                        });

                        this.current_sal$.next(this.elementList["current_sal"]);

                }



                if(this.elementList["expect_sal"].loadedDataFlag == false){
                    this.elementList["expect_sal"].loadedDataFlag =true;

                    this._getSalaryRange().subscribe(res => {

                        this.elementList["expect_sal"].elements = [];
                        this.elementList["expect_sal"].showAddmoreFlag = (this.elementList["expect_sal"].elementsChecked.length >0 || res.length >= this.minShowMoreCount)?true :false;
                        this.elementList["expect_sal"].elementsMapper = [];
                        res.forEach(selval => {
                            let selElement = new SalaryRange();
                            this._buildElementBody(selElement,selval,"expect_sal");

                        });

                        this.expect_sal$.next(this.elementList["expect_sal"]);

                    });


                }


            });
        }

    }



    public numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    public _buildElementBody(selElement,selval,key) {

        selElement.id = selval.id;
        if(key == "expect_sal" || key == "current_sal"){

            if(selval.salary_to > 10000){
                selElement.name = '10,000+';

            }
            else{
                selElement.name = this.numberWithCommas(selval.salary_from)+'-'+this.numberWithCommas(selval.salary_to);
            }

        }
        else if(key == "age_group"){

            if(selval.max_age == 1000)
                selElement.name = selval.min_age+'+';

            else {
                selElement.name = selval.min_age+'-'+selval.max_age;
            }
        }
        else
            selElement.name = selval.name;

        selElement.selectedFlag = false;
        if(this.elementList[key].elementsChecked.indexOf(selval.id) != -1){
            selElement.selectedFlag = true;
        }
        this.elementList[key].elements.push(selElement);
        this.elementList[key].elementsMapper.push(selElement.id);

    }


    public _getSalaryRange():Observable<any> {

        if(this.salaryLevels.length == 0){
            return this._generalservice.getSalaryRanges().map(res => {
                this.salaryLevels = res;
                return this.salaryLevels;
            })
        }else{
            return Observable.of(this.salaryLevels);
        }


    }

    public onApply() {


        let params = {"queryParams":this.paramsList};

        this.filters.forEach(selFilter => {

            if(this.elementList[selFilter].elementsChecked.length >0)
                params["queryParams"][selFilter] = this.elementList[selFilter].elementsChecked;


        });


        if(this.orderBy)
            params["queryParams"]["order"] = this.orderBy;


        this._router.navigate([this.page],params);
    }


    public onResetUrl(){

        this.paramsList = {};
        if(this.orderBy)
            this._router.navigate([this.page],{"queryParams":{order:this.orderBy}});
        else
            this._router.navigate([this.page]);
      //  this._getInitialize();
    }

    public onReset(){

        this._getInitialize();
        this.getLoadData();
    }

    public getLoadData(){


        //URL Params Fetch
        this.queryParams$ = this._activeRoute.queryParams.subscribe(params => {

            this.paramsList = {};
            if(params) {
                Object.assign(this.paramsList, params);
            }
            this.resetFilter = false;
            if((params["order"] && this.orderBy == null) || ((!params["order"]) && this.orderBy != null)){
                this.resetFilter = true;
            }

            if(params["order"])
            {
                this.orderBy = params["order"];
            }
            else {
                this.orderBy = null;

            }
            if(this.resetFilter)
            {
                this.onResetUrl();
            }


            this.filters.forEach(selfilter => {

                this.elementList[selfilter].elementsChecked = this._getBuildParamsUrl(params[this.paramsHash[selfilter]],selfilter);
                this.elementList[selfilter].elementsSearchString =  params;
            })



            this._getFetchData();

            //For Remove tags Feature
            this._getResetSelectTags();

        });


    }

    public _getResetSelectTags() {

        this.filters.forEach(selfilter => {

            if(this.elementList[selfilter].elements.length > 0){

                this.elementList[selfilter].elements.forEach((selval,key) =>{

                    if(this.elementList[selfilter].elementsChecked.indexOf(selval.id) != -1){
                        selval.selectedFlag = true;
                    }
                    else{
                        selval.selectedFlag = false;
                    }

                });
            }


        });


    }




    ngOnDestroy() {
        this.queryParams$.unsubscribe();
    }
    //
    ngOnInit(){

        this.getLoadData();


    }


}
