import {Component,EventEmitter,Input,Output} from '@angular/core';
import {NgClass} from '@angular/common';


import {GeneralService} from '../../shared/services/general.service';

//models
import {FunctionalArea} from '../../shared/models/FunctionalArea';
import {BehaviorSubject} from "rxjs/BehaviorSubject"


@Component({
    selector: 'auto-comp-city',
    template: `

<div *ngIf="showSpinner" class="autocomplete_spinner">
    <span><img src="images/balls.svg"></span>
</div>
<div [class.input-tag-common-width]="!fullWidth">
 <ng2-select *ngIf="placeholder == null"
         [items]="items"
         [active]="initData"
         [resetOnSelect]="resetOnSelect"
         [selectOneEnter]="selectOneEnter"
         (data)="refreshValue($event)"
         (selected)="selected($event)"
         (removed)="removed($event)"
         (typed)="typed($event)"
         (keyup.enter)="selected($event)"
         placeholder="Add {{recordType}}">

 </ng2-select>
 <ng2-select *ngIf="placeholder != null"
         [items]="items"
         [active]="initData"
         [resetOnSelect]="resetOnSelect"
         [selectOneEnter]="selectOneEnter"
         (data)="refreshValue($event)"
         (selected)="selected($event)"
         (removed)="removed($event)"
         (typed)="typed($event)"
         (keyup.enter)="selected($event)"
         placeholder="{{placeholder}}">

 </ng2-select>
</div>

`
})




export class AutoCompleteCityComponent {

    @Input() recordType:string;
    @Input() placeholder:string = null;
    @Input() paramsType:string = "";
    @Input() resetOnSelect:boolean = false;
    @Input() selectOneEnter:boolean = false;
    @Input() fullWidth:boolean = false;
    @Input() items:Array<any> = [];
    @Output() changeRecords = new EventEmitter();
    @Input() initData:Array<any>  = [];
    @Input() excludeItems:Array<any> =[];
    @Input() countryList = [];
    @Input() sortOrder = "jobs";

    public value:any = {};
    public showSpinner:boolean = false;
    public _disabledV:string = '0';
    public disabled:boolean = false;

    public items$:BehaviorSubject<any> = new BehaviorSubject(null);


    public get disabledV():string {
        return this._disabledV;
    }

    public set disabledV(value:string) {
        this._disabledV = value;
        this.disabled = this._disabledV === '1';
    }

    public selected(_value:any):void {

        if(_value.id && _value.text) {
            this.items = [];
            this.changeRecords.emit({id:_value.id,name: _value.text});
        }
        else if (_value.srcElement && _value.srcElement.value && _value.srcElement.value.length > 0){
            this.changeRecords.emit({id:null,name: _value.srcElement.value});
        }
        // else if (_value.srcElement.value && _value.srcElement.value.length > 0){
        //   this.changeRecords.emit({id:null,name: _value.srcElement.value});
        // }
        this.value = {};
        this.items = [];
        this.initData = [];
        this.items$.next([]);
        // this.changeRecords.emit({id:this.value.id,name:this.value.text});

    }

    public removed(value:any):void {

    }

    public typed(value:any):void {
        this.getNewList(value);
    }

    public refreshValue(_value:any):void {
        this.value = _value;
    }

    constructor(public _generalService:GeneralService){

    }


    public resetItems(){

        this.value = {};
        this.items = [];
        this.initData = [];
        this.items$.next(null);

    }

    public getNewList(search_string:string) {


        this.showSpinner = true;
        // if(this.recordType == 'Skill' || this.recordType == 'Tag') {
        //    this.changeRecords.emit({id:null,name:search_string});
        // }
        let method_name = "get" + this.recordType + "Search";
        this._generalService.getCitySearch(this.countryList,search_string,this.sortOrder).subscribe(recordList=> {
            this.items = [];


            this.showSpinner = false;
            recordList.forEach(res => {
                let foundFlag = false;
                this.excludeItems.forEach(xItem => {
                    if(xItem.id == res.id)
                    {
                        foundFlag =  true;
                    }
                });

                if(!foundFlag)
                    this.items.push({id:res.id, text:res.name});
            });

            this.items$.next(this.items);

        });
    }

}

