import {Component,EventEmitter,Input,Output,OnInit} from '@angular/core';


import {LoaderService} from '../../shared/services/loader.service';
import {Observable} from 'rxjs/Observable'


@Component({
    selector: 'auto-comp1',
    template: `
 <!-- Auto complete Spinner -->
    <div *ngIf="showSpinner" class="autocomplete_spinner">
      <span><img src="images/balls.svg"></span>
    </div>
     <ng2-select
              [items]="items"
              [active]="initData"
              (data)="refreshValue($event)"
              (selected)="selected($event)"
              (removed)="removed($event)"
              (typed)="typed($event)"
              placeholder="Select a City">
     
    </ng2-select>
`,
    providers: [LoaderService]
})
export class AutoComplete1Component  implements OnInit{


    ngOnInit(): void {


        this.getNewCityList();
        // if(this.current_city) {
        //
        //     this.value = this.current_city.name;
        //     this.getNewCityList(this.value);
        // }
    }



    @Input() countryId:number = 2;
    @Input() items:Array<any> = [];
    @Input() current_city:any;
    @Output() changeCityId = new EventEmitter();
    @Input() initData:Array<any>  = [];


    public value:any = {};
    public _disabledV:string = '0';
    public disabled:boolean = false;
    public showSpinner = false;

    public get disabledV():string {
        return this._disabledV;
    }

    public set disabledV(value:string) {
        this._disabledV = value;
        this.disabled = this._disabledV === '1';
    }

    public selected(value:any):void {
        this.changeCityId.emit({id:value.id,name:value.text});

    }

    public removed(value:any):void {

    }

    public typed(value:any):void {
        // this.getNewCityList(value);
    }

    public refreshValue(value:any):void {
        if(value[0]) {
            this.value = value[0];
        }else{
            this.value = value;
        }
    }


    constructor(public _loaderService:LoaderService){

        // this.loader();
    }


    public loader() {
        this._loaderService.getAllCities(this.countryId).subscribe(city => {
            this.items = [];
            city.forEach(res => {
                this.items.push({id: res.id, text: res.name});
            });
        });
    }

    public getNewCityList() {

        this.showSpinner = true;
        Observable.of(1).delay(1)
            .subscribe(x => {
                this._loaderService.getAllCities(this.countryId).subscribe(city=> {

                    this.items = [];
                    this.showSpinner = false;
                    city.forEach(res => {
                        this.items.push({id:res.id, text:res.name});
                    });
                });
            });


    }

}
