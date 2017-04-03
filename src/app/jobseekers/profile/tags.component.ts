import {Component, Output, EventEmitter, ElementRef, Inject,Input, OnInit} from '@angular/core';


/**
 * Services
 */
import {Tags} from "../../shared/models/Tags";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {ProfileService} from "../../core/services/profile.service";
import {AccountService} from "../../core/account/services/account.service";


declare var jQuery:any;

@Component({

    selector: "job-tags",
    templateUrl: "tags.component.html"
})

export class TagsComponent implements OnInit {

    @Input() tags;
    @Output() onUpdateProfileStatus= new EventEmitter();

    public tagsstring:string;
    public tagsarry:Tags[] = [];
    public tagsObjects:any = new Array();
    public tags_status = "read";
    public elementRef: ElementRef;
    public maxCount:number = 10;
    public profileCacheDirty = false;

    //flags
    public showSpinnerFlag = false;

    //Observer
    public showSpinnerFlag$:BehaviorSubject<any> = new BehaviorSubject(false);


    ngOnDestroy() {
        if(this.profileCacheDirty){
            AccountService.profileCacheDirty = true;
        }
    }

    onRead() {
        this.tags_status = "read";
    }

    onEdit() {
        this.tags_status = "edit";
    }

    onAddElement($event){
        let tag = new Tags();
        tag.id = $event.id;
        tag.name = $event.name;
        this.tagsarry.push(tag);

    }

    onRemoveElement(index: number) {

        if (index > -1) {
            this.tagsarry.splice(index, 1);
        }


    }

    constructor(public _profile_service:ProfileService,@Inject(ElementRef) elementRef:ElementRef) {
        this.elementRef = elementRef;
    }

    ngOnInit() {


        this.showSpinnerFlag$.next(false);
        this.tags.subscribe((tag)=> {
            if (tag)
                tag.forEach((y)=> {
                    let tag = new Tags();
                    tag.id = y.id;
                    tag.name = y.name;
                    tag.weight = y.weight;
                    this.tagsarry.push(tag);
                });
        });


    }

    onSave() {


        this.showSpinnerFlag$.next(true);

        var new_tags_obj = [];
        for (var i = 0; i < this.tagsarry.length; ++i) {
            new_tags_obj.push({id: null, name: this.tagsarry[i].name});
        }


        this._profile_service.updateTags({"tags":new_tags_obj}).subscribe(res => {
            this.profileCacheDirty = true;
            this.showSpinnerFlag$.next(false);

            if(res["jobseekers"]){


                this.tags = Observable.of(this.tagsarry);
                this.onUpdateProfileStatus.emit({"update":true});
                this.tags_status = "read";
            }

        });
    }
}
