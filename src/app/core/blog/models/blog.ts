export class Blog {

    id:number;
    name:string;
    bannerImage:string;
    postDate:Date;
    postedUserId:number;
    postedUserName:string;
    postedUserIcon:string;
    likes:number;
    liked:boolean = false;
    totalComments:number;
    description:string;
    image:string;
    googlePlusUrl:string;
    current_user_avatar:string;
    linkedInUrl:string;
    facebookUrl:string;
    twitterUrl:string;
    tags:Tag[] = Array();
    comments:Comment[] = Array();
}


export class Tag {
    id:number;
    name:string;
}

export class Comment {

    id:number;
    userId:number;
    userName:string;
    postedDate:Date;
    postedTime:string;
    description:string
}