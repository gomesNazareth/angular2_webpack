import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core'
import {BehaviorSubject} from "rxjs/Rx";


//Services
import {ProfileService} from  '../../core/services/profile.service';

import {Country} from '../../shared/models/Country';
import {City} from '../../shared/models/City';
import {AccountService} from "../../core/account/services/account.service";


var moment = require('moment');
declare var Pikaday:any;
declare var moment:any;

@Component({

    selector: "sel-education",
    templateUrl: "selEducation.component.html"
})


export class SelEducationComponent implements OnInit {
    @Input() education;
    @Input() educationList;
    @Input() field_studyList;
    @Input() countryList;
    @Input() cityList;
    @Input() edu_index;
    @Input() display_mode;

    @Input() city_Obj:City = new City();


    public toYear = moment().format('YYYY');
    public maxDate = moment()._d;
    public startDate;
    public endDate;
    public edu_end_date_error:boolean = false;
    public pristineEducation:boolean = true;

    //Output
    @Output() cancelEDU = new EventEmitter();
    @Output() saveEDU = new EventEmitter();
    @Output() onUpdateProfileStatus = new EventEmitter();
    //flags
    public eduSpinnerFlag:boolean = false;


    //members
    country_Obj:Country = new Country();
    firstCountryId:number;
    country_Obj$:BehaviorSubject<any> = new BehaviorSubject(null);
    formPostObj$:BehaviorSubject<any> = new BehaviorSubject(false);
    public profileCacheDirty = false;

    constructor(public _profileService:ProfileService) {
    }


    ngOnDestroy() {
        if(this.profileCacheDirty){
            AccountService.profileCacheDirty = true;
        }
    }

    ngOnInit():any {

        this.city_Obj.id    = this.education.city.id;
        this.city_Obj.name    = this.education.city.name;
        this.city_Obj.text    = this.education.city.name;
        this.country_Obj.id =   this.education.country.id;
        this.country_Obj.name = this.education.country.name;
        this.country_Obj$.next(this.country_Obj);
        this.firstCountryId = this.country_Obj.id;


        this.startDate = this.education.edu_form.value.edu_start_date;
        this.endDate = this.education.edu_form.value.edu_end_date;
        this.education.edu_form.controls["edu_country_id"].valueChanges.subscribe(val =>{ this.onSelectCountry(val)})
    }


    selectStartDate(obj){
        this.startDate = obj.value;
    }

    selectEndDate(obj){
        this.endDate = obj.value;
    }

    onSelectCountry(val){
        this.country_Obj.id = val;
        this.country_Obj$.next(this.country_Obj);
        this.city_Obj = new City();
    }

    public onPost(index:number) {

        let postList = {
            id:this.education.edu_form.value.edu_id,
            job_education_id:this.education.edu_form.value.edu_q_id,
            city_id:this.education.edu_form.value.edu_city_id,
            country_id:this.education.edu_form.value.edu_country_id,
            grade:this.education.edu_form.value.edu_grade,
            school:this.education.edu_form.value.edu_name,
            field_of_study:this.education.edu_form.value.edu_field_study,
            from:this.education.edu_form.value.edu_start_date,
            to:this.education.edu_form.value.edu_end_date
        }

        if(this.education.edu_form.value.edu_id == -1)
        {
            this._profileService.postEducation(postList).subscribe(res=>{ this.profileCacheDirty = true;
            this.saveEDU.emit({"id":index,"result":res});

            this.onUpdateProfileStatus.emit({"update":true});

            });

        }
        else
        {
            this._profileService.updateEducation(postList).subscribe(res=>{this.profileCacheDirty = true;
            this.saveEDU.emit({id:index,result:res});

            this.onUpdateProfileStatus.emit({"update":true});
            });

        }
    }

    onToggleCurrentlyStuding(){
        this.education.edu_still_studing = (this.education.edu_still_studing)?false:true;
    }

    onSaveEdu(id:number = null) {
        this.eduSpinnerFlag = true;
        this.pristineEducation = false;

        if (this.education.edu_form.valid) {


            if(!this.education.edu_form.value.edu_still_studing)
            {
                //if your not working here make sure data is entered
                if(this.education.edu_form.value.edu_end_date != null)
                {
                    this.edu_end_date_error = false;

                    this.onPost(id);
                }
                else{
                    this.edu_end_date_error = true;
                }
            }
            else
            {
                //if you are still working then
                this.education.edu_form.value.edu_end_date = null
                this.onPost(id);
            }
        }
    }

    onSelectCity($event){

        if($event.id)
        {
            this.city_Obj.id = $event.id;
            this.city_Obj.name = $event.name;
            this.city_Obj.text = $event.name;

        }
    }

    onCancelEDU(id:number = null) {

        this.cancelEDU.emit({id: id});
    }


}
