import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import {ChartGoogleComponent} from '../shared/directives/chartGoogleDonut.component';


@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule
    ],
    declarations: [
        ChartGoogleComponent
    ],
    exports: [
        ChartGoogleComponent
    ]
})



export class DonutChartModule {


}