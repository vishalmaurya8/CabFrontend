import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  profile: any = null; // Holds user or driver profile data
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile(): void {
    const token = sessionStorage.getItem('jwt_token');
    if (!token) {
      this.errorMessage = 'You are not authenticated. Please log in.';
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any>('https://localhost:7109/api/Customer/me', { headers }).subscribe({
      next: (data) => {
        this.profile = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to fetch profile:', error);
        this.errorMessage = 'Failed to load profile. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}