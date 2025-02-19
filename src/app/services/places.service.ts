import {Injectable} from "@angular/core";
import {BaseApiService} from "./base-api.service";
import {Place} from "../places/place.model";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlacesService extends BaseApiService {

  getPlaces(): Observable<Place[]> {
    return this.get<{places: Place[]}>('places').pipe(
      map((response => response.places))
    )
  }
}
