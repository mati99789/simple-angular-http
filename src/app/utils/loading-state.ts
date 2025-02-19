import { signal } from '@angular/core';

export class LoadingState<T> {
  data = signal<T | undefined>(undefined);
  isLoading = signal<boolean>(false);
  error = signal<string>('');

  setLoading(loading: boolean) {
    this.isLoading.set(loading);
  }

  setError(error: string) {
    this.error.set(error);
    this.isLoading.set(false);
  }

  setData(data: T) {
    this.data.set(data);
    this.isLoading.set(false);
    this.error.set('');
  }
}
