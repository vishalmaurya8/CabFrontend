import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-5">
      <h1 class="text-center">Payment History</h1>
      <div *ngIf="payments.length > 0; else noPayments">
        <table class="table table-striped mt-4">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Ride ID</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Pickup Location</th>
              <th>Dropoff Location</th>
              <th>Driver Name</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let payment of payments">
              <td>{{ payment.paymentId }}</td>
              <td>{{ payment.rideId }}</td>
              <td>{{ payment.amount }}</td>
              <td>{{ payment.method }}</td>
              <td>{{ payment.status }}</td>
              <td>{{ payment.timestamp | date: 'short' }}</td>
              <td>{{ payment.pickupLocation || 'N/A' }}</td>
              <td>{{ payment.dropoffLocation || 'N/A' }}</td>
              <td>{{ payment.driverName || 'N/A' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <ng-template #noPayments>
        <p class="text-muted text-center">You have no payment history yet.</p>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 800px;
        margin: auto;
      }
    `,
  ],
})
export class PaymentHistoryComponent implements OnInit {
  payments: any[] = []; // Store payment details

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log('PaymentHistoryComponent initialized');
    this.fetchPayments();
  }

  fetchPayments(): void {
    const token = sessionStorage.getItem('jwt_token');
    console.log('Token:', token); // Debug log

    if (!token) {
      console.error('No token found in sessionStorage');
      return;
    }
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http
      .get<any[]>('https://localhost:7109/api/Payment/my-payments', { headers })
      .subscribe({
        next: (response) => {
          console.log('Payment history fetched successfully:', response);
          this.payments = response;
          this.cdr.detectChanges(); // Trigger change detection
        },
        error: (error) => {
          console.error('Failed to fetch payment history:', error);
        },
      });
  }
}