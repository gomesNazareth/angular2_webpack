import {OnInit, Component} from '@angular/core';
import {FormBuilder, FormGroup,Validators} from '@angular/forms';
import {AccountService} from '../account/services/account.service';
import {Router, ActivatedRoute} from '@angular/router';
//directives
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {ConfigService} from "../../shared/config.service";

@Component({

    selector: "login",
    templateUrl: "login.component.html"
})

export class LoginComponent implements OnInit  {

    public form1:FormGroup;
    public queryParamsObs;
    public showSuccessActivated:boolean = false;
    public showErrorActivated:boolean = false;
    public errorFlag:boolean = false;
    public errorMode = 1;
    public pristineFlag$:BehaviorSubject<any> = new BehaviorSubject(true);

    constructor(public _accountservice:AccountService,public _activeRoute:ActivatedRoute,public fb:FormBuilder,public _router:Router) {
        let elements1 = {
            username: ['', Validators.required],
            rememberme: [false],
            user_password: ['', Validators.required]
        };
        this.form1 = fb.group(elements1);
    }

    ngOnDestroy() {
            this.queryParamsObs.unsubscribe();
            }


    ngOnInit():void {

          this.queryParamsObs = this._activeRoute.queryParams.subscribe(qparams => {

              if(qparams["confirmation"] == "true"){

                  this.showSuccessActivated = true;
                  Observable.timer(4000).subscribe(val=>{
                      this.showSuccessActivated = false;
                  })
              }

              if(qparams["confirmation"] == "false"){

                  this.showErrorActivated = true;
                  Observable.timer(4000).subscribe(val=>{
                      this.showErrorActivated = false;
                  })
              }

                  });
        if(this._accountservice.getAuth()){
            if(this._accountservice. getCheckEmployer()){
                this._router.navigateByUrl('/employer/profile');
            }
            else {
                this._router.navigateByUrl('/'+ConfigService.jobseekerPath+'/profile');
            }
        }
    }

    loginUser(){
        this.pristineFlag$.next(false);
        if(this.form1.valid) {

          this._accountservice.getLoginUser(this.form1.value).subscribe(res => {
              this.errorFlag = false;
          },error=>{
              this.errorFlag = true;
              let errorJson = JSON.parse(error._body);
              if(errorJson["msg"] == "deactivated"){
                  this.errorMode = 2;
              }
              else {
                  this.errorMode = 1;
              }


          })
        }
    }
}
