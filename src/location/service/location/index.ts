import { HttpRequest } from 'web-clients';
import { Client } from 'web-clients';
import { LocationRate } from '../location-rate/location-rate';
import { locationModel, LocationFilter, Location, LocationService } from './location';

export class LocationClient extends Client<Location, string, LocationFilter> implements LocationService {
    constructor(http: HttpRequest, url: string) {
        super(http, url, locationModel);
        this.searchGet = true;
        this.getLocationByType = this.getLocationByType.bind(this);
        this.rateLocation = this.rateLocation.bind(this);
    }

    getLocationByType(type: string): Promise<Location[]> {
        const url = this.serviceUrl + '/type/' + type;
        return this.http.get(url);
    }
    rateLocation(obj: LocationRate): Promise<any> {
        const url = this.serviceUrl + '/rateLocation';
        return this.http.post(url, obj);
    }
}
