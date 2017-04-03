import {Http,Headers} from '@angular/http';
import {ConfigService} from '../../shared/config.service';


import {Injectable,Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AccountService} from  '../account/services/account.service';


//Models
import {Job,JobStats,JobSearchTags,BenefitList,JobGraphs} from '../../jobseekers/job/models/Job';
import {JobSearch} from '../../jobseekers/job/models/JobSearch';
import {Company} from '../../shared/models/Company';

@Injectable()
export class JobService {

    private _url = "jobs.html";
    private _saved_job_search_url = "saved_job_search.html";
    private _invited_applicants = "invited_jobseekers.json";

    private _alljobs_url = "jobs/all_jobs";
    private _job_details_url = "jobs";
    private _myjobs_url = "/job_applications";
    private _myjobsStats_url = "/dashboard_summary";
    private _suggestedjobs_url = "/jobs/suggested_jobs";

    private _savedsearchjobs_url = "/saved_job_searches";
    private _savedjobs_url = "/saved_jobs";
    private _deletesavedjobs_url = "/saved_jobs/delete_bulk";
    private _featuredjobs_url = "/jobs/featured_jobs";

    //members
    private AuthHeader;
    private AuthHeader2;
    private AuthHeader3;
    private userId;

    //Cache
    private allJobsCache = null;
    private myJobsCache = null;
    private suggestedJobsCache = null;
    private suggestedJobsCacheURL = null;
    private savedJobsCache = null;
    private savedSearchJobsCache = null;
    private allJobsURLCache = null;
    private myJobsURLCache = null;
    private featuredJobsCache = null;

    //variables
    public cachedTimeSec:number

    private _paramHash = {locations:"q[co_in][]=",
        cities:"q[ci_in][]=",
        sectors:"q[se_in][]=",
        fareas:"q[fa_in][]=",
        jobtypes:"q[jt_in][]=",
        salarylevels:"q[sr_in][]=",
        edulevels:"q[je_in][]=",
        explevels:"q[jel_in][]=",
        companies:"q[com_in][]="
    };

    constructor(private _http: Http,@Inject(AccountService) authService:AccountService) {
        this.AuthHeader = authService.AuthHeader();
        this.AuthHeader2 = authService.AuthHeader2();
        this.AuthHeader3 = authService.AuthHeader3();
        this.userId = authService.getUserId();
    }

    applyJobNoAttach(jobId:number): Observable<any> {

        let postDate = {"job_application":{"job_id":jobId}};
        let url = ConfigService.getAPI()+'jobseekers/'+this.userId+'/job_applications';


        return this._http.post(url,JSON.stringify(postDate),this.AuthHeader2)
            .map(res => res.json());
    }

    private _onBuildFilterParams(filterList) {


        let queryString:string = "";



        if(filterList["locations"] && filterList["locations"].length >0){
            filterList["locations"].forEach(selval=>{
                queryString+= this._paramHash.locations+selval+"&";

            });
        }

        if(filterList["cities"] && filterList["cities"].length >0){
            filterList["cities"].forEach(selval=>{
                queryString+= this._paramHash.cities+selval+"&";

            });
        }
        if(filterList["sectors"] && filterList["sectors"].length >0){
            filterList["sectors"].forEach(selval=>{
                queryString+= this._paramHash.sectors+selval+"&";

            });
        }


        if(filterList["fareas"] && filterList["fareas"].length >0){
            filterList["fareas"].forEach(selval=>{
                queryString+= this._paramHash.fareas+selval+"&";

            });
        }



        if(filterList["jobtypes"] && filterList["jobtypes"].length >0){
            filterList["jobtypes"].forEach(selval=>{
                queryString+= this._paramHash.jobtypes+selval+"&";

            });
        }


        if(filterList["salarylevels"] && filterList["salarylevels"].length >0){
            filterList["salarylevels"].forEach(selval=>{
                queryString+= this._paramHash.salarylevels+selval+"&";

            });
        }



        if(filterList["edulevels"] && filterList["edulevels"].length >0){
            filterList["edulevels"].forEach(selval=>{
                queryString+= this._paramHash.edulevels+selval+"&";

            });
        }



        if(filterList["explevels"] && filterList["explevels"].length >0){
            filterList["explevels"].forEach(selval=>{
                queryString+= this._paramHash.explevels+selval+"&";

            });
        }




        if(filterList["companies"] && filterList["companies"].length >0){
            filterList["companies"].forEach(selval=>{
                queryString+= this._paramHash.companies+selval+"&";

            });
        }

        return queryString;

    }



