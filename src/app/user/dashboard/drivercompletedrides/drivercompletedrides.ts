import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver-completed-rides',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="completed-rides-container mt-4">
      <h3 class="text-center">Completed Rides</h3>
      <div *ngIf="completedRides.length > 0; else noRides">
        <table class="table table-striped mt-3">
          <thead>
            <tr>
              <th>Ride ID</th>
              <th>Pickup Location</th>
              <th>Dropoff Location</th>
              <th>Fare</th>
              
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let ride of completedRides">
              <td>{{ ride.rideId }}</td>
              <td>{{ ride.pickupLocation }}</td>
              <td>{{ ride.dropoffLocation }}</td>
              <td>{{ ride.fare }}</td>
              
            </tr>
          </tbody>
        </table>
      </div>
      <ng-template #noRides>
        <p class="text-muted text-center">No completed rides available.</p>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .completed-rides-container {
        max-width: 800px;
        margin: auto;
      }
      table {
        width: 100%;
      }
      th, td {
        text-align: center;
      }
    `,
  ],
})
export class DriverCompletedRidesComponent implements OnInit {
  completedRides: any[] = []; // Store completed rides

  constructor(private http: HttpClient,
              private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchCompletedRides();
  }

  fetchCompletedRides(): void {
    const token = sessionStorage.getItem('jwt_token');
    if (!token) {
      console.error('No token found in sessionStorage');
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http
      .get<any[]>('https://localhost:7109/api/Driver/completed-rides', { headers })
      .subscribe({
        next: (response) => {
          console.log('Completed rides fetched successfully:', response);
          this.completedRides = response;
          this.cdr.detectChanges(); // Trigger change detection
        },
        error: (error) => {
          console.error('Failed to fetch completed rides:', error);
        },
      });
  }
}