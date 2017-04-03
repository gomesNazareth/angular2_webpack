import {Input, OnInit,Component, Output, EventEmitter, ElementRef, Inject} from '@angular/core';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import {AccountService} from "../../core/account/services/account.service";


@Component({

    selector: "invalid-page",
    template: `
        <div class="main-tab load-data-js mobile-tab-top"></div>
           <div role="tabpanel" class="tab-pane active" id="my-profile">
                <div class="commen-container-less" id="followers">
                    <div class="block bottom-gap ">
                        <div class="block-title-2">
                            <h2>Let Your Friends Know About BLOOVO With a Click</h2>
                        </div>
                    </div>
                        <section class="fournotfour"> 
                        <div class="error_pg"> 
                            <div class="four"><img src="images/unauthorised.svg" class="unauthorised"></div>
                            <h2 class="m-message">You are not authorized to view this page.</h2>
                            <div class="light mg-0 padding-top-10">Please go back to the website home page and try to find your page from the website navigation.</div> 
                            <a href="index.html" class="bt-normal-un">Back</a>  
                        </div>
                        </section>
                    
                </div>
            </div>
       
            
            
         
            
            
      

`
})




export class UnAuthPageComponent implements OnInit {


    constructor(public _accountService:AccountService) {

    }


    ngOnInit(){

        this._accountService.getClearStorage();
    }



    onBack() {
        window.history.back();
    }



}


