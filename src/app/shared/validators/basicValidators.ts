import {FormControl, FormGroup} from '@angular/forms';
import {Injectable, Inject} from '@angular/core';

import { DOCUMENT } from '@angular/platform-browser';
var moment = require('moment');
declare var  moment;
declare var jQuery:any;

@Injectable()
export class BasicValidators{
    public doc;
    constructor(@Inject(DOCUMENT) public document: any) {
        this.doc = document;
    }

    static email(control: FormControl){
        var regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var valid = regEx.test(control.value);
        return valid ? null : { email: true };
    }


    static phoneNo(control: FormControl){


        // Bypass if empty
        if (control.value == '')
            return null;

        // var regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{1,8}$/;
        var regex = /^\+(?:[0-9] ?){6,14}$/;

        let valid = regex.test(control.value);

        return (valid) ? null : { phoneNo: true };

    }



    static url(control: FormControl){

        // const  minlength = 0;
        // if(control.value && control.value.length > minlength) {
        //     var regEx = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        //     var valid = regEx.test(control.value);

        //     return valid ? null : {url: true};
        // }
        // If pass
        return null;
    }

}

export class TypeValidators{
    static numeric(control: FormControl){
        // Bypass if empty
        if (control.value == '')
            return null;
        return (!isNaN(control.value)) ? null : { numeric: true };
    }


    static nonNumeric(control: FormControl){
        // Bypass if empty
        if (control.value == '')
            return null;

        var regex = /^[a-zA-Z ]{2,30}$/;

        return (regex.test(control.value)) ? null : { nonNumeric: true };
    }

    static array(control: FormControl){
        return (control.value["length"] && control.value["length"] > 0) ? null : { array: true };
    }

    static numeric_one_decimal(control: FormControl) {
        // Bypass if empty
        if (control.value == '')
            return null;


        var regEx = /^\d+\.?\d?$/;
        var valid = regEx.test(control.value);
        return (valid && !isNaN(control.value)) ? null : {numeric_one_decimal: true};

    }

    static numeric_no_decimal(control: FormControl) {
        // Bypass if empty
        if (control.value == '')
            return null;

        var regEx = /^\d{1,10}$/;
        var valid = regEx.test(control.value);
        return (valid && !isNaN(control.value)) ? null : {numeric_no_decimal: true};

    }
}

export class ExpLessThanValidator {

    static explessThan(group:FormGroup){

        let numberOne = group.root["_value"]["experience_from"];
        let selectedNumber = group["_value"];

        //Fails
        if(selectedNumber <= numberOne) {
            return {explessThan:true}
        }

        //Success
        return null;
    }
}

export class LessThanValidator {

    static lessThan(group:FormGroup){

        let numberOne = group.root["_value"]["from"];
        let selectedNumber = group["_value"];

        //Fails
        if(selectedNumber < numberOne) {
            return {lessThan:true}
        }

        //Success
        return null;

    }
}

export class DateValidator {

    static validDate(control:FormControl)
    {
        const  minlength = 0;
        if(control.value && control.value.length > minlength)
        {

            var timestamp=Date.parse(control.value)
            if (isNaN(timestamp)==true)
            {
                // If fail
                return {validDate:{datetype:null}};
            }
        }

        // If pass
        return null;

    }


    static validDateRange(group: FormGroup)
    {
        const  minlength = 0;

        if(group["_value"] && group.root["_value"]["start_date"]){

            if(!moment(Date.parse(group["_value"])).isAfter(Date.parse(group.root["_value"]["start_date"])))
            {

                return {validDateRange:true};
            }
            else {
                // If pass
                return null;
            }

        }
        else{
            // If pass
            return null;
        }




    }

    static validDateGrtEqlToday(control:FormControl){

        if(control.value)
        {

            if(!moment(Date.parse(control.value)).isAfter( moment(new Date()).subtract(1,'d')))
            {
                return {validDateGrtEqlToday:true};
            }
        }

        // If pass
        return null;
    }

}
