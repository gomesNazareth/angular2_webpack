import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import  {Language} from '../models/Language';
import {GeneralService} from "../services/general.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";



@Component({

    selector: 'lang-tag',
    templateUrl: "languageTag.component.html"
})

export class LanguageTagComponent implements OnInit {

    @Input() languageList: Array<Language> = [];

    @Input() maxCount: number = 3;
    @Output() onLanChange = new EventEmitter();

    public languages = [];
    public languages$ = new BehaviorSubject([]);

    constructor(public _generalService:GeneralService) {

        // let lang1 = new Language();
        // lang1.id = 1;
        // lang1.name = "Spanish";
        //
        // this.languageList.push(lang1);
    }


    onRemoveElement(index: number) {

        if (index > -1) {
            this.languageList.splice(index, 1);
            this.onLanChange.emit({"languageList": this.languageList});
        }


    }

    onAddElement($event) {

        let lang1 = new Language();
        lang1.id = $event.id;
        lang1.name = $event.name;
        this.languageList.push(lang1);
        this.onLanChange.emit({"languageList": this.languageList});
    }


    ngOnInit() {

        this._generalService.getLanguages().subscribe(res=>{


            res.forEach(selval=>{

                let lang1 = new Language();

                lang1.id = selval["id"];
                lang1.name = selval["name"];
                this.languages.push(lang1);
            });

            this.languages$.next(this.languages);
            // console.log(this.languages);

        });
    }

}
