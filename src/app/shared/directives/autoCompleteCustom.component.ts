import {Component,EventEmitter,Input,Output,OnInit} from '@angular/core';

import {Observable} from 'rxjs/Observable'


@Component({
    selector: 'ng2-select',
    template: `
<div class="bs-docs-example no-code">
  <div class="btn-group bootstrap-select" [ngClass]="{ 'open': openDropDown }">
  
  <button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown" role="button" title="" aria-expanded="true" (click)="moveFocus()">
    
         <span class="filter-option pull-left" *ngIf="selvalue != '' && selvalue != null">{{selvalue}}</span>
        <span class="filter-option pull-left placeholder" *ngIf="selvalue == '' || selvalue == null">{{placeholder}} </span>&nbsp;
        <span class="bs-caret">
            <span class="caret"></span>
        </span>
  </button>
  
<div class="dropdown-menu open" role="combobox">
<div class="bs-searchbox">
  <input *ngIf="!selectOneEnter" [focus]="inputFocused" autocomplete="off" name="auto_comp" class="focusedInput"  (click)="setDefault(autocomp)"  
  (keyup)="onSearch(autocomp.value)" #autocomp   [attr.placeholder]="placeholder" type="text" 
   [(ngModel)] ="selValue" >
  <input *ngIf="selectOneEnter"  [focus]="inputFocused" autocomplete="off" name="auto_comp" class="focusedInput" 
  (keydown.enter)="selectedElement(null,autocomp.value);resetSelValue()"  
  [(ngModel)] ="selValue"
  (click)="setDefault(autocomp)"  (keyup)="onSearch(autocomp.value)" #autocomp   [attr.placeholder]="placeholder" type="text" >
</div>
<ul class="dropdown-menu inner" role="listbox" aria-expanded="true" style="max-height: 123px; overflow-y: auto; min-height: 0px;">
<li *ngFor="let selval of items,let selIndex = index" (click)="selectedElement(selval.id,selval.text);resetSelValue()" [attr.data-original-index]="selIndex" [class]="selval.text == selvalue ?'selected active': ''" [class.hide]="selval.text.toLowerCase().indexOf(searchString.toLowerCase()) === -1"  >
<a tabindex="0"  data-tokens="null" role="option" aria-disabled="false" aria-selected="false">
<span class="text">
 {{selval.text}}
</span>
</a>
</li>
</ul>
</div>
  </div>
</div>
               `
})
export class AutoCompleteCustom  implements OnInit{

    @Input() items =[];
    @Input() disabled;
    @Input() active = {};
    @Input() placeholder = "AutoComplete";
    @Input() resetOnSelect:boolean = false;
    @Input() selectOneEnter:boolean = false;
    @Input() keepSelected:boolean = false;

    @Output() data = new EventEmitter();
    @Output() selected = new EventEmitter();
    @Output() removed = new EventEmitter();
    @Output() typed = new EventEmitter();

    // public selvalue = {id:null,text:""};
    public selvalue = "";
    public showListFlag = false;
    public searchString = "";
    public inputFocused = false;
    public openDropDown = false;
    public selValue = "";


    resetSelValue(){

        if(this.keepSelected == false){

            this.selValue='';
        }

        if(this.resetOnSelect){
            this.selvalue='';

        }
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

    public selectedElement(id:any,name:any) {

        this.searchString = "";
        this.selvalue = name;

        Observable.of(1).delay(500)
            .subscribe(x => {

                if(this.keepSelected == true){
                    this.selValue=name;
                }
                this.selected.emit({id:id,text:name});
                this.data.emit({id:id,text:name});
                this.openDropDown = false;

                    this.resetSelValue();

            });
    }


    setDefault(obj){
        obj.value = '';
        this.showListFlag = true;
        this.onSelect({id:null,text:null});
    }

    onSelect(selData){
        this.selvalue = selData["text"];

        Observable.of(1).delay(500)
            .subscribe(x => {


                if(this.keepSelected == true){
                    this.selValue=name;
                }
                this.resetSelValue();
                this.selected.emit(selData);
                this.data.emit(selData);
            });

    }


    onSearch(val){
        this.openDropDown = true;
        this.typed.emit(val);
        // this.showListFlag =false;
        this.searchString = val;
    }
    ngOnInit() {
        this.selvalue = (this.active[0]) ? this.active[0]["text"] : "";
        if(this.keepSelected == true) {
           this.selValue=this.selvalue;
        }
    }

}
