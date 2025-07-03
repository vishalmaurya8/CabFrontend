import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Makes the service available application-wide
})
export class RatingService {
  private baseUrl = 'https://localhost:7109/api'; // Base URL for API calls

  constructor(private http: HttpClient) {}

  // Fetch ratings
  fetchRatings(token: string): Observable<any[]> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<any[]>(`${this.baseUrl}/Rating`, { headers });
  }
}