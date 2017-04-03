import {Component, OnInit, EventEmitter, Output, OnDestroy, Input,ElementRef,Inject} from '@angular/core';
import {AccountService} from "../../core/account/services/account.service";



declare var google:any;
@Component({
    
    selector: "google-donut-chart",
    template: `<div></div>`,
    providers: []
})


export class ChartGoogleComponent implements OnInit,OnDestroy {


    @Input() weight =100;
    @Input() height =100;
    @Input() options;
    @Input() data;
    @Input() mode:string ="desktop";

    elementRef:ElementRef;


    ngOnInit() {


        if(!AccountService.googleLoaded) {
            AccountService.googleLoaded = true;
            google.charts.load("current", {packages: ["corechart"]});
        }


        google.charts.setOnLoadCallback(x=>{ this.drawChart()});

    }

    ngOnDestroy() {

    }


    constructor(@Inject(ElementRef) elementRef:ElementRef,public accountService:AccountService) {
        this.elementRef = elementRef;
    }

    drawChart() {
        var data2 = google.visualization.arrayToDataTable(this.data);

        let options = {};

        if(this.mode == "desktop")
        {
             options ={ pieHole: 0.5,pieSliceText: 'percentage'
                ,chartArea:{left:0,top:10,width:"100%",height:"100%"}
                ,height: 200,
                 legend:{alignment:"center"}
                ,width: "100%"
                , colors: ['#142130','#26384c','#374b61','#4b6076','#f1f1f1'] };
        }
        else
        {
             options = { pieHole: 0.5,pieSliceText: 'percentage'
                ,chartArea:{left:0,top:50,width:"100%",height:"100%"}
                ,height: 100
                ,legend:{alignment:"center"}
                ,width: 320
                , colors: ['#142130','#26384c','#374b61','#4b6076','#f1f1f1'] };
        }

      
        
       
        
        options["colors"] =  this.options["colors"];

        var chart = new google.visualization.PieChart(this.elementRef.nativeElement);

        chart.draw(data2, options);
    }

}
