export class File {
    id:number;
    selId:number;
    index:number = null;
    name:string = "Upload Your CV";
    file_types:string[];
    file_type_names:string = ".Doc, .Docx and .PDF";
    file_size:number = 2;
    file_upload_type:string = 'work';
    file_size_unit:string = "MB";
    file_name:string;
    file_url:string = null;
    file_default:boolean = false;
    file_title:string = null;
    file_optional:boolean = false;
    file_format_list = ['image/jpeg','image/png'];


    //Rectangle cropper  dimensions
    cropperSettings_width = 500;
    cropperSettings_height = 300;


    //size of the image that is prodoced after crop . If the dimensions are bigger than the original a propotional
    // image will be created example
    //  canvas : 500X300  cropper: 1000x600 the output is 300x180
    cropperSettings_croppedWidth = 1000;
    cropperSettings_croppedHeight = 600;

    // Dimensions of the full canvas
    cropperSettings_canvasWidth = 500;
    cropperSettings_canvasHeight = 300;

    cropperSettings_minWidth = 100;
    cropperSettings_minHeight = 100;

    post_url:string = "jobseeker_educations";
    post_location= null;
    formParams = [];
    root:string;
    rootTag:string;
    method:string = "POST";
    mode:string;   //edu exp cert resume video coverletter profile
    sub_mode:string = null;
    classMap:string = "upload-dp";
    extraDesc:string = "";

    constructor(name:string,mode:string = "edu",file_type_names:string,file_size:number,file_size_unit:string,file_default:boolean=false,file_title:string=null)
    {
        this.name = name;
        this.file_type_names = file_type_names;
        this.file_size = file_size;
        this.file_size_unit = file_size_unit;

        this.mode = mode;

        if(this.mode == "edu")
        {
            this.post_url = "jobseeker_educations";
            this.root = "jobseeker_education[document]";

        }
        else if(this.mode == "exp")
        {
            this.post_url = "jobseeker_experiences";
            this.root = "jobseeker_experience[document]";

        }
        else if(this.mode == "cert"){
            this.post_url = "jobseeker_certificates"
            this.root = "jobseeker_certificate[document]";

         }
        else if(this.mode == "resume"){
            this.post_url = "jobseeker_resumes"
            this.root = "jobseeker_resume[document]";
            this.file_default = file_default;
            this.file_title = file_title;
         }
        else if(this.mode == "coverletter"){
            this.post_url = "jobseeker_coverletters"
            this.root = "jobseeker_coverletter[document]";
            this.file_default = file_default;
            this.file_title = file_title;
         }

        else if(this.mode == "video"){
            this.post_url = "upload_video"
            this.root = "users[video]";
         }

        else if(this.mode == "profile"){
            this.post_url = "upload_profile_image"
            this.root = "users[profile_image]";
         }




    }

    public setmethod(method = "POST") {
        this.method = method;
    }
    
}

export class File1 {
    id:number;
    name:string;
    desc:string;
    size:number;
    url:string;
    default:boolean = false;
    
}
