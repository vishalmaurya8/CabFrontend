import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/services/auth';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="container text-center py-5" style="background-image: url('https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_896,w_1344/v1712926828/assets/a3/cf8564-e2a6-418c-b9b0-65dd285c100b/original/3-2-ridesharing-new.jpg'); background-size: cover; background-repeat: no-repeat;">
      <h1 class="display-4">Go anywhere with TapRide...</h1>
      <p class="lead"></p>

      <!-- Ride Booking Form -->
      <div class="card mt-4">
        <div class="card-header">
          <h3>Book a Ride</h3>
        </div>
        <div class="card-body">
          <form [formGroup]="rideForm" (ngSubmit)="bookRide()">
            <div class="mb-3">
              <label for="pickupLocation" class="form-label"
                >Pickup Location</label
              >
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
              <label for="dropoffLocation" class="form-label"
                >Dropoff Location</label
              >
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

                <th>Rating</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let ride of rideHistory.slice(0, ridesToShow)">
                <td>{{ ride.pickupLocation }}</td>
                <td>{{ ride.dropoffLocation }}</td>

                <td>
                  <!-- Show stars if the ride is rated -->
                  <ng-container *ngIf="ride.rating !== 'N/A'; else rateButton">
                    <span
                      *ngFor="let star of [].constructor(ride.rating)"
                      class="star"
                      >★</span
                    >
                  </ng-container>

                  <!-- Show "Rate Ride" button if the ride is not rated -->
                  <ng-template #rateButton>
                    <button
                      class="btn btn-primary btn-sm"
                      (click)="openRatingModal(ride)"
                    >
                      Rate Ride
                    </button>
                  </ng-template>
                </td>
                <td>{{ ride.comments || 'N/A' }}</td>
              </tr>
            </tbody>
          </table>
          <div
            class="text-center mt-3"
            *ngIf="ridesToShow < rideHistory.length"
          >
            <button class="btn btn-secondary" (click)="loadMore()">
              Load More
            </button>
          </div>
        </div>
        <ng-template #noHistory>
          <p class="text-muted">You have no ride history yet.</p>
        </ng-template>
      </div>

      <!-- Add the button to view payment history -->
      <div class="mt-4 text-center">
        <button class="btn btn-secondary" (click)="viewPaymentHistory()">
          View Payment History
        </button>
      </div>
    </div>

    <!-- Rating Modal -->
    <div class="modal" tabindex="-1" *ngIf="showRatingModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Rate Ride</h5>
            <button
              type="button"
              class="btn-close"
              (click)="closeRatingModal()"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              Rate your ride from {{ selectedRide?.pickupLocation }} to
              {{ selectedRide?.dropoffLocation }}:
            </p>
            <div>
              <span
                *ngFor="let star of [1, 2, 3, 4, 5]"
                class="star"
                [class.selected]="star <= currentRating"
                (click)="setRating(star)"
              >
                ★
              </span>
            </div>
            <div class="mt-3">
              <label for="comments" class="form-label">Comments</label>
              <textarea
                id="comments"
                class="form-control"
                [(ngModel)]="comments"
                placeholder="Enter your comments"
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              (click)="closeRatingModal()"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-primary"
              (click)="submitRating()"
            >
              Submit
            </button>
          </div>
        </div>
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
        opacity: 0.9;
        border-radius: 20px;
      }

      .display-4{
        font-weight: 500;
      }

      .card {
        width: 100%;
        max-width: 800px;
        margin: auto;
      }
      table {
        width: 100%;
      }
      .star {
        color: gold;
        font-size: 1.5rem;
        cursor: pointer;
        margin-right: 5px;
      }
      .star.selected {
        color: orange;
      }
      .modal {
        display: block;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1050;
        background-color: rgba(0, 0, 0, 0.5);
      }
      .modal-dialog {
        background: white;
        border-radius: 8px;
        padding: 20px;
      }
    `,
  ],
})
export class UserDashboardComponent implements OnInit {
  rideForm: FormGroup;
  userName: string | null = null; // Store the user's name
  isLoading: boolean = false;
  rideHistory: any[] = []; // Store the user's ride history
  showRatingModal: boolean = false; // To toggle the rating modal
  selectedRide: any = null; // Store the selected ride for rating
  currentRating: number = 0; // Store the current rating
  ridesToShow: number = 5; // Number of rides to show initially

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.rideForm = this.fb.group({
      pickupLocation: ['', Validators.required],
      dropoffLocation: ['', Validators.required],
    });
  }

  // Method to navigate to the Payment History page
  viewPaymentHistory(): void {
    console.log('Navigating to Payment History');
    this.router.navigate(['/payment-history']);
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
            this.router.navigate(['/ride-details'], {
              state: { data: response },
            });
          },
          error: (error) => {
            console.error('Failed to book ride:', error);
            if (error.error && error.error.message) {
              this.toastr.error(error.error.message, 'Error');
            } else {
              this.toastr.error(
                'Failed to book ride. Please try again.',
                'Error'
              );
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
          this.cdr.detectChanges(); // Ensure the view updates
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
            return {
              ...ride,
              rating: rating ? rating.score : 'N/A',
              comments: rating ? rating.comments : null,
            }; // Use 'score' for the rating
          });
          this.cdr.detectChanges(); // Trigger change detection

          console.log('Merged Ride History:', this.rideHistory);
        },
        error: (error) => {
          console.error('Failed to fetch ratings:', error);
          this.toastr.error('Failed to load ratings.', 'Error');
        },
      });
  }

  loadMore(): void {
    this.ridesToShow += 5; // Increase the number of rides to show
    console.log('Loading more rides, total now:', this.ridesToShow);
    this.cdr.detectChanges(); // Ensure the view updates
  }

  openRatingModal(ride: any): void {
    this.selectedRide = ride;
    this.currentRating = 0; // Reset the rating
    this.showRatingModal = true;
  }

  closeRatingModal(): void {
    this.showRatingModal = false;
    this.selectedRide = null;
  }

  setRating(rating: number): void {
    this.currentRating = rating;
  }

  comments: string = ''; // Store user comments

  submitRating(): void {
    if (!this.selectedRide || this.currentRating === 0) {
      this.toastr.error('Please select a rating before submitting.', 'Error');
      return;
    }

    const token = sessionStorage.getItem('jwt_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const requestBody = {
      rideId: this.selectedRide.rideId,
      score: this.currentRating,
      comments: this.comments || 'No comments provided', // Use user input or a default value
    };

    console.log('Request Body:', requestBody); // Debug log

    this.http
      .post('https://localhost:7109/api/Rating', requestBody, { headers })
      .subscribe({
        next: () => {
          this.toastr.success('Rating submitted successfully!', 'Success');
          this.selectedRide.rating = this.currentRating; // Update the rating locally
          this.selectedRide.comments = this.comments; // Update the comments locally
          this.closeRatingModal();
          this.cdr.detectChanges(); // Ensure the view updates
        },
        error: (error) => {
          console.error('Failed to submit rating:', error);
          if (error.error && error.error.errors) {
            console.error('Validation Errors:', error.error.errors); // Log validation errors
          }
          this.toastr.error(
            'Failed to submit rating. Please try again.',
            'Error'
          );
        },
      });
  }
}
