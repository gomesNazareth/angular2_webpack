import {Component, Input,Inject,EventEmitter,Output,OnInit} from '@angular/core';
import {Directive, ElementRef, Renderer} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';




declare var jQuery:any;
@Component({
    selector: 'bootstrap-selectbox',
    template:`<div class="bs-docs-example no-code">
  <div class="btn-group bootstrap-select">
  <button type="button" class="btn dropdown-toggle btn-default " data-toggle="dropdown" role="button" title=""  aria-expanded="true" (click)="moveFocus()">
        <span class="filter-option pull-left " [class.placeholder]="pristine" *ngIf="selectedName != null || selectedName != ''">{{selectedName}}</span>
        <span class="filter-option pull-left " [class.placeholder]="pristine" *ngIf="selectedName == null || selectedName == ''">{{placeholder}} </span>&nbsp;
        <span class="bs-caret">
            <span  class="caret"></span>
        </span>
  </button>
<div class="dropdown-menu open" role="combobox">
<div class="bs-searchbox" *ngIf="showSearch">
 <input  [focus]="inputFocused"  [(ngModel)]="typedString"  type="text" class="form-control focusedInput"  (keydown.enter)="selectedonEnter(null,typedvalue.value)" (keyup)="onAutofilter(typedvalue.value)" #typedvalue autocomplete="off" role="textbox" aria-label="Search" placeholder="Search"> 
</div>
<ul class="dropdown-menu inner" role="listbox" aria-expanded="true" style="max-height: 123px; overflow-y: auto; min-height: 0px;">

<li *ngFor="let selval of selectList,let selIndex = index" (click)="selected(selval.id,selval.name)" 
[attr.data-original-index]="selIndex" [class]="selval.name == selectedName ?'selected active': ''" 
[class.hide]="selval.name.toLowerCase().indexOf(searchString.toLowerCase()) === -1">
<a tabindex="0" [class.hidden]='getCheckExclude(selval.id)'  data-tokens="null" role="option" aria-disabled="false" aria-selected="false">
<span class="text">
 {{selval.name}}
</span>
<!--<span class="zmdi zmdi-check-circle f-check-m"></span>-->
</a>
</li>
</ul>
</div>

  </div>
</div>`



})


export class SelectBoxComponent implements  OnInit{

    @Input() visible = true;
    @Input() selectList = [];
    @Input() excludeItems:Array<any> =[];
    @Input() placeholder = "Select from list";
    @Input() selectedValue = null;
    @Input() showSearch = true;
    @Input() resetOnSelect:boolean = false;
    @Input() selectOneEnter:boolean = false;
    @Output() selectedId = new EventEmitter();
    @Output() selectedString = new EventEmitter();

    public selectedValueObs:BehaviorSubject<any> = new BehaviorSubject(this.selectedValue);
    public selectedName = null;
    public searchString = "";
    public inputFocused = false;
    public pristine:boolean = true;
    public typedString:string = "";



    constructor(public el: ElementRef, public renderer: Renderer) {


    }

    onAutofilter(value) {

        this.searchString = value;
    }




    getCheckExclude(id){

        let returnFlag = false;
        this.excludeItems.forEach(val=>{

            if(val["id"] == id){

                returnFlag = true;

            }

        });

        return returnFlag;
    }

    getSelectedName() {


        if(this.selectedValue != null)
        {


            this.selectList.forEach(res=>{
                if(res.id == this.selectedValue)
                {
                    this.selectedName = res.name;
                    this.pristine = false;
                }
            });
        }
        else {
            this.pristine = true;
            this.selectedName = this.placeholder;
        }
    }

    ngOnInit() {

    }

    ngOnChanges(_changes) {


        this.getSelectedName();
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


        if(!this.resetOnSelect)
        {
            this.searchString = "";
            this.selectedName = name;
        }
        this.typedString = null;
        this.selectedId.emit({id:id,name:name});
    }

    public selectedonEnter(id:any,name:any) {


        this.typedString = null;
        if(this.selectOneEnter){
            this.pristine = false;
            this.searchString = "";
            this.selectedName = name;
            this.selectedString.emit({id:null,name:name});
        }


    }




    ngAfterViewInit() {

    }



}
