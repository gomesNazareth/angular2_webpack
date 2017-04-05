import { RouterModule } from '@angular/router';
import {SignupComponent} from './signup.component';
import {SigninSocialComponent} from './signinSocial.component';
import {SignupJobseekerComponent} from './signupJobseeker.component';
import {SignupEmployerComponent} from './signupEmployer.component';
import {CountryComponent} from './country.component';
import {SectorComponent} from './sector.component';
import {AboutComponent} from './about.component';
import {ContactusComponent} from './contactus.component';
import {CandidateElevatorComponent} from './candidateElevator.component';
import {TermsComponent} from './terms.component';
import {PolicyComponent} from './policy.component';
import {SiteMapComponent} from './siteMap.component';
import {LoginComponent} from './login.component';
import {ForgetPasswordComponent} from './forgetPassword.component';
import {ChangePasswordComponent} from './changePassword.component';
import {HomeComponent} from './home.component';

import {CanHomeActivateGuard} from '../../canHomeActivateGuard.guard';

// export const PublicPageRoutes = RouterModule.forChild([
export const PublicPageRoutes: Array<any> = [
  { path: '', component: HomeComponent},
  // { path: '', component: HomeComponent, canActivate: [CanHomeActivateGuard] },
  // { path: 'signup', component: SignupComponent, canActivate: [CanHomeActivateGuard] },
  // { path: 'signin', component: LoginComponent, canActivate: [CanHomeActivateGuard] },
  // { path: 'signin_social', component: SigninSocialComponent, canActivate: [CanHomeActivateGuard] },
  // { path: 'signup_jobseeker', loadChildren: '#SignupJobseekerModule', canActivate: [CanHomeActivateGuard] },
  // { path: 'signup_employer',loadChildren: './#SignupEmployerModule', canActivate: [CanHomeActivateGuard] },
  // { path: 'country', component: CountryComponent, canActivate: [CanHomeActivateGuard] },
  // { path: 'sector', component: SectorComponent, canActivate: [CanHomeActivateGuard] },
  // { path: 'about', component: AboutComponent, canActivate: [CanHomeActivateGuard] },
  // { path: 'contactus', component: ContactusComponent, canActivate: [CanHomeActivateGuard] },
  // { path: 'candidate-elevator', component: CandidateElevatorComponent, canActivate: [CanHomeActivateGuard] },
  // { path: 'terms', component: TermsComponent, canActivate: [CanHomeActivateGuard] },
  // { path: 'policy', component: PolicyComponent, canActivate: [CanHomeActivateGuard] },
  // { path: 'site-map', component: SiteMapComponent, canActivate: [CanHomeActivateGuard] },
  // { path: 'forget-password', component: ForgetPasswordComponent, canActivate: [CanHomeActivateGuard] },
  // { path: 'change-password', component: ChangePasswordComponent, canActivate: [CanHomeActivateGuard] },
  // { path: 'login', component: LoginComponent, canActivate: [CanHomeActivateGuard] },
  // { path: 'companies', loadChildren: './app/jobseekers/company/company.module#CompanyModule', canActivate: [CanHomeActivateGuard] },
  // { path: 'jobs', loadChildren: './app/jobseekers/job/job.module#JobModule', canActivate: [CanHomeActivateGuard] },
  // { path: 'blog', loadChildren: './app/jobseekers/blog/listBlog.module#ListBlogModule', canActivate: [CanHomeActivateGuard] }
];
// ]);

