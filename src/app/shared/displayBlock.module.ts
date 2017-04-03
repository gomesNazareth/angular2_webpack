import {NgModule} from '@angular/core';
import { LeftsideBarComponent, FooterBarComponent, HeaderBarComponent } from '../layout/index';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';




@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule
    ],
    declarations: [
          LeftsideBarComponent,
          FooterBarComponent,
          HeaderBarComponent
    ],
    exports: [

    ]
})



export class DisplayBlockModule {


}

