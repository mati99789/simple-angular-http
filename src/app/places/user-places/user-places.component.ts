import {Component, DestroyRef, ElementRef, inject, OnInit} from '@angular/core';

import {PlacesContainerComponent} from '../places-container/places-container.component';
import {PlacesComponent} from '../places.component';
import {PlacesService} from "../../services/places.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {LoadingState} from "../../utils/loading-state";
import {Place} from "../place.model";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent, NgIf],
})
export class UserPlacesComponent implements OnInit {
  state = new LoadingState<Place[]>();

  private placeService = inject(PlacesService)
  private destroyRef = inject(DestroyRef)


  ngOnInit() {
    // Initial loading state
    this.state.isLoading.set(true);
    
    // Subscribe to the userPlaces$ observable for real-time updates
    this.placeService.userPlaces$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(places => {
      this.state.data.set(places);
      this.state.isLoading.set(false);
    });
    
    // Fetch initial user places from the server
    this.loadUserPlaces();
  }

  private loadUserPlaces() {
    this.placeService.getUserPlaces().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      error: (error: Error) => {
        this.state.error.set(error.message);
        this.state.isLoading.set(false);
      }
    });
  }

  hasPlaces(): boolean {
    return this.state.data() !== undefined && this.state.data()!.length > 0;
  }

  onRemovePlace(place: Place) {
    
    this.placeService.deletePlace(place.id).subscribe(places => {
      error: (error: Error) => {
        this.state.error.set(error.message);
        this.state.isLoading.set(false);
      }
  }) }
}
