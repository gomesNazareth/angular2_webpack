import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import {SocialMedia2Component} from './directives/socialMedia2.component';
import {SocialMediaComponent} from './directives/socialMedia.component';



@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule
    ],
    declarations: [
        SocialMedia2Component,
        SocialMediaComponent

    ],
    exports: [
        SocialMedia2Component,
        SocialMediaComponent
    ]
})



export class  SocialMediaModule {


}