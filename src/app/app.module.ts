import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  NgModule,
  ApplicationRef
} from '@angular/core';
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';
import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';
import {PublicPageModule} from './core/publicPage/publicPage.module';


/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';
import { XLargeDirective } from './home/x-large';
import {InvalidPageComponent} from './shared/directives/invalidPage.component';
import {UnAuthPageComponent} from './shared/directives/unAuthPage.component';
import {SwitchPageComponent} from './shared/directives/switchPage.component';
import {RedirectComponent} from './redirect.component';


import {AccountService} from  './core/account/services/account.service';
import {CookieService} from  './core/services/cookie.service';
import { ProfileService } from './core/services/profile.service';
import { EmployerService } from './core/services/employer.service';
//service
import {ErrorHandling} from './core/services/errorHandling.service';



// import '/src/assets/fonts/material/Material-Design-Iconic-Font.woff2';
// import '/src/styles/fonts/helvertica/helveticaneue_medium-webfont.woff2';
import '../styles/sass/main.scss';
import '../styles/css/bootstrap.css';
import '../styles/css/intlTelInput.css';
import '../styles/fonts/material/material-design.css';
import '../styles/fonts/helvertica/stylesheet.css';
import '../styles/fonts/bloovo-font/bloovo-fonts.css';
import '../styles/css/bootstrap-select.css';

import * as jQuery from 'jquery';
import * as bootstrap  from 'bootstrap';


// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState,
  AccountService,
  ProfileService,
  EmployerService,
  CookieService,
  ErrorHandling
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    InvalidPageComponent,
    UnAuthPageComponent,
    SwitchPageComponent,
    AboutComponent,
    RedirectComponent,
    HomeComponent,
    NoContentComponent,
    XLargeDirective
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    PublicPageModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: false, preloadingStrategy: PreloadAllModules })
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    public appState: AppState
  ) {}

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues  = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
