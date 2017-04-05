import {Input, OnInit,Component, Output, EventEmitter, ElementRef, Inject} from '@angular/core';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';


// import 'localrepo/mediaelement';
import 'jquery';
import  * as  mediaelement from 'localrepo/mediaelement';
// var mediaelement = require('localrepo/mediaelement');

declare var jQuery:any;


@Component({

    selector: "video-style",
    template: `
                <div class="video_fix">
                    <video width="100%" height="100%" controls [attr.poster]="(video_screenshot | async)" preload="none">
                        <source [attr.src]="(social_media_video | async)" type="video/mp4">
                    </video>
                    <div class=" clearfix"></div>
                </div>`
})


export class VideoComponent implements OnInit{

    @Input() social_media_video;
    @Input() video_screenshot;

    public elementRef:ElementRef;

    constructor(@Inject(ElementRef) elementRef:ElementRef,public _fb:FormBuilder) {
        this.elementRef = elementRef;
    }

    ngOnInit() {


    }


    ngAfterViewInit() {


        jQuery(this.elementRef.nativeElement.querySelector('video'))
            .mediaelementplayer({
                alwaysShowControls: false,
                videoVolume: 'horizontal',
                features: ['playpause', 'progress', 'volume', 'fullscreen']
            });

    }



}
