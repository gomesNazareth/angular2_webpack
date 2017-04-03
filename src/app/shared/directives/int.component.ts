import {Input, OnInit,Component, Output, EventEmitter, ElementRef, Inject} from '@angular/core';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';

// var jQuery = require('jquery');
// var bootstrap = require('bootstrap');
// var intltelinput =require('intl-tel-input');

declare var jQuery:any;



@Component({

    selector: "jquery-tel",
    template: `<input (change)="onGetPhone()" (blur)="onGetPhone()" id="int-tel" placeholder="{{placeholder}}" [(ngModel)]="phone_no" class="int-tel-phoneNum" type="tel"/>`
})


export class IntComponent implements OnInit{

    @Input() phone_no:string = "+971529518234";
    @Input() match:string = "phone_no";
    @Input() placeholder:string = "Phone Number";
    @Input() tel_class:string = "int-tel-phoneNum";
    @Output() getProcessedPhoneNo = new EventEmitter();
    public form1:FormGroup;
    public elementRef:ElementRef;

    constructor(@Inject(ElementRef) elementRef:ElementRef,public _fb:FormBuilder) {
        this.elementRef = elementRef;

    }

    ngOnInit() {
        if (jQuery(this.elementRef.nativeElement)) {
            jQuery(this.elementRef.nativeElement.querySelector('input')).intlTelInput();
        }

    }


    ngAfterViewInit() {
        if (jQuery(this.elementRef.nativeElement) && this.phone_no) {
            jQuery(this.elementRef.nativeElement.querySelector('input')).intlTelInput("setNumber", this.phone_no);
            var that = this;
            jQuery(that.elementRef.nativeElement.querySelector('input')).on("countrychange", function(e, countryData) {
                // do something with countryData

                if (jQuery(that.elementRef.nativeElement)) {
                    that.getProcessedPhoneNo.emit({
                        match:that.match,
                        // phone_no:this.elementRef.nativeElement.querySelector('input').value,
                        phone_no: jQuery(that.elementRef.nativeElement.querySelector('input')).intlTelInput("getNumber")
                    });
                }
            });
        }
    }

onGetPhone() {
        if (jQuery(this.elementRef.nativeElement)) {

            this.getProcessedPhoneNo.emit({
                match:this.match,
                // phone_no:this.elementRef.nativeElement.querySelector('input').value,
                phone_no: jQuery(this.elementRef.nativeElement.querySelector('input')).intlTelInput("getNumber")
            });

        }
    }

}
