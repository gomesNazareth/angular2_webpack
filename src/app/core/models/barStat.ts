export class BarStat {

    public  id: number;
    public  shortDesc: string;
    public  longDesc: string;
    public  pollVal: number;

    constructor(shortDesc1,longDesc1,pollVal1)
    {
        this.shortDesc = shortDesc1;
        this.longDesc = longDesc1;
        this.pollVal = pollVal1;
    }
}