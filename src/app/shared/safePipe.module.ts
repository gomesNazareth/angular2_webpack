import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

//pipes
import {SafePipe} from '../shared/pipes/safeUrl';




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
        SafePipe
    ],
    exports: [
        SafePipe
    ]
})



export class SafePipeModule {


}