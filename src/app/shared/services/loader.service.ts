import {Http,Headers} from '@angular/http';
import {ConfigService} from '../../shared/config.service';
import {Injectable,Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

//Models
import {Country} from '../models/Country';
import {City} from '../models/City';
import {Sector} from '../models/Sector';
import {FunctionalArea} from '../models/FunctionalArea';
import {JobType} from "../models/JobType";
import {Company} from "../models/Company";
import {Education} from "../models/Education";
import {SalaryRange} from "../models/SalaryRange";
import {Experience} from "../models/Experience";
import {Language} from "../../shared/models/Language";
import {Observer} from "rxjs/Rx";

//Services
import {AccountService} from '../../core/account/services/account.service';



@Injectable()
export class LoaderService {


    private AuthHeader;
    private userId;

    constructor(private _http: Http,@Inject(AccountService) authService:AccountService) {
        this.AuthHeader = authService.AuthHeader();
        this.userId = authService.getUserId();
    }


    private _country_url ="countries";
    private _featured_companies_url ="featured_companies.json";
    private _city_url ="cities";
    private _phone_code_url ="phone_codes.html";
    private _general_url ="general.html";
    private _sector_url ="sectors.json";
    private _visa_statuses_url ="visa_statuses.json";
    private _functional_area_url ="functional_areas.json";
    private _jobtype_url ="job_types.json";
    private _education_level_url ="job_educations.json";
    private _company_url ="company_list.html";
    private _company_types ="company_types";

    private _experience_url = "job_experience_levels.json";
    public  _language_url = "languages.json";
    private _salary_range_url = "salary_range.html";

    
    public selCountryCode:string = "UAE";
    public selCityCode:number = 1;
    public countryList:Country[] =  new Array();
    public cityList:City[] =  new Array();
    public sectorList:Sector[] =  new Array();
    public visaStatusList:Sector[] =  new Array();
    public jobTypeList:JobType[] =  new Array();
    public companyList:Company[] =  new Array();
    public educationList:Education[] =  new Array();
    public experienceList:Experience[] =  new Array();
    public salaryRangeList:SalaryRange[] =  new Array();
    public functionalAreaList:FunctionalArea[] =  new Array();
    public countryCacheList:BehaviorSubject<any> = new BehaviorSubject([]);
    public countryListPristine = true;

    //observer
    public countryObs: BehaviorSubject<Country[]> =  new BehaviorSubject(null);
    public sectorObs: BehaviorSubject<Country[]> =  new BehaviorSubject(null);
    public cityObs: BehaviorSubject<City[]> =  new BehaviorSubject(null);

    //Default array
    public defaultList = Array();

    //Cache
    private cityCache = null;
    static countryCache= Array();
    static countryAlphaCache= Array();
    static sectorCache = Array();
    static sectorAlphaCache = Array();
    private visaStatusCache = null;
    private companyCache= null;
    private educationCache= null;
    private experienceCache= null;
    static functionalAreaCache= Array();
    private salaryRangeCache= null;
    private languageCache =null;
    private jobTypeCache =null;


    getLoadDefaults():Array<any[]>{
        let defaultsArry = Array();
        return defaultsArry;
    }

    private _getBuildEducationType(eduTypes) {

        eduTypes.forEach(seleduTypes=> {
            let edNew = new Education();
            edNew.id = seleduTypes.id;
            edNew.name = seleduTypes.name;
            this.educationList.push(edNew);
        })

        this.educationCache = this.educationCache;
        return this.educationList;
    }



    getEducationLevels():Observable<any[]>{

        if(this.educationCache != null)
            return Observable.of(this.educationCache);

        return this._http.get(ConfigService.getAPI()+this._education_level_url)
            .map(res => res.json())
            .map(res => this._getBuildEducationType(res["job_educations"]));
    }

    private _getBuildExperienceType(expTypes) {
        this.experienceList = Array();

        expTypes.forEach(selexpTypes=> {
            let exNew = new Experience();
            exNew.id = selexpTypes.id;
            exNew.name = selexpTypes.name;
            this.experienceList.push(exNew);

        });

        this.experienceCache = this.experienceList;
        return this.experienceList;
    }


    getExperienceLevels():Observable<any[]>{

        if(this.experienceCache != null)
            return Observable.of(this.experienceCache);

        return this._http.get(ConfigService.getAPI()+this._experience_url)
            .map(res => res.json())
            .map(res => this._getBuildExperienceType(res["job_experience_levels"]));
    }

    private _getBuildSalaryRange(salRange) {

        this.salaryRangeList = Array();


        salRange.forEach(selSalRange=> {
            let salaryNew = new SalaryRange();
            salaryNew.id = selSalRange.id;
            salaryNew.name = selSalRange.name;
            this.salaryRangeList.push(salaryNew);
        })

        this.salaryRangeCache = this.salaryRangeList;
        return this.salaryRangeList;
    }

    getSalaryRange():Observable<any[]>{

        if(this.salaryRangeCache != null)
            return Observable.of(this.salaryRangeCache);

        return this._http.get(ConfigService.getBloovoAPI()+this._salary_range_url)
            .map(res => res.json())
            .map(res => this._getBuildSalaryRange(res));
    }

    private _getBuildJobType(jobTypes) {

        this.jobTypeList = Array();


        jobTypes.forEach(selJobtype=> {
            let jtNew = new JobType();
            jtNew.id = selJobtype.id;
            jtNew.name = selJobtype.name;
            this.jobTypeList.push(jtNew);
        })

        this.jobTypeCache = this.jobTypeList;
        return this.jobTypeList;
    }


    getJobTypes() : Observable<any[]>{

        if(this.jobTypeCache != null)
        {
            return Observable.of(this.jobTypeCache);
        }
        //ConfigService.getAPI()+this._sector_url+"?all=true&order=jobs"
        return this._http.get(ConfigService.getAPI()+this._jobtype_url+"?all=true")
            .map(res => res.json())
            .map(res => this._getBuildJobType(res["job_types"]));
    }

    private _getBuildCompanyList(Companies) {

        this.companyList = Array();

        Companies.forEach(selCompany=> {
            let companyNew = new Company();
            companyNew.id = selCompany.id;
            companyNew.name = selCompany.name;
            this.companyList.push(companyNew);
        })


        this.companyCache  = this.companyCache;
        return this.companyList;
    }

    getCompanyType():Observable<any[]>{

        if(this.companyCache != null)
            return Observable.of(this.companyCache);

        return this._http.get(ConfigService.getBloovoAPI()+this._company_url)
            .map(res => res.json())
            .map(res => this._getBuildCompanyList(res));
    }

    getCompanySizes():Observable<any[]> {

        let company_sizes = [];
        return this._http.get(ConfigService.getAPI()+"company_sizes")
            .map(res => res.json())
            .map(res => {res["company_sizes"].forEach(res=> company_sizes.push({id:res.id,name:res.size})); return company_sizes });
    }

    getCompanyTypes():Observable<any[]> {

        return this._http.get(ConfigService.getAPI()+this._company_types)
            .map(res => res.json())
            .map(res => res["company_types"]);
    }

    getCompanyTypesClassifications(){
        return this._http.get(ConfigService.getAPI()+"company_classifications")
            .map(res => res.json())
            .map(res => res["company_classifications"]);
    }

    private _getBuildFunctionalArea(fuctionalAreas) {

        this.functionalAreaList = Array();

        fuctionalAreas.forEach(selFuctionalArea=> {
            let faNew = new FunctionalArea();
            faNew.id = selFuctionalArea.id;
            faNew.name = selFuctionalArea.name;
            this.functionalAreaList.push(faNew);
        })


        LoaderService.functionalAreaCache = this.functionalAreaList;
        return this.functionalAreaList;
    }

    getFunctionalArea() : Observable<any[]>{

        if(LoaderService.functionalAreaCache != null && LoaderService.functionalAreaCache.length > 0)
            return Observable.of(LoaderService.functionalAreaCache);

        return this._http.get(ConfigService.getAPI()+this._functional_area_url+"?all=true")
            .map(res => res.json())
            .map(res => this._getBuildFunctionalArea(res["functional_areas"]));
    }

    private _sortSectors(sectors) {
        if (!LoaderService.sectorAlphaCache || LoaderService.sectorAlphaCache.length == 0){
            LoaderService.sectorAlphaCache = sectors.slice(0);

            LoaderService.sectorAlphaCache.sort(function(a, b) {
                return (a.name < b.name) ? -1 : 1;
            });
        }

        return LoaderService.sectorAlphaCache;
    }

    private _getBuildSector(sectors) {

        this.sectorList = Array();
        sectors.forEach(selSector=> {
            let sectorNew = new Sector();
            sectorNew.id = selSector.id;
            sectorNew.name = selSector.name;
            sectorNew.jobs_count = selSector.jobs_count;
            this.sectorList.push(sectorNew);
        });

        LoaderService.sectorCache = this.sectorList;
        LoaderService.sectorAlphaCache = this._sortSectors(this.sectorList);
        return this.sectorList;
    }

    getSectors(order_by = "jobs") : Observable<any[]>{
        if (LoaderService.sectorCache && LoaderService.sectorCache.length != 0) {
            if (order_by == "alphabetical"){
                this.sectorObs.next(LoaderService.sectorAlphaCache);
            }else {
                this.sectorObs.next(LoaderService.sectorCache);
            }
            return this.sectorObs;
            // return order_by == "alphabetical" ? Observable.from(this._sortSectors(LoaderService.sectorCache)) : Observable.from(LoaderService.sectorCache);
        }else{

                let url = (order_by == "none")? ConfigService.getAPI()+this._sector_url+"?all=true" :ConfigService.getAPI()+this._sector_url+"?all=true&order="+order_by;
                return this._http.get(url)
                    .map(res => res.json())
                    .map(res => {
                        let arr = this._getBuildSector(res["sectors"]);
                        if (order_by == "alphabetical") arr = this._sortSectors(arr);
                        return arr;
                    });



        }
    }

    private _getBuildVisaStatus(visa_statuses) {

        this.visaStatusList = Array();
        visa_statuses.forEach(selVisa=> {
            this.visaStatusList.push(selVisa);
        });

        this.visaStatusCache = this.visaStatusList;
        return this.visaStatusList;
    }

    getVisaStatuses() : Observable<any[]>{
        return this._http.get(ConfigService.getAPI()+this._visa_statuses_url+"?all=true")
                 .map(res => res.json())
                 .map(res => this._getBuildVisaStatus(res["visa_statuses"]));
    }


    private _getBuildCities(cities){
        this.cityList = Array();

        cities.cities.forEach(selCity=>{
            let cityNew = new City();
            cityNew.id = selCity.id;
            cityNew.name = selCity.name;
            this.cityList.push(cityNew);
        });


        this.defaultList["city"] = this.cityList;
        this.cityCache = this.cityList;

        return this.cityList;
    }

    private _getBuildLanguages(data) {
        let lanArray = [];
        data.forEach(res => {

            let lanNew = new Language();
            lanNew.id = res.id;
            lanNew.name = res.name;
            lanArray.push(lanNew);

        });

        this.languageCache = lanArray;
        return lanArray;
    }


    getAllCities(country_id:number) : Observable<City[]>{

        let queryString = "";
        queryString = this._country_url+'/'+country_id+'/cities.json?all=true';
        return this._http.get(ConfigService.getAPI()+queryString)
            .map(res => {
                return res.json()["cities"];
            })
    }


    getCities(country_id:number,query:string=null) : Observable<City[]>{

        if(this.cityCache != null)
            return Observable.of(this.cityCache);

        let queryString = "";
        if(query == null) {
            queryString = this._country_url+'/'+country_id+'/cities.json';
        }
        else {
             queryString = this._country_url+'/'+country_id+'/cities.json?q[name_cont]='+query;
        }

        return this._http.get(ConfigService.getAPI()+queryString)
            .map(res => {
                return res.json()["cities"];
            })
    }

    private _sortCountries(countries) {

        if (!LoaderService.countryAlphaCache || LoaderService.countryAlphaCache.length == 0){
            LoaderService.countryAlphaCache = countries.slice(0);

            LoaderService.countryAlphaCache.sort(function(a, b) {
                return (a.name < b.name) ? -1 : 1;
            });
        }
        return LoaderService.countryAlphaCache;
    }


    private _getBuildCountries(countries){
        this.countryList = Array();
        let cnt =0;
        countries.forEach(selCountry=>{

            let countryNew = new Country();
            countryNew.id = selCountry.id;
            countryNew.name = selCountry.name;
            countryNew.jobs_count = selCountry.jobs_count;
            this.countryList.push(countryNew);
            cnt++;

        });

        LoaderService.countryCache = this.countryList;
        LoaderService.countryAlphaCache = this._sortCountries(this.countryList);
        return this.countryList;
    }


    getCountriesNonZero(order_by="jobs"): Observable<any>{

        let countriesObs = new BehaviorSubject([]);
        this.getCountries(order_by).subscribe(res=>{

           let countryList = [];

            res.forEach(selLan => {
                if(selLan.jobs_count > 0){
                    countryList.push(selLan);
                }
            });

            countriesObs.next(countryList);
        });

        return countriesObs;
    }

    getCountries(order_by="jobs"): Observable<any>{
        if (LoaderService.countryAlphaCache != null && LoaderService.countryAlphaCache.length > 0){
            if (order_by != "jobs")
                this.countryObs.next(LoaderService.countryAlphaCache);
            else
                this.countryObs.next(LoaderService.countryCache);
            return this.countryObs;
        }else {

            let url = (order_by == "none")? ConfigService.getAPI()+this._country_url+"?all=true" :ConfigService.getAPI()+this._country_url+"?all=true&order=jobs";

            return this._http.get(url)
                .map(res => res.json())
                .map(res =>{
                    this._getBuildCountries(res["countries"]);
                    return order_by != "jobs" ? LoaderService.countryAlphaCache : LoaderService.countryCache;
                });
        }

    }


    getFeaturedCompanies(): Observable<any[]>{

        return this._http.get(ConfigService.getAPI()+this._featured_companies_url)
            .map(res => res.json())
            .map(res => res["featured_companies"]);

    }


    // getPhoneCodes(countryCode?:string) : Observable<any[]>{
    //
    //
    //
    //     this.selCountryCode = (countryCode)?countryCode:this.selCountryCode;
    //
    //     let post_data = {"country_code":this.selCountryCode};
    //     return this._http.get(ConfigService.getBloovoAPI()+this._phone_code_url,post_data)
    //         .map(res => res.json());
    //
    // }
}