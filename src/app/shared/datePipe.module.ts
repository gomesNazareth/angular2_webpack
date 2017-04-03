import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

//pipes
import {CalcAgePipe} from '../shared/pipes/date.pipe';
import {DurationPipe} from '../shared/pipes/date.pipe';
import {TimePipe} from '../shared/pipes/date.pipe';
import {DayPipe} from '../shared/pipes/date.pipe';




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
        CalcAgePipe,
        DurationPipe,
        TimePipe,
        DayPipe
    ],
    exports: [
        CalcAgePipe,
        DurationPipe,
        TimePipe,
        DayPipe
    ]
})



export class DatePipeModule {


}
