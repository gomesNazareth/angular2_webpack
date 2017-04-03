import { Injectable }   from '@angular/core';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';

import { JobSeekerGeneralInfo } from '../models/JobSeekerGeneralInfo';

@Injectable()
export class ProfileControlService {
    constructor(private fb: FormBuilder) { }

    toControlGroup(jobSeekerGeneralInfo: JobSeekerGeneralInfo[]  ) {
        let group = {};

       

        return this.fb.group(group);
    }
}