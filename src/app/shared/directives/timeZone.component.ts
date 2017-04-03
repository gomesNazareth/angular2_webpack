import {Component, Input,EventEmitter,Output,OnInit} from '@angular/core';
import {Renderer} from '@angular/core';

var moment = require('moment-timezone');

declare var moment:any;
@Component({

    selector: "timezone",
    templateUrl: "timeZone.component.html"
})

export class TimeZoneComponent implements OnInit {

    public timeZoneList = moment.tz ? moment.tz.names() : [];

    @Input() visible = true;
    @Input() selectList = [];
    @Input() placeholder = "Select from list";
    @Input() selectedValue = null;

    @Output() selectedId = new EventEmitter();

    public selectedName = null;
    public searchString = "";
    public inputFocused = false;
    public pristine:boolean = true;


    constructor(public renderer: Renderer) {
    }

    onAutofilter(value) {

        this.searchString = value;
    }

    ngOnInit() {
        this.timeZoneList.forEach(res => {
            this.selectList.push({
                id: res,
                name: "(GMT " + moment.tz(res).format('Z') + ") " +res
            });
        })
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

}
