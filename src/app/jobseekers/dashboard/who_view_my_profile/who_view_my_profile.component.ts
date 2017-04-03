import {Component,Input,OnInit} from '@angular/core';
import {CompanyService} from './services/company.service';
// import {AdService} from './services/ads.service';
import {SpinnerComponent} from '../../../shared/directives/spinner.component';
import {Observable} from 'rxjs/Rx';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {Company} from '../../../shared/models/Company';
import {AccountService} from "../../../core/account/services/account.service";


@Component({

    selector:"who-view-prof",
    templateUrl: "who_view_my_profile.component.html",
    providers:[CompanyService]
})


export  class WhoViewMyProfileComponent  implements OnInit{

    public companies$: BehaviorSubject<any> = new BehaviorSubject(null);
    public companies = [];
    public ads;
    public companiesLoading;
    public adsLoading;
    public followList = [];
    public filer_name = "Date Posted";
    public followLis$:BehaviorSubject<any> = new BehaviorSubject([]);

    ngOnInit():any {


        this.loadCompanies();
        this.loadAds();
    }

    @Input() isWvmpActive = false;

    constructor(public _companyservice: CompanyService,public _accountService:AccountService){

    }


    public loadAds(){
        this.adsLoading = true;




        // this._adservice.getAdList()
        //     .subscribe(
        //         ads => {
        //             this.ads = ads["ads"];
        //         }, null,
        //         ()=> {this.adsLoading = true;});
    }



    public followCompany(index:number){



        this._companyservice.getFollowCompany(this.companies[index].company.id).subscribe(res => {

            this.companies[index].company.followers_count++;
            this.followList.push(index);
            this.followLis$.next(this.followList);


        });

    }

    public unFollowCompany(index:number){



        this._companyservice.getUnfollowCompany(this.companies[index].company.id).subscribe(res => {
            this.companies[index].company.followers_count--;
            this.followList.splice(index,1);
            this.followLis$.next(this.followList);


        });

    }


    public onAddFilter(order = "none") {

        this.filer_name = (order == 'date')?"Date Posted":(order == 'followers')?"No of followers":"None";


        this.companiesLoading = true;
        this._companyservice.getCompanyList(order).subscribe(
            companies => {

                this.companiesLoading = false;

                companies.forEach((selCompany,index)=>{

                    if(selCompany.company.is_follow_by_current_user){
                        this.followList.push(index);
                        this.followLis$.next(this.followList);

                    }
                });
                this.companies = companies;
                this.companies$.next(this.companies);
            });


    }

    public loadCompanies(){

        this.companiesLoading = true;
        this._companyservice.getCompanyList().subscribe(
              companies => {

                  this.companiesLoading = false;

                  companies.forEach((selCompany,index)=>{

                      if(selCompany.company.is_follow_by_current_user){
                          this.followList.push(index);
                          this.followLis$.next(this.followList);

                      }
                  });
                  this.companies = companies;
                  this.companies$.next(this.companies);
              });
    }

}

