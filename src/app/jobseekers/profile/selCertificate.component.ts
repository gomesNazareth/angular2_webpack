import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core'

//Services
import {ProfileService} from  '../../core/services/profile.service';
import {AccountService} from "../../core/account/services/account.service";

var moment = require('moment');

declare var Pikaday:any;
declare var moment:any;


@Component({

    selector: "sel-certificate",
    templateUrl: "selCertificate.component.html"
})


export class SelCertificateComponent implements OnInit {


    @Input() cert_index;
    @Input() certificate;
    @Input() display_mode;


    //Output
    @Output() cancelCERT = new EventEmitter();
    @Output() saveCERT = new EventEmitter();
    @Output() onUpdateProfileStatus = new EventEmitter();


    //flags
    public cerSpinnerFlag:boolean = false;
    public certificate_pristine:boolean = true;
    public startDate;
    public endDate;
    public profileCacheDirty = false;
    public toYear = moment().format('YYYY');
    public maxDate = moment()._d;
    public certSpinnerFlag = false;

    constructor(public _profileService:ProfileService) {
    }

    ngOnDestroy() {
        if(this.profileCacheDirty){
            AccountService.profileCacheDirty = true;
        }
    }

    ngOnInit():any {
       this.startDate = this.certificate.cert_form.value.cert_start_date;
       this.endDate = this.certificate.cert_form.value.cert_end_date;

    }


    onSaveCERT(id:number = null) {
        this.certificate_pristine= false;
        this.cerSpinnerFlag = true;
        if (this.certificate.cert_form.valid) {
            this.onPost(id);
        }
    }


    onCancelCERT(id:number = null) {
        this.cancelCERT.emit({id: id});
    }

    selectStartDate(obj){
       this.startDate = obj.value;
    }

    selectEndDate(obj){
       this.endDate = obj.value;

    }


    ngAfterViewInit() {

    }

    public onPost(index: number) {

        let postList = {
            id:this.certificate.cert_form.value.cert_id,
            name: this.certificate.cert_form.value.cert_name,
            institute: this.certificate.cert_form.value.cert_university,
            attachment: null,
            grade: this.certificate.cert_form.value.cert_grade,
            from: new Date(Date.parse(this.certificate.cert_form.value.cert_start_date)),
            to: new Date(Date.parse(this.certificate.cert_form.value.cert_end_date))
            };

        if(this.certificate.cert_form.value.cert_id == -1)
        {
            this._profileService.postCertificate(postList).subscribe(res=>{ this.profileCacheDirty = true; this.saveCERT.emit({"id":index,"result":res});
            this.onUpdateProfileStatus.emit({"update":true});});

        }
        else
        {
            this._profileService.updateCertificate(postList).subscribe(res=>{this.profileCacheDirty = true; this.saveCERT.emit({id:index,result:res})
                this.onUpdateProfileStatus.emit({"update":true});});

        }
    }
}
