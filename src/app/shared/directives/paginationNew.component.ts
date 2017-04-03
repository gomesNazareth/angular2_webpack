import {OnInit,Output,EventEmitter,Input,Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {FormBuilder, FormGroup, FormControl,Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

//Directives
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Router} from '@angular/router';

@Component({

    selector: "pagination-new",
    templateUrl: "paginationNew.component.html"
})

export class PaginationNewComponent implements OnInit {
    // pager object
    pager: any = {};

    page_params : any = {};

    //Input
    // @Input() currentPage:number = 1;
    @Input() totalRecords:BehaviorSubject<any>;
    @Input() url:string;
    @Input() perPage = 10;
    @Input() hideLast = false;

    public constructor( public _router: Router,
                       public _activeRoute:ActivatedRoute,
                       fb: FormBuilder){

    }

    loadPage() {

        this._activeRoute.queryParams.subscribe(params => {

            this.page_params = {};
            if(params) {
                Object.assign(this.page_params, params);
            }

            if(this.page_params["page"] && this.page_params["page"] != "undefined") {
                this.page_params["page"] = parseInt(this.page_params["page"]);
            }else{
                this.page_params["page"] = 1;
            }

            this.pager = this.getPager(this.totalRecords.getValue(), this.page_params["page"]);
            window.scroll(0, 0);
        });
    }

    setPage(page: number = 1) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
       this.page_params["page"] = page;

       this._router.navigate([this.url], {queryParams: this.page_params});
    }

    getPager(totalItems: number, currentPage: number = 1, pageSize: number = this.perPage) {
        // calculate total pages
        var totalPages = Math.ceil(totalItems / pageSize);

        var startPage, endPage;
        if (totalPages <= this.perPage) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = this.perPage;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        var pages = [];
        for (var i = startPage; i < endPage + 1; ++i) {
            pages.push(i);
        }
        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }


    ngOnDestroy() {
    }

    ngOnInit(){
        this.totalRecords.subscribe(total_records => {
            if(total_records && this.url && this.url.length > 0) {
                this.loadPage();
            }
        })
    }
}
