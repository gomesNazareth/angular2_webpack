import {Input, Component,OnInit,Output,EventEmitter} from '@angular/core'
import {FormBuilder, FormGroup,Validators } from '@angular/forms';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';





import {File} from '../../shared/models/File';

//Directives


declare var Pikaday:any;

@Component({
    
    selector: "work-edu-cert",
    templateUrl: "work_edu_cert.component.html"

})


export class WorkEduCertComponent implements OnInit {
    @Input() cachedProfile:BehaviorSubject<any>;
    @Input() commonData:BehaviorSubject<any>;
    @Output() onUpdateProfileStatus= new EventEmitter();

    public cachedProfile$:BehaviorSubject<any> = new BehaviorSubject(null);

    //General Data List
    public sectorList:any;
    public field_studyList:any;
    public educationList:any;


//Members
    public file:File;

    /**
     * Forms
     */
    formCompany:FormGroup;

    ngOnInit():any {
        this.cachedProfile.subscribe(res => {

            if(res) {
                this.cachedProfile$.next(res);
            }
        })
    }


    constructor(public fb:FormBuilder) {


        this.formCompany = this.fb.group({
            company_name: ['', Validators.compose([Validators.required])],
            company_title: ['', Validators.required],
            company_sector_id: ['', Validators.required],
            company_country: ['', Validators.required],
            company_city_id: ['', Validators.required],
            company_start_date: ['', Validators.required],
            company_end_date: ['', Validators.required]
        });


    }


}
