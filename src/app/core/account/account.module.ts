// angular
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

// app
import {AccountSettingsComponent} from '../account/accountSettings.component';

//modules
import {SharedModule} from '../../shared/shared.module';

//Services
import {AccountService} from '../account/services/account.service';

//Routes
import { AccountRoutes } from '../account/account.routes';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AccountRoutes
  ],
  declarations: [
    AccountSettingsComponent
  ],
  providers: [AccountService],
  // shared:[SharedModule],
  exports: [
    AccountSettingsComponent
  ]
})
export class AccountModule {

  constructor(@Optional() @SkipSelf() parentModule: AccountModule) {
    if (parentModule) {
      throw new Error('AccountModule already loaded; Import in root module only.');
    }
  }
}
