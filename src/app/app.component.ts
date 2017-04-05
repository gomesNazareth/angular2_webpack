/*
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  Inject,
  ViewEncapsulation
} from '@angular/core';


import { Router} from '@angular/router';
import { Config } from './shared/index';
import {ConfigService} from './shared/config.service'
import {AccountService} from "./core/account/services/account.service";
import {Location} from '@angular/common';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { AppState } from './app.service';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html'

})
export class AppComponent implements OnInit {
  public navbarToggle = false;
  public diffStyle = false;
  public showMenus = true;
  public isPublic:boolean;
  public isAuthorized$:BehaviorSubject<any> = new BehaviorSubject(null);
  public isSwitchPage$:BehaviorSubject<any> = new BehaviorSubject(this.accountService.getSwitchPage());
  public sub;


  constructor(
    public accountService:AccountService
  ) {}

  // constructor(public accountService:AccountService,
  //             public appState: AppState,
  //             public _location:Location,
  //             public _router:Router) {}


  ngOnInit() : any {
    // this.sub =this._router.events.subscribe(params => {
    //   this.isAuthorized$.next(this.accountService.getAuth());
    //   this.isPublic = (this._location.path().indexOf('/home') != -1);
    // });
  }

  // ngOnChanges(){
  //   this.isSwitchPage$.next(this.accountService.getSwitchPage());
  //
  // }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }



  onMenuToggle($event:any) {
    this.navbarToggle = $event.navbarToggle;
  }


}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