    private clearSavedJobCache(){
        this.savedJobsCache=null;
    }
    getDeleteSavedJobList(jobIdList:any=[]):Observable<any>  {

        let url = ConfigService.getAPI()+'jobseekers/'+this.userId+this._deletesavedjobs_url;
        let querystring:string ="";
        jobIdList.forEach(id=>{
            querystring +="job_ids[]="+id+"&";
        })
        return this._http.delete(url+"?"+querystring,this.AuthHeader3)
            .map(res => res.json())
            .map(res => {this.clearSavedJobCache(); return true});
    }


    getSavedJobList(page:number=1,flag:boolean=false,order_string:string = ""): Observable<any> {

        let url = ConfigService.getAPI()+'jobseekers/'+this.userId+this._savedjobs_url+'?page='+page+'&';

        if(order_string != null && order_string != ""){
            url +='order='+order_string+"&";
        }


        return this._http.get(url,this.AuthHeader)
            .map(res => res.json())
            .map(res => {
                this.savedJobsCache = res;
                return this.getJobs(this.savedJobsCache,flag,"jobs");
            });
    }


    private _clearSavedJobSearchCache() {
        this.savedSearchJobsCache =null;
    }



    getDeleteAllSavedSearchJobList(page:number =1,ids:any[] = null){

        let queryString = "";
        let url = ConfigService.getAPI()+'jobseekers/'+this.userId+this._savedsearchjobs_url+'/delete_bulk?';
        if(ids["length"]>0){

            ids.forEach(selId =>{
                queryString+="saved_job_search_ids[]="+selId+"&";
            });

        }

        return this._http.delete(url+queryString,this.AuthHeader3)
            .map(res => res.json())
            .map(res => {this._clearSavedJobSearchCache();
                this.savedSearchJobsCache = res;
                return this._getSavedSearchJobs(this.savedSearchJobsCache,false)});

    }


    getDeleteSavedSearchJobList(page:number=1,id:number=null): Observable<any> {

        let url = ConfigService.getAPI()+'jobseekers/'+this.userId+this._savedsearchjobs_url+'/'+id;

        return this._http.delete(url,this.AuthHeader3)
            .map(res => res.json())
            .map(res => {this._clearSavedJobSearchCache();
                this.savedSearchJobsCache = res;
                return this._getSavedSearchJobs(this.savedSearchJobsCache,false)});
    }

    getSavedSearchJobList(page:number=1,flag:boolean=false,clearCache:boolean =false): Observable<any> {
        let url = ConfigService.getAPI()+'jobseekers/'+this.userId+this._savedsearchjobs_url+'?page='+page;


        return this._http.get(url,this.AuthHeader)
            .map(res => res.json())
            .map(res => {
                this.savedSearchJobsCache = res;
                return this._getSavedSearchJobs(this.savedSearchJobsCache,flag);
            });

    }

    getSuggestedJobList(page:number=1,order_string=""): Observable<any> {
        let url = ConfigService.getAPI()+this._suggestedjobs_url+'?page='+page+'&';

        if(order_string != null && order_string != ""){
            url +='order='+order_string+"&";
        }

        if(this.suggestedJobsCache != null && this.suggestedJobsCacheURL == url){
            return Observable.of(this.suggestedJobsCache);
        }
        return this._http.get(url,this.AuthHeader)
            .map(res => res.json())
            .map(res => {
                this.suggestedJobsCacheURL = url; 
                this.suggestedJobsCache = this.getJobs(res,[],"jobs");
                return this.suggestedJobsCache; 
            });
    }


