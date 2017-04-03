import { RouterModule } from '@angular/router';
import {CompanyComponent} from '../company/company.component';
import {CanJobActivateGuard} from '../../canJobActivateGuard.guard';


export const CompanyRoutes = RouterModule.forChild([
  { path: '', component: CompanyComponent, canActivate:[CanJobActivateGuard] },
  { path: 'top-followed-companies', component: CompanyComponent, canActivate:[CanJobActivateGuard] },
  // { path: ':mode', component: CompanyComponent, canActivate:[CanJobActivateGuard] },
  { path: 'details/:id', component: CompanyComponent, canActivate:[CanJobActivateGuard] },
  { path: ':id/:name_url', component: CompanyComponent, canActivate:[CanJobActivateGuard] }
]);
