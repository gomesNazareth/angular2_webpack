// angular
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup } from '@angular/forms';


//Routes
import {SignupEmployerRoutes} from './signupemployer.routes';

//Modules
import { SharedModule } from '../../shared/shared.module';
import { GeneralModule } from './general.module';
import {ElementBlockModule} from '../../shared/elementBlock.module';


//Services
import {SignupService} from  './services/signup.service';
import {LoaderService} from  '../../shared/services/loader.service';
import {CompanyService} from '../services/company.service';
import  {JobService} from '../services/job.service';
import  {GeneralService} from '../../shared/services/general.service';


//Components
import {SignupEmployerComponent} from './signupEmployer.component';

import {ImageCropperModule} from 'ng2-img-cropper/src/imageCropperModule';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        SignupEmployerRoutes,
        ElementBlockModule,
        ImageCropperModule,
    ],
    declarations: [
        SignupEmployerComponent

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
export class SignupEmployerModule {

    constructor(@Optional() @SkipSelf() parentModule: SignupEmployerModule) {
        if (parentModule) {
            throw new Error('SignupEmployerModule already loaded; Import in root module only.');
        }
    }
}