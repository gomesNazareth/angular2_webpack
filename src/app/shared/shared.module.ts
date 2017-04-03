import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule ,FormBuilder} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NameListService } from './name-list/index';



//Component
import {SpinnerComponent} from '../shared/directives/spinner.component';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
      CommonModule,
      RouterModule,
      // FormsModule,
      // ReactiveFormsModule

  ],
  declarations: [

      SpinnerComponent

  ],
  exports: [

    SpinnerComponent,
    CommonModule,
    FormsModule,
    RouterModule
  ]

})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [NameListService,FormBuilder]
    };
  }
}
