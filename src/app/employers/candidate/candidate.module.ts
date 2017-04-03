import { NgModule } from '@angular/core';
import {FileUploadModule} from 'ng2-file-upload/ng2-file-upload';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

//Modules
import {SharedModule} from '../../shared/shared.module';
import {PollModule} from '../../core/poll/poll.module';
import {DashboardStatsModule} from '../../core/dashboard/stats/dashboardStats.module';
import {CandidateDetailsModule} from './candidateDetails.module';
import {ElementBlockModule} from "../../shared/elementBlock.module";
import {SearchTagModule} from "../../shared/searchTag.module";
import {PaginationModule} from "../../shared/pagination.module";

//services
import {LoaderService} from "../../shared/services/loader.service";
import { AccountService } from '../../core/account/services/account.service';
import {CompanyService} from "../../core/services/company.service";
import {GeneralService} from "../../shared/services/general.service";


//Routes
import {CandidateRoutingModule} from './candidate.routes';


//Components
import {SearchCandidatesComponent} from './searchCandidates.component';
import {FilterCandidateComponent} from './filterCandidate.component';
import {ListCandidatesComponent} from './listCandidates.component';
import {CandidateProfileComponent} from './candidateProfile.component';
import {OfferLetterComponent} from './offerletter.component';
import { CandidateProfileComComponent } from './candidateProfileCom.component';

@NgModule({
    imports: [
        CandidateRoutingModule,
        CommonModule,
        ElementBlockModule,
        SearchTagModule,
        PaginationModule,
        CandidateDetailsModule,
        FormsModule,
        FileUploadModule,
        ReactiveFormsModule,
        PollModule,
        DashboardStatsModule,
        SharedModule],
    providers: [LoaderService,AccountService,CompanyService,GeneralService],
    declarations: [
        SearchCandidatesComponent,
        OfferLetterComponent,
        ListCandidatesComponent,
        FilterCandidateComponent,
        CandidateProfileComponent,
        CandidateProfileComComponent],
    exports: [SearchCandidatesComponent,ListCandidatesComponent,OfferLetterComponent,FilterCandidateComponent,CandidateProfileComponent]
})

export class CandidateModule {


}