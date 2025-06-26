import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared/services/auth';
// import { AuthService } from '../services/auth.service';

// Define interfaces for profile data
interface BaseProfile {
  emailaddress: string;
  role: string;
  nameidentifier: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  // memberSince?: string;
  profileImageUrl?: string;
  licenseNumber?: string;
  vehicleModel?: string;
  status?: string;
}

// You can keep these if your backend DTOs return distinct fields,
// but they are not directly used in the display logic if only BaseProfile fields are shown.
interface CustomerProfile extends BaseProfile {
  // Specific properties for a Customer profile (if any, not displayed now)
  // preferredPaymentMethod?: string;
}

interface DriverProfile extends BaseProfile {
  // Specific properties for a Driver profile (if any, will be displayed conditionally)
  licenseNumber?: string;
  vehicleModel?: string;
  status?: string; // e.g., 'Available', 'On Ride'
  // averageRating?: number;
  // earningsToday?: number; // Not part of profile details display
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  profile: CustomerProfile | DriverProfile | null = null; // Can hold either customer or driver profile
  // Removed: bookedRides and ratingsGiven properties
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile(): void {
    this.isLoading = true;
    this.errorMessage = null;
  
    if (!this.authService.isLoggedIn) {
      this.errorMessage = 'You are not authenticated. Please log in.';
      this.isLoading = false;
      this.router.navigate(['/login']);
      return;
    }
  
    const token = sessionStorage.getItem('jwt_token');
    if (!token) {
      this.errorMessage = 'Authentication token not found. Please log in again.';
      this.isLoading = false;
      this.router.navigate(['/login']);
      return;
    }
  
    const userRole = this.authService.userRole;
    let profileApiUrl: string = '';
  
    if (userRole === 'user') {
      profileApiUrl = 'https://localhost:7109/api/Customer/me';
    } else if (userRole === 'driver') {
      profileApiUrl = 'https://localhost:7109/api/Driver/me';
    } else {
      this.errorMessage = 'User role not recognized. Cannot fetch profile.';
      this.isLoading = false;
      this.authService.logout();
      return;
    }
  
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  
    this.http.get<any>(profileApiUrl, { headers }).subscribe({
      next: (data) => {
        // Assign common fields
        this.profile = {
          emailaddress: data.email || 'N/A',
          role: userRole,
          nameidentifier: data.nameidentifier || 'N/A',
          firstName: data.name || 'N/A',
          lastName: data.lastName || 'N/A',
          phone: data.phone || 'N/A',
          profileImageUrl: data.profileImageUrl || ('https://placehold.co/150x150/CCE2FF/000000?text=' + (data.firstName ? data.firstName.charAt(0) : (userRole === 'user' ? 'U' : 'D')))
        };
  
        // Assign driver-specific fields if the role is 'driver'
        if (userRole === 'driver') {
          const driverProfile = this.profile as DriverProfile; // Explicitly cast to DriverProfile
          driverProfile.licenseNumber = data.licenseNo || 'N/A';
          driverProfile.vehicleModel = data.vehicleDetails || 'N/A';
          driverProfile.status = data.status || 'N/A';
        }
  
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Failed to fetch profile:', error);
        this.isLoading = false;
        if (error.status === 401 || error.status === 403) {
          this.errorMessage = 'Authentication failed. Please log in again.';
          this.authService.logout();
        } else if (error.status === 404) {
          this.errorMessage = 'Profile not found. The API returned 404.';
        } else {
          this.errorMessage = `An error occurred: ${error.message || error.statusText}`;
        }
      }
    });
  }

  // Removed: getStarArray, getEmptyStarArray, hasHalfStar, getMockBookedRides, getMockRatingsGiven
}
