import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RideService {
  private baseURL = 'https://localhost:7109/api';

  constructor(private http: HttpClient) {}

  bookRide(rideDetails: any, token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`${this.baseURL}/ride/book`, rideDetails, { headers });
  }

  // Fetch ride history
  fetchRideHistory(token: string): Observable<any[]> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<any[]>(`${this.baseURL}/Customer/rides`, { headers });
  }
}