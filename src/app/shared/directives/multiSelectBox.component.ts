import {Component, Input,Inject,EventEmitter,Output,OnInit} from '@angular/core';
import {Directive, ElementRef, Renderer} from '@angular/core';



declare var jQuery:any;
@Component({

    selector: 'bootstrap-multiselectbox',

    templateUrl:"multiSelectBox.component.html" ,



})


export class MultiSelectBoxComponent implements  OnInit{

    @Input() visible = true;
    @Input() selectList = [];
    @Input() placeholder = "Select from list";
    @Input() selectedValue = null;
    @Input() multiSelect:boolean = true;

    @Output() selectedId = new EventEmitter();
    @Output() selectedIds = new EventEmitter();

    public selectedName = null;
    public searchString = "";
    public inputFocused = false;
    public multiList = [];


    constructor(public el: ElementRef, public renderer: Renderer) {


    }

    onAutofilter(value) {

        this.searchString = value;
    }

    ngOnInit() {

        if(this.selectedValue !=null)
        {

            this.selectedName = "";
            this.selectList.forEach(res=>{

                if(this.selectedValue.indexOf(res.id) != -1) {
                    this.multiList.push(res.id);
                    if(this.selectedName.length == 0)
                        this.selectedName += res.name;
                    else
                    this.selectedName += ", "+res.name;
                }
            });

            this.reArrangeList();

        }
        else {
            this.selectedName = this.placeholder;
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


    public getCallTick(id){


        //Reset on all Selection
        if(id == -1){


            this.multiList = [];
        }
        else{
            //If its not all option that is ticked
            //Remove all from the list
            if(this.multiList.indexOf("-1") != -1){

                this.multiList.splice(this.multiList.indexOf(-"1"),1);

            }
        }

    }

    public getCallUnTick(id) {
        console.log('It was unticked');

    }

    public selected(id:any,name:any) {

        if(this.multiSelect){
            this.searchString = "";
            this.selectedName = "";




            if(this.multiList.length > 100) {
                this.multiList = [];
            }
            if(this.multiList.indexOf(id) != -1){
                this.getCallUnTick(id);
                this.multiList.splice(this.multiList.indexOf(id),1);
            }
            else {
                this.getCallTick(id);
                this.multiList.push(id);
            }


            this.selectList.forEach(res=>{
                if(this.multiList.indexOf(res.id) != -1){
                    if(this.selectedName == ""){
                        this.selectedName += res.name;
                    }
                    else {
                        this.selectedName += ', '+res.name;
                    }

                }
            });



            this.reArrangeList();


            this.selectedIds.emit({id: this.multiList, name: this.selectedName});
        }

    }



    public reArrangeList(){

        //Re Arange the  List
        this.selectList.forEach((res,index)=>{

            if(this.multiList.indexOf(res.id) != -1) {

                this.selectList.splice(index,1);
                this.selectList.unshift(res);
            }


        });
    }

    ngAfterViewInit() {

    }



}
