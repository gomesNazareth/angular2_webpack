// angular
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';

//Routes
import {CompanyRoutes} from './company.routes';

//Modules
import { SharedModule } from '../../shared/shared.module';
import {CompanyDetailsModule} from '../../core/company/companyDetails.module';
import {ElementBlockModule} from '../../shared/elementBlock.module';
import {PaginationModule} from '../../shared/pagination.module';



//Directives
import {CompanyComponent} from '../company/company.component';
import {AllCompaniesComponent} from '../../core/company/allCompanies.component';
import {FilterComponent} from '../../core/company/filter.component';


//Services
import {AccountService} from  '../../core/account/services/account.service';
import {LoaderService} from '../../shared/services/loader.service';
import {CompanyService} from '../../core/services/company.service';
import  {GeneralService} from '../../shared/services/general.service';
import  {JobService} from '../../core/services/job.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ElementBlockModule,
    CompanyDetailsModule,
    PaginationModule,
    CompanyRoutes
  ],
  declarations: [
    CompanyComponent,
    AllCompaniesComponent,
    FilterComponent
  ],
  providers: [
    AccountService,
    FormBuilder,
    LoaderService,
    GeneralService, 
    CompanyService, 
    JobService
  ],

  exports: [
    CompanyComponent,
    AllCompaniesComponent,
    FilterComponent
  ]
})
export class CompanyModule {

  constructor(@Optional() @SkipSelf() parentModule: CompanyModule) {
    if (parentModule) {
      throw new Error('CompanyModule already loaded; Import in root module only.');
    }
  }
}
