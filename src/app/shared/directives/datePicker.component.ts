import {Component, OnInit, EventEmitter, Output, OnDestroy, Input,ElementRef,Inject} from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";


var Pikaday = require('pikaday');
var moment = require('moment');

declare var google:any;
declare var Pikaday:any;
declare var jQuery:any;
declare var moment:any

@Component({

    selector: "datePicker-block",
    template: `<input type="text"  [id]="'datepicker_cert_'+sel_id" [attr.placeholder]="dp_placeholder"   [(ngModel)]="dp_value" value="{{dp_value}}"  #seldate  (change)="emitDate(seldate)" >`
})


export class datePickerComponent implements OnInit,OnDestroy {


    elementRef:ElementRef;

    @Input() dp_placeholder;
    @Input() dp_value = "";
    @Input() dp_startDate;
    @Input() sel_id = "";
    @Input() fromYear = 1946;
    @Input() toYear = 2025;
    @Input() numberOfMonths = 1;
    @Input() maxDate = null;
    @Input() minDate = null;
    @Input() setDefaultDate = "";
    @Input() dateRangeFlag:boolean = false;

    @Output() emitSelDate= new EventEmitter();

    public startPicker;
    public dp_valueObs:BehaviorSubject<any> = new BehaviorSubject(this.dp_value);
    public datePickerLoaded:boolean = false;

    emitDate(data){


        this.emitSelDate.emit({'selDate':data.value});
    }


    ngOnChanges(_changes) {

        if(this.datePickerLoaded == true){
            this.dp_startDate = moment(new Date(this.dp_startDate)).add(0,'days')._d;
            this.startPicker.setMinDate(this.dp_startDate);
            this.startPicker.setStartRange(this.dp_startDate);
        }

        if(this.dp_value){
            this.dp_value =  moment(Date.parse(this.dp_value)).format("D MMM, YYYY");
        }
    }

    ngAfterViewInit() {



        if(this.dp_value == null) this.dp_value = "";
        else if(this.dp_value != ""){
            this.dp_value =  moment(Date.parse(this.dp_value)).format("DD MMM, YYYY");
        }

        this.dp_valueObs.next(this.dp_value);
        this.dp_startDate = moment().add(0,'days')._d;


        if(this.dateRangeFlag == false) {
            this.startPicker = new Pikaday(
                {
                    numberOfMonths: this.numberOfMonths,
                    theme: 'triangle-theme',
                    field: document.getElementById('datepicker_cert_' + this.sel_id),
                    defaultDate: this.setDefaultDate,
                    format : "DD MMM, YYYY",
                    yearRange: [this.fromYear, this.toYear]
                });

            if(this.maxDate)
            this.startPicker.setMaxDate(this.maxDate);

            if(this.minDate)
                this.startPicker.setMinDate(this.minDate);
        }
        else {

           this.startPicker = new Pikaday(
                {
                    numberOfMonths: this.numberOfMonths,
                    theme: 'triangle-theme',
                    field: document.getElementById('datepicker_cert_'+this.sel_id),
                    defaultDate:this.setDefaultDate,
                    yearRange: [this.fromYear, this.toYear],
                    format : "DD MMM, YYYY"
                });
            this.startPicker.setMinDate(this.dp_startDate);
            this.startPicker.setStartRange(this.dp_startDate);
            this.datePickerLoaded = true;
            if(this.maxDate)
                this.startPicker.setMaxDate(this.maxDate);

        }


    }


    ngOnInit() {


    }

    ngOnDestroy() {}

    // constructor(@Inject(ElementRef) elementRef:ElementRef) {
    //     this.elementRef = elementRef;
    // }

}
