import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-container mt-4">
      <!-- Total Rides Card -->
      <div class="card stat-card">
        <div class="card-header">
          <h4>Total Rides Completed</h4>
        </div>
        <div class="card-body" *ngIf="stats; else loading">
          <p class="stat-value">{{ stats.totalRidesCompleted }}</p>
        </div>
      </div>

      <!-- Average Rating Card -->
      <div class="card stat-card">
        <div class="card-header">
          <h4>Average Rating</h4>
        </div>
        <div class="card-body" *ngIf="stats; else loading">
          <p class="stat-value">{{ stats.averageRating | number: '1.1-1' }}</p>
        </div>
      </div>

      <!-- Total Earnings Card -->
      <div class="card stat-card">
        <div class="card-header">
          <h4>Total Earnings</h4>
        </div>
        <div class="card-body" *ngIf="stats; else loading">
          <p class="stat-value">{{ stats.totalEarnings | currency }}</p>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <p>Loading stats...</p>
    </ng-template>
  `,
  styles: [
    `
      .stats-container {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        flex-wrap: wrap;
      }
      .stat-card {
        flex: 1;
        max-width: 30%;
        min-width: 250px;
        text-align: center;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .stat-card .card-header {
        background-color: #f8f9fa;
        font-weight: bold;
        padding: 10px;
        border-bottom: 1px solid #ddd;
      }
      .stat-card .card-body {
        padding: 20px;
      }
      .stat-value {
        font-size: 2rem;
        font-weight: bold;
        color: #007bff;
      }
      @media (max-width: 768px) {
        .stat-card {
          max-width: 100%;
        }
      }
    `,
  ],
})
export class DriverStatsComponent implements OnInit {
  stats: any = null;

  constructor(private http: HttpClient,
              private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.fetchDriverStats();
  }

  fetchDriverStats(): void {
    const token = sessionStorage.getItem('jwt_token');
    if (!token) {
      console.error('No token found in sessionStorage');
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http
      .get('https://localhost:7109/api/Driver/stats', { headers })
      .subscribe({
        next: (response) => {
          console.log('Driver stats fetched successfully:', response);
          this.stats = response;
          console.log('Stats object updated: ', this.stats); //Debug log
          this.cdr.detectChanges(); // Trigger change detection
        },
        error: (error) => {
          console.error('Failed to fetch driver stats:', error);
        },
      });
  }
}