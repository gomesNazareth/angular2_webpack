import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import {PaginationNewComponent} from '../shared/directives/paginationNew.component'



@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule
    ],
    declarations: [
        PaginationNewComponent

    ],
    exports: [
        PaginationNewComponent
    ]
})



export class PaginationModule {


}