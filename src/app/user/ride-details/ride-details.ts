import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-ride-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-5">
      <h1 class="text-center">Ride Details</h1>
      <div class="card mt-4">
        <div class="card-body">
          <p>
            <strong>Pickup Location:</strong> {{ rideDetails?.pickupLocation }}
          </p>
          <p>
            <strong>Dropoff Location:</strong>
            {{ rideDetails?.dropoffLocation }}
          </p>
          <p><strong>Fare:</strong> {{ rideDetails?.fare | currency }}</p>
          <p><strong>Driver ID:</strong> {{ rideDetails?.driverId }}</p>
          <div class="mb-3">
            <label for="paymentMethod" class="form-label">Payment Method</label>
            <select
              id="paymentMethod"
              class="form-select"
              [(ngModel)]="paymentMethod"
            >
              <option value="Card">Card</option>
              <option value="Cash">Cash</option>
              <option value="Cash">UPI</option>
            </select>
          </div>
          <button class="btn btn-success" (click)="makePayment()">
            Make Payment
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 600px;
        margin: auto;
      }
    `,
  ],
})
export class RideDetailsComponent implements OnInit {
  rideDetails: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Retrieve ride details from route parameters
    this.rideDetails = history.state.data;
    if (!this.rideDetails) {
      this.toastr.error('No ride details found.', 'Error');
      this.router.navigate(['/dashboard']); // Redirect to dashboard if no details
    }
  }

  paymentMethod: string = 'Select method'; // Default payment method

makePayment(): void {
  if (!this.rideDetails?.rideId) {
    this.toastr.error('Invalid ride details. Cannot proceed with payment.', 'Error');
    return;
  }

  const token = sessionStorage.getItem('jwt_token');
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  const requestBody = {
    rideId: this.rideDetails.rideId,
    method: this.paymentMethod // Use the selected payment method
  };

  console.log('Request Body:', requestBody); // Debug log

  this.http
    .post('https://localhost:7109/api/Payment', requestBody, { headers })
    .subscribe({
      next: (response: any) => {
        console.log('Payment Response:', response); // Debug log
        this.toastr.success('Payment successful!', 'Success');
        this.router.navigate(['/dashboard']); // Redirect to dashboard after payment
      },
      error: (error) => {
        console.error('Payment failed:', error);
        if (error.error && error.error.errors) {
          console.error('Validation Errors:', error.error.errors); // Log validation errors
        }
        this.toastr.error('Payment failed. Please try again.', 'Error');
      },
    });
  }
}