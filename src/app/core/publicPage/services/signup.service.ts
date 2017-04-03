import {Http, Headers, RequestOptions} from '@angular/http';
import {ConfigService} from '../../../shared/config.service';
import {AccountService} from  '../../account/services/account.service';


import {Injectable,Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

//Models
import {Company,CompanyPicture,Team} from '../../../shared/models/Company';
import {Job} from '../../../jobseekers/job/models/Job';

import 'rxjs/add/operator/map';

@Injectable()
export class SignupService {
    public _jobseeker_signup = "users/signup_jobseeker";
    public _employer_signup = "users/signup_employer";

    constructor(public _http: Http) {

    }

    signup_jobseeker(postData):Observable <any[]>{
        let headers = new Headers();

        if (postData['user'] && postData['user']['email']) {
            headers.append("Authorization", "Basic " + btoa(postData['user']['email'] + ":" + postData['user']['password']));
        }
        headers.append("Content-Type", "application/json");

        return this._http.post(ConfigService.getAPI()+this._jobseeker_signup, JSON.stringify(postData), {headers: headers})
            .map(res => res.json());
    }

    signup_employer(postData):Observable <any[]>{

        let headers = new Headers();
        if (postData['user'] && postData['user']['email']) {
            headers.append("Authorization", "Basic " + btoa(postData['user']['email'] + ":" + postData['user']['password']));
        }
        headers.append("Content-Type", "application/json");

        return this._http.post(ConfigService.getAPI()+this._employer_signup, JSON.stringify(postData), {headers: headers})
            .map(res => res.json());
    }




    signup_employer_with_image(formData:FormData, postData):Observable <any[]>{


        return Observable.create(observer => {

            let xhr: XMLHttpRequest = new XMLHttpRequest();

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };

            let url = ConfigService.getAPI() + this._employer_signup;
            let method = "POST";

            xhr.open(method, url, true);
            // xhr.setRequestHeader("Authorization", "Basic " + btoa(postData['user']['email'] + ":" + postData['user']['password']));
            xhr.setRequestHeader("Authorization", "Basic " + btoa('aa@aa.aa' + ":" + 'test1234'));
            // xhr.setRequestHeader("Content-Type", 'multipart/form-data');
            xhr.send(formData);
        });
    }
}
