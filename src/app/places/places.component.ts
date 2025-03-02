import { Component, input, output } from '@angular/core';

import { Place } from './place.model';

@Component({
  selector: 'app-places',
  standalone: true,
  imports: [],
  templateUrl: './places.component.html',
  styleUrl: './places.component.css',
})
export class PlacesComponent {
  places = input.required<Place[]>();
  selectPlace = output<Place>();
  onRemovePlace = output<Place>();
  addingPlaceIds = input<Set<string>>(new Set<string>());
  favoritePlaceIds = input<Set<string>>(new Set<string>());

  onSelectPlace(place: Place) {
    this.selectPlace.emit(place);
  }
  
  removePlace(place: Place) {
    this.onRemovePlace.emit(place);
  }
  
  isAddingPlace(placeId: string): boolean {
    return this.addingPlaceIds().has(placeId);
  }
  
  isInFavorites(placeId: string): boolean {
    return this.favoritePlaceIds().has(placeId);
  }
  
  isDisabled(placeId: string): boolean {
    return this.isAddingPlace(placeId) || this.isInFavorites(placeId);
  }
}
