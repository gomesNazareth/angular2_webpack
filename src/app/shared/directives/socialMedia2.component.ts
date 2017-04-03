import {Input, OnInit,Component, Output, EventEmitter, ElementRef, Inject} from '@angular/core';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';


// var  jQuery = require('jquery');
declare var jQuery:any;


@Component({

    selector: "share-social-media-2",
    template: `

<div class="social-section rrssb-buttons">
                                <div class="social-media">
                               <span class="rrssb-facebook">
                                    <a href="#" class="soc-rounds facebook margin-lft-10 popup">
                                        <div class="s-media facebook"><i class="zmdi zmdi-facebook"></i></div>
                                    </a>
                               </span>
                               <span class="rrssb-twitter">
                                   <a href="#" class="soc-rounds twitter popup">
                                        <div class="s-media twitter"><i class="zmdi zmdi-twitter"></i></div>
                                    </a>
                               </span>
                               <span class="rrssb-linkedin">
                                    <a href="#" class="soc-rounds linkedin popup">
                                        <div class="s-media linkdin"><i class="zmdi zmdi-linkedin"></i></div>
                                    </a>
                               </span>  
                               <span class="rrssb-googleplus">
                                   <a href="#" class="soc-rounds google-plus popup">
                                        <div class="s-media google-plus"><i class="zmdi zmdi-google-plus"></i></div>
                                    </a>
                               </span>
                                    <div class=" clearfix"></div>

                                </div>
                            </div>
`
})


export class SocialMedia2Component implements OnInit{

    @Input() url;
    @Input() title:string = "This is the email subject and/or tweet text";
    @Input() description:string = "Bloovo.com where jobs are born";
    @Input() emailBody:string = "email body";
    // @Output() getProcessedPhoneNo = new EventEmitter();
    public form1:FormGroup;
    public elementRef:ElementRef;

    constructor(@Inject(ElementRef) elementRef:ElementRef,public _fb:FormBuilder) {
        this.elementRef = elementRef;

    }

    ngOnInit() {


    }


    ngAfterViewInit() {


        jQuery('.rrssb-buttons').rrssb({
            // required:
            title: this.title,
            url: this.url,

            // optional:
            description: this.description,
            emailBody: this.emailBody
        });


    }



}
