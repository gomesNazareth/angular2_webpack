import {Http} from '@angular/http';
import {ConfigService} from '../../../shared/config.service';

import {AccountService} from  '../../../core/account/services/account.service';
import {Injectable,Inject} from '@angular/core';


@Injectable()
export class PollService {

    // public poll: Poll;
    // public optionList: PollOptions[];
    // public question: String;
    // public pollDate: Date;

    public _url = "poll_questions?latest_two=true";
    public _allurl = "poll_questions";
    public _url_poll = "poll_questions";
    public _url_new_poll = "new_poll.html";
    public _url_all_poll = "all_polls.html";



    public AuthHeader;
    public AuthHeader2;
    public AuthHeaderPdf;
    public AuthHeader3;
    public userId;



    constructor(public _http: Http,@Inject(AccountService) authService:AccountService) {
        this.AuthHeader = authService.AuthHeader();
        this.AuthHeader2 = authService.AuthHeader2();
        this.AuthHeaderPdf = authService.AuthHeaderPDF()
        this.AuthHeader3 = authService.AuthHeader3();
        this.userId = authService.getUserId();

    }


    postPoll(id,pollList) {


        return this._http.post(ConfigService.getAPI()+this._url_poll+'/'+id+"/vote",
            JSON.stringify({poll_result:{poll_answer_ids:pollList}}), this.AuthHeader2)
            .map(res => res.json());

    }


    getAllPollQuestion()
    {


        return this._http.get(ConfigService.getAPI()+this._allurl,this.AuthHeader)
            .map(res =>res.json())
            .map(res =>res["poll_questions"]);

    }

    getPollQuestion()
    {

        return this._http.get(ConfigService.getAPI()+this._url,this.AuthHeader)
            .map(res =>res.json())
            .map(res =>res["poll_questions"]);



    }

}




