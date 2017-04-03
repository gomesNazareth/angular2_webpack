import {File} from '../../shared/models/File';
import {File1} from '../../shared/models/File';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import {Router} from '@angular/router';
import {Team} from '../../shared/models/Company';

//Services
import {CompanyService} from '../../core/services/company.service';



declare var jQuery:any;
@Component({

    selector: "company-team-desktop",
    templateUrl: "companyTeamDesktop.component.html"

})


export class CompanyTeamDesktopComponent implements OnInit {



    //Forms
    public teamForm:FormGroup;
    @Input() companyTeamObs:BehaviorSubject<any> = new BehaviorSubject(null);
    @Input() companyId:number = null;

    @Output() backEmit:EventEmitter<any> = new EventEmitter();

    //Behavior Subject
    public pristineFlag$:BehaviorSubject<any> = new BehaviorSubject(true);
    public teamPicUpdatedObs:BehaviorSubject<any> = new BehaviorSubject(false);
    public postSuccessFull:boolean = false;
    public pageMode = "list";  //list edit add
    public file_team;
    public fileTeamList = [];





    editTeamMember(id = null,index =null){


        this.companyTeamObs.subscribe(res => {



            if(id)
                this.teamForm = this._fb.group({
                    id: [res[index]["id"]],
                    name: [res[index]["name"],Validators.required],
                    designation: [res[index]["designation"],Validators.required]

                });
            else
                this.teamForm = this._fb.group({
                    id: [''],
                    name: ['',Validators.required],
                    designation: ['',Validators.required]

                });

            this.pageMode = "edit";

        });
    }



    onBuildFileList() {
        this.companyTeamObs.subscribe(res=>{


            res.forEach((selteam,teamIndex)=>{

                this.fileTeamList[teamIndex] = new File("Edit Team","profile", "PNG, JPG", 3, 'MB');
                this.fileTeamList[teamIndex].classMap = "myteamprofile_desk"+teamIndex;
                this.fileTeamList[teamIndex].mode = "profile_member";
                this.fileTeamList[teamIndex].formParams.push({'title':'name',"value":selteam["name"],"placeholder":"Name"});
                this.fileTeamList[teamIndex].formParams.push({'title':'position',"value":selteam["designation"],"placeholder":"Position"});
                this.fileTeamList[teamIndex].selId = selteam["id"];
                this.fileTeamList[teamIndex].method = "PUT";
                this.fileTeamList[teamIndex].rootTag = "company_member";
                this.fileTeamList[teamIndex].root = "company_member[avatar]";
                this.fileTeamList[teamIndex].cropperSettings_croppedWidth =300;
                this.fileTeamList[teamIndex].cropperSettings_croppedHeight =300;
                this.fileTeamList[teamIndex].cropperSettings_width =300;
                this.fileTeamList[teamIndex].file_optional = true;
                this.fileTeamList[teamIndex].cropperSettings_height =300;

            })


            this.file_team = new File("Add New Team","profile", "PNG, JPG", 3, 'MB.');
            this.file_team.classMap = "myteamprofile_desk";
            this.file_team.mode = "profile_member";
            this.file_team.formParams.push({'title':'name',"value":"","placeholder":"Name"});
            this.file_team.formParams.push({'title':'position',"value":"","placeholder":"Position"});
            this.file_team.selId = "";
            this.file_team.method = "POST";
            this.file_team.rootTag = "company_member";
            this.file_team.root = "company_member[avatar]";
            this.file_team.cropperSettings_croppedWidth =300;
            this.file_team.cropperSettings_croppedHeight =300;
            this.file_team.cropperSettings_width =300;
            this.file_team.cropperSettings_height =300;


        });
    }

    ngOnInit():void {

        window.scroll(0,0);
        this.onBuildFileList();



    }




    onBack() {

        this.backEmit.emit({operation:"back"});
    }

    onTeamPicUploaded($event) {



        if($event["result"]["company_member"]){

            let newFlag = true;
            this.companyTeamObs.value.forEach((selval,selIndex) => {
                if (selval.id == $event["result"]["company_member"]["id"]) {
                    newFlag = false;
                    this.companyTeamObs.value[selIndex]["profileImage"] = $event["result"]["company_member"]["avatar"];

                    this.companyTeamObs.value[selIndex]["name"] = $event["result"]["company_member"]["name"];
                    this.companyTeamObs.value[selIndex]["designation"] = $event["result"]["company_member"]["position"];

                }

                this.teamPicUpdatedObs.next(true);
            });

            if( newFlag == true) {




                let team = new Team();
                team.id = $event["result"]["company_member"]["id"];
                team.name = $event["result"]["company_member"]["name"];
                team.designation = $event["result"]["company_member"]["position"];

                team.profileImage = $event["result"]["company_member"]["avatar"];
                this.companyTeamObs.value.unshift(team);

            }

            this.onBuildFileList();
        }
    }


    onDelete(id,index){

        this._companyservice.getDeleteTeamMember(this.companyId,this.companyTeamObs.value[index]["id"]).subscribe(res => {


            this.companyTeamObs.next(res);
            jQuery('.close_delete').modal('hide');

        });



    }

    onTeamMemberSave(){


        this.pristineFlag$.next(false);

        let postData = {};
        if(this.teamForm.valid)
        {


            postData = {company_member:{
                name:this.teamForm.value["name"],
                position:this.teamForm.value["designation"]

            }};


            this._companyservice.updateCompanyTeamMember(this.companyId,this.teamForm.value["id"],postData).subscribe(res => {

                this.postSuccessFull = true;
                window.scroll(0,0);
                Observable.of(1).delay(2000)
                    .subscribe(x => {

                        if(this.teamForm.value["id"])
                            this.companyTeamObs.value.forEach((selval,selIndex) => {
                                if (selval.id ==res[0]["id"]) {
                                    this.companyTeamObs.value[selIndex] = res[0];

                                }
                            });
                        else
                        {
                            this.companyTeamObs.value.unshift(res[0]);
                        }

                        this.postSuccessFull = false;
                        this.pageMode = "list";

                        this.onBuildFileList();
                    });


            })
        }

    }


    constructor(public _router: Router,
                public _companyservice: CompanyService,
                public _fb:FormBuilder) {

    }
}
