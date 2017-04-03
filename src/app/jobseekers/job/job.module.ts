// angular
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {ResumeCoverService} from  '../profile/services/resume_cover.services';

//Routes
import {JobRoutes} from './job.routes';

//Modules
import { SharedModule } from '../../shared/shared.module';
import {ElementBlockModule} from '../../shared/elementBlock.module';
import {SearchTagModule} from '../../shared/searchTag.module';
import {PaginationModule} from '../../shared/pagination.module';
import {DatePipeModule} from '../../shared/datePipe.module';
import {SocialMediaModule} from '../../shared/socialMedia.module';
import {DonutChartModule} from '../../shared/donutChart.module';

//Services
import {AccountService} from  '../../core/account/services/account.service';
import {LoaderService} from '../../shared/services/loader.service';
import  {GeneralService} from '../../shared/services/general.service';
import  {JobService} from '../job/services/job.service';
import {Location} from '@angular/common';
import {CompanyService} from '../dashboard/who_view_my_profile/services/company.service';
import {ConfigService} from '../../shared/config.service';


//Components
import {Filter1Component} from './filter1.component';
import {SavedJobsComponent} from './savedJobs.component';
import {SavedSearchComponent} from './savedSearch.component';
import {SuggestedJobsComponent} from './suggestedJobs.component';
import {SavedSearchForm} from './savedSearchForm.component';
import {MyJobsComponent} from './myJobs.component';
import {AllJobsComponent} from './allJobs.component';
import {JobDetailComponent} from './jobDetail.component';
import {ApplyJobComponent} from './applyJob.component';
import {JobComponent} from './job.component';
import {jobMenuComponent} from './jobMenu.componet';



/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ElementBlockModule,
    SearchTagModule,
    PaginationModule,
    DatePipeModule,
    SocialMediaModule,
    DonutChartModule,
    JobRoutes
  ],
  declarations: [
    Filter1Component,
    jobMenuComponent,
    AllJobsComponent,
    SavedJobsComponent,
    ApplyJobComponent,
    SavedSearchComponent,
    SuggestedJobsComponent,
    MyJobsComponent,
    JobDetailComponent,
    JobComponent,
    SavedSearchForm
  ],
  providers: [
    AccountService,
    ResumeCoverService,
    Location,
    FormBuilder,
    CompanyService,
    ConfigService,
    LoaderService,
    GeneralService,
    JobService,
  ],

  exports: [

  ]
})
export class JobModule {

  constructor(@Optional() @SkipSelf() parentModule: JobModule) {
    if (parentModule) {
      throw new Error('JobModule already loaded; Import in root module only.');
    }
  }
}
