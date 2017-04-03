// angular
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';

//Modules
import { SharedModule } from '../../shared/shared.module';
import {PaginationModule} from '../../shared/pagination.module';
import {DatePipeModule} from '../../shared/datePipe.module';
import {SocialMediaModule} from '../../shared/socialMedia.module';

//Directives
import {BlogComponent} from '../blog/blog.component';
import {BlogDetailsComponent} from '../blog/blogDetails.component';
import {TopViewedBlogComponent} from '../blog/topViewedBlog.component';

//Services
import {AccountService} from  '../account/services/account.service';
import {BlogService} from './services/blog.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PaginationModule,
    DatePipeModule,
    SocialMediaModule

  ],
  declarations: [
    BlogComponent,
    BlogDetailsComponent,
    TopViewedBlogComponent
  ],
  providers: [
    AccountService,
    BlogService,
    FormBuilder
  ],

  exports: [
    BlogComponent,
    BlogDetailsComponent,
    TopViewedBlogComponent
  ]
})
export class BlogModule {

  constructor(@Optional() @SkipSelf() parentModule: BlogModule) {
    if (parentModule) {
      throw new Error('BlogModule already loaded; Import in root module only.');
    }
  }
}
