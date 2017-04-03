// angular
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule} from '@angular/forms';


//services
import {FindFriendService} from './services/findfriend.service';
import {EmailService} from '../../shared/services/email.service';

//Modules
import { SharedModule } from '../../shared/shared.module';
import { EmailPipeModule } from '../../shared/emailPipe.module';
import { TruncatePipeModule } from '../../shared/truncatePipe.module';



//Directives

import {InviteFriendComponent} from './inviteFriend.component';
import {FindFriendComponent} from './find_friends.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        EmailPipeModule,
        TruncatePipeModule,
        ReactiveFormsModule,
    ],
    declarations: [
        InviteFriendComponent,
        FindFriendComponent
    ],
    providers: [
        FindFriendService,
        EmailService

    ],
    exports: [InviteFriendComponent,FindFriendComponent]
})
export class InviteFriendsModule {

    constructor(@Optional() @SkipSelf() parentModule: InviteFriendsModule) {
        if (parentModule) {
            throw new Error('InviteFriendsModule already loaded; Import in root module only.');
        }
    }
}



