// angular
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule} from '@angular/forms';

//services
import {StatsService} from '../../services/stats.service';

//Modules
import { SharedModule } from '../../../shared/shared.module';



//Directives

import {JobsCountryComponent} from '../stats/jobs_country.component';
import {JobsSectorComponent}  from '../stats/jobs_sector.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
    ],
    declarations: [
        JobsCountryComponent,
        JobsSectorComponent
    ],
    providers: [
        StatsService
    ],
    exports: [JobsCountryComponent,JobsSectorComponent]
})
export class DashboardStatsModule {

    constructor(@Optional() @SkipSelf() parentModule: DashboardStatsModule) {
        if (parentModule) {
            throw new Error('InviteFriendsModule already loaded; Import in root module only.');
        }
    }
}



