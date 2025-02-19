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


  ngOnInit() {
    this.state.isLoading.set(true)
    this.placesService.getPlaces().pipe(
      takeUntilDestroyed(this.destroyRef),
    )
      .subscribe({
        next: places => {
          this.state.data.set(places)
        },        error: (error: Error) => {
          this.state.error.set(error.message);
          this.state.isLoading.set(false);
        },
        complete: () => {
          this.state.isLoading.set(false);
        }
      })
  }

  hasPlaces(): boolean {
    return this.state.data() !== undefined && this.state.data()!.length > 0;
  }

}
