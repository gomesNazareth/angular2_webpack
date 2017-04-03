import {Http, Headers} from '@angular/http';
import {ConfigService} from '../../shared/config.service';
import {AccountService} from  '../../core/account/services/account.service';


import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

//Models


import 'rxjs/add/operator/map';

@Injectable()
export class CookieService {


    /**
     * try to read a saved cookie
     *
     * @param  {string} name [the cookie name]
     *
     * @return {string}      [the cookie's value]
     */
    public cookieExisits(name: string): boolean {
        let ca: Array<string> = document.cookie.split(';');
        let caLen: number = ca.length;
        let cookieName = name + '=';
        let c: string;

        for (let i: number = 0; i < caLen; i += 1) {
            c = ca[i].replace(/^\s\+/g, '');
            if (c.indexOf(cookieName) !== -1) {
                if(ca[cookieName] == "")
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
        }

        return false;
    }

    public eraseCookie(name) {
        this.setCookie(name, "", -1);
    }



    public getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }


    /**
     * store a new cookie in the browser
     */
    public setCookie(cname: string, cvalue,min = 0): void {

        var d = new Date();
        var timeMilisec = 1 * 1 * min * 60 * 1000;
        if(min > 60){
            var hrs = min/60;
            timeMilisec = 1 * hrs * 60 * 60 * 1000;
        }
        if(min == 0){
            // This means remember me
            timeMilisec = 1000 * 24 * 60 * 60 * 1000;
        }

        d.setTime(d.getTime() + timeMilisec);
        var expires = "expires=" + d.toUTCString();
        document.cookie = encodeURIComponent(cname) + "=" + cvalue + ";" + expires + ";path=/";

    }


}