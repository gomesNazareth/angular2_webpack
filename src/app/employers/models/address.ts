import {City} from '../../shared/models/City';
import {Country} from '../../shared/models/Country';

export class  Address{
    addressLine1:string
    addressLine2:string
    city:City = new City();
    country:Country = new Country();
}