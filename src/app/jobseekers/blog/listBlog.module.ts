// angular
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';


//Routes
import { BlogRoutes} from './listBlog.routes';

//Modules
import { SharedModule } from '../../shared/shared.module';

//Directives
import {ListBlogComponent} from './listBlog.component';


import {BlogModule} from '../../core/blog/blog.module';
import { FileUploadModule} from 'ng2-file-upload/ng2-file-upload';
import {ImageCropperModule} from 'ng2-img-cropper/src/imageCropperModule';
//Services

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BlogModule,
    BlogRoutes,
    FileUploadModule,
    ImageCropperModule
  ],
  declarations: [
    ListBlogComponent
  ],
  providers: [
    FormBuilder
  ],

  exports: [

  ]
})
export class ListBlogModule {

  constructor(@Optional() @SkipSelf() parentModule: ListBlogModule) {
    if (parentModule) {
      throw new Error('EditBlogModule already loaded; Import in root module only.');
    }
  }
}
