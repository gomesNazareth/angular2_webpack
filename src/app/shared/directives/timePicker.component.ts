import {Component, OnInit, EventEmitter, Output, OnDestroy, Input,ElementRef,Inject} from '@angular/core';

var moment = require('moment');

declare var google:any;
declare var moment:any;
declare var Pikaday:any;
declare var jQuery:any;

@Component({

    selector: "timePicker-block",
    templateUrl:"timePicker.component.html"
})

export class timePickerComponent implements OnInit {
    elementRef:ElementRef;

    @Input() visible = true;
    @Input() selectList = [];
    @Input() placeholder = "Select from list";
    @Input() selectedValue = null;

    @Output() selectedId = new EventEmitter();

    public selectedName = null;
    public searchString = "";
    public inputFocused = false;
    public pristine:boolean = true;
    public hour = [12,1,2,3,4,5,6,7,8,9,10,11];
    public minute =  [];
    public periods = ["am","pm"];
    public timeList = [];


    ngOnInit() {
        for(var i= 0;i<60;i++){
            let hourString = (i < 10)? "0"+i : i;
            this.minute.push(hourString);
        }

        this.periods.forEach(selPeriod => {
            this.hour.forEach(selHour => {

                this.minute.forEach(selMin=>{
                    this.timeList.push(selHour+" "+selMin+" "+selPeriod);

                    this.selectList.push({id:selHour+":"+selMin+" "+selPeriod,name:selHour+":"+selMin+" "+selPeriod});
                })
            })
        })
    }


    onAutofilter(value) {
        this.searchString = value;
    }


    moveFocus() {
        this.inputFocused = true;
        // we need this because nothing will
        // happens on next method call,
        // ngOnChanges in directive is only called if value is changed,
        // so we have to reset this value in async way,
        // this is ugly but works
        setTimeout(() => {this.inputFocused = false});
    }


    public selected(id:any,name:any) {
        this.pristine = false;

        this.searchString = "";
        this.selectedName = name;
        this.selectedId.emit({id:id,name:name});
    }

    constructor(@Inject(ElementRef) elementRef:ElementRef) {
        this.elementRef = elementRef;
    }

}
