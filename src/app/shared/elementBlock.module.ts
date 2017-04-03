import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import {SelectBoxComponent} from '../shared/directives/selectBox.component';
import {AutoComplete1Component} from '../shared/directives/autoComplete1.component';
import {AutoCompleteCityComponent} from '../shared/directives/autoCompleteCity.component';
import {AutoCompleteComponent} from '../shared/directives/autoComplete.component';
import {AutoCompleteCustom} from '../shared/directives/autoCompleteCustom.component';
import {datePickerComponent} from '../shared/directives/datePicker.component';
import {timePickerComponent} from '../shared/directives/timePicker.component';
import {IntComponent} from '../shared/directives/int.component';


//Directive
import {FocusDirective} from '../shared/directives/focus.directive';
import {MultiSelectBoxComponent} from "./directives/multiSelectBox.component";
import {TimeZoneComponent} from "./directives/timeZone.component";


@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule
    ],
    declarations: [
        SelectBoxComponent,
        MultiSelectBoxComponent,
        FocusDirective,
        AutoComplete1Component,
        AutoCompleteCityComponent,
        AutoCompleteComponent,
        AutoCompleteCustom,
        TimeZoneComponent,
        datePickerComponent,
        timePickerComponent,
        IntComponent

    ],
    exports: [
        SelectBoxComponent,
        FocusDirective,
        AutoComplete1Component,
        AutoCompleteCityComponent,
        AutoCompleteComponent,
        MultiSelectBoxComponent,
        AutoCompleteCustom,
        TimeZoneComponent,
        datePickerComponent,
        timePickerComponent,
        IntComponent
    ]
})



export class ElementBlockModule {

}