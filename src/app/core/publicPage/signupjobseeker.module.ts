// angular
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';


//Routes
import {SignupjobseekerRoutes} from './signupjobseeker.routes';

//Modules
import { SharedModule } from '../../shared/shared.module';


//Services
import {SignupService} from  './services/signup.service';
import {LoaderService} from  '../../shared/services/loader.service';
import {CompanyService} from '../services/company.service';
import  {JobService} from '../services/job.service';
import  {GeneralService} from '../../shared/services/general.service';
import {ElementBlockModule} from '../../shared/elementBlock.module';


//Components
import {SignupJobseekerComponent} from './signupJobseeker.component';
import {SignupFormJobseekerComponent} from './signupFormJobseeker.component';

import {ImageCropperModule} from 'ng2-img-cropper/src/imageCropperModule';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        SignupjobseekerRoutes,
        ImageCropperModule,
        ElementBlockModule
    ],
    declarations: [
        SignupJobseekerComponent,
        SignupFormJobseekerComponent
    ],
    providers: [
        SignupService,
        LoaderService,
        FormBuilder,
        CompanyService,
        JobService,
        GeneralService
    ]
})
export class SignupJobseekerModule {

    constructor(@Optional() @SkipSelf() parentModule: SignupJobseekerModule) {
        if (parentModule) {
            throw new Error('SignupJobseekerModule already loaded; Import in root module only.');
        }
    }
}