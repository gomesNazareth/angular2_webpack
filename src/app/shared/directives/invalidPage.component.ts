import {Input, OnInit,Component, Output, EventEmitter, ElementRef, Inject} from '@angular/core';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import {AccountService} from "../../core/account/services/account.service";
import { AppState } from '../../app.service';


@Component({

    selector: "invalid-page",
    template: `
        <div class="main-tab load-data-js mobile-tab-top"></div>
           <div role="tabpanel" class="tab-pane active" id="my-profile">
                <div class="commen-container-less" id="followers">
                    <div class="block bottom-gap ">
                        <div class="block-title-2">
                            <h2>Let Your Friends Know About BLOOVO With a Click</h2>
                            <p>Please go back to the website home page and try to find your page from the website navigation.</p>
                        </div>
                    </div>
                        <section class="fournotfour"> 
                        <div class="error_pg"> 
                            <div class="four"> <img src="assets/images/404.svg"></div>
                            <div class="light">Something Went Wrong! Go Back to <a href="index.html">Homepage</a> </div>   
                        </div>
                        </section>
                    
                </div>
            </div>
       
           

`
})


export class InvalidPageComponent implements OnInit {


    constructor(public _accountService: AccountService) {

    }


    ngOnInit(){

        // this._accountService.getClearStorage();
    }
   onBack() {
        window.history.back();
    }



}
