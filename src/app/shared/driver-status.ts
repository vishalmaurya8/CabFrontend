import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DriverStatusService {
  private baseUrl = 'https://localhost:7109/api/Driver'; // Base URL for API calls

  constructor(private http: HttpClient) {}

  // Fetch the current status of the driver
  getDriverStatus(token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${this.baseUrl}/me`, { headers });
  }

  // Update the status of the driver
  updateDriverStatus(requestBody: { status: string }, token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put(`${this.baseUrl}/status`, requestBody, { headers });
  }
}