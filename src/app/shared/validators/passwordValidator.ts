import {FormBuilder, FormGroup, FormControl,Validators} from '@angular/forms';




export class PasswordValidator {




    static passwordConfirm(group: FormGroup) {


        var newPassword =   group.root["_value"]['password'];
        var newPassword2 =  group["_value"];

        // //If fail
        if(newPassword != newPassword2)
        {

            return {passwordConfirm: true};
        }

        //If Success
        return null;
    }

    static passwordMissmatch(group: FormGroup) {


        var newPassword =   group.root["_value"]['new_password'];
        var newPassword2 =  group["_value"];


        // //If fail
        if(newPassword != newPassword2)
        {

            return {passwordMissmatch: true};
        }

        //If Success
        return null;
    }


    static complexPass(control)
    {
        const  minlength = 4;
        if(control.value.length != 0 && control.value.length < minlength)
        {
            // If fail
            return {complexPass:{minlength:minlength}};
        }


        // If pass
        return null;

    }


}
