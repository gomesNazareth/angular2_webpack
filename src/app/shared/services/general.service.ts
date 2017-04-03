import {Http,Headers} from '@angular/http';
import {ConfigService} from '../config.service';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class GeneralService {


    //Initialization
    private minCount = 5;
    private maxCount = 10;


    //mapping param keys
    public location_key = "locations";
    public nationality_key = "nationality";
    public city_key = "cities";
    public job_key = "jobtypes";
    public visa_key = "visa_status";
    public age_group = "age_group";
    public jobexp_key = "explevels";
    public salary_range_key = "salarylevels";
    public education_key = "edulevels";
    public language_key = "language";
    public sector_key = "sectors";
    public func_area_key = "fareas";
    public company_key = "companies";

    private _paramsHash = {general:"id_in",location:"country_id_in",city:"ci_in",search:"name_cont"};
    public sectorCacheList:BehaviorSubject<any> = new BehaviorSubject([]);
    public expRangeCacheList:BehaviorSubject<any> = new BehaviorSubject([]);
    public sectorListPristine = true;
    public expRangeListPristine = true;

    private _country_url ="countries";
    private _company_url = "companies";
    private _salary_ranges = "salary_ranges";
    private _visa_statuses = "visa_statuses";
    private _city_url ="cities";
    private _phone_code_url ="phone_codes.html";
    private _general_url ="general.html";
    private _sectors_url ="sectors";
    private _certificates_url ="certificates";
    private _alert_types_url = "alert_types";
    private _skills_url ="skills";
    private _tags_url ="tags";
    private _jobs_url ="job_types";
    private _geo_group_url ="geo_groups";
    private _functional_areas_url ="functional_areas.json";
    private _job_educations_url ="job_educations.json";
    private _job_experience_levels_url ="job_experience_levels.json";
    public  _language_url = "languages.json";

    //Cache
    private alertTypesCache  = null;
    private sectorCache  = null;
    private cityCache = null;
    private countryCache = null;
    private FunctionalAreaCache = null;
    private jobTypesCache = null;
    private EducationCache = null;
    private ExperienceCache = null
    private CompanyCache = null;
    private salaryRangeCache = null;
    private languageCache =null;

    //URL Cache
    private cityCacheUrl = null;
    private functionalAreaCacheURL = null;
    private alertTypesCacheURL  = null;

    private countryCacheURL  = null;
    private sectorCacheURL  = null;
    private jobTypesCacheURL  = null;
    private salaryRangeCacheURL  = null;
    private EducationCacheURL  = null;
    private ExperienceCacheURL  = null;
    private CompanyCacheURL  = null;




    constructor(private _http: Http) {


    }



    private setCountryCache(country) {

        this.countryCache = country;
        return country;
    }



    onCleanString(selvalue){

        var patt = new RegExp(/[^0-9\-]/g);
        if(selvalue!= null){
            if(patt.test(selvalue.toString())){

                selvalue = selvalue.toString().replace(/[^0-9\-]/g,'');
                return selvalue;
            }
        }
        return false;

    }


    public getExpList(){

        let totalExp = 50;
        let yearsExpList =  [];

        for(let i = 0;i<= totalExp;i++){

            if(i != 1){
                yearsExpList.push({id:i,name:i+' Years'})
            }
            else {
                yearsExpList.push({id:i,name:i+' Year'})
            }

        }

        return yearsExpList;
    }


    getAlertTypes():Observable<any[]> {

        let url  = ConfigService.getAPI()+this._alert_types_url;


        if(this.alertTypesCacheURL == url && this.alertTypesCache != null)
        {
            return Observable.of(this.alertTypesCache);
        }
        else
        return this._http.get(url)
            .map(res => res.json())
            .map(res => { this.alertTypesCache = res;this.alertTypesCacheURL = url; return this.alertTypesCache; })

    }

    getCountrySearch(searchString:string = null,order = ""): Observable<any[]> {

        let searchStingURL = "";
        let orderByParams = "";
        if(searchString != null && searchString != "")
        {
            if(order == ""){

                searchStingURL = "?q[name_cont]="+searchString;
            }
            else {
                searchStingURL = "&q[name_cont]=" + searchString;
            }
        }

        if(order != "") {

            if(searchString != null && searchString != ""){

                orderByParams = "?order="+order;
            }
            else {
                orderByParams = "&order="+order;
            }
        }


        return this._http.get(ConfigService.getAPI()+this._country_url+orderByParams+searchStingURL)
            .map(res => res.json())
            .map(res => res["countries"]);
    }


    private _getBuildParamsUrl(params,key:string= null) {

        let url = "";
        if (key != null && params != null && params[key]) {

            if(!Array.isArray(params[key])) {

                let Ids = params[key].split(",");
                if(Ids.length >0){
                    Ids.forEach(id => {
                        url +="&q["+this._paramsHash.general+"][]="+id;
                    });
                }
            }
            else if(Array.isArray(params[key])) {
                if(params[key].length >0){
                    params[key].forEach(id => {
                        url +="&q["+this._paramsHash.general+"][]="+id;
                    });
                }
            }

        }

        return url;
    }

    getCountries(limit:any =1000,params=null,order = "jobs") : Observable<any[]>{

        let orderByParams = (order == "") ? "?all=true":"?order="+order;
        let url = ConfigService.getAPI()+this._country_url+orderByParams+this._getBuildParamsUrl(params,this.location_key);


        if(this.countryCache == null || (this.countryCache != null || this.countryCache.length ==0)|| this.countryCacheURL != url )
        {

            return this._http.get(url)
                .map(res => res.json())
                .map(res => {this.countryCache = res["countries"];this.countryCacheURL = url;return this.countryCache;})
                .map(res => this.getLimiter(res,limit));
        }
        else
        {

            return Observable.of(this.countryCache).map(res => this.getLimiter(res,limit));
        }
    }


    getNationality(limit:any =1000,params=null,order = "jobs") : Observable<any[]>{


        let orderByParams = (order == "") ? "?all=true":"?order="+order;
        let url = ConfigService.getAPI()+this._country_url+orderByParams+this._getBuildParamsUrl(params,this.nationality_key);


        if(this.countryCache == null || (this.countryCache != null || this.countryCache.length ==0)|| this.countryCacheURL != url )
        {


            return this._http.get(url)
                .map(res => res.json())
                .map(res => {this.countryCache = res["countries"];this.countryCacheURL = url;return this.countryCache;})
                .map(res => this.getLimiter(res,limit));
        }
        else
        {

            return Observable.of(this.countryCache).map(res => this.getLimiter(res,limit));
        }
    }



    getCitySearch(country_ids = [],query:string=null,order = "jobs") {

        let url_params = "";
        if(country_ids.length >0)
        {
            country_ids.forEach(selcountryId => {
                url_params += "&q["+this._paramsHash.location+"][]="+selcountryId;
            });
        }

        let orderByParams = (order == "") ? "?all=true":"?order="+order;
        let url = ConfigService.getAPI()+this._city_url+orderByParams+url_params+"&q["+this._paramsHash.search+"]="+query;

        return this._http.get(url)
            .map(res => res.json())
            .map(res => (Array.isArray(res["cities"]) && res["cities"].length >0)?res["cities"]: []);

    }


    getCitiesList(country_ids = [],params=null,limit:any=1000,order = "jobs") : Observable<any[]>{


        let url_params = "";
        if(country_ids.length >0)
        {
            country_ids.forEach(selcountryId => {
                url_params += "&q["+this._paramsHash.location+"][]="+selcountryId;
            });
        }


        let orderByParams = (order == "") ? "?all=true":"?order="+order;
        let url = ConfigService.getAPI()+this._city_url+orderByParams+url_params+this._getBuildParamsUrl(params,this.city_key);



        if(this.cityCacheUrl != url) {

            return this._http.get(url)
                .map(res => res.json())
                .map(res => (Array.isArray(res["cities"]) && res["cities"].length >0)?res["cities"]: [])
                .map(res => {this.cityCache = res,this.cityCacheUrl = url;return this.cityCache})
                .map(res => this.getLimiter(res,limit));
        }
        else {
            return Observable.of(this.cityCache);
        }



    }

    getCities(country_id:number,limit:any=1000) : Observable<any[]>{
        let queryString = this._country_url+'/'+country_id+'/cities.json';
        return this._http.get(ConfigService.getAPI()+queryString)
            .map(res => res.json())
            .map(res => {this.cityCache = res; return res})
            .map(res => (Array.isArray(res["cities"]) && res["cities"].length >0)?res["cities"]: [])
            .map(res => this.getLimiter(res,limit))
    }






    getJobType(){
        return [{name:"Full Time",id:1},{name:"Part Time",id:2}];
    }


    getNoticePeriod() {
        return [{name:"Less than 1 Month",id:"0"},{name:"1 Month",id:"1"},{name:"2 Months",id:"2"},{name:"3 Months",id:"3"},{name:"4 Months",id:"4"},{name:"5 Months",id:"5"},{name:"6+ Months",id:"12"}];
    }


    getAgeGroups(limit:any = 1000,params = null): Observable<any> {

        let url = ConfigService.getAPI() + 'age_groups'+"?order=''"+this._getBuildParamsUrl(params,this.age_group);
        return this._http.get(url)
            .map(res => res.json())
            .map(res => res["age_groups"]);
    }

    getVisaStatus(limit:any =1000,params=null) : Observable<any>{
        let url = ConfigService.getAPI()+this._visa_statuses+"?order=''"+this._getBuildParamsUrl(params,this.visa_key);

        // let url = ConfigService.getAPI() + this._visa_statuses;
        return this._http.get(url)
                .map(res => {
                    return res.json()["visa_statuses"]
                })
    }

    getMaritalStatus(){
        return [{id:"married",name:"Married",code:"married"},{id:"single",name:"Single",code:"single"}];
    }

    getMaritalStatus2(){
        return [{id:"any",name:"Any",code:"any"},{id:"married",name:"Married",code:"married"},{id:"single",name:"Single",code:"single"}];
    }

    getGender(){

        return [{id:"any",name:"Any",code:"any"},{id:"male",name:"Male",code:"male"},{id:"female",name:"Female",code:"female"}];
    }

    getJobseekerGender(){

        return [{id:"male",name:"Male",code:"male"},{id:"female",name:"Female",code:"female"}];
    }

    getLastActive(){

        return [{id:"1 week",name:"1 Week"},{id:"1 month",name:"1 Month"},{id:"3 months",name:"3 Months"},{id:"6 months",name:"6 Months"},{id:"6+ months",name:"Over 6 Months"}];
    }

    getYears(count:number =70): any[] {

        let yearList = [];
        let startYear = 1950
        for (let i =1;i<=count;i++) {
            yearList.push({id:(startYear+i),name:(startYear+i).toString(),year:(startYear+i)})
        }

        return yearList;
    }

    getMonths(): any[] {

        let monthList = [];

        monthList.push({id:1,name:"January"});
        monthList.push({id:2,name:"February"});
        monthList.push({id:3,name:"March"});
        monthList.push({id:4,name:"April"});
        monthList.push({id:5,name:"May"});
        monthList.push({id:6,name:"June"});
        monthList.push({id:7,name:"July"});
        monthList.push({id:8,name:"August"});
        monthList.push({id:9,name:"September"});
        monthList.push({id:10,name:"October"});
        monthList.push({id:11,name:"November"});
        monthList.push({id:12,name:"December"});

        return monthList


    }


    private setSectorCache(sector) {


        this.sectorCache = sector;
        return sector;
    }


    getSkillSearch(searchString:string= "",order = "") :Observable<any[]>{

        return this._http.get(ConfigService.getAPI()+this._skills_url+'?q[name_cont]='+searchString)
            .map(res => res.json())
            .map(res => res["skills"]);
    }

    getTagSearch(searchString:string,order = ""): Observable <any[]> {

         
        return this._http.get(ConfigService.getAPI()+this._tags_url+'?q[name_cont]='+searchString)
            .map(res => res.json())
            .map(res => res["tags"]);

        
    }

    getSectorSearch(searchString:string= "",order = "") :Observable<any[]>{

        return this._http.get(ConfigService.getAPI()+this._sectors_url+'?q[name_cont]='+searchString)
            .map(res => res.json())
            .map(res => res["sectors"]);
    }

    getCertificateSearch(searchString:string= "",order = "") :Observable<any[]>{

        return this._http.get(ConfigService.getAPI()+this._certificates_url+'?q[name_cont]='+searchString)
            .map(res => res.json())
            .map(res => res["certificates"]);
    }



    getCacheSectors(limit:any = 1000,params=null){

        let subUrl = "";
        if(params){
            subUrl ="?q["+this.sector_key+"][]="+' '+this._getBuildParamsUrl(params,this.sector_key);
        }
        else{
            subUrl = "?all=true";
        }
        let url = ConfigService.getAPI()+this._sectors_url+subUrl;

        if(this.sectorListPristine){
            this.sectorListPristine = false;
            this._http.get(url)
                .map(res => res.json())
                .map(res =>{this.sectorCache = res["sectors"];
                    this.sectorCacheList.next(this.sectorCache)})
                .subscribe();
        }

    }



    getSectors(limit:any = 1000,params=null) : Observable<any[]>{

        this.getCacheSectors(limit,params);
        return this.sectorCacheList;

    }



    getSectorTags(limit:any = 1000,params=null) : Observable<any[]>{

        let url = ConfigService.getAPI()+this._sectors_url+"?q["+this.sector_key+"][]="+'  '+this._getBuildParamsUrl(params,this.sector_key);

        if(this.sectorCache == null || this.sectorCacheURL != url)
        {
            return this._http.get(url)
                .map(res => res.json())
                .map(res=> {this.sectorCacheURL =url;return this.setSectorCache(res["sectors"])})
                .map(res => this.getLimiter(res,limit))
        }
        else
        {
            return Observable.of(this.sectorCache).map(res => this.getLimiter(res,limit));
        }

    }


    private setFunctionalAreaCache(fuctionalArea) {


        this.FunctionalAreaCache = fuctionalArea;
        return fuctionalArea;
    }


    getFunctionalAreaSearch(searchString:string= "",order = "") :Observable<any[]>{
        return this._http.get(ConfigService.getAPI()+this._functional_areas_url+'?q[area_cont]='+searchString)
            .map(res => res.json())
            .map(res => res["functional_areas"]);
    }

    getLanguageSearch(query:string=null,order = "") : Observable<any[]> {
        if(this.languageCache != null)
            return Observable.of(this.languageCache);

       let queryString = this._language_url+'?q[name_cont]='+query;

        return this._http.get(ConfigService.getAPI()+queryString)
            .map(res => res.json())
            .map(res => res["languages"])
    }
    getFunctionalAreas(limit:any = 1000,params = null) : Observable<any[]>{

        let url = ConfigService.getAPI()+this._functional_areas_url+"?order=''"+this._getBuildParamsUrl(params,this.func_area_key);


            return this._http.get(url)
                .map(res => res.json())
                .map(res=> this.setFunctionalAreaCache(res["functional_areas"]))
                .map(res => this.getLimiter(res,limit));


    }

    getExpRange() : Observable<any[]>{

        let url = ConfigService.getAPI()+'experience_ranges';


        if(this.expRangeListPristine){
            this.expRangeListPristine = false;

               this._http.get(url)
                .map(res => res.json())
                .map(res=>  {
                    this.expRangeCacheList.next(res["experience_ranges"])
                }).subscribe();

        }

        return this.expRangeCacheList;

    }


    private getLimiter(res,limit:any) {
        if(!isNaN(limit) && res) {
            return res.slice(0, limit);
        }else{
            return (res && res.length > this.maxCount) ? res.slice(0, this.minCount) : res;
        }
    }



    getCompanySearch(searchString:string= "",order = "") :Observable<any[]>{

        return this._http.get(ConfigService.getAPI()+this._company_url+'?q[name_cont]='+searchString)
            .map(res => res.json())
            .map(res => res["companies"]);
    }

    getCompanies(limit:any =1000,params=null) :Observable<any[]> {

        let url = ConfigService.getAPI()+this._company_url+"?order=followers"+this._getBuildParamsUrl(params,this.company_key);


        if(this.CompanyCache == null || this.CompanyCacheURL != url) {
            return this._http.get(url)
                .map(res => res.json())
                .map(res=> {this.CompanyCache = res;this.CompanyCacheURL = url; return res;})
                .map(res => res["companies"])
                .map(res => this.getLimiter(res,limit));
        }
        else
        {
            return Observable.of(this.CompanyCache).map(res => res["companies"]).map(res => this.getLimiter(res,limit));
        }



    }



    getSalaryRanges(params =null): Observable<any[]>{

        let url = ConfigService.getAPI() + this._salary_ranges+"?order=''"+this._getBuildParamsUrl(params,this.salary_range_key);

        if(this.salaryRangeCache == null || this.salaryRangeCacheURL != url ){


            return this._http.get(url)
                .map(res => res.json())
                .map(res=> {this.salaryRangeCache = res;this.salaryRangeCacheURL = url; return res;})
                .map(res => res["salary_ranges"]);
        }
        else
        {
            return Observable.of(this.salaryRangeCache).map(res => res["salary_ranges"]);
        }
    }


    getJobTypeSearch(searchString:string= "",params=null) :Observable<any[]>{

        return this._http.get(ConfigService.getAPI()+this._jobs_url+'?q[name_cont]='+searchString)
            .map(res => res.json())
            .map(res => res["job_types"]);
    }

    getJobTypes(limit:any =1000,params=null,cleanCache=false) :Observable<any[]> {

        let url = ConfigService.getAPI()+this._jobs_url+"?order=''"+this._getBuildParamsUrl(params,this.job_key);

        if(cleanCache == true || this.jobTypesCache == null || this.jobTypesCacheURL != url) {
            return this._http.get(url)
                .map(res => res.json())
                .map(res=> {this.jobTypesCache = res["job_types"];this.jobTypesCacheURL = url; return res["job_types"];})
                .map(res => this.getLimiter(res,limit));
        }
        else
        {
            return Observable.of(this.jobTypesCache).map(res => this.getLimiter(res,limit));
        }



    }


    getGeoGroups() :Observable<any[]> {

        let url = ConfigService.getAPI()+this._geo_group_url;
        return this._http.get(url)
            .map(res => res.json())
            .map(res => res["geo_groups"]);


    }

    getLanguages(limit:any = 1000,params = null) :Observable<any[]> {

        let url = ConfigService.getAPI()+this._language_url+'?all=true'+this._getBuildParamsUrl(params,this.language_key);
        return this._http.get(url)
            .map(res => res.json())
            .map(res => res["languages"])
            .map(res => this.getLimiter(res,limit));


    }

    getJobEducationSearch(searchString:string,order = "") : Observable<any[]>
    {

        let url = ConfigService.getAPI()+this._job_educations_url+'?q[level_cont]='+searchString
        return this._http.get(url)
            .map(res => res.json())
            .map(res => res["job_educations"]);

    }



    getJobEducations(limit:any = 1000,params = null) : Observable<any[]>{


        let url = ConfigService.getAPI() + this._job_educations_url+"?order=''"+this._getBuildParamsUrl(params,this.education_key);


        if(this.EducationCache == null || this.EducationCacheURL != url) {
     
            return this._http.get(url)
                .map(res => res.json())
                .map(res => { this.EducationCache = res["job_educations"];this.EducationCacheURL = url; return res["job_educations"];})
                .map(res => this.getLimiter(res,limit));
        }
        else
        {
            return Observable.of(this.EducationCache).map(res => this.getLimiter(res,limit));
        }

    }


    getBenefits() : Observable<any[]>
    {
        return this._http.get(ConfigService.getAPI()+'benefits')
            .map(res => res.json())
            .map(res => res["benefits"]);

    }

    getJobExperienceSearch(searchString:string,order = "") : Observable<any[]>
    {
        return this._http.get(ConfigService.getAPI()+this._job_experience_levels_url+'?q[level_cont]='+searchString)
            .map(res => res.json())
            .map(res => res["job_experience_levels"]);

    }

    getJobExperienceLevels(limit:any =1000,params=null) : Observable<any[]>{

        let url = ConfigService.getAPI() + this._job_experience_levels_url+"?order=''"+this._getBuildParamsUrl(params,this.jobexp_key);
        if(this.ExperienceCache == null || this.ExperienceCacheURL != url) {

            return this._http.get(url)
                .map(res => res.json())
                .map(res => {
                    this.ExperienceCache = res["job_experience_levels"];
                    this.ExperienceCacheURL = url
                    return res["job_experience_levels"];
                })
                .map(res => this.getLimiter(res,limit));

        }
        else
        {
            return Observable.of(this.ExperienceCache).map(res => this.getLimiter(res,limit));
        }
    }

}