import {Component, OnInit, Input} from '@angular/core';
import {FormBuilder} from '@angular/forms';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Router,ActivatedRoute} from '@angular/router';

//Services
import { AccountService } from '../../core/account/services/account.service';
import {CompanyService} from "../../core/services/company.service";
import {LoaderService} from "../../shared/services/loader.service";
import {GeneralService} from "../../shared/services/general.service";


declare let jsPDF;
declare let html2pdf;
declare var jQuery:any;
@Component({

    selector: "offer-letter",
    templateUrl: "offerletter.component.html",
    styles:[`   
   
 
.offer-letter-2{
    width: 100%;
    margin: 0 auto;
    background: #fff;
    position: relative;
    padding: 15px;
    text-align: left!important;
}
.company-logo{
    width: 60px;
    height: 60px;
    background-color: #f1f1f1;
    overflow: hidden;
}
.company-logo img{
    width: 100%;
    height: auto;
}

.candidate h4{
    font-style: 14px!important;
    color: #374b61;
    font-weight: normal;
    display: block;
    text-align: left;
}

.candidate strong{
    font-style: 14px!important;
    color: #374b61;
    font-weight: 600;
    display: block;
}

.candidate span{
    font-style: 14px!important;
    color: #4f788a;
    font-weight: normal;
    display: block;
    padding: 3px 0px;
}

.title{
    display: block;
    width: 100%;
}
.body-text h5{
    display: block;
    border-bottom: 1px solid #f1f1f1;
    text-align: center;
    font-size: 16px;
    color: #374b61;
    font-weight: 600;
    padding-bottom: 10px;
    padding-top: 35px;
    font-family: 'helveticaneuemedium';
    font-weight: normal;
}

.body-text p{
    font-style: 14px!important;
    color: #4f788a;
    font-weight: normal;
    display: block;
    padding: 3px 0px;
    line-height: 35px;
}

.body-text strong{
    font-style: 14px!important;
    color: #374b61;
    font-weight: 600;
    display: block;
}

.offer-footer{
    border-top: 1px solid #f1f1f1;
    text-align: center;
    margin-top: 40px;
}
.offer-footer p{
    font-size: 14px;
    color: #4f788a;
    padding-top: 20px;
}`]

})

export class OfferLetterComponent implements OnInit {

    @Input() jobTitle;
    @Input() description;
    @Input() candidateDetailsObs:BehaviorSubject<any>;

    public employerObj:BehaviorSubject<any> = new BehaviorSubject(null);
    public todayDate;


    constructor(private _accountService:AccountService) {

        this._accountService.getEmployerDetails(this._accountService.getEmployerId()).subscribe(res => {
            this.employerObj.next(res);
        });
    }

    ngOnInit() {
    }
}
