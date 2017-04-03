import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

//Component
import {LanguageTagComponent} from '../shared/directives/languageTag.component';
import {ElementBlockModule} from '../shared/elementBlock.module';




@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        ElementBlockModule,
        RouterModule,
    ],
    declarations: [
        LanguageTagComponent
    ],
    exports: [
        LanguageTagComponent
    ]
})



export class LanguageModule {


}