    getAllJobList(search_string="",order_string="",dataVal:any = null,page:number=1) : Observable<any> {
        let searchQry = "";
        if(dataVal != null)
        {
            searchQry =this._onBuildFilterParams(dataVal);
        }

        let url = ConfigService.getAPI()+this._alljobs_url+'?page='+page;

        if(searchQry && searchQry.length > 0) {
            url += '&' + searchQry;
        }

        if(order_string != null && order_string != ""){

            url += 'order='+order_string;
        }

        if(search_string != "" && search_string != null){
            url += "&q[title_cont]="+search_string;
        }

        if(this.allJobsCache != null &&  this.allJobsURLCache == url){
            return Observable.of(this.allJobsCache);
        }
        return this._http.get(url,this.AuthHeader)
            .map(res => res.json())
            .map(res => {
                this.allJobsCache = this.getJobs(res,dataVal,"jobs",dataVal);
                this.allJobsURLCache = url; 
                return this.allJobsCache; 
            } );

    }

    getFeaturedJobList(searchQuery ="",dataVal ="") : Observable<any> {
        let url = ConfigService.getAPI()+this._featuredjobs_url+'?'+searchQuery;

        if(this.featuredJobsCache != null){
            return Observable.of(this.featuredJobsCache);
        }
        return this._http.get(url,this.AuthHeader)
            .map(res => res.json())
            .map(res => {this.featuredJobsCache = this.getJobs(res,dataVal,"jobs"); return this.featuredJobsCache; } );

    }

    public deleteJobSearch(search_id:number) {
        this._http.delete(ConfigService.getBloovoAPI()+this._saved_job_search_url);
    }


    public posteSavedSearchJob(web_url:string,title:string,alert_type_id:number){

        let postData = {saved_job_search:{title:title,alert_type_id:alert_type_id,web_url:web_url}};
        let url = ConfigService.getAPI()+'jobseekers/'+this.userId+this._savedsearchjobs_url;

        return this._http.post(url,postData,this.AuthHeader2)
            .map(res=>res.json());

    }

    public updateSavedSearchJob(id:number,web_url:string,title:string,alert_type_id:number){

        let postData = JSON.stringify({saved_job_search:{title:title,alert_type_id:alert_type_id,web_url:web_url}});
        let url = ConfigService.getAPI()+'jobseekers/'+this.userId+this._savedsearchjobs_url+'/'+id;




        return this._http.put(url,postData,this.AuthHeader2)
            .map(res=>res.json());

    }

    public saveJob(job_id:number){


        let postData = {saved_job:{job_id:job_id}};

        let url = ConfigService.getAPI()+'jobseekers/'+this.userId+this._savedjobs_url;

        return this._http.post(url,JSON.stringify(postData),this.AuthHeader2)
            .map(res => res.json());


    }

    public saveJobSearch(search_string:string="all",alert_type:string="",search_id?:number) {

        let contentHeaders = "";
       this._http.post(ConfigService.getBloovoAPI()+this._saved_job_search_url,JSON.stringify({"search_string":search_string,"alert_type":alert_type,"search_id":search_id}))
           .subscribe(
               response => {

               },
               error => {

               }

           );

    }

