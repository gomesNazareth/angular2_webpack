import { NgModule } from '@angular/core';
import {FileUploadModule} from 'ng2-file-upload/ng2-file-upload';
import {ChartsModule} from 'ng2-charts/ng2-charts';
import {CompanyDetailsModule} from '../../core/company/companyDetails.module'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {InviteFriendsModule} from '../../core/invite-friends/inviteFriends.module';
import { JobsDetailsComponent } from './jobDetails.component';

//services
import {LoaderService} from "../../shared/services/loader.service";
import {GeneralService} from "../../shared/services/general.service";
import {StatsService} from "../../core/services/stats.service";
import {CompanyService} from "../../core/services/company.service";
import  {JobService} from '../../core/services/job.service';


//Routes
import {JobRoutingModule} from './job.routes';

//Components
import {ListJobsComponent} from './listJobs.component';
import { AddEditJobComponent } from './addEditJob.component';
import { JobsApplicantsComponent } from './jobApplicants.component';
import { SuggestedApplicants } from './suggestedApplicants.component';
import { FilterAppliedCandidateComponent } from './filterAppliedCandidate.component';
import {ElementBlockModule} from "../../shared/elementBlock.module";
import {PaginationModule} from "../../shared/pagination.module";
import {SocialMediaModule} from "../../shared/socialMedia.module";


@NgModule({
    imports: [JobRoutingModule,
        CommonModule,
        FormsModule,
        FileUploadModule,
        ElementBlockModule,
        SocialMediaModule,
        PaginationModule,
        InviteFriendsModule,
        ReactiveFormsModule,
        SharedModule],
    providers: [LoaderService,StatsService,GeneralService,CompanyService,JobService],
    declarations: [ListJobsComponent,AddEditJobComponent,JobsDetailsComponent,JobsApplicantsComponent,FilterAppliedCandidateComponent,SuggestedApplicants],
    exports: []
})

export class JobModule {


}
