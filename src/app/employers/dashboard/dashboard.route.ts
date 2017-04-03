import { PollComponent } from './poll.component';
import { StatsComponent } from './stats.component';
import { AllPollComponent} from './allPolls.component';
import { MostViewedJobsComponent} from './mostViewedJobs.component';
import { MostViewedProflesComponent} from './mostViewedProfiles.component';
import {CandidateComponent} from './candidate.component';


import { RouterModule } from '@angular/router';

//Route Guard
import  {CanEmpActivateGuard} from '../../canEmpActivateGuard.guard';


export const DashboardRoutingModule = RouterModule.forChild([
    {
        path: '',
        component: StatsComponent,
        canActivate: [CanEmpActivateGuard]
    },
    {
        path: 'polls',
        component: PollComponent,
        canActivate: [CanEmpActivateGuard]
    } ,
    {
        path: 'stats',
        component: StatsComponent,
        canActivate: [CanEmpActivateGuard]
    } ,
    {
        path: 'poll-list',
        component: AllPollComponent,
        canActivate: [CanEmpActivateGuard]
    },
    {
        path: 'most-viewed-jobs',
        component: MostViewedJobsComponent,
        canActivate: [CanEmpActivateGuard]
    },
    {
        path: 'candidate_details',
        component: CandidateComponent,
        canActivate: [CanEmpActivateGuard]
    },
    {
        path: 'most-viewed-profiles',
        component: MostViewedProflesComponent,
        canActivate: [CanEmpActivateGuard]
    },
    {
        path: ':statsmode',
        component: StatsComponent,
        canActivate: [CanEmpActivateGuard]
    }
]);
