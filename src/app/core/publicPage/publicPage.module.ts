// angular
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup } from '@angular/forms';


//Routes
import {PublicPageRoutes} from './publicPage.routes';

//Modules
import { SharedModule } from '../../shared/shared.module';
import { GeneralModule } from './general.module';

//Services
import {SignupService} from  './services/signup.service';
import {LoaderService} from  '../../shared/services/loader.service';
import {BlogService} from  '../../core/blog/services/blog.service';
import {CompanyService} from '../services/company.service';
import  {JobService} from '../services/job.service';
import  {GeneralService} from '../../shared/services/general.service';


//Components
import {HomeComponent} from './home.component';
import {SignupComponent} from './signup.component';
import {SigninComponent} from './signin.component';
import {CountryComponent} from './country.component';
import {SectorComponent} from './sector.component';
import {SiteMapComponent} from './siteMap.component';
import {CandidateElevatorComponent} from './candidateElevator.component';
import {LoginComponent} from './login.component';
import {ElementBlockModule} from '../../shared/elementBlock.module';
import {ForgetPasswordComponent} from './forgetPassword.component';
import {ChangePasswordComponent} from './changePassword.component';
import {SigninSocialComponent} from './signinSocial.component';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    GeneralModule,
    ReactiveFormsModule,
    // PublicPageRoutes,
    ElementBlockModule,
  ],
  declarations: [
    HomeComponent,
    SignupComponent,
    SigninComponent,
    CountryComponent,
    SectorComponent,
    CandidateElevatorComponent,
    SiteMapComponent,
    LoginComponent,
    SigninSocialComponent,
    ForgetPasswordComponent,
    ChangePasswordComponent,
  ],
  providers: [
    SignupService,
    LoaderService,
    BlogService,
    FormBuilder,
    CompanyService,
    JobService,
    GeneralService
  ]
})
export class PublicPageModule {

  // constructor(@Optional() @SkipSelf() parentModule: PublicPageModule) {
  //   if (parentModule) {
  //     throw new Error('PublicPageModule already loaded; Import in root module only.');
  //   }
  // }
}
