import {Http,Headers} from '@angular/http';
import {Injectable,Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ConfigService} from '../../shared/config.service';
import {Tags} from '../../shared/models/Tags';

import {AccountService} from  '../../core/account/services/account.service';

@Injectable()
export class TagService {

	private _root_url = "jobseekers/";
    private _tags_url = "tags/";
    private _update_tags_url ="/update_tags.json";
    private AuthHeader;
    private AuthHeader2;
    private userId:any;

    constructor(private _http:Http, @Inject(AccountService) authService:AccountService){
    	this.AuthHeader = authService.AuthHeader();
    	this.AuthHeader2 = authService.AuthHeader2();
        this.userId = authService.getUserId();
    }


    private getBuildTags(data) {

        let listTags = [];
        if(data.tags)
        {
            data.tags.forEach(res => {
                let tag = new Tags();
                tag.id = res.id;
                tag.name = res.name;
                tag.weight = res.weight;

                listTags.push(tag);

            });
        }
        return listTags;
    }

    getTags(searchString:string): Observable <Tags[]> {
        return this._http.get(ConfigService.getAPI()+this._tags_url+'?q[name_cont]='+searchString,this.AuthHeader)
            .map(res => res.json())
            .map(res => this.getBuildTags(res));
    }


    updateTags(tags :any): Observable<any[]> {
        return this._http.post(ConfigService.getAPI()+this._root_url+this.userId+this._update_tags_url, JSON.stringify({jobseeker: tags}), this.AuthHeader2)
            .map(res => res.json())
    }
}