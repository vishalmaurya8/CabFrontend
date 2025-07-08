import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Important for standalone components
import { DriverStatsComponent } from '../driverstats/driverstats';
import { DriverCompletedRidesComponent } from '../drivercompletedrides/drivercompletedrides';
import { DriverStatusService } from '../../../shared/driver-status';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule, DriverStatsComponent, DriverCompletedRidesComponent, FormsModule],
  template: `
    <div class="container text-center py-5">
      <h1 class="display-4"></h1>
      <!-- Driver Status Section -->
      <div class="status-section mt-4">
        <h3>Captain Status</h3>
        <p class="status-message">Current Status: {{ status }}</p>
        <p class="status-advice" *ngIf="status === 'OnDuty'">You are all set!</p>
        <p class="status-advice text-danger" *ngIf="status === 'Unavailable'">Change status to OnDuty to be ready.</p>
        <select
          class="form-select"
          [(ngModel)]="status"
          (change)="updateDriverStatus()"
        >
          <option value="OnDuty">OnDuty</option>
          <option value="Unavailable">Unavailable</option>
        </select>
      </div>

      <!-- Driver Stats -->
      <app-driver-stats></app-driver-stats>

      <!-- Completed Rides -->
      <app-driver-completed-rides></app-driver-completed-rides>
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
      .status-section {
        margin-top: 20px;
      }

      .status-message {
        font-size: 16px;
        margin-bottom: 10px;
      }

      .form-select {
        width: 200px;
        margin: auto;
      }
    `,
  ],
})
export class DriverDashboardComponent implements OnInit {
  status: string = ''; // Default status
  statusMessage: string = 'You are offline'; // Default message
  driverId: number = 8; // Example driver ID

  constructor(
    private driverStatusService: DriverStatusService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchDriverStatus();
  }

  // Fetch the driver's current status
  fetchDriverStatus(): void {
    const token = sessionStorage.getItem('jwt_token') || '';
    this.driverStatusService.getDriverStatus(token).subscribe({
      next: (response) => {
        this.status = response.status;
        this.cdr.detectChanges(); // Trigger change detection
      },
      error: (error) => {
        console.error('Failed to fetch driver status:', error);
        this.toastr.error('Failed to load driver status.', 'Error');
      },
    });
  }

  // Update the driver's status
  updateDriverStatus(): void {
    const token = sessionStorage.getItem('jwt_token') || '';
    const requestBody = { status: this.status };

    this.driverStatusService
      .updateDriverStatus(requestBody, token)
      .subscribe({
        next: () => {
          this.toastr.success(`Status updated to ${this.status}`, 'Success');
        },
        error: (error) => {
          console.error('Failed to update driver status:', error);
          this.toastr.error('Failed to update status.', 'Error');
        },
      });
  }
}