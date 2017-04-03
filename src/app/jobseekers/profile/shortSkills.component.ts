import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';



class skillList {
    public id = null;
    public name = '';
    public level = 1;
}


declare var jQuery: any;
@Component({
    
    selector: "short-skills",
    templateUrl: "shortSkills.component.html"

})


export class ShortSkillsComponent implements OnInit {

    @Input() maxCount = 3;
    @Input() skillList = [];
    @Output() selectSkills = new EventEmitter();


    public skillListObs = new BehaviorSubject(null);
    public currentCnt = 1;

    ngOnInit() {



        if (this.skillList.length == 0) {
            this.skillList.push(new skillList());
        }
        else {
            this.skillList = this.skillList.slice(0,3);
        }
        this.skillListObs.next(this.skillList);
    }

    constructor() {


    }

    ngOnChange() {

    }


    addRating(index,val){
        this.skillList[index].level =val;
        this.skillListObs.next(this.skillList);
        this.selectSkills.emit(this.skillList);
    }

    addMore(){
        this.skillList.push(new skillList());
        this.skillListObs.next(this.skillList);
    }

    subLess(index){

        this.skillList.splice(index,1);
        this.skillListObs.next(this.skillList);
        this.selectSkills.emit(this.skillList);
    }

    addNewSkillName($event,sIndex){

        this.skillList[sIndex]["id"] = $event.id;
        this.skillList[sIndex]["name"] = $event.name;
        this.skillListObs.next(this.skillList);
        this.selectSkills.emit(this.skillList);
    }

    ngOnDestroy() {

    }

}
