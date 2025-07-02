import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private baseUrl = 'https://localhost:7109/api/Ride/locations'; // Backend API base URL

  constructor(private http: HttpClient) {}

  // Fetch locations from the backend
  getLocations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/locations`);
  }
}