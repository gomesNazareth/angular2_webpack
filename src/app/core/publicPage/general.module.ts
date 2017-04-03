import { NgModule } from '@angular/core';
import {FileUploadModule} from 'ng2-file-upload/ng2-file-upload';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';



//Components
import {AboutComponent} from './about.component';
import {ContactusComponent} from './contactus.component';
import {TermsComponent} from './terms.component';
import {PolicyComponent} from './policy.component';

//Service
import {AccountService} from '../account/services/account.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FileUploadModule,
        ReactiveFormsModule,
        SharedModule],
    providers: [AccountService],
    declarations: [AboutComponent, TermsComponent,PolicyComponent,ContactusComponent],
    exports: [AboutComponent, TermsComponent,PolicyComponent,ContactusComponent,]
})

export class GeneralModule {


}
