import {Input,Component,OnInit,Output,EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup,Validators } from '@angular/forms';


//service
import  {JobService} from './services/job.service';
import  {GeneralService} from '../../shared/services/general.service';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

declare var jQuery:any;

@Component({

    selector: "saved-search-form",
    templateUrl: "savedSearchForm.component.html"
})


export class SavedSearchForm   implements OnInit{

    @Input() selJob;
    @Input() alertTypes:BehaviorSubject<any> =new BehaviorSubject(null);
    @Output() onUpdateDone = new EventEmitter();

    //Form
    public  form : FormGroup;

    public constructor( public _fb: FormBuilder,public _jobservice: JobService,
                        public _generalservice:GeneralService) {

        this._generalservice.getAlertTypes().subscribe(res=>{
           this.alertTypes.next(res["alert_types"]);
        });
    }

    ngOnInit(){
        this.form = this._fb.group({
            search_string: [this.selJob.title, Validators.required],
            web_url: [this.selJob.web_url, Validators.required],
            search_id: [this.selJob.id],
            alert_type: [this.selJob.alertTypeId, Validators.required]
        })
    }


    public submitSetupAlert() {

        if(this.form.valid){

            if(this.selJob.id == -1){
                this._jobservice.posteSavedSearchJob(this.form.value.web_url,this.form.value.search_string,this.form.value.alert_type)
                    .subscribe(res => { jQuery('.close_editsavesearch').modal('hide'); this.onUpdateDone.emit({"id":res["saved_job_search"]["id"],"title":res["saved_job_search"]["title"],"alert_type_id":res["saved_job_search"]["alert_type"]["id"],"alert_type_name":res["saved_job_search"]["alert_type"]["name"]})},
                        error =>{ console.error("Saved Job Search could not be updated")});
            }
            else
           this._jobservice.updateSavedSearchJob(this.form.value.search_id,this.form.value.web_url,this.form.value.search_string,this.form.value.alert_type)
               .subscribe(res => { jQuery('.close_editsavesearch').modal('hide'); this.onUpdateDone.emit({"id":res["saved_job_search"]["id"],"title":res["saved_job_search"]["title"],"alert_type_id":res["saved_job_search"]["alert_type"]["id"],"alert_type_name":res["saved_job_search"]["alert_type"]["name"]})},
                          error =>{ console.error("Saved Job Search could not be updated")});
        }
    }
}
