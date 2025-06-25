import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Important for standalone components

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container text-center py-5">
      <h1 class="display-4">Welcome, User!</h1>
      <p class="lead">This is your personalized dashboard with features for booking rides, viewing history, etc.</p>
      <!-- User-specific features would go here -->
      <a routerLink="/profile" class="btn btn-primary mt-4">View Your Profile</a>
    </div>
  `,
  styles: [`
    .container { min-height: 80vh; display: flex; flex-direction: column; justify-content: center; align-items: center; }
  `]
})
export class UserDashboardComponent { }