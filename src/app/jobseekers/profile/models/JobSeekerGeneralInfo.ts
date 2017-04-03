export class JobSeekerGeneralInfo {
    sector_id:number;
    jobseeker_id:number;
    expected_monthly_salary:number
    nationality_id:number;
    driving_license_country_id:number;
    driving_license_country_name:string;
    sector_name:string;
    functional_area_id:number;
    functional_area_name:string;
    job_type_id:number;
    job_type_name:string;
    highest_edu_id:number;
    highest_edu_name:string;
    experience_level_id:number;
    experince_level_name:string;
    total_years_experience:number;
    current_salary:number;
    expected_salary_min:number;
    expected_salary:number;
    expected_salary_max:number;
    expected_salary_range:string;
    nationality_code:string;
    nationality_name:string;
    jobseeker_name:string;
    languages:Language[];
    dob:Date;
    dob_day:string;
    dob_month:string;
    dob_year:string
    gender:string;
    marital_status:string;
    visa_status:string;
    notice_period_in_months:number;
    driving_license:boolean;
    driving_license_country_code:string;


}

export class Dob {

    day:number;
    month:number;
    year:number;
}


export class Language {

    constructor(id, name) {

        this.id = id;
        this.name = name;
    }

    id:number;
    name:string;
    created_at:Date;
    updated_at:Date;

}