    private buildJobs(job,checkallFlag,mode ="short"){
        let jobListArry = new Array();


        let statusMapper = ["Applied","Reviewed","Shortlisted","Interview","Successful","Unsuccessful"];
        job.forEach(record => {
            let selJob = null;
            let selJobApplication = null;
            if(mode == "myjobs") {
                selJob = record.job;
                selJobApplication = record;
            }else{
                selJob = record;
            }

            let selJobObj = new Job();
            selJobObj.id = selJob.id;
            selJobObj.title = selJob.title;


            selJobObj.matchingPercent = selJob["matching_percentage"];
            if(selJob["city"]){
                selJobObj.cityId = selJob["city"].id;
                selJobObj.city = selJob["city"].name;
            }

            if(selJob["sector"]) {
                selJobObj.sector = selJob["sector"].name;
                selJobObj.sectorId = selJob["sector"].id;
            }

            if(selJob["country"]){
                selJobObj.countryCode =  selJob["country"].id;
                selJobObj.countryCountry =selJob["country"].name;
            }
            selJobObj.numberApplicants = selJob["job_applications_count"];
            selJobObj.probabilitySuccess = selJob.probability_success;

            
            selJobObj.startDate = selJob.start_date;

            if(mode == "myjobs"){
                selJobObj.startDate = selJobApplication.start_date;
                selJobObj.interviewDate = selJobApplication.interview_date;
                selJobObj.interviewTime = selJobApplication.interview_time;
                selJobObj.trackingId =  statusMapper.indexOf(selJobApplication["job_application_status"]["status"]);
                selJobObj.statusId = statusMapper.indexOf(selJobApplication["job_application_status"]["status"]);
                selJobObj.interviewStatusFlag = statusMapper.indexOf(selJobApplication["job_application_status"]["status"]);
                selJobObj.interviewVenue = selJobApplication.interview_venue;
                selJobObj.employersComment = selJobApplication.interview_comment;
                selJobObj.appliedFlag = selJobApplication.applied_flag;
                selJobObj.appliedDate =  (selJobApplication.applied_date == null)?null:new Date(selJobApplication.applied_date);

                selJobObj.employersFeedbackList = [];

                if(selJobApplication["employer_feedbacks"] && selJobApplication["employer_feedbacks"].length >0) {

                    selJobApplication["employer_feedbacks"].forEach(selFeed => {

                        let obj = {
                                    id:selFeed["id"],
                                    comment:selFeed["comment"],
                                    created_at:selFeed["comment"],
                                    employer_name:selFeed["employer_name"],
                                    employer_id:selFeed["employer_id"]
                                };

                        selJobObj.employersFeedbackList.push(obj);
                    });
                }
            }
            
            if(Date.now() > Date.parse(selJob.end_date)){
                selJobObj.openFlag =false;
            }
            /**
             * Check all flag set
             */
            if (checkallFlag == true){
                selJobObj.checkedFlag = true;
            }


            let selCompany = new Company();
            selCompany.name = selJob["company"]["name"];
            selCompany.id = selJob["company"]["id"];

            if(selJob.company.sector) {
                selCompany.sector   = selJob["company"]["sector"]["name"];
            }

            selJobObj.companyObj  = selCompany;
            selJobObj.companyObj.profileImage = selJob.company.avatar;

            jobListArry.push(selJobObj);
        });
        return jobListArry;
    }

    private getJobs(jobList,dataVal:any,mode= "short",filtersObj ={}):any{
        if(mode == "jobs") {

            let jobListArry = this.buildJobs(jobList.jobs,dataVal);
            let jobOnlyListArry = {
                "jobs":jobListArry,
                "search_tags":filtersObj,
                "meta": jobList["meta"]
            };
            return jobOnlyListArry;

        }
        else if(mode == "myjobs"){

            let jobListArry = this.buildJobs(jobList.job_applications,dataVal,'myjobs');
            let jobOnlyListArry = {
                "jobs":jobListArry,
                "search_tags":filtersObj,
                "meta": jobList["meta"]
            };
            return jobOnlyListArry;

        }
        else if(mode == "long"){
            let jobListArry = this.buildJobs(jobList.jobs,dataVal);

            let jobStats = new JobStats();
            jobStats.totalApplication= jobList.stats.applications;
            jobStats.inProgress= jobList.stats.in_progress;
            jobStats.successful= jobList.stats.success;
            jobStats.unSuccessful= jobList.stats.un_successful;




            let jobSearchTags =  new JobSearchTags();

            jobSearchTags.searchtagName = jobList.search_tags;


            let featuredJobListArry = this.buildJobs(jobList.featured_jobs,dataVal);

            let longJobListArry = {
                "matching_jobs":jobList.matching_jobs,
                "help_message":jobList.help_message,
                "stats":jobStats,
                "featured_jobs":featuredJobListArry,
                "jobs":jobListArry,
                "search_tags":jobSearchTags
            };

            return longJobListArry;
        }
    }

