import {OnInit,Input,Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';


//Directives

import {BehaviorSubject} from 'rxjs/BehaviorSubject';

//service
import  {GeneralService} from '../../shared/services/general.service';
import  {AccountService} from '../../core/account/services/account.service';
import {Router} from '@angular/router';

//Models
import  {Sector} from '../../shared/models/Sector';
import {FunctionalArea} from '../../shared/models/FunctionalArea';
import {Education} from "../../shared/models/Education";
import {Experience} from "../../shared/models/Experience";
import {JobType} from '../../shared/models/JobType';
import {JobSearch} from './models/JobSearch';
import {Country} from "../../shared/models/Country";
import {City} from "../../shared/models/City";
import {Company} from "../../shared/models/Company";
import {FilterElement} from './models/FilterElement';
import {SalaryRange} from "../../shared/models/SalaryRange";



@Component({

    selector: "filter1-area-job",
    templateUrl:"filter1.component.html"

})



export class Filter1Component implements OnInit {

    //Observables
    public queryParams$;
    public params$;
    public minShowMoreCount = 5;
    public selJob:JobSearch = new JobSearch();

    public locations$:BehaviorSubject<any> = new BehaviorSubject(null);
    public fareas$:BehaviorSubject<any> = new BehaviorSubject(null);
    public sectors$:BehaviorSubject<any> = new BehaviorSubject(null);
    public cities$:BehaviorSubject<any> = new BehaviorSubject(null);
    public jobTypes$:BehaviorSubject<any> = new BehaviorSubject(null);
    public salarylevels$:BehaviorSubject<any> = new BehaviorSubject(null);
    public edulevels$:BehaviorSubject<any> = new BehaviorSubject(null);
    public explevels$:BehaviorSubject<any> = new BehaviorSubject(null);
    public companies$:BehaviorSubject<any> = new BehaviorSubject(null);
    public sector;

    //hash keys
    public paramsHash = {locations:"locations",cities:"cities",sectors:"sectors",fareas:"fareas",jobtypes:"jobtypes",salarylevels:"salarylevels",edulevels:"edulevels",explevels:"explevels",companies:'companies'};


    @Input() page:string= this._accountservice.getPath()+'/jobs/all';

    //Members
    public elementList = [];
    public filters = ["locations","cities","sectors","fareas","jobtypes","salarylevels","edulevels","explevels","companies"];



    public constructor(public  _accountservice: AccountService,
                       public _generalservice : GeneralService,
                       public _router: Router,
                       public _activeRoute:ActivatedRoute){

        //Unassigned
        this.selJob.id= -1;
        this.selJob.alertTypeId= null;
        this._getInitialize();

    }


    public _getInitialize(){

        this.filters.forEach(selfilter => {
            this.elementList[selfilter] = new FilterElement();
        })


    }




    public _getBuildParamsUrl(params) {


        let  ary = [];
        if (params != null && params) {
             ary = params.split(",").map(Number);
        }
        return ary;
    }


    public _loadCitis() {
        this._generalservice.getCitiesList(this.elementList["locations"].elementsChecked,this.elementList["cities"].elementsSearchString,"auto").subscribe(res => {

            this.elementList["cities"].showAddmoreFlag = (this.elementList["cities"].elementsChecked.length >0 || res.length >= this.minShowMoreCount)?true :false;

            this.elementList["cities"].elements = [];
            this.elementList["cities"].elementsMapper = [];
            res.forEach(selval => {
                let city = new City();
                city.id = selval.id;
                city.name = selval.name;
                city.jobs_count = selval.jobs_count;
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
            this.elementList[key].elementsChecked.push(id);
        }
        else
        {
            this.elementList[key].elementsChecked.splice(this.elementList[key].elementsChecked.indexOf(id),1);
        }

        if(key == "locations")
        {
            this._loadCitis();
        }

        this.onApply();

    }

    public onAddElement($event,key = "locations") {

        if($event.id) {
            let selElement = null;
            if(key == "locations"){selElement = new Country();}
            if(key == "sectors"){selElement = new Sector();}
            if(key == "salarylevels"){selElement = new SalaryRange();}
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

            // this.locations$.next(this.elementList[key]);


        }


        this.onApply();

    }
    public customAdd(key ="locations") {

        this.elementList[key].expendAddmoreFlag = (this.elementList[key].expendAddmoreFlag)?false:true;

    }


    public _getFetchData() {

        if(this.elementList["locations"].loadedDataFlag == false){
            this.elementList["locations"].loadedDataFlag =true;

            //Loading Locations
            this._generalservice.getCountries(this.minShowMoreCount,this.elementList["locations"].elementsSearchString).subscribe(res => {

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
            // this._generalservice.getJobTypes(this.minShowMoreCount,this.elementList["jobtypes"].elementsSearchString).subscribe(res => {
            this._generalservice.getJobTypes().subscribe(res => {

                this.elementList["jobtypes"].elements = [];
                // this.elementList["jobtypes"].showAddmoreFlag = (this.elementList["jobtypes"].elementsChecked.length >0 || res.length >= this.minShowMoreCount)?true :false;
                this.elementList["jobtypes"].showAddmoreFlag = false;
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
            // this._generalservice.getJobExperienceLevels(this.minShowMoreCount,this.elementList["explevels"].elementsSearchString).subscribe(res => {
            this._generalservice.getJobExperienceLevels().subscribe(res => {

                this.elementList["explevels"].elements = [];
                // this.elementList["explevels"].showAddmoreFlag = (this.elementList["explevels"].elementsChecked.length >0 || res.length >= this.minShowMoreCount)?true :false;
                this.elementList["explevels"].showAddmoreFlag = false;
                this.elementList["explevels"].elementsMapper = [];
                res.forEach(selval => {
                    let selElement = new Experience();
                    this._buildElementBody(selElement,selval,"explevels");

                });
                this.explevels$.next(this.elementList["explevels"]);




            });


        }

        if(this.elementList["companies"].loadedDataFlag == false){
            this.elementList["companies"].loadedDataFlag =true;

            //Loading explevels
            this._generalservice.getCompanies(this.minShowMoreCount,this.elementList["companies"].elementsSearchString).subscribe(res => {

                this.elementList["companies"].elements = [];
                this.elementList["companies"].showAddmoreFlag = (this.elementList["companies"].elementsChecked.length >0 || res.length >= this.minShowMoreCount)?true :false;
                this.elementList["companies"].elementsMapper = [];
                res.forEach(selval => {
                    let selElement = new Company();
                     this._buildElementBody(selElement,selval,"companies");

                });
                this.companies$.next(this.elementList["companies"]);




            });


        }


        if(this.elementList["salarylevels"].loadedDataFlag == false){
            this.elementList["salarylevels"].loadedDataFlag =true;

            //Loading jobTypes
            // this._generalservice.getSalaryRanges(this.elementList["salarylevels"].elementsSearchString).subscribe(res => {
            this._generalservice.getSalaryRanges().subscribe(res => {

                this.elementList["salarylevels"].elements = [];
                this.elementList["salarylevels"].showAddmoreFlag = (this.elementList["salarylevels"].elementsChecked.length >0 || res.length >= this.minShowMoreCount)?true :false;
                this.elementList["salarylevels"].elementsMapper = [];
                res.forEach(selval => {
                    let selElement = new SalaryRange();
                    this._buildElementBody(selElement,selval,"salarylevels");

                });
                this.salarylevels$.next(this.elementList["salarylevels"]);




            });


        }

    }


    public numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    public _buildElementBody(selElement:any,selval,key) {

        selElement.id = selval.id;
        if(key == "salarylevels"){

            if(selval.salary_to > 10000){
                selElement.name = '10,000+';

            }
            else{
                selElement.name = this.numberWithCommas(selval.salary_from)+'-'+this.numberWithCommas(selval.salary_to);
            }

        }
        else
            selElement.name = selval.name;

        if (selval.jobs_count != null) selElement.jobs_count = selval.jobs_count;

        selElement.selectedFlag = false;
        if(this.elementList[key].elementsChecked.indexOf(selval.id) != -1){
            selElement.selectedFlag = true;
        }
        this.elementList[key].elements.push(selElement);
        this.elementList[key].elementsMapper.push(selElement.id);

    }

    public onSaveSearch(){

        this.selJob.web_url = window.location.href ;
    }


    public onApply() {

        let pagination_url = {"queryParams":{}};



        this.queryParams$ = this._activeRoute.queryParams.subscribe(params => {
            for (var key in params) {

                if (params.hasOwnProperty(key)) {

                    //All parameters other than the filters
                    if(this.filters[key] === 'undefined' ){
                        pagination_url["queryParams"][key] = params[key];
                    }
                    else if(key == 'title'){
                        pagination_url["queryParams"][key] = params[key];                    }
                }
            }

        });

        this.params$ = this._activeRoute.params.subscribe(params => {
            for (var key in params) {

                if (params.hasOwnProperty(key)) {

                    //All parameters other than the filters
                    if(this.filters[key] === 'undefined' ){
                        pagination_url["queryParams"][key] = params[key];
                    }
                    else if(key == 'title'){
                        pagination_url["queryParams"][key] = params[key];                    }
                }
            }

        });

        this.filters.forEach(selFilter => {

            if(this.elementList[selFilter].elementsChecked.length >0)
                pagination_url["queryParams"][selFilter] = this.elementList[selFilter].elementsChecked;


        });



        this._router.navigate([this.page],pagination_url);
    }

    public onReset(){

        this._router.navigate([this.page]);
        this.getLoadData();
    }

    public getLoadData(){

        //URL QueryParams Fetch
        this.queryParams$ = this._activeRoute.queryParams.subscribe(params => {



            //URL Params Fetch    Used for seo urls
            this.params$ = this._activeRoute.params.subscribe(params2 => {



                this.filters.forEach(selfilter => {


                    if(params[this.paramsHash[selfilter]]){

                        this.elementList[selfilter].elementsChecked = this._getBuildParamsUrl(params[this.paramsHash[selfilter]]);
                        this.elementList[selfilter].elementsSearchString =  params;
                    }
                    else {

                        this.elementList[selfilter].elementsChecked = this._getBuildParamsUrl(params2[this.paramsHash[selfilter]]);
                        this.elementList[selfilter].elementsSearchString =  params2;
                    }



                })


                this._getFetchData();

                //For Remove tags Feature
                this._getResetSelectTags();


            });




            // this._getFetchData();

            //For Remove tags Feature
            // this._getResetSelectTags();




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

        this._getLoadObervables();

    }


    public _getLoadObervables() {

        this.locations$.next(this.elementList["locations"]);
        this.cities$.next(this.elementList["cities"]);
        this.sectors$.next(this.elementList["sectors"]);
        this.fareas$.next(this.elementList["fareas"]);
        this.jobTypes$.next(this.elementList["jobtypes"]);
        this.salarylevels$.next(this.elementList["salarylevels"]);
        this.edulevels$.next(this.elementList["edulevels"]);
        this.explevels$.next(this.elementList["explevels"]);
        this.companies$.next(this.elementList["companies"]);



    }


    ngOnDestroy() {
        this.queryParams$.unsubscribe();
        this.params$.unsubscribe();
    }



    ngOnInit(){

       this.getLoadData();


    }


}
