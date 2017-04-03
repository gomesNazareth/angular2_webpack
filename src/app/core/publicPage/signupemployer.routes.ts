import { RouterModule } from '@angular/router';
import {SignupEmployerComponent} from './signupEmployer.component';

import {CanHomeActivateGuard} from '../../canHomeActivateGuard.guard';


export const SignupEmployerRoutes = RouterModule.forChild([
    { path: '', component: SignupEmployerComponent, canActivate: [CanHomeActivateGuard] },

]);

