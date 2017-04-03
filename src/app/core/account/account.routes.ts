import { Route, RouterModule } from '@angular/router';
import {AccountSettingsComponent} from '../account/accountSettings.component';

// export const  AccountRoutes: Route[] = [
//   { path: 'account', component: AccountSettingsComponent }
// ];


export const AccountRoutes = RouterModule.forChild([
  {
    path: '',
    component: AccountSettingsComponent
  }
]);