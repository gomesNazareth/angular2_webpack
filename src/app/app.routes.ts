import { Routes } from '@angular/router';
import { InvalidPageComponent } from './shared/directives/invalidPage.component';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';
import {PublicPageRoutes} from './core/publicPage/publicPage.routes';


export const ROUTES: Routes = [
  { path: 'home',  component: InvalidPageComponent},
  { path: '',children:[...PublicPageRoutes] },
  { path: '404',      component: HomeComponent },
  // { path: 'home',  component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'detail', loadChildren: './+detail#DetailModule'},
  { path: 'barrel', loadChildren: './+barrel#BarrelModule'},
  { path: '**',    component: NoContentComponent },
];

