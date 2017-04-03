import {City} from '../../../shared/models/City';
import {Country} from '../../../shared/models/Country';


export class JobSeekerAddress {
    address_line1: string;
    address_line2: string;
    postal_code: string;
    city_id: number;
    city_name: string;
    city:City;
    country:Country;
    country_code: string;
    country_name: string;
 
}