    getMyJobStats(): Observable<any> {
        let url = ConfigService.getAPI()+'jobseekers/'+this.userId+this._myjobsStats_url;

        return this._http.get(url,this.AuthHeader)
            .map(res => res.json());
    }

    getMyJobList(search_string="",order_string="",dataVal:any = null,page:number=1) : Observable<any> {
        let searchQry = "";
        if(dataVal != null){
            searchQry =this._onBuildFilterParams(dataVal);
        }

        let url = ConfigService.getAPI()+'jobseekers/'+this.userId+this._myjobs_url+'?page='+page+'&'+searchQry;

        if(order_string != null && order_string != ""){

            url +='order='+order_string+"&";
        }

        if(search_string != "" && search_string != null){
            url+= "q[title_cont]="+search_string+"&";
        }

        if(this.myJobsCache != null &&  this.myJobsURLCache == url){
            return Observable.of(this.myJobsCache);
        }

        return this._http.get(url,this.AuthHeader)
            .map(res => res.json())
            .map(res => {
                this.myJobsCache = this.getJobs(res,dataVal,"myjobs",dataVal);
                this.myJobsURLCache=url; 
                return this.myJobsCache; 
            });
    }

    getJobList(jobType,dataVal:any,mode="short") : Observable<any> {

        return this._http.get(ConfigService.getBloovoAPI()+this._url+'?'+jobType+'&search_string='+dataVal)
            .map(res => res.json())
            .map(res => this.getJobs(res,dataVal,mode))

    }

    private _getBuildCompany(data){
        let companyList = Array();

        data.forEach(res =>{

            let company = new Company();

            company.id = res.id;
            company.name = res.name;
            company.sector = res.sector.name;

            company.follower = res.followers_count;
            company.followingFlag = res.is_follow_by_current_user;
            company.countryCode = res.country_code;

            company.country = res.country;
            company.city = res.city;
            company.cityId = res.city_id;

            if(res.current_city){
                company.city = res.current_city;
            }


            company.profileImage = res.avatar;
            companyList.push(company);

        });

        return companyList;
    }


    private _getBuildJobCharts(data){
        let jobCharts = this._getBuildCharts(data["job"]);
        return {"jobCharts":jobCharts};
    }


    private _getBuildSimilarJobs(data){

        let similarJobs= this.buildJobs(data.similar_jobs,false);

        return {"similarJobs":similarJobs};
    }

    private _getBuildSimilarCompanies(data){
        let similarCompanies= this._getBuildCompany(data.similar_companies);

        return {"similarCompanies":similarCompanies};
    }

