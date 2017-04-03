import {RouterModule } from '@angular/router';
import {JobComponent} from '../job/job.component';
import {AllJobsComponent} from '../job/allJobs.component';
import {MyJobsComponent} from '../job/myJobs.component';
import {ApplyJobComponent} from '../job/applyJob.component';
import {SuggestedJobsComponent} from '../job/suggestedJobs.component';
import {SavedSearchComponent} from '../job/savedSearch.component';
import {SavedJobsComponent} from '../job/savedJobs.component';
import {CanJobActivateGuard} from '../../canJobActivateGuard.guard';


export const JobRoutes = RouterModule.forChild([
  { path: '', component: AllJobsComponent, canActivate: [CanJobActivateGuard] },
  { path: 'all', component: AllJobsComponent, canActivate: [CanJobActivateGuard]},
  { path: 'country/:locations/:country_name', component: AllJobsComponent, canActivate: [CanJobActivateGuard]},
  { path: 'sector/:sectors/:sector_name', component: AllJobsComponent, canActivate: [CanJobActivateGuard]},
  { path: 'my-jobs', component: MyJobsComponent, canActivate: [CanJobActivateGuard]},
  { path: 'suggested-jobs', component: SuggestedJobsComponent, canActivate: [CanJobActivateGuard]},
  { path: 'saved-searches', component: SavedSearchComponent, canActivate: [CanJobActivateGuard]},
  { path: 'saved-jobs', component: SavedJobsComponent, canActivate: [CanJobActivateGuard]},
  { path: ':mode', component: JobComponent , canActivate: [CanJobActivateGuard]},
  { path: 'apply/:id', component: ApplyJobComponent, canActivate: [CanJobActivateGuard] },
  { path: 'details/:id', component: JobComponent , canActivate: [CanJobActivateGuard]},
  { path: ':id/:jobTitle', component: JobComponent , canActivate: [CanJobActivateGuard]},
  { path: ':id/display', component: JobComponent , canActivate: [CanJobActivateGuard]}
]);
