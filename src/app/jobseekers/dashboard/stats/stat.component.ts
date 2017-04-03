import {Component, Input, OnInit} from '@angular/core'

// import {NumericStatComponent} from './numeric_stat.component';
// import {WireStatComponent} from './wire_stat.component';
import {BarStatComponent} from './bar_stat.component';
// import {JobsCountryComponent} from './jobs_country.component';
// import {JobsSectorComponent} from './jobs_sector.component';
import {Params} from '@angular/router';
// import {BaseComponent} from '../../../frameworks/core/index';
import { Router, ActivatedRoute }       from '@angular/router';



@Component({
  selector: "stat-component",
  template: `
<div class="tab-content">
<div role="tabpanel" class="tab-pane" [class.active]="isStatsActive" id="statistics">
<div class="commen-container">
<jobs-country *ngIf="jobFlag == 'jobs-by-country'"></jobs-country>
<jobs-sector *ngIf="jobFlag == 'jobs_by_sector'"></jobs-sector>
 
 <span *ngIf="jobFlag != 'jobs-by-country' && jobFlag != 'jobs-by-sector' && isStatsActive == true">
 <!--<span> -->
<numeric-stat ></numeric-stat>
<wire-stat></wire-stat>
<bar-stat></bar-stat>
</span>
 
</div>
</div>
</div>`,


})


export class StatComponent implements OnInit {

  @Input() isStatsActive = false;


  public jobFlag = "";

  ngOnInit() {



    this.route.params.subscribe(params => {
      this.jobFlag = params['details'];

    });

    /**
     * To Do : need to find a way to get route params in RC3
     */

    // this.jobFlag = this._routeParams.get("details");
  }

  constructor(public route: ActivatedRoute,
              public router: Router) {

  }
}
