// angular
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup } from '@angular/forms';


//Routes
import {ProfileRoutes} from './profile.routes';

//Modules
import {VideoModule} from '../../shared/video.module';
import {LanguageModule} from '../../shared/language.module';
import {UploadModule} from '../../shared/upload.module';
import { SharedModule } from '../../shared/shared.module';
import { ElementBlockModule } from '../../shared/elementBlock.module';
import { DatePipeModule } from '../../shared/datePipe.module';
import {InviteFriendsModule} from '../../core/invite-friends/inviteFriends.module';


//Services
import {AccountService} from  '../../core/account/services/account.service';
import {LoaderService} from '../../shared/services/loader.service';
import {ResumeCoverService} from './services/resume_cover.services';
import {ProfileService} from '../../core/services/profile.service';
import {GeneralService} from '../../shared/services/general.service';
import {ProfileControlService} from '../../jobseekers/profile/services/profile_control.service';
import {SummaryService} from './services/summary.service';
import {WorkService} from './services/work.service';
import {EduService} from './services/edu.service';
import {CertService} from './services/cert.service';
import {SkillService} from './services/skill.service';
import {TagService} from '../../shared/services/tag.service';

import {EmailService} from '../../shared/services/email.service';

//Components
import  {ProfileComponent} from './profile.component';
import  {ShortSkillsComponent} from './shortSkills.component';
import  {CompleteProfileComponent} from './completeProfile.component';
import {ContactComponent} from './contact.component';
import {AddressComponent} from './address.component';
import {AddressContactResume} from './address_contact_resume.component';
import {GeneralInfoComponent} from './generalInfo.component';
import {SummaryComponent} from './summary.component';
import {SkillsComponent} from './skills.component';
import  {TagsComponent} from './tags.component';



import {WorkComponent} from './work.component';

import {EducationComponent} from './education.component';
import {CertificateComponent} from './certificate.component';
import {WorkEduCertComponent} from './work_edu_cert.component';
import {SelEducationComponent} from './selEducation.component';
import {SelCertificateComponent} from './selCertificate.component';


import {CompanyComponent} from './company.component';
import {SafePipeModule} from "../../shared/safePipe.module";

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UploadModule,
    SharedModule,
    LanguageModule,
    VideoModule,
    ReactiveFormsModule,
    ElementBlockModule,
    DatePipeModule,
    SafePipeModule,
    InviteFriendsModule,
    ProfileRoutes
  ],
  declarations: [
    ProfileComponent,
    CompleteProfileComponent,
    ShortSkillsComponent,
    SelEducationComponent,
    SelCertificateComponent,
    ContactComponent,
    AddressComponent,
    SummaryComponent,
    SkillsComponent,
    AddressContactResume,
    GeneralInfoComponent,
    EducationComponent,
    CertificateComponent,
    WorkComponent,
    WorkEduCertComponent,
    CompanyComponent,
    TagsComponent
  ],
  providers: [
    AccountService,
    ProfileService,
    SkillService,
    EmailService,
    GeneralService,
    LoaderService,
    ResumeCoverService,
    ProfileControlService,
    AccountService,
    SummaryService,
    TagService,
    WorkService,
    GeneralService,
    EduService,
    CertService,
    FormBuilder
  ]
})
export class ProfileModule {

  constructor(@Optional() @SkipSelf() parentModule: ProfileModule) {
    if (parentModule) {
      throw new Error('ProfileModule already loaded; Import in root module only.');
    }
  }
}
