import {Company} from '../../../shared/models/Company';


export class Job {
    id:number;
    jobAppId:number;
    deleted:boolean;
    title:string;
    title_url:string;
    description:string;
    qualifications:string;
    requirements:string;
    benefits:string;
    startDate: Date;
    endDate: Date;
    createdDate: Date;
    postDate:Date;
    web_url:string;
    appliedDate:any;
    statusId:number;
    jobTypeName:string;
    rankListLow:number;
    rankListHigh:number;
    trackingId:number;
    is_featured:boolean;
    offerLetter:string;
    avatar:string;
    join_date:any = null;
    employersFeedbackList:any[];
    employersFeedbackInterview = null;
    employersFeedbackOfferLetter = null;
    employersInterviewComment = {};
    employersComment:string;
    appliedFlag:boolean;
    numberApplicants:number;
    probabilitySuccess:number;
    showFeedbackFlag:boolean = false;
    matchingPercent:number;
    openFlag:boolean = true;
    jobStatus:string;
    salaryFrom:number;
    isSaved:boolean;
    salaryTo:number;
    experienceFrom:number;
    experienceTo:number;
    cityId:string;
    city:string;
    checkedFlag:boolean = false;
    countryCode:string;
    countryId:number;
    countryCountry:string;
    viewCount:number;
    licenseRequiredFlag:boolean = false;
    interviewDate:Date;
    interviewTime:string;
    interviewVenue:string;
    interviewStatusFlag:number;
    educationRequirementList = new Array();
    educationLevel:string;
    educationLevelId:number;
    experienceLevel:string;
    experienceLevelId:number;
    employmentType:string;
    employmentTypeId:number;
    drivingLicense:boolean = false;
    howSoon:string;
    howSoonId:number;
    genderType:string;
    certificates = Array();
    certificateRequired:boolean = false;
    jobDescription:string[] = Array();
    jobRequirement:string[] = Array();
    jobBenefitList:BenefitList[] = Array();
    languageList = new Array();
    companyObj:Company;
    sector:string;
    sectorId:string;
}


export class BenefitList {

    id:number;
    name:string;
    icon_code:string;
    description:string;

}


export class JobGraphs {

    options:any;
    data:any;
    mainLabel:string;
    labelList:String[];
    dataList:number[];
    legend:boolean = true;

    chartType:string = "doughnut";
    chartColor:Array<any> =  [
        {
            backgroundColor: [
                '#0b4882',
                '#1560a8',
                '#2c6cb5',
                '#3379bd',
                '#f1f1f1'

            ]

        }];
    chartOptions:any  = {
        responsive: true,
        title: {
            display: false,
            text: 'In Percentage',
            position: 'top'
        },
        legend: {
            display: true,
            alignment:"center",
            position: 'bottom',
            configuration: {
                fontSize: 20
            }
        }
    }

}


export class JobSearchTags {

    searchtagName:string;
    countryCodeList:string[];
    cityIdList:number[];
    sectorIdList:number[];
    functionalAreaIdList:number[];
    jobTypeIdList:number[];
    salaryRange:number[];
    educationLevelIdList:number[];
    companyIdList:number[];
}

export class JobStats {

    totalApplication:number;
    inProgress:number;
    successful:number;
    unSuccessful:number;

}