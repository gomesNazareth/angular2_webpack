// angular
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import {StatsService} from "../../core/services/stats.service";
import {DashboardComponent } from './dashboard.component';
import {StatComponent } from './stats/stat.component';
import {WhoViewMyProfileComponent} from './who_view_my_profile/who_view_my_profile.component'


//models
import {NumericStatComponent} from './stats/numeric_stat.component';
import {WireStatComponent} from './stats/wire_stat.component';
import {BarStatComponent} from './stats/bar_stat.component';
import {JobsCountryComponent} from './stats/jobs_country.component';
import {JobsSectorComponent} from './stats/jobs_sector.component';

//Routes
import { DashboardRoutes } from './dashboard.routes';
import { SharedModule } from '../../shared/shared.module';


//Modules
import {ChartsModule} from 'ng2-charts/ng2-charts';
import {PollModule} from '../../core/poll/poll.module';


//Services
import {AccountService} from  '../../core/account/services/account.service';
import {CompanyService} from './who_view_my_profile/services/company.service';
// import {AdService} from './who_view_my_profile/services/ads.service';

import {ProfileStatService} from "./stats/services/profile_stat.service";
import {NewFollowStatService} from "./stats/services/newfollow_stat.service";

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    SharedModule,
    PollModule,
    ReactiveFormsModule, 
    DashboardRoutes
  ],
  declarations: [
    DashboardComponent,
    StatComponent,
    BarStatComponent,
    WireStatComponent,
    NumericStatComponent,
    JobsCountryComponent,
    JobsSectorComponent,
    WhoViewMyProfileComponent
  ],
  providers: [
    AccountService,
    CompanyService,
    StatsService,
    ProfileStatService,
    NewFollowStatService
  ],

  exports: [
    DashboardComponent,
    StatComponent,
    BarStatComponent,
    WireStatComponent,
    NumericStatComponent,
    JobsCountryComponent,
    JobsSectorComponent,
    WhoViewMyProfileComponent

  ]
})
export class DashboardModule {

  constructor(@Optional() @SkipSelf() parentModule: DashboardModule) {
    if (parentModule) {
      throw new Error('DashboardModule already loaded; Import in root module only.');
    }
  }
}
