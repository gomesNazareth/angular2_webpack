import { ListJobsComponent } from './listJobs.component';
import { AddEditJobComponent } from './addEditJob.component';
import { JobsDetailsComponent } from './jobDetails.component';
import {JobsApplicantsComponent} from './jobApplicants.component';
import {SuggestedApplicants} from './suggestedApplicants.component';

import { RouterModule } from '@angular/router';

//Guards
import  {CanEmpActivateGuard} from '../../canEmpActivateGuard.guard';



export const JobRoutingModule = RouterModule.forChild([
  {
    path: '',
    component: ListJobsComponent,
    canActivate: [CanEmpActivateGuard]
  },{
    path: ':id/edit',
    component: AddEditJobComponent,
    canActivate: [CanEmpActivateGuard]
  },{
    path: ':id/display',
    component: JobsDetailsComponent,
    canActivate: [CanEmpActivateGuard]
  },{
    path: 'details/:id',
    component: JobsDetailsComponent,
    canActivate: [CanEmpActivateGuard]
  },{
    path: 'add',
    component: AddEditJobComponent,
    canActivate: [CanEmpActivateGuard]
  }
  ,{
    path: ':id/:jobTitle/applicants',
    component: JobsApplicantsComponent,
    canActivate: [CanEmpActivateGuard]
  }
  ,{
    path: ':id/:jobTitle/suggest-candidates',
    component: SuggestedApplicants,
    canActivate: [CanEmpActivateGuard]
  }
  ,{
    path: ':id/:jobTitle',
    component: JobsDetailsComponent,
    canActivate: [CanEmpActivateGuard]
  }

]);
