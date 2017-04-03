import {PollOption} from '../poll/poll_option';


export class Poll {

    public question:string;
    public pollOption: PollOption[];
    public pollDate: Date;
    public postsuccessFlag:boolean =  null;
    public errorFlag:boolean = null;
    public errorMessageServer:string = null;
    public status;
    public postValue= null;
    public multiple_selection:boolean = false;
    public id;
    

    constructor(question,pollOption,pollDate,pollstatus?,pollid?,multiple_selection = false){

        this.question = question;
        this.multiple_selection = multiple_selection;
        this.pollOption= pollOption;
        this.pollDate= pollDate;
        this.status= pollstatus;
        this.id= pollid;
    }


}