    private _getBuildJobDetails(data){
        let selJob = data.job;
        let selJobObj = new Job();

        selJobObj.id = selJob.id;
        selJobObj.title = selJob.title;
        selJobObj.startDate = selJob.start_date;
        selJobObj.endDate = selJob.end_date;

        selJobObj.appliedDate =  (selJob.applied_date == null)?null:new Date(selJob.applied_date);
        selJobObj.matchingPercent = selJob.matching_percentage;
        selJobObj.probabilitySuccess = selJob.probability_success;

        selJobObj.educationLevel = selJob.job_education.name;
        selJobObj.educationLevelId = selJob.job_education.id;

        selJobObj.employmentType =  selJob.job_experience_level.name;
        selJobObj.employmentTypeId =  selJob.job_experience_level.id;

        selJobObj.experienceFrom = selJob.experience_from;
        selJobObj.experienceTo = selJob.experience_to;
        selJobObj.drivingLicense = (selJob.license_required)?true:false;



        selJobObj.salaryFrom = selJob.salary_from;
        selJobObj.isSaved = selJob.is_saved_by_current_user;
        selJobObj.salaryTo = selJob.salary_to;
        selJobObj.educationLevelId = selJob.job_education.id;
        selJobObj.educationLevel = selJob.job_education.name;
        selJobObj.genderType = selJob.gender_type;
        selJobObj.viewCount = selJob.views_count;
        selJobObj.numberApplicants = selJob.count_applications;

        selJobObj.rankListHigh = selJob.count_applications;

        selJobObj.jobDescription =  selJob.description;
        selJobObj.jobRequirement =  selJob.requirements;




        selJob.languages.forEach(x=>{
            selJobObj.languageList.push({"id":x.id,"name":x.name});
        });


        selJobObj.experienceLevel = selJob.job_experience_level.name;
        selJobObj.experienceLevelId = selJob.job_experience_level.id;


        selJob.benefits.forEach(x=>{
             let bl = new BenefitList();
             bl.id = x.id;
             bl.name = x.name;
             bl.icon_code = x.icon;
            selJobObj.jobBenefitList.push(bl);

        });

        if (selJob.city){
            selJobObj.cityId = selJob.city.id;
            selJobObj.city = selJob.city.name;
        }

        if(selJob.sector) {
            selJobObj.sector = selJob.sector.name;
            selJobObj.sectorId = selJob.sector.id;
        }

        selJobObj.countryCode = selJob.country.id;
        selJobObj.countryId = selJob.country.id;
        selJobObj.countryCountry = selJob.country.name;

        selJobObj.companyObj = new Company();
        selJobObj.companyObj.id = selJob.company.id;
        selJobObj.companyObj.name = selJob.company.name;
        selJobObj.companyObj.followingFlag = selJob.company.is_follow_by_current_user;
        if(selJob.company.sector) {
            selJobObj.companyObj.sector   = selJob.company.sector.name;
            selJobObj.companyObj.sectorId = selJob.company.sector.id;
        }
        selJobObj.companyObj.functionalArea   = selJob.functional_area.name;
        selJobObj.companyObj.functionalAreaId   = selJob.functional_area.id;
        selJobObj.companyObj.profileImage = selJob.company.avatar;

        return {"selectedJobs":selJobObj};

    }

    getViewCount(id:number) {

        let url = ConfigService.getAPI()+this._job_details_url+'/'+id+"/statistics";

        return this._http.get(url,this.AuthHeader)
            .map(res => res.json());

    }

    getJobCharts(id:number) {

        let url = ConfigService.getAPI()+this._job_details_url+'/'+id+"/analysis";

        return this._http.get(url,this.AuthHeader)
            .map(res => res.json())
            .map(res => this._getBuildJobCharts(res));
    }

    getSimilarJobs(id:number){
        let url = ConfigService.getAPI()+this._job_details_url+'/'+id+"/similar_jobs";

        return this._http.get(url,this.AuthHeader)
            .map(res => res.json())
            .map(res => this._getBuildSimilarJobs(res));

    }

    getSimilarCompanies(id:number){
        let url = ConfigService.getAPI()+this._job_details_url+'/'+id+"/similar_companies";

        return this._http.get(url,this.AuthHeader)
            .map(res => res.json())
            .map(res => this._getBuildSimilarCompanies(res));

    }

    getAppStatusList():Observable<any>{

        let url = ConfigService.getAPI()+'/job_application_statuses';
        return this._http.get(url,this.AuthHeader).map(res => res.json());
    }


    sendBulkFeedBack(id,from,to,applStatus,comment) :Observable<any> {

        let url = ConfigService.getAPI()+this._job_details_url+'/'+id+"/job_application_status_changes/create_bulk";

        let postDate = {job_application_status_change: {comment:comment,job_application_status_id:applStatus},start_matching_percentage:from,end_matching_percentage:to};

        return this._http.post(url,JSON.stringify(postDate),this.AuthHeader2)
            .map(res => res.json())

    }


    getJobDetails(id:number) :Observable<any>{

        let url = ConfigService.getAPI()+this._job_details_url+'/'+id+"/show_details";

        return this._http.get(url,this.AuthHeader)
            .map(res => res.json())
            .map(res => this._getBuildJobDetails(res));
    }


    private _getSpaceToDash(title:string){
        return title.trim().replace(/\s+/g, '-');
    }

