import { Route, RouterModule } from '@angular/router';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {CanJobActivateGuard} from '../../canJobActivateGuard.guard';


export const DashboardRoutes = RouterModule.forChild([
  { path: '', component: DashboardComponent , canActivate: [CanJobActivateGuard]},
  { path: ':details', component: DashboardComponent , canActivate: [CanJobActivateGuard]}
]);
