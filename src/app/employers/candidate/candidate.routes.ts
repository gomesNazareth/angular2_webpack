import { SearchCandidatesComponent } from './searchCandidates.component';
import { ListCandidatesComponent } from './listCandidates.component';
import { CandidateProfileComponent } from './candidateProfile.component';
import { CandidateProfileComComponent } from './candidateProfileCom.component';

import { RouterModule } from '@angular/router';

//Guards
import  {CanEmpActivateGuard} from '../../canEmpActivateGuard.guard';


export const CandidateRoutingModule = RouterModule.forChild([
  {
    path: '',
    component: SearchCandidatesComponent
    ,canActivate: [CanEmpActivateGuard]
  }, {
    path: 'list',
    component: ListCandidatesComponent
    ,canActivate: [CanEmpActivateGuard]
  },
  {
    path: ':id/profile',
    component: CandidateProfileComponent
    ,canActivate: [CanEmpActivateGuard]
  }
  ,{
    path: ':id/:candidate_name/profile',
    component: CandidateProfileComponent
    ,canActivate: [CanEmpActivateGuard]
  },
  {
    path: ':id/communication',
    component: CandidateProfileComComponent
    ,canActivate: [CanEmpActivateGuard]
  } ,{
    path: ':id/:candidate_name/communication',
    component: CandidateProfileComComponent
    ,canActivate: [CanEmpActivateGuard]
  }

]);
