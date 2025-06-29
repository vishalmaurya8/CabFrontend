import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Important for standalone components
import { DriverStatsComponent } from '../driverstats/driverstats';
import { DriverCompletedRidesComponent } from '../drivercompletedrides/drivercompletedrides';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule, DriverStatsComponent, DriverCompletedRidesComponent],
  template: `
    <div class="container text-center py-5">
      <h1 class="display-4">Welcome, Driver!</h1>
      

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
    `,
  ]
})
export class DriverDashboardComponent { }