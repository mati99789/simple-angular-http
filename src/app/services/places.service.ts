import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BaseApiService} from "./base-api.service";
import {Place} from "../places/place.model";
import {BehaviorSubject, catchError, map, Observable, of, Subject, tap, throwError} from "rxjs";
import { ErrorService } from "../../shared/error.service";

@Injectable({
  providedIn: 'root'
})
export class PlacesService extends BaseApiService {
  // BehaviorSubject to store and emit the current list of user places
  private userPlacesSubject = new BehaviorSubject<Place[]>([]);
  
  // Observable that components can subscribe to
  userPlaces$ = this.userPlacesSubject.asObservable();
  
  // Cache for available places
  private availablePlacesCache: Place[] = [];

  private errorService = inject(ErrorService)


  getPlaces(): Observable<Place[]> {
    return this.get<{places: Place[]}>('places').pipe(
      map((response => response.places)),
      tap(places => {
        // Cache the available places
        this.availablePlacesCache = places;
      })
    )
  }

  putPlace(id: string): Observable<Place> {
    // Find the place in the available places cache
    const placeToAdd = this.availablePlacesCache.find(place => place.id === id);
    
    if (placeToAdd) {
      // Check if the place is already in user places to prevent duplicates
      const currentUserPlaces = this.userPlacesSubject.value;
      const isAlreadyAdded = currentUserPlaces.some(place => place.id === id);
      
      if (!isAlreadyAdded) {
        // Optimistically update the UI by adding the place to the user places
        const updatedUserPlaces = [...currentUserPlaces, placeToAdd];
        this.userPlacesSubject.next(updatedUserPlaces);
      }
    }
    
    // Send the request to the server
    return this.put<{ userPlaces: Place }>('user-places', {placeId: id}).pipe(
      map((response) => response.userPlaces),
      tap(() => {
      }),
      catchError((err) => {
        // If the server request fails, revert the optimistic update
        if (placeToAdd) {
          const currentUserPlaces = this.userPlacesSubject.value;
          const updatedUserPlaces = currentUserPlaces.filter(place => place.id !== id);
          this.userPlacesSubject.next(updatedUserPlaces);
        }

        this.errorService.showError('Error adding place');

        return throwError(() => {

          new Error('Error adding place')});
      })
    )
  }

  getUserPlaces(): Observable<Place[]> {
    return this.get<{places: Place[]}>('user-places').pipe(
      map(repos => repos.places),
      tap(places => {
        // Update the BehaviorSubject with the latest user places
        this.userPlacesSubject.next(places);
      })
    )
  }
}
