import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';

import {Place} from '../place.model';
import {PlacesComponent} from '../places.component';
import {PlacesContainerComponent} from '../places-container/places-container.component';
import {NgIf} from "@angular/common";
import {LoadingState} from "../../utils/loading-state";
import {PlacesService} from "../../services/places.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent, NgIf],
})
export class AvailablePlacesComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private placesService = inject(PlacesService)

  state = new LoadingState<Place[]>();
  // Track places that are being added to favorites
  addingPlaceIds = signal<Set<string>>(new Set<string>());
  // Track places that are already in favorites
  favoritePlaceIds = signal<Set<string>>(new Set<string>());

  ngOnInit() {
    this.state.isLoading.set(true);
    
    // Subscribe to user places to know which places are already in favorites
    this.placesService.userPlaces$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(userPlaces => {
      const favoriteIds = new Set(userPlaces.map(place => place.id));
      this.favoritePlaceIds.set(favoriteIds);
    });
    
    // Load available places
    this.placesService.getPlaces().pipe(
      takeUntilDestroyed(this.destroyRef),
    )
      .subscribe({
        next: places => {
          this.state.data.set(places)
        },
        error: (error: Error) => {
          this.state.error.set(error.message);
          this.state.isLoading.set(false);
        },
        complete: () => {
          this.state.isLoading.set(false);
        }
      });
  }

  hasPlaces(): boolean {
    return this.state.data() !== undefined && this.state.data()!.length > 0;
  }

  onSelectPlace(place: Place) {
    // Check if the place is already in favorites
    if (this.isInFavorites(place.id)) {
      console.log('Place already in favorites:', place.title);
      return;
    }
    
    // Add the place ID to the set of places being added
    const updatedAddingIds = new Set(this.addingPlaceIds());
    updatedAddingIds.add(place.id);
    this.addingPlaceIds.set(updatedAddingIds);
    
    // Call the service to add the place (optimistic update already happens in the service)
    this.placesService.putPlace(place.id).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (updatedPlace) => {
        console.log('Place added to favorites:', updatedPlace);
      },
      complete: () => {
        // Remove the place ID from the set of places being added
        const updatedAddingIds = new Set(this.addingPlaceIds());
        updatedAddingIds.delete(place.id);
        this.addingPlaceIds.set(updatedAddingIds);
      },
      error: (error: Error) => {
        // Remove the place ID from the set of places being added
        const updatedAddingIds = new Set(this.addingPlaceIds());
        updatedAddingIds.delete(place.id);
        this.addingPlaceIds.set(updatedAddingIds);
        
        this.state.error.set(error.message);
      }
    })
  }

  // Helper method to check if a place is currently being added
  isAddingPlace(placeId: string): boolean {
    return this.addingPlaceIds().has(placeId);
  }
  
  // Helper method to check if a place is already in favorites
  isInFavorites(placeId: string): boolean {
    return this.favoritePlaceIds().has(placeId);
  }
}
