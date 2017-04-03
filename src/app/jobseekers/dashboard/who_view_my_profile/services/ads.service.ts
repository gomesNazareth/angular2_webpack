import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import {ConfigService} from '../../../../shared/config.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AdService {
    public _url ="ads.html";


    public constructor(public _http : Http) {

    }

    getAdList(){

        let returnString:string = '{"ads":[{"id":1,"name":"Ad One","url":"http://lorempixel.com/277/283/city/?1,277,283","desc":"201510261526215146.png"},{"id":2,"name":"Ad One","url":"http://lorempixel.com/277/283/city/?3,277,283","desc":"201510261526215146.png"}]}';
        return Observable.of(JSON.parse(returnString));

    }
}
