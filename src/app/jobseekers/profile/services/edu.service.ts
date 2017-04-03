import {Http,Headers} from '@angular/http';
import {ConfigService} from '../../../shared/config.service';
import {JobSeekerContact} from '../models/JobSeekerContact';

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

//Models
import {JobSeekerEducation} from '../models/JobSeekerEducation';


@Injectable()
export class EduService {

    private _url ="edu.html";


    constructor(private _http: Http) {

    }

    updateEduDetails(jobSeekerEducation :JobSeekerEducation): Observable<any[]> {
        return this._http.put(ConfigService.getBloovoAPI()+this._url, JSON.stringify(jobSeekerEducation))
            .map(res => res.json())
    }
    
    postEduDetails(jobSeekerEducation :JobSeekerEducation): Observable<any[]> {
        return this._http.post(ConfigService.getBloovoAPI()+this._url, JSON.stringify(jobSeekerEducation))
            .map(res => res.json())
    }

    getEduList() : Observable<any[]>{

        return this._http.get(ConfigService.getBloovoAPI()+this._url)
            .map(res => res.json())
            .delay(500)
    }
}