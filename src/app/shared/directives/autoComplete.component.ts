import {Component,EventEmitter,Input,Output} from '@angular/core';

import {GeneralService} from '../../shared/services/general.service';
import {AccountService} from '../../core/account/services/account.service';

import {BehaviorSubject} from "rxjs/BehaviorSubject"

@Component({

    selector: 'auto-complete',
    templateUrl: "autoComplete.component.html",
    providers: [GeneralService,AccountService]
})

export class AutoCompleteComponent {

    @Input() recordType:string;
    @Input() placeholder:string = null;
    @Input() paramsType:string = "";
    @Input() resetOnSelect:boolean = false;
    @Input() selectOneEnter:boolean = false;
    @Input() fullWidth:boolean = false;
    @Input() keepSelected:boolean = false;
    @Input() items:Array<any> = [];
    @Output() changeRecords = new EventEmitter();
    @Input() initData:Array<any>  = [];
    @Input() excludeItems:Array<any> =[];

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


        if(_value.id == null) {
            this.items = [];
           if(_value.text && _value.text != ''){
               this.changeRecords.emit({id:null,name: _value.text});
           }

        }
        else{
            this.items = [];
           if(_value.text && _value.text != '')
               this.changeRecords.emit({id:_value.id,name: _value.text});
        }

        // else if (_value.srcElement && _value.srcElement.value && _value.srcElement.value.length > 0){
        //     this.changeRecords.emit({id:null,name: _value.srcElement.value});
        // }

        this.value = {};
        this.items = [];
        this.initData = [];
        this.items$.next([]);

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

        let method_name = "get" + this.recordType + "Search";
        this._generalService[method_name](search_string,this.paramsType).subscribe(recordList=> {
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
