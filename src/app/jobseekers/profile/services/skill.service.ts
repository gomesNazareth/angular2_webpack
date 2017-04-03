import {Http,Headers} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {JobSeekerSkills} from '../models/JobSeekerSkills';
import {ConfigService} from '../../../shared/config.service';



@Injectable()
export class SkillService {

    private _url ="skills.html";
    constructor(private _http:Http ){

    }

    getSkills(): Observable <JobSeekerSkills> {

         
        return this._http.get(ConfigService.getBloovoAPI()+this._url)
            .map(res => res.json())

        
    }




    updateSkills(skills :JobSeekerSkills[]): Observable<any[]> {

        return this._http.post(ConfigService.getBloovoAPI()+this._url, JSON.stringify(skills))
            .map(res => res.json())


    }

}