import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver-completed-rides',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card mt-4">
        <div class="card-header">
            <h3>Completed Rides</h3>
        </div>
        <div class="card-body">
            <!-- This container will be shown only if there are completed rides -->
            <div *ngIf="completedRides.length > 0; else noRides">
                <!-- Responsive table wrapper for smaller screens -->
                <div class="table-responsive">
                    <!-- Standard Bootstrap striped table -->
                    <table class="table table-bordered table-hover">
                        <thead class="thead-dark">
                            <tr>
                                <th>Ride ID</th>
                                <th>Pickup Location</th>
                                <th>Dropoff Location</th>
                                <th class="text-end">Fare</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Angular's *ngFor iterates through the paginated rides -->
                            <tr *ngFor="let ride of getPaginatedRides()">
                                <td>{{ ride.rideId }}</td>
                                <td>{{ ride.pickupLocation }}</td>
                                <td>{{ ride.dropoffLocation }}</td>
                                <td class="text-end">{{ ride.fare }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination controls are now in the card-footer for better structure -->
                <div class="d-flex justify-content-end mt-3">
                    <button
                        class="btn btn-secondary me-2"
                        [disabled]="currentPage === 1"
                        (click)="previousPage()"
                    >
                        &larr; Previous
                    </button>
                    <button
                        class="btn btn-secondary"
                        [disabled]="currentPage === getTotalPages()"
                        (click)="nextPage()"
                    >
                        Next &rarr;
                    </button>
                </div>
            </div>

            <!-- This ng-template will be displayed when there are no rides -->
            <ng-template #noRides>
                <p class="text-muted text-center">No completed rides available.</p>
            </ng-template>
        </div>
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