export class Account {

    id:number;
    authenticationKey:string;
    username:string;
    profile_image:string;
    profile_image_icon:string;
    googlePlusUrl:string;
    linkedInUrl:string;
    facebookUrl:string;
    twitterUrl:string
    firstname:string;
    lastname:string;
    currentPassword:string;
    newPassword:string;
    activated:boolean = true;
    suggestedJobNotification:string = "none";   // daily,weekly,monthly,none
    blogPostNotification:string = "none";   // daily,weekly,monthly,none
    pollNotification:string = "none";   // daily,weekly,monthly,none
    visibletoCurrentEmployer:boolean = false;
    subscribeNewsLetter:boolean = false;
}