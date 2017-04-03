import {Job} from '../../jobseekers/job/models/Job';

export class Company {

    id: number;
    duration: string;
    name:string;
    name_url:string;
    text:string;
    contactEmail:string;
    summary:string;
    sectorId:string;
    sector:any;
    functionalArea:string
    functionalAreaId:number
    facebookUrl:string;
    linkedInUrl:string;
    googlePlusUrl:string;
    skypeUrl:string;
    twitterUrl:string;
    follower:number;
    followingFlag:boolean=false;
    jobsOpen:number;
    establishmentDate:Date;
    profileImage:string;
    coverImage:string;
    addressLine:string;
    addressLine2:string;
    poBox:string;
    cityId:string;
    city:any;
    countryCode:string;
    country:any;
    websiteUrl:string;
    phoneNo:string;
    faxNo:string;
    public lat:string;
    public long:string;
    public companyType:string;
    public companyTypeId:number;
    public companySizeId:number;
    public companySize:string;
    public classification:string;
    public classificationId:number;
    public aboutUs:string;
    public pictures:CompanyPicture[] = Array();
    public team:Team[] = Array();
    public selectedFlag:boolean = false;
    public jobList:Job[] = Array();

}




export class Team {
    id:number;
    name:string;
    designation:string;
    profileImage:string;
    linkedinUrl:string;
    facebookUrl:string;
    twitterUrl:string;
    googlePlusUrl:string;

}

export class CompanyPicture {
    id:number;
    name:string;
    description:string;
    image_url:string;
    image_thumb_url:string;
}