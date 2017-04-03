import {Input, OnInit,Component, Output, EventEmitter, ElementRef, Inject} from '@angular/core';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';

require('localrepo/rrssb');

declare var jQuery:any;


@Component({

    selector: "share-social-media",
    template: `


<div class="rrssb-buttons">

<span class="rrssb-facebook">
<a href="#" class="soc-rounds facebook margin-lft-10 popup">
 <i class="zmdi zmdi-facebook"></i>
</a> 
</span>

<span class="rrssb-twitter">
<a href="#" class="soc-rounds twitter popup">
 <i class="zmdi zmdi-twitter"></i>
</a> 
</span>

<span class="rrssb-linkedin">
<a href="#" class="soc-rounds linkedin popup">
<i class="zmdi zmdi-linkedin"></i>
</a> 
</span>


<span class="rrssb-googleplus">
<a href="#" class="soc-rounds google-plus popup">
<i class="zmdi zmdi-google-plus"></i> 
</a> 
</span>

<div class=" clearfix "></div>
</div>



`
})


export class SocialMediaComponent implements OnInit{

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
