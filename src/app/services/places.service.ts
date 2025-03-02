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

  putPlace(id: string): Observable<Place> {
    return this.put<{ userPlaces: Place }>('user-places', {placeId: id}).pipe(
      map((response) => response.userPlaces),
    )
  }

  getUserPlaces(): Observable<Place[]> {
    return this.get<{places: Place[]}>('user-places').pipe(
      map(repos => repos.places)
    )
  }
}
