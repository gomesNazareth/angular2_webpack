import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

//pipes
import {SearchNameEmail} from '../shared/pipes/searchNameEmail';




// import m = require("angular2-moment/moment.module");
//

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
    ],
    declarations: [
        SearchNameEmail
    ],
    exports: [
        SearchNameEmail
    ]
})



export class EmailPipeModule {


}