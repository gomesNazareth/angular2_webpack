// angular
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule} from '@angular/forms';


//services
import {PollService} from '../poll/services/poll.service';
import {AccountService} from  '../../core/account/services/account.service';

//Modules
import { SharedModule } from '../../shared/shared.module';



//Directives
import {PollComponent} from '../poll/poll.component';


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
        PollComponent
    ],
    providers: [
        PollService,
        AccountService,
    ],
    exports: [PollComponent]
})
export class PollModule {

    constructor(@Optional() @SkipSelf() parentModule: PollModule) {
        if (parentModule) {
            throw new Error('PollModule already loaded; Import in root module only.');
        }
    }
}



