import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/services/auth';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container text-center py-5">
      <h1 class="display-4">Dashboard</h1>
      <p class="lead">
        
      </p>

      <!-- Ride Booking Form -->
      <div class="card mt-4">
        <div class="card-header">
          <h3>Book a Ride</h3>
        </div>
        <div class="card-body">
          <form [formGroup]="rideForm" (ngSubmit)="bookRide()">
            <div class="mb-3">
              <label for="pickupLocation" class="form-label">Pickup Location</label>
              <input
                type="text"
                id="pickupLocation"
                class="form-control"
                formControlName="pickupLocation"
                placeholder="Enter pickup location"
                required
              />
            </div>
            <div class="mb-3">
              <label for="dropoffLocation" class="form-label">Dropoff Location</label>
              <input
                type="text"
                id="dropoffLocation"
                class="form-control"
                formControlName="dropoffLocation"
                placeholder="Enter dropoff location"
                required
              />
            </div>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="rideForm.invalid || isLoading"
            >
              <span
                *ngIf="isLoading"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              Book Ride
            </button>
          </form>
        </div>
      </div>

      <!-- Ride History Section -->
      <div class="card mt-5">
        <div class="card-header">
          <h3>Your Ride History</h3>
        </div>
        <div class="card-body" *ngIf="rideHistory.length > 0; else noHistory">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Pickup Location</th>
                <th>Dropoff Location</th>
                <th>Fare</th>
                <th>Rating</th>
                <th>Timing</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let ride of rideHistory">
                <td>{{ ride.pickupLocation }}</td>
                <td>{{ ride.dropoffLocation }}</td>
                <td>{{ ride.fare | currency }}</td>
                <td>{{ ride.rating || 'N/A' }}</td>
                <td>{{ ride.timing | date: 'short' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ng-template #noHistory>
          <p class="text-muted">You have no ride history yet.</p>
        </ng-template>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        min-height: 80vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .card {
        width: 100%;
        max-width: 800px;
        margin: auto;
      }
      table {
        width: 100%;
      }
    `,
  ],
})
export class UserDashboardComponent implements OnInit {
  rideForm: FormGroup;
  userName: string | null = null; // Store the user's name
  isLoading: boolean = false;
  rideHistory: any[] = []; // Store the user's ride history

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.rideForm = this.fb.group({
      pickupLocation: ['', Validators.required],
      dropoffLocation: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userName = this.authService.getUserName(); // Fetch the user's name
    this.fetchRideHistory(); // Fetch the user's ride history
  }

  bookRide(): void {
    if (this.rideForm.valid) {
      this.isLoading = true;
      const token = sessionStorage.getItem('jwt_token');
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

      const rideDetails = {
        ...this.rideForm.value,
        driverId: 8, // Automatically assign driverId as 8
      };

      this.http
        .post('https://localhost:7109/api/Ride/book', rideDetails, { headers })
        .subscribe({
          next: (response) => {
            console.log('Ride booked successfully:', response);
            this.toastr.success('Ride booked successfully!', 'Success');
            this.rideForm.reset();
            this.isLoading = false;
            this.fetchRideHistory(); // Refresh ride history after booking
            // Navigate to RideDetailsComponent with ride details
            this.router.navigate(['/ride-details'], { state: { data: response } });
          },
          error: (error) => {
            console.error('Failed to book ride:', error);
            if (error.error && error.error.message) {
              this.toastr.error(error.error.message, 'Error');
            } else {
              this.toastr.error('Failed to book ride. Please try again.', 'Error');
            }
            this.isLoading = false;
          },
        });
    }
  }

  fetchRideHistory(): void {
    const token = sessionStorage.getItem('jwt_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http
      .get<any[]>('https://localhost:7109/api/Customer/rides', { headers })
      .subscribe({
        next: (rides) => {
          this.fetchRatings(rides); // Fetch ratings and merge with rides
        },
        error: (error) => {
          console.error('Failed to fetch ride history:', error);
          this.toastr.error('Failed to load ride history.', 'Error');
        },
      });
  }

  fetchRatings(rides: any[]): void {
    const token = sessionStorage.getItem('jwt_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  
    this.http
      .get<any[]>('https://localhost:7109/api/Rating', { headers })
      .subscribe({
        next: (ratings) => {
          console.log('Fetched Rides:', rides);
          console.log('Fetched Ratings:', ratings);
  
          // Merge ratings with rides based on rideId
          this.rideHistory = rides.map((ride) => {
            const rating = ratings.find((r) => r.rideId === ride.rideId);
            return { ...ride, rating: rating ? rating.score : 'N/A' }; // Use 'score' for the rating
          });
  
          console.log('Merged Ride History:', this.rideHistory);
        },
        error: (error) => {
          console.error('Failed to fetch ratings:', error);
          this.toastr.error('Failed to load ratings.', 'Error');
        },
      });
  }
}