    private _getSavedSearchJobs(jobList,checkallFlag){
        let jobListArry = new Array();


        jobList["saved_job_searches"].forEach(selJob=> {

            let selJobSearchObj = new JobSearch()
            selJobSearchObj.id = selJob.id;
            selJobSearchObj.title = selJob.title;
            selJobSearchObj.title_url = this._getSpaceToDash(selJob.title);
            selJobSearchObj.alertType = selJob.alert_type["name"];
            selJobSearchObj.web_url = selJob.web_url;
            selJobSearchObj.alertTypeId = selJob.alert_type["id"];
            selJobSearchObj.dateCreated = selJob.created_at;
            if(checkallFlag)
                selJobSearchObj.checked = true;

            jobListArry.push(selJobSearchObj);

        });

        let jobOnlyListArry = {"jobs":jobListArry,"meta": jobList["meta"]};

        return jobOnlyListArry;
    }

    applyJob(jobId:number,resumeId:number,coveletterId:number = null): Observable<any> {

        let postDate = {"job_application":{"job_id":jobId,"jobseeker_resume_id":resumeId,"jobseeker_coverletter_id":coveletterId}};
        let url = ConfigService.getAPI()+'jobseekers/'+this.userId+'/job_applications';


        return this._http.post(url,JSON.stringify(postDate),this.AuthHeader2)
            .map(res => res.json());
    }


    getSavedSearchJobsList(checkallFlag:boolean=false) : Observable<any> {

        return this._http.get(ConfigService.getBloovoAPI()+this._saved_job_search_url)
            .map(res => res.json())
            .map(res => this._getSavedSearchJobs(res,checkallFlag))
    }


    private _getBuildCharts(stats) {
        let jobGraphs1 = new JobGraphs();
        jobGraphs1.mainLabel= "By Country";


        jobGraphs1.options = { colors: ['#142130','#26384c','#374b61','#4b6076','#f1f1f1'] };
        jobGraphs1.data = Array(['Heading', '']);
        let cnt1 = 0;

        stats.analysis_applications_by_country.labels.forEach(sel =>{

            jobGraphs1.data.push([sel, stats.analysis_applications_by_country.data[cnt1]]);
            cnt1++;
        });


        let jobGraphs2 = new JobGraphs();
        jobGraphs2.mainLabel= "By Education Level";

        jobGraphs2.options = {  colors: ['#142130','#26384c','#374b61','#4b6076','#f1f1f1'] };

        jobGraphs2.data = Array(['Heading', '']);
        let cnt2 = 0;

        stats.analysis_applications_by_job_education.labels.forEach(sel =>{

            jobGraphs2.data.push([sel, stats.analysis_applications_by_job_education.data[cnt2]]);
            cnt2++;
        });


        let jobGraphs3 = new JobGraphs();
        jobGraphs3.mainLabel= "By Sector";


        jobGraphs3.options = { colors: ['#31596c','#40697d','#507a8e','#648b9d','#f1f1f1'] };

        jobGraphs3.data = Array(['Heading', '']);
        let cnt3 = 0;


        stats.analysis_applications_by_sector.labels.forEach(sel =>{
            jobGraphs3.data.push([sel, stats.analysis_applications_by_sector.data[cnt3]]);
            cnt3++;
        });


        let jobGraphs4 = new JobGraphs();
        jobGraphs4.mainLabel= "By Age Group";

        jobGraphs4.options = {  colors: ['#629ad1','#87b6e4','#9fc9f2','#badcfd','#f1f1f1'] };
        jobGraphs4.data = Array(['Heading', '']);
        let cnt4 = 0;


        stats.analysis_applications_by_age.labels.forEach(sel =>{
            jobGraphs4.data.push([sel, stats.analysis_applications_by_sector.data[cnt4]]);
            cnt4++;
        });

        return {"country": jobGraphs1,"education":jobGraphs2,"sector":jobGraphs3,"age":jobGraphs4};
    }

    sendApplyInvitation(postData:any) : Observable<any> {


        return this._http.post(ConfigService.getAPI() + this._invited_applicants, postData, this.AuthHeader2)
            .map(res => res.json());
    }

}