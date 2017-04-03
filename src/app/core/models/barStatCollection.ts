import {BarStat} from '../models/barStat';

export class BarStatCollection {

    public previousPollList: BarStat[];
    public pollDate: Date;
    public pollDesc: string
    constructor(previousPollList,pollDate,pollDesc){
        this.previousPollList = previousPollList;
        this.pollDate = pollDate;
        this.pollDesc = pollDesc;

    }
}