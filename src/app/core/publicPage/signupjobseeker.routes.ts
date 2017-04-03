import { RouterModule } from '@angular/router';
import {SignupJobseekerComponent} from './signupJobseeker.component';

import {CanHomeActivateGuard} from '../../canHomeActivateGuard.guard';


export const SignupjobseekerRoutes = RouterModule.forChild([
    { path: '', component: SignupJobseekerComponent, canActivate: [CanHomeActivateGuard] },
]);
