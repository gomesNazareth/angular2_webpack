import {Component,Input,OnInit} from '@angular/core';
import {StatsService} from "../services/stats.service";
import {PollService} from "./services/poll.service";

import {BarStat} from '../models/barStat';
import {BarStatCollection} from '../models/barStatCollection';


import {Poll} from '../poll/poll';
import {PollOption} from '../poll/poll_option';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import {AccountService} from "../account/services/account.service";





@Component({

    selector:"bl-poll",
    templateUrl: "poll.component.html",
    styles:[`
    .ng-touched.ng-invalid {
     border: 1px solid red;
    }
`],
    providers: [StatsService,PollService],

})


export  class PollComponent  implements OnInit{



    public allPollsFlag = false;

    public previousPoll;
    public pollDesc;
    public barStat: BarStat[];
    public barStatCollection;
    public pollOption: PollOption[];
    public form: FormGroup;


    public question: String;
    public pollDate: Date;
    public poll;
    public spPoll;
    public allPoll$: BehaviorSubject<any> = new BehaviorSubject(null);
    public poll$: BehaviorSubject<any> = new BehaviorSubject(null);
    public allPoll;
    public pollId:number = null;
    public username;
    public customError$:  BehaviorSubject<any> = new BehaviorSubject(null);

    //flags
    public errorFlag = false;
    public castPollFlag$:BehaviorSubject<any> = new BehaviorSubject(false);
    public prePollFlag$:BehaviorSubject<any> = new BehaviorSubject(false);
    public voteCastFlag$:BehaviorSubject<any> = new BehaviorSubject(false);

    ngOnInit():any {

       this.loadPollQuestions();
      /**
       * TO DO
       */
       // this.allPollFlag = this._routeParams.get("details");

       this.loadAllPolls();

    }


    public onPostPoll2(index =null) {

        this.allPoll[index].postsuccessFlag = null;
        this.allPoll[index].errorMessageServer = null;

        if(this.allPoll[index].postValue == null || this.allPoll[index].postValue.length == 0){

            this.allPoll[index].errorFlag = true;
            this.allPoll$.next(this.allPoll);

        }

        this._pollService.postPoll(this.allPoll[index].id,this.allPoll[index].postValue).subscribe(res=> {

                this.allPoll[index].postsuccessFlag = true;
                this.voteCastFlag$.next(true);
                this.allPoll$.next(this.allPoll);

            },
            error=>{

                var obj = JSON.parse(error._body);

                this.allPoll[index].errorMessageServer = obj["base"][0];
                this.allPoll$.next(this.allPoll);


            });


    }


    public onPostPoll(){

        this.customError$.next(null);
        if(this.pollId == null){
            this.errorFlag = true;
        }
        else {


            let pollList = [];
            pollList.push(this.pollId);
            this._pollService.postPoll(this.poll.id,pollList).subscribe(res=> {
                this.voteCastFlag$.next(true);
            },
            error=>{
                var obj = JSON.parse(error._body);
                this.customError$.next(obj["base"][0]);


            });

        }

    }


    public onSelectPoll2(index,multiselectFlag,id){

        if(multiselectFlag){

            var pollindex = this.allPoll[index].postValue.indexOf(id);
            if(pollindex == -1)
            {

                this.allPoll[index].postValue.push(id);
            }
            else {
                this.allPoll[index].postValue.splice(pollindex, 1);

            }
        }
        else
        {
            let plist = [];
            plist.push(id);
            this.allPoll[index].postValue = plist;
        }



    }

    public onSelectPoll(id){
        this.pollId = id;
    }

    public loadAllPolls()
    {
        this.allPoll= [];
        let matchMade = false;
        this._pollService.getAllPollQuestion()
            .subscribe(poll =>{
                for(var i=0;i< poll.length;i++) {
                    this.pollOption =[];


                    poll[i]["poll_answers"].forEach(selAns =>{
                        this.pollOption.push(new PollOption(selAns.id,selAns.answer));
                    });


                    this.question = poll[i]["question"];
                    this.pollDate =  new Date(poll[i]["start_at"]);
                    let status = (poll[i]["active"] && !poll[i]["is_answered_by_current_user"])? "open":"closed";
                    let multiple_selection  = (poll[i]["active"]["multiple_selection"])? true: false;
                    // multiple_selection = true;
                    this.poll = new Poll(this.question,this.pollOption,this.pollDate,status,poll[i]["id"],multiple_selection);

                    if(multiple_selection)
                        this.poll.postValue = [];

                    this.allPoll.push(this.poll);
                }

                this.allPoll$.next(this.allPoll);
                this.poll$.next(this.allPoll[0]);


                this.allPoll.forEach(selPoll=>{

                    if(matchMade == false){
                        this.spPoll = selPoll;
                        matchMade = true;
                    }
                });

            });





        //Every thing is closed
        if(matchMade == false){
            this.spPoll = this.allPoll[0];
            matchMade = true;
        }
    }

    public loadPollQuestions()
    {
        this.poll= "";
        this.pollOption =[];
        this.barStatCollection ="";
        this.castPollFlag$.next(true);
        this.prePollFlag$.next(true);


        this._pollService.getPollQuestion()
            .subscribe(poll =>{


                this.prePollFlag$.next(false);

                poll.forEach((selPoll,pcount)=>{

                    if(pcount == 0)
                    {
                        this.castPollFlag$.next(false);
                        this.question = selPoll["question"];
                        this.pollDate =  new Date(selPoll["start_at"]);
                        this.pollOption =[];
                        selPoll["poll_answers"].forEach(selAns =>{
                            this.pollOption.push(new PollOption(selAns.id,selAns.answer));
                        });

                        let status = (selPoll["active"]  && !selPoll["is_answered_by_current_user"])? "open":"closed";
                        this.poll = new Poll( this.question,this.pollOption,this.pollDate,status,selPoll["id"]);

                    }
                   else {

                        this.barStat =[];
                        // This below line is written so that the barStatCollection can be made available outside the
                        // subscribe function
                        this.barStatCollection ="";


                        selPoll["poll_answers"].forEach(selAns =>{
                            this.barStat.push(new BarStat(selAns.answer,selAns.answer,selAns.percentage_vote));
                        });

                       this.barStatCollection =  new BarStatCollection(this.barStat, selPoll["post_date"],  selPoll["question"]) ;


                    }


                });


            });



    }




    @Input() isPollActive = false;
    @Input() allPollFlag = true;

    constructor(public _statService: StatsService,
                public _pollService: PollService,
                public _accountService:AccountService,
                fb: FormBuilder
    ) {

   this.form= fb.group({
          pollOption: ['',Validators.required]
        });



    }


}

