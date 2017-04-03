import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

//component
import {UploadComponent} from '../shared/directives/upload.component';
import {BuildFileUploadComponent} from '../shared/directives/buildFileUpload.component';
import {CropperSettings} from 'ng2-img-cropper/src/cropperSettings';
import {ImageCropperComponent} from 'ng2-img-cropper/src/imageCropperComponent';



// //Modules
import { FileUploadModule} from 'ng2-file-upload/ng2-file-upload';
import {ImageCropperModule} from 'ng2-img-cropper/src/imageCropperModule';


@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        FileUploadModule,
        ImageCropperModule,
        RouterModule,
    ],
    declarations: [
        UploadComponent,
        BuildFileUploadComponent
    ],
    exports: [
        UploadComponent,
        BuildFileUploadComponent
    ]
})



export class UploadModule {


}