import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {catchError, map, Observable, pipe, throwError} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  private baseURL = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  protected get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseURL}/${endpoint}`, {
      observe: 'response'
    }).pipe(
      map(response => {
        return response.body as T;
      }),
      catchError(this.handleError)
    );
  }

  protected post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseURL}/${endpoint}`, data)
      .pipe(catchError(this.handleError));
  }

  protected put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseURL}/${endpoint}`, data)
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => new Error('An error occurred'));
  }
}
