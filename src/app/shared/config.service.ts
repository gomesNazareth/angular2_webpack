export class ConfigService {
    //office PC
    public static DEVELOPMENT_BLOOVO_REST_NODE_API = "http://34.193.217.26:8080/";

    //AWS
    public static DEVELOPMENT_BLOOVO_REST_API = "http://34.193.217.26:8080/api/";
    // public static DEVELOPMENT_BLOOVO_REST_API = "http://192.168.1.30:3000/api/";
    public static STAGING_BLOOVO_REST_API = "http://34.193.217.26:8080/api/";
    public static PRODUCTION_BLOOVO_REST_API = "https://test.bloovo.com/api/";


    public static DEVELOPMENT_DOMAIN = "http://34.193.217.26:8080/";
    public static STAGING_DOMAIN = "http://34.193.217.26:8080/";
    public static PRODUCTION_DOMAIN = "https://test.bloovo.com";


    public static expiremin = 60;
    public static jobseekerPath = "job-seeker";


    public static userId:any;

    public static authKey;


    public static publicRoutes = [
        '/home','/home/candidate-elevator', '/home/signup_employer',
        '/home/signup_jobseeker', '/login','/home/login','/home/signup',
        '/home/signin', '/home/forget-password', '/home/change-password'];
    public static titles = {"blogs":"Blogs","jobs":"Jobs","companies":"Companies","dashboard":"Dashboard","settings":"Settings"};

    public static getNodeAPI():string {
        return this.DEVELOPMENT_BLOOVO_REST_NODE_API;
    }


    public static getSocialMediaContent() {
        return "Bloovo job website";
    }

    public static getDomain():string {


        // if (String('<%= CONFIG_ENV %>') == 'prod') {
        //     return this.PRODUCTION_DOMAIN;
        // }
        // else if (String('<%= CONFIG_ENV %>') == 'staging') {
        //     return this.STAGING_DOMAIN;
        // }
        return this.DEVELOPMENT_DOMAIN;
    }

    public static getAPI():string {
        // if (String('<%= CONFIG_ENV %>') == 'prod') {
        //     return this.PRODUCTION_BLOOVO_REST_API;
        // }
        // else if (String('<%= CONFIG_ENV %>') == 'staging') {
        //     return this.STAGING_BLOOVO_REST_API;
        // }
        return this.DEVELOPMENT_BLOOVO_REST_API;
    }

    public static getBloovoAPI():string {
        return this.getNodeAPI();
    }

}
