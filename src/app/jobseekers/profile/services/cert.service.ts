import {Http,Headers} from '@angular/http';
import {ConfigService} from '../../../shared/config.service';

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

//Models
import {JobSeekerCertificate} from '../models/JobSeekerCertificate';


@Injectable()
export class CertService {

    private _url ="cert.html";


    constructor(private _http: Http) {

    }

    updateCertDetails(jobSeekerCertificate :JobSeekerCertificate): Observable<any[]> {
        return this._http.put(ConfigService.getBloovoAPI()+this._url, JSON.stringify(jobSeekerCertificate))
            .map(res => res.json())
    }

    postCertDetails(jobSeekerCertificate :JobSeekerCertificate): Observable<any[]> {
        return this._http.post(ConfigService.getBloovoAPI()+this._url, JSON.stringify(jobSeekerCertificate))
            .map(res => res.json())
    }

    getCertList() : Observable<any[]>{
        return this._http.get(ConfigService.getBloovoAPI()+this._url)
            .map(res => res.json())
            .delay(500)
    }
}