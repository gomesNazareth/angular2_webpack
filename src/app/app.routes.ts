import { Routes } from '@angular/router';
import { InvalidPageComponent } from './shared/directives/invalidPage.component';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';
import {PublicPageRoutes} from './core/publicPage/publicPage.routes';
import {UnAuthPageComponent} from './shared/directives/unAuthPage.component';
import {SwitchPageComponent} from './shared/directives/switchPage.component';
import {RedirectComponent} from './redirect.component';

import { LeftsideBarComponent, FooterBarComponent, HeaderBarComponent } from './layout/index';
import {CanLoadGuard} from './canLoadGuard.guard';

import {ConfigService} from "./shared/config.service";


export const ROUTES: Routes = [
  { path: 'home',  component: InvalidPageComponent},
  { path: '',children:[...PublicPageRoutes] },
  { path: ConfigService.jobseekerPath, loadChildren: './jobseekers#JobseekerModule',canLoad: [CanLoadGuard] },
  { path: '404',      component: UnAuthPageComponent },
  { path: 'unauthorized',  component: UnAuthPageComponent},
  { path: '', component: SwitchPageComponent, outlet: 'switchpage' },
  { path: '', component: HeaderBarComponent, outlet: 'header' },
  { path: '', component: LeftsideBarComponent, outlet: 'leftbar' },
  { path: '', component: FooterBarComponent, outlet: 'footer' },
  { path: 'core/invite-connections', component:RedirectComponent},
  { path: 'profile/invite-connections', component:RedirectComponent},
  // { path: 'home',  component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'detail', loadChildren: './+detail#DetailModule'},
  { path: 'barrel', loadChildren: './+barrel#BarrelModule'},
  { path: '**',    component: NoContentComponent },
];

