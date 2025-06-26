import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container text-center py-5">
      <h1 class="display-4">Welcome, User!</h1>
      <p class="lead">
        This is your personalized dashboard with features for booking rides,
        viewing history, etc.
      </p>

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
            <div class="mb-3">
              <label for="driverId" class="form-label">Driver ID</label>
              <input
                type="number"
                id="driverId"
                class="form-control"
                formControlName="driverId"
                placeholder="Enter driver ID"
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
        max-width: 500px;
        margin: auto;
      }
    `,
  ],
})
export class UserDashboardComponent {
  rideForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.rideForm = this.fb.group({
      pickupLocation: ['', Validators.required],
      dropoffLocation: ['', Validators.required],
      driverId: ['', [Validators.required, Validators.min(1)]],
    });
  }

  isLoading: boolean = false;

  bookRide(): void {
    if (this.rideForm.valid) {
      this.isLoading = true;
      const token = sessionStorage.getItem('jwt_token');
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  
      this.http
        .post('https://localhost:7109/api/Ride/book', this.rideForm.value, { headers })
        .subscribe({
          next: (response) => {
            console.log('Ride booked successfully:', response);
            this.toastr.success('Ride booked successfully!', 'Success');
            this.rideForm.reset();
            this.isLoading = false;
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
}