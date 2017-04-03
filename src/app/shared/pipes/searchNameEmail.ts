import {Pipe, PipeTransform} from "@angular/core";
import {Observable} from "rxjs/Rx";

@Pipe({
	name: "filterEmail",
    pure: false
})

export class SearchNameEmail implements PipeTransform {
	transform(items: any[], args: string): any {
		if(!args) {
			args = "";
		}

        // filter items array, items which match and return true will be kept, false will be filtered out
        return items.filter(item => {
        	if(item.email){
        		if(item.email.indexOf(args) !== -1 || (item.name && item.name.indexOf(args) !== -1)) {
        			return item;
        		}
        	}else if (item.screen_name){
        		if(item.screen_name.indexOf(args) !== -1 || (item.name && item.name.indexOf(args) !== -1)) {
        			return item;
        		}
        	}
        });
    }
}