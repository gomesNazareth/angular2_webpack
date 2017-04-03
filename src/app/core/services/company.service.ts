import {Http,Headers} from '@angular/http';
import {ConfigService} from '../../shared/config.service';
import {AccountService} from  '../../core/account/services/account.service';


import {Injectable,Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

//Models
import {Company,CompanyPicture,Team} from '../../shared/models/Company';
import {Job} from '../../jobseekers/job/models/Job';

import 'rxjs/add/operator/map';

@Injectable()
export class CompanyService {
    private _url = "all_companies.html";
    private _url_company = "companies";
    private _url_jobseekers = "jobseekers";
    private _url_jobs = "jobs";
    private _url_company_user = "company_users";
    private _company_details_url = "companies";
    private _allcompanies_url = "companies";
    private _top_followed_companies_url = "companies";

    //variables
    public cachedTimeSec:number;

    //cache
    public allCompaniesCache = null;
    public allCompaniesURLCache  = null;

    //members
    private AuthHeader;
    private AuthHeader2;
    private AuthHeader3;
    private AuthHeaderPdf;
    private userId;
    private _authkey;

    private _paramHash = {locations:"q[co_in][]=",
    cities:"q[ci_in][]=",
    sectors:"q[se_in][]=",
    fareas:"q[fa_in][]=",
    jobtypes:"q[jt_in][]=",
    salarylevels:"q[sr_in][]=",
    edulevels:"q[je_in][]=",
    explevels:"q[jel_in][]=",
    companies:"q[id_in][]="
};


    constructor(private _http: Http,@Inject(AccountService) authService:AccountService) {

        this.AuthHeader = authService.AuthHeader();
        this.AuthHeader2 = authService.AuthHeader2();
        this.AuthHeader3 = authService.AuthHeader3();
        this.AuthHeaderPdf = authService.AuthHeaderPDF();
        this.userId = authService.getUserId();
        this._authkey = authService.getAuthKey();

    }

    private _getSpaceToDash(name:string){
        return name.trim().replace(/\s+/g, '-');
    }


    private _getBuildCompany(data,mode = "") {
        let companyList = Array();

        data.companies.forEach(res =>{
            let company = new Company();

            company.id = res.id;
            company.name = res.name;
            company.name_url = this._getSpaceToDash(res.name);

            company.sector = res.sector;
            // company.websiteUrl = res.website;
            company.jobsOpen = res.opened_jobs_count;

            company.follower = res.followers_count;
            company.followingFlag = res.is_follow_by_current_user;
            // company.addressLine = res.company_geographical_presence[0].address_line1;
            // company.countryCode = res.company_geographical_presence[0].country_code;
            company.country = res.current_country;
            company.city = res.current_city;
            company.cityId = ((res.current_city !=null)) ?  res.current_city["id"] :null;
            company.profileImage = res.avatar;

            companyList.push(company);
        });
        return {companies: companyList,meta: data["meta"]};
    }


    private _getBuildCompanyJobs(data){


        let jobList = Array();

        data.forEach(val=>{
            let job = new Job();
            val = this.clean(val);
            job.id = val.id;
            job.title = val.title;
            job.title_url = this._getSpaceToDash(val.title);
            job.avatar = val.company["avatar"];
            job.deleted = val.deleted;
            job.endDate = val.end_date;
            job.postDate = val.created_at;
            job.numberApplicants = val.count_applications;
            job.appliedFlag = val.is_applied_by_current_user;
            job.is_featured = val.is_featured;
            job.sector =  val.sector["name"];
            job.city =  val.city.name;
            job.cityId =  val.city.id;
            job.countryId =  val.country.id;
            job.countryCountry =  val.country.name;
            job.sectorId =  val.sector["id"];
            job.viewCount = val.views_count;
            job.jobStatus =  val.status;
            job.appliedDate = val.applied_date;
            jobList.push(job);

        });

        return jobList;

    }

    private _getBuildCompanyCulture(data){


        let pictureList = Array();

        data.forEach(val=>{

            let picture = new CompanyPicture();
            picture.id = val.id;
            picture.name = val.title;
            picture.description = val.title;
            picture.image_url = val.avatar;
            picture.image_thumb_url = val.avatar;
            pictureList.push(picture);


        });

        return pictureList;

    }

    private _getBuildCompanyMembers(data){


        let teamList = Array();

        data.forEach(val=>{

            let team = new Team();
            team.id = val.id;
            team.name = val.name;
            team.designation = val.position;
            team.googlePlusUrl = val.google_plus_url;
            team.linkedinUrl = val.linkedin_url;
            team.facebookUrl =  val.facebook_url;
            team.twitterUrl = val.twitter_url;
            team.profileImage = val.avatar;
            teamList.push(team);
        });


        return teamList;
    }

    private _getBuildCompanyDetails(data){


        let company = new Company();
        company.id = data.id;
        company.name = data.name;
        company.name_url = this._getSpaceToDash(data.name);
        company.summary = data.summary;
        company.aboutUs = data.summary;
        if(data.sector) {
            company.sectorId = data.sector.id;
            company.sector = data.sector.name;
        }

        company.facebookUrl = data.facebook_page_url;
        company.linkedInUrl = data.linkedin_page_url;
        company.twitterUrl = data.twitter_page_url;
        company.googlePlusUrl = data.google_plus_page_url;
        company.contactEmail = data.contact_email;

        company.follower = data.followers_count;
        company.followingFlag = data.is_followed_by_current_user;
        company.establishmentDate = data.establishment_date;
        company.coverImage = data.cover;
        company.profileImage = data.avatar;
        company.addressLine = data.address_line1;
        company.addressLine2 = data.address_line2;
        company.poBox = data.po_box;

        company.city = data.current_city;

        company.country = data.current_country;
        company.websiteUrl = data.website;
        company.phoneNo = data.phone;
        company.faxNo = data.fax;
        company.lat = data.latitude;
        company.long = data.longitude;
        if(data.type) {
            company.companyType = data.type.name;
            company.companyTypeId = data.type.id;
        }
        if(data.size) {
            company.companySizeId = data.size.id;
            company.companySize = data.size.size;
        }
        if(data.classification) {
            company.classification = data.classification.name;
            company.classificationId = data.classification.id;
        }

        let jobList = Array();
        company.jobList = jobList;

        let teamList = Array();
        company.team = teamList;

        let pictureList = Array();

        company.pictures = pictureList;
        return company;
    }



    getGoogleCoOrdinates(address="") :Observable <any[]>{

        return this._http.get('http://maps.google.com/maps/api/geocode/json?address='+address)
            .map(res => res.json());

    }


    getDeleteJob(companyId:number,jobId:number,currentPage:number =1){

        return this._http.delete(ConfigService.getAPI()+this._url_jobs+'/'+jobId,this.AuthHeader3)
            .map(res => res);

    }

    getCompanyJob(id:number):Observable <any[]>{

        return this._http.get(ConfigService.getAPI()+this._url_jobs+'/'+id+'/show_details',this.AuthHeader)
            .map(res => res.json());
    }

    getCompanyJobAnalysis(id:number):Observable <any[]>{

        return this._http.get(ConfigService.getAPI()+this._url_jobs+'/'+id+'/job_applications_analysis',this.AuthHeader)
            .map(res => res.json());
    }


    getCompanyJobsWithFilter(id:number,params = [],pageNo = 1):Observable <any[]>{

        let paramsUrl = "?page="+pageNo;
        params.forEach(selparam=>{

            if(selparam["name"] == 'sector') {
                paramsUrl += "&q[se_eq]="+selparam["id"];
            }
            else if(selparam["name"] == 'fArea') {
                paramsUrl += "&q[fa_eq]="+selparam["id"];
            }
            else if(selparam["name"] == 'jobTypes') {
                paramsUrl += "&q[se_jt]="+selparam["id"];
            }
            else if(selparam["name"] == 'title') {
                paramsUrl += "&q[ti_cont]="+selparam["value"];
            }
        });

        return this._http.get(ConfigService.getAPI()+this._url_company+'/'+id+'/'+'jobs'+paramsUrl,this.AuthHeader)
            .map(res => res.json())
            .map(res =>{ let rnt =[this._getBuildCompanyJobs(res.jobs),res.meta]; return rnt} );
    }

    clean(obj) {
        for (var propName in obj) {

            if (obj[propName] === null || obj[propName] === undefined) {

                if(propName != "views_count" && propName != "applied_date")
                    obj[propName] = {};
                else
                    obj[propName] = 0;
            }
        }
        return obj;
    }


    getCompanyJobs(id:number,params = [],pageNo = 1):Observable <any[]>{


        let paramsUrl = "?page="+pageNo;
        params.forEach(selparam=>{

            if(selparam["name"] == 'sector') {
                paramsUrl += "&q[se_eq]="+selparam["id"];
            }
            else if(selparam["name"] == 'fArea') {
                paramsUrl += "&q[fa_eq]="+selparam["id"];
            }
            else if(selparam["name"] == 'jobTypes') {
                paramsUrl += "&q[se_jt]="+selparam["id"];
            }
            else if(selparam["name"] == 'title') {
                paramsUrl += "&q[ti_cont]="+selparam["value"]
            }
            });

        return this._http.get(ConfigService.getAPI()+this._url_company+'/'+id+'/'+'jobs'+paramsUrl,this.AuthHeader)
            .map(res => res.json())
            .map(res => this._getBuildCompanyJobs(res.jobs));
    }




    addCompanyUserDetails(params):Observable<any> {


        return this._http.post(ConfigService.getAPI()+this._url_company_user,params,this.AuthHeader2)
            .map(res => res.json());
    }



    updateCompanyUserDetails(employerId:number,params):Observable<any> {

        return this._http.put(ConfigService.getAPI()+this._url_company_user+'/'+employerId,params,this.AuthHeader2)
            .map(res => res.json());
    }


    getAddJobs(postJson){
        return this._http.post(ConfigService.getAPI()+'jobs/',postJson,this.AuthHeader2)
            .map(res => res.json());
    }
    getUpdateJobs(jobId:number,postJson){

        return this._http.put(ConfigService.getAPI()+'jobs/'+jobId,postJson,this.AuthHeader2)
            .map(res => res.json());
    }


    getCompanyUserDetails(employerId:number):Observable<any> {

        return this._http.get(ConfigService.getAPI()+this._url_company_user+'/'+employerId,this.AuthHeader)
            .map(res => res.json());
    }

    getDeleteCompanyUser(employerId:number): Observable<any[]> {


        return this._http.delete(ConfigService.getAPI()+this._url_company_user+'/'+employerId,this.AuthHeader3)
            .map(res => res.json());
    }

    getCompanyUsers(companyId:number,pageNo:number,all:boolean=false): Observable<any[]> {

        if(all == true){
            return this._http.get(ConfigService.getAPI()+this._url_company+'/'+companyId+'/users?page='+pageNo,this.AuthHeader)
                .map(res => res.json());
        }
        else {

            return this._http.get(ConfigService.getAPI()+this._url_company+'/'+companyId+'/users?page='+pageNo,this.AuthHeader)
                .map(res => res.json());
        }


    }

    getCompanyEmployerJobs(employerId:number,pageNo:number=1): Observable<any[]> {

        return this._http.get(ConfigService.getAPI()+this._url_company_user+'/'+employerId+'/jobs?page='+pageNo,this.AuthHeader)
            .map(res => res.json());

    }

    getCompanyEmployerBlogs(employerId:number,pageNo:number=1): Observable<any[]> {

        return this._http.get(ConfigService.getAPI()+this._url_company_user+'/'+employerId+'/blogs?page='+pageNo,this.AuthHeader)
            .map(res => res.json());

    }


    getOfferLetter(jobAppId,title,content,fileName){


        let returnObs = new BehaviorSubject(null);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                return returnObs.next("success");
            }
            else {
                return returnObs.next("error");
            }
        };

        var  url = ConfigService.getAPI()+'job_applications/'+jobAppId+'/offer_letters/generate';
        var params = {offer_letter: {title: title, content: content}};
        xhr.open('POST', url, this.AuthHeader2);

        xhr.setRequestHeader("Authorization",this._authkey);
        xhr.setRequestHeader("Content-Type",'application/json');
        xhr.responseType = 'arraybuffer';
        xhr.onload = function(e) {
            if (this["status"] == 200) {
                var blob=new Blob([this["response"]], {type:"application/pdf"});
                var link=document.createElement('a');
                link.href=window.URL.createObjectURL(blob);
                link["download"]=fileName.replace(/\s/g, '')+".pdf";
                link.click();
            }
        };

        xhr.send(JSON.stringify(params));
        return returnObs;


    }



    getCompanyCulture(id:number):Observable <any[]>{

        return this._http.get(ConfigService.getAPI()+this._url_company+'/'+id+'/'+'cultures',this.AuthHeader)
            .map(res => res.json())
            .map(res => this._getBuildCompanyCulture(res.cultures));
    }


    getDeleteCultureMember(companyId:number,cultureMemberId:number) :Observable <any[]>{

        return this._http.delete(ConfigService.getAPI()+this._url_company+'/'+companyId+'/'+'cultures/'+cultureMemberId,this.AuthHeader3)
            .map(res => res.json())
            .map(res => this._getBuildCompanyCulture(res["cultures"]));
    }

    updateCompanyCulture(companyId:number,cultureId:number,postData):Observable <any[]>{



        if(cultureId)
            return this._http.put(ConfigService.getAPI()+this._url_company+'/'+companyId+'/'+'cultures/'+cultureId,JSON.stringify(postData),this.AuthHeader2)
                .map(res => res.json())
                .map(res => this._getBuildCompanyCulture([res["culture"]]));
        else
            return this._http.post(ConfigService.getAPI()+this._url_company+'/'+companyId+'/'+'cultures/',JSON.stringify(postData),this.AuthHeader2)
                .map(res => res.json())
                .map(res => this._getBuildCompanyCulture([res["culture"]]));


    }

    getDeleteTeamMember(companyId:number,teamMemberId:number) :Observable <any[]>{

        return this._http.delete(ConfigService.getAPI()+this._url_company+'/'+companyId+'/'+'company_members/'+teamMemberId,this.AuthHeader3)
            .map(res => res.json())
            .map(res => this._getBuildCompanyMembers(res["company_members"]));
    }




    updateCompanyTeamMember(companyId:number,teamMemberId:number,postData):Observable <any[]>{



        if(teamMemberId)
        return this._http.put(ConfigService.getAPI()+this._url_company+'/'+companyId+'/'+'company_members/'+teamMemberId,JSON.stringify(postData),this.AuthHeader2)
            .map(res => res.json())
            .map(res => this._getBuildCompanyMembers([res["company_member"]]));
        else
            return this._http.post(ConfigService.getAPI()+this._url_company+'/'+companyId+'/'+'company_members/',JSON.stringify(postData),this.AuthHeader2)
                .map(res => res.json())
                .map(res => this._getBuildCompanyMembers([res["company_member"]]));

    }

    getCompanyTeam(id:number):Observable <any[]>{

        return this._http.get(ConfigService.getAPI()+this._url_company+'/'+id+'/'+'company_members',this.AuthHeader)
            .map(res => res.json())
            .map(res => this._getBuildCompanyMembers(res["company_members"]));
    }

    getCompanyDetails(id:number, isPublic:boolean = false): Observable <Company> {


        if (isPublic) {

            return this._http.get(ConfigService.getAPI()+this._url_company+'/'+id)
                .map(res => {
                    return res.json();
                })
                .map(res => this._getBuildCompanyDetails(res.company));

        }else {

            return this._http.get(ConfigService.getAPI()+this._url_company+'/'+id+'/show_details',this.AuthHeader)
                .map(res => res.json())
                .map(res => this._getBuildCompanyDetails(res.company));

        }

    }


    updateCompanyDetails(id:number,company_data) : Observable<Company>{



        return this._http.put(ConfigService.getAPI()+this._url_company+'/'+id,JSON.stringify(company_data),this.AuthHeader2)
            .map(res => res.json())
            .map(res => this._getBuildCompanyDetails(res.company));

    }

    getTopFollowCompanyList(order_string="",dataVal:any = null,page:number=1) : Observable<any[]>{


        let searchQry = "";
        if(dataVal != null)
        {
            searchQry =this._onBuildFilterParams(dataVal);
        }

        let url = ConfigService.getAPI()+this._url_company+'?order=followers&page='+page+'&'+searchQry;

        if(order_string != null && order_string != ""){

            url +='order='+order_string+"&";
        }


        if(this.allCompaniesCache != null &&  this.allCompaniesURLCache == url){

            return Observable.of(this.allCompaniesCache);
        }
        return this._http.get(url,this.AuthHeader)
            .map(res => res.json())
            .map(res => {this.allCompaniesCache = this._getBuildCompany(res);
                this.allCompaniesURLCache=url;
                return this.allCompaniesCache; } );

    }


    private _onBuildFilterParams(filterList) {
        let queryString:string = "";
        if(!filterList) {
            return queryString;
        }

        if(filterList["locations"] && filterList["locations"].length > 0){
            filterList["locations"].forEach(selval=>{
                queryString+= this._paramHash.locations+selval+"&";

            });
        }

        if(filterList["cities"] && filterList["cities"].length > 0){
            filterList["cities"].forEach(selval=>{
                queryString+= this._paramHash.cities+selval+"&";

            });
        }

        if(filterList["sectors"] && filterList["sectors"].length > 0){
            filterList["sectors"].forEach(selval=>{
                queryString+= this._paramHash.sectors+selval+"&";

            });
        }

        if(filterList["fareas"] && filterList["fareas"].length > 0){
            filterList["fareas"].forEach(selval=>{
                queryString+= this._paramHash.fareas+selval+"&";

            });
        }

        if(filterList["jobtypes"] && filterList["jobtypes"].length > 0){
            filterList["jobtypes"].forEach(selval=>{
                queryString+= this._paramHash.jobtypes+selval+"&";

            });
        }

        if(filterList["salarylevels"] && filterList["salarylevels"].length > 0){
            filterList["salarylevels"].forEach(selval=>{
                queryString+= this._paramHash.salarylevels+selval+"&";

            });
        }

        if(filterList["edulevels"] && filterList["edulevels"].length > 0){
            filterList["edulevels"].forEach(selval=>{
                queryString+= this._paramHash.edulevels+selval+"&";

            });
        }

        if(filterList["explevels"] && filterList["explevels"].length > 0){
            filterList["explevels"].forEach(selval=>{
                queryString+= this._paramHash.explevels+selval+"&";

            });
        }

        if(filterList["companies"] && filterList["companies"].length > 0){
            filterList["companies"].forEach(selval=>{
                queryString+= this._paramHash.companies+selval+"&";

            });
        }

        return queryString;
    }

    getAllCompanyList(order_string="",dataVal:any = null,page:number=1) {
        let searchQry = "";

        if(dataVal != null)
        {
            searchQry =this._onBuildFilterParams(dataVal);
        }

        let url = ConfigService.getAPI()+this._url_company+'?page='+page+'&'+searchQry;

        if(order_string != null && order_string != ""){

            url +='order='+order_string+"&";
        }

        if(this.allCompaniesCache != null &&  this.allCompaniesURLCache == url){

            return Observable.of(this.allCompaniesCache);
        }
        return this._http.get(url,this.AuthHeader)
            .map(res => res.json())
            .map(res => {
                this.allCompaniesCache = this._getBuildCompany(res);
                this.allCompaniesURLCache=url;
                return this.allCompaniesCache; 
            });
    }


    getFollowCompany(companyId) {

        let geturl = ConfigService.getAPI()+this._url_company+'/'+companyId+'/'+'follow';
        return this._http.put(geturl,'', this.AuthHeader2)
            .map(res =>res.json())
            .map(res =>res["company"]);

    }


    getUnfollowCompany(companyId) {

        let geturl = ConfigService.getAPI()+this._url_company+'/'+companyId+'/'+'unfollow';
        return this._http.put(geturl,'', this.AuthHeader2)
            .map(res =>res.json())
            .map(res =>res["company"]);
    }




    getJobseekers(pageNo = 1,search_string = "",orderBy,postQuery = "",search_mode = null):Observable<any> {

        let urlParams = "";
        if(search_string != "" && search_mode == null){
            urlParams+="&q[full_name_cont]="+search_string;
        }
        if(search_string != "" && search_mode != null){
            urlParams+="&q[text]="+search_string;

            if(search_mode == 1){
                urlParams+="&q[matching]=all";
            }
            if(search_mode == 2){
                urlParams+="&q[matching]=any";
            }
            if(search_mode == 3){
                urlParams+="&q[matching]=exact";
            }

        }


        let geturl = ConfigService.getAPI()+this._url_jobseekers+'?page='+pageNo+'&order='+orderBy+urlParams+postQuery;


        return this._http.get(geturl,this.AuthHeader)
            .map(res =>res.json());
    }


    getJobseekersAppliedAnalysis(jobId):Observable<any> {

        let geturl = ConfigService.getAPI()+this._url_jobs+'/'+jobId+'/job_applications_analysis';
        return this._http.get(geturl,this.AuthHeader)
            .map(res =>res.json());
    }

    getJobseekersApplied(jobId,pageNo = 1,orderBy,postQuery = ""):Observable<any> {



        let geturl = ConfigService.getAPI()+this._url_jobs+'/'+jobId+'/applicants?page='+pageNo+'&order='+orderBy+postQuery;


        return this._http.get(geturl,this.AuthHeader)
            .map(res =>res.json());
    }

    
    getJobseekersSuggested(jobId,pageNo = 1,orderBy,postQuery = ""):Observable<any> {

        let geturl = ConfigService.getAPI()+this._url_jobs+'/'+jobId+'/suggested_jobseekers?page='+pageNo+'&order='+orderBy+postQuery;
        return this._http.get(geturl,this.AuthHeader)
            .map(res =>res.json());
    }



    getCompanyFollowers(companyId,pageNo = 1,search_string = "",params={}) {



        let urlParams = "";
        if(search_string != "")
        {
            urlParams +='&q[full_name_cont]='+search_string;
        }

        for (var key in params) {
            if (params.hasOwnProperty(key)) {

                if(key == 'locations')
                {
                    params[key].split(',').forEach(res=>{
                        urlParams +='&q[loc_co_in][]='+ res;
                    });

                }
                if(key == 'cities')
                {
                    params[key].split(',').forEach(res=>{
                        urlParams +='&q[loc_ci_in][]='+ res;
                    });

                }
                if(key == 'sectors')
                {
                    params[key].split(',').forEach(res=>{
                        urlParams +='&q[se_in][]='+ res;
                    });

                }




            }
        }

        let geturl = ConfigService.getAPI()+this._url_company+'/'+companyId+'/'+'followers?page='+pageNo+urlParams;


        return this._http.get(geturl,this.AuthHeader)
            .map(res =>res.json());

    }






}