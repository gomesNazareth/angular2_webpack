import { Route, RouterModule } from '@angular/router';
import {ProfileComponent} from './profile.component';
import {CompleteProfileComponent} from './completeProfile.component';
import {CanJobActivateGuard} from '../../canJobActivateGuard.guard';

export const ProfileRoutes = RouterModule.forChild([
  { path: '', component: ProfileComponent, canActivate: [CanJobActivateGuard] },
  { path: ':invite-connections', component: ProfileComponent, canActivate: [CanJobActivateGuard] }
]);

