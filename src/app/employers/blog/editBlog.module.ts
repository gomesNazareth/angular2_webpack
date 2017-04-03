// angular
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';


//Routes
import { BlogRoutes} from './editBlog.routes';

//Modules
import { SharedModule } from '../../shared/shared.module';

//Directives
import {BlogCreateFormComponent} from './blogCreateForm.component';
import {BlogEditFormComponent} from './blogEditForm.component';
import {ManageBlogComponent} from '../../employers/blog/manageBlog.component';
import {BlogTopMenuComponent} from './blogTopMenu.component';


import {BlogModule} from '../../core/blog/blog.module';
import { FileUploadModule} from 'ng2-file-upload/ng2-file-upload';
import {ImageCropperModule} from 'ng2-img-cropper/src/imageCropperModule';
import {ElementBlockModule} from "../../shared/elementBlock.module";
import {PaginationModule} from "../../shared/pagination.module";
//Services

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ElementBlockModule,
    PaginationModule,
    SharedModule,
    BlogModule,
    BlogRoutes,
    FileUploadModule,
    ImageCropperModule
  ],
  declarations: [
    BlogEditFormComponent,
    BlogCreateFormComponent,
    BlogTopMenuComponent,
    ManageBlogComponent
  ],
  providers: [
    FormBuilder
  ],

  exports: [

  ]
})
export class EditBlogModule {

  constructor(@Optional() @SkipSelf() parentModule: EditBlogModule) {
    if (parentModule) {
      throw new Error('EditBlogModule already loaded; Import in root module only.');
    }
  }
}
