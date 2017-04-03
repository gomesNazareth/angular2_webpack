import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import {SearchTagComponent} from '../shared/directives/searchTag.component';



@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule
    ],
    declarations: [
        SearchTagComponent

    ],
    exports: [
        SearchTagComponent
    ]
})



export class SearchTagModule {


}