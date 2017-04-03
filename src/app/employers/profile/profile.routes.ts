
import { CompanyComponent } from './company.component';
import {CompanyInviteFirendsComponent} from './companyInviteFriends.component';
import {CompanyUsersComponent} from './companyUsers.component';
import {CompanyUserAddEditComponent} from './companyUserAddEdit.component';
import {CompanyUserReportComponent} from './companyUserReport.component';
import { CompanyEditComponent} from './companyEdit.component';
import {CompanyFollowersComponent} from './companyFollowers.component';
import {CandidateComponent} from './candidate.component';

import { RouterModule } from '@angular/router';


//Guards
import  {CanEmpActivateGuard} from '../../canEmpActivateGuard.guard';


export const ProfileRoutingModule = RouterModule.forChild([
  {
    path: '',
    component: CompanyComponent,
    canActivate: [CanEmpActivateGuard]
  },
  {
    path: 'edit',
    component: CompanyEditComponent,
    canActivate: [CanEmpActivateGuard]
  },
  {
    path: 'invite-connections',
    component: CompanyInviteFirendsComponent,
    canActivate: [CanEmpActivateGuard]
  },
  {
    path: 'users',
    component: CompanyUsersComponent,
    canActivate: [CanEmpActivateGuard]
  },{
    path: 'user_add',
    component: CompanyUserAddEditComponent,
    canActivate: [CanEmpActivateGuard]
  },{
    path: 'user_report',
    component: CompanyUserReportComponent,
    canActivate: [CanEmpActivateGuard]
  },{
    path: 'users/:id/edit',
    component: CompanyUserAddEditComponent,
    canActivate: [CanEmpActivateGuard]
  },{
    path: 'users/:username/:id/edit',
    component: CompanyUserAddEditComponent,
    canActivate: [CanEmpActivateGuard]
  },
  {
    path: 'candidate_details',
    component: CandidateComponent,
    canActivate: [CanEmpActivateGuard]
  },
  {
    path: 'followers',
    component: CompanyFollowersComponent,
    canActivate: [CanEmpActivateGuard]
  }
]);
