import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared/services/auth';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Define interfaces for profile data
interface BaseProfile {
  emailaddress: string;
  role: string;
  nameidentifier: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileImageUrl?: string;
  licenseNumber?: string;
  vehicleModel?: string;
  status?: string;
}

interface CustomerProfile extends BaseProfile {
  // Specific properties for a Customer profile (if any)
}

interface DriverProfile extends BaseProfile {
  licenseNumber?: string;
  vehicleModel?: string;
  status?: string; // e.g., 'Available', 'On Ride'
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  profile: CustomerProfile | DriverProfile | null = null; // Can hold either customer or driver profile
  isLoading: boolean = true;
  errorMessage: string | null = null;

  // Edit Profile Feature
  isEditing: boolean = false; // Toggle for edit mode
  editForm: FormGroup; // Form for editing profile

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    // Initialize the edit form
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      licenseNo: [''], // Optional for users
      vehicleDetails: [''] // Optional for users
    });
  }

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

        // Pre-fill the edit form with the fetched profile data
        if (userRole === 'user') {
          this.editForm.patchValue({
            name: this.profile.firstName,
            email: this.profile.emailaddress,
            phone: this.profile.phone
          });
        } else if (userRole === 'driver') {
          this.editForm.patchValue({
            email: this.profile.emailaddress,
            phone: this.profile.phone,
            licenseNo: (this.profile as DriverProfile).licenseNumber,
            vehicleDetails: (this.profile as DriverProfile).vehicleModel
          });
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

  // Toggle edit mode
  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
  }

  // Update profile
  updateProfile(): void {
    if (this.editForm.invalid) {
      console.log('Form is invalid:', this.editForm.value); // Debug log
      return;
    }

    const token = sessionStorage.getItem('jwt_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    // Determine the API endpoint based on the user's role
    const userRole = this.authService.userRole;
    let updateApiUrl: string = '';

    if (userRole === 'user') {
      updateApiUrl = 'https://localhost:7109/api/Customer/profile';
    } else if (userRole === 'driver') {
      updateApiUrl = 'https://localhost:7109/api/Driver/profile';
    } else {
      alert('User role not recognized. Cannot update profile.');
      return;
    }

    this.http.put(updateApiUrl, this.editForm.value, { headers }).subscribe({
      next: () => {
        alert('Profile updated successfully!');
        this.isEditing = false;
        this.fetchProfile(); // Refresh the profile data
      },
      error: (error: HttpErrorResponse) => {
        console.error('Failed to update profile:', error);
        alert('Failed to update profile. Please try again.');
      }
    });
  }
}