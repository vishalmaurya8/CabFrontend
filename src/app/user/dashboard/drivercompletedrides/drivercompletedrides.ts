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
            <tr *ngFor="let ride of getPaginatedRides()">
              <td>{{ ride.rideId }}</td>
              <td>{{ ride.pickupLocation }}</td>
              <td>{{ ride.dropoffLocation }}</td>
              <td>{{ ride.fare }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" class="text-end">
                <button
                  class="btn btn-secondary me-2"
                  [disabled]="currentPage === 1"
                  (click)="previousPage()"
                >
                  ← Previous
                </button>
                <button
                  class="btn btn-secondary"
                  [disabled]="currentPage === getTotalPages()"
                  (click)="nextPage()"
                >
                  Next →
                </button>
              </td>
            </tr>
          </tfoot>
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
      tfoot td {
        text-align: right;
      }
      .pagination-controls button {
        margin: 0 5px;
      }
    `,
  ],
})
export class DriverCompletedRidesComponent implements OnInit {
  completedRides: any[] = []; // Store completed rides
  currentPage: number = 1; // Current page number
  itemsPerPage: number = 7; // Number of rides to show per page

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

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

  // Calculate the rides to display based on the current page
  getPaginatedRides(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.completedRides.slice(startIndex, endIndex);
  }

  // Navigate to the previous page
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cdr.detectChanges(); // Ensure the view updates
    }
  }

  // Navigate to the next page
  nextPage(): void {
    const totalPages = Math.ceil(this.completedRides.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.cdr.detectChanges(); // Ensure the view updates
    }
  }

  // Get the total number of pages
  getTotalPages(): number {
    return Math.ceil(this.completedRides.length / this.itemsPerPage);
  }
}