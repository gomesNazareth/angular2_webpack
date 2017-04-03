import {Input,OnInit,Output,EventEmitter,Component} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

/**
 * Services
 */
import {ProfileService} from '../../core/services/profile.service';

//Models
import {JobSeekerSkills} from './models/JobSeekerSkills';
import {AccountService} from "../../core/account/services/account.service";




@Component({

    selector: "profile-skills",
    templateUrl: "skills.component.html"

})


export class SkillsComponent  implements OnInit{


    @Output() onUpdateProfileStatus= new EventEmitter();
    @Input() skills:BehaviorSubject<any>;
    public skills_status = "read";

    //Flags
    public savingmode = false;
    public cancelmode = false;

    //Obervable flags
    public savingmode$:BehaviorSubject<any> = new BehaviorSubject(false);
    public errorflag$:BehaviorSubject<any> = new BehaviorSubject(false);

    //Observables
    public skills$:BehaviorSubject<any> = new BehaviorSubject(null);


    public skillList:JobSeekerSkills[] = [];
    public skillListBackup:JobSeekerSkills[] = [];
    public newSkill;
    public profileCacheDirty = false;


    ngOnDestroy() {
        if(this.profileCacheDirty){
            AccountService.profileCacheDirty = true;
        }
    }

    constructor(public _profileservice:ProfileService) {

        this.createNewSkill();
    }


   public getCreateSkills() {
       this.skills.subscribe(res => {

           if(res != null) {

               this.skillListBackup = res.slice();
               this.skillList = res;

               this.skills$.next(this.skillList);


           }
       });
   }

    ngOnInit(): void {

        this.errorflag$.next(false);
        this.getCreateSkills();

    }

    createNewSkill()
    {
        this.newSkill = new JobSeekerSkills();
        this.newSkill.level = 1;
        this.newSkill.name = "";
    }



    onRead() {
        this.skills_status = "read";
    }

    addNewSkillLevel(level:number){
        this.newSkill.level =level;
    }

    addNewSkillName($event){

        this.newSkill.id = $event.id;
        this.newSkill.name = $event.name;
    }


    onCancel() {
        this.onRead();
        this.cancelmode = true;
        this.skillList = this.skillListBackup.slice();
        this.skills$.next(this.skillList);


    }

    onEdit() {
        this.skills_status = "edit";
    }


    onSave() {

        this.savingmode = true;
        this.savingmode$.next(true);
        this.errorflag$.next(false)
        this.skills_status = "read";
        this.skills$.subscribe(val =>{

        });
        let postData = {"jobseeker":{"skills":this.skillList}};
        this._profileservice.updatSkills(postData)
            .subscribe(res=>{
                            this.profileCacheDirty = true;
                            this.skillList = [];
                            res["jobseekers"].forEach(res1=>{

                               let selJobseeker = new JobSeekerSkills();
                                selJobseeker.id = res1.id;
                                selJobseeker.name = res1.name;
                                selJobseeker.level = res1.level;
                                this.skillList.push(selJobseeker);
                            });
                            this.skills$.next(this.skillList);
                            this.onUpdateProfileStatus.emit({"update":true});
                            },
                       error=> {this.savingmode$.next(false);this.errorflag$.next(true)},
                       () => this.savingmode$.next(false));
    }



    onAdd() {

        if(this.newSkill.name != "")
        {
            this.skillList.unshift(this.newSkill);
            this.skills$.next(this.skillList);

            this.createNewSkill();
        }


    }

    onDel(id:number) {

        this.skillList.splice(id, 1);
        this.skills$.next(this.skillList);

    }
}
