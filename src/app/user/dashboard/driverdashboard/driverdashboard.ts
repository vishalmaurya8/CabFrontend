import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Important for standalone components

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container text-center py-5">
      <h1 class="display-4">Welcome, Driver!</h1>
      <p class="lead">This is your dashboard to manage rides, view earnings, and update availability.</p>
      <!-- Driver-specific features would go here -->
      <a routerLink="/profile" class="btn btn-primary mt-4">View Your Profile</a>
    </div>
  `,
  styles: [`
    .container { min-height: 80vh; display: flex; flex-direction: column; justify-content: center; align-items: center; }
  `]
})
export class DriverDashboardComponent { }