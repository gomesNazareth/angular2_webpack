import { NgModule } from '@angular/core';
import {FileUploadModule} from 'ng2-file-upload/ng2-file-upload';
import {ChartsModule} from 'ng2-charts/ng2-charts';
import {CompanyDetailsModule} from '../../core/company/companyDetails.module'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {ElementBlockModule} from '../../shared/elementBlock.module';
import {InviteFriendsModule} from '../../core/invite-friends/inviteFriends.module';
import {CandidateDetailsModule} from '../candidate/candidateDetails.module';


//services
import {LoaderService} from "../../shared/services/loader.service";
import {GeneralService} from "../../shared/services/general.service";
import {StatsService} from "../../core/services/stats.service";
import  {JobService} from '../../core/services/job.service';


//Routes
import {ProfileRoutingModule} from './profile.routes';
import {PaginationModule} from "../../shared/pagination.module";


//Components
import {CompanyComponent} from './company.component';
import {CandidateComponent} from './candidate.component';
import {CompanyInviteFirendsComponent } from './companyInviteFriends.component';
import {CompanyEditComponent} from './companyEdit.component';
import {CompanyEditMobileComponent} from './companyEditMobile.component';
import {CompanyGeneralMobileComponent} from './companyGeneralMobile.component';
import {CompanyEditAboutComponent} from './companyEditAbout.component';
import {CompanyTeamMobileComponent} from './companyTeamMobile.component';
import {CompanyTeamDesktopComponent} from './companyTeamDesktop.component';
import {CompanyCultureMobileComponent} from './companyCultureMobile.component';
import {CompanyCultureDesktopComponent} from './companyCultureDesktop.component';
import {TopMenuComponent} from './topMenu.component';
import {CompanyFollowersComponent} from './companyFollowers.component';
import {CompanyUsersComponent} from './companyUsers.component';
import {CompanyUserAddEditComponent} from './companyUserAddEdit.component';
import {CompanyUserReportComponent} from './companyUserReport.component';
import {FilterProfilesComponent} from './filterProfiles.component';
import {UploadModule} from "../../shared/upload.module";
import {SafePipeModule} from "../../shared/safePipe.module";





@NgModule({
    imports: [
        CompanyDetailsModule,ProfileRoutingModule,
        CommonModule,
        CandidateDetailsModule,
        UploadModule,
        PaginationModule,
        FormsModule,
        SafePipeModule,
        FileUploadModule,
        InviteFriendsModule,
        ReactiveFormsModule,
        ElementBlockModule,
        SharedModule],
    providers: [LoaderService,StatsService,GeneralService,JobService],
    declarations: [
        CompanyComponent,
        CandidateComponent,
        CompanyUserAddEditComponent,
        CompanyUserReportComponent,
        FilterProfilesComponent,
        CompanyFollowersComponent,
        CompanyUsersComponent,
        CompanyInviteFirendsComponent,
        CompanyCultureDesktopComponent,
        CompanyTeamDesktopComponent,
        CompanyCultureMobileComponent,
        CompanyTeamMobileComponent,
        TopMenuComponent,
        CompanyEditComponent,
        CompanyEditMobileComponent,
        CompanyGeneralMobileComponent,
        CompanyEditAboutComponent
    ],
    exports: []
})

export class ProfileModule {


}
