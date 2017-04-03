import {Component, OnInit, EventEmitter, Output,Input} from '@angular/core';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

//directives
import {Router,ActivatedRoute} from '@angular/router';

//Services

import {CompanyService} from '../../core/services/company.service';

@Component({

    selector: "signin",
    templateUrl: "signin.component.html"
})


export class SigninComponent implements OnInit {
    ngOnInit() {

    }
}
