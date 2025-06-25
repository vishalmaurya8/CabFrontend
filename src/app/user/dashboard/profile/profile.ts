import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // For *ngIf, *ngFor, etc.
import { HttpClient } from '@angular/common/http'; // To simulate backend calls (for real data)
import { Router, RouterLink } from '@angular/router'; // For navigation

// Define interfaces for better type safety
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  memberSince: string; // e.g., "January 2023"
  profileImageUrl: string;
}

interface BookedRide {
  id: string;
  pickupLocation: string;
  dropoffLocation: string;
  date: string; // e.g., "2024-06-20"
  time: string; // e.g., "10:30 AM"
  status: 'Completed' | 'Upcoming' | 'Cancelled';
  fare: number;
  driverName: string;
  driverRating: number; // Rating for the driver on this ride
}

interface UserRating {
  id: string;
  rideId: string;
  driverName: string;
  rating: number; // 1-5 stars
  comment: string;
  date: string; // e.g., "2024-06-20"
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink], // CommonModule for directives, RouterLink for navigation
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;
  bookedRides: BookedRide[] = [];
  ratingsGiven: UserRating[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  // In a real app, you might inject a service that handles API calls
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    // Simulate fetching data from a backend
    this.loadProfileData();
  }

  loadProfileData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // --- Mock Data for Demonstration ---
    // In a real application, you would replace this with actual HTTP requests
    // to your backend to fetch user data, booked rides, and ratings.
    // Example:
    // const userId = localStorage.getItem('userId'); // Get user ID after login
    // if (userId) {
    //   this.http.get<UserProfile>(`/api/users/${userId}/profile`).subscribe({
    //     next: (data) => this.userProfile = data,
    //     error: (err) => { this.errorMessage = 'Failed to load profile.'; this.isLoading = false; },
    //     complete: () => { /* Check if all data loaded */ }
    //   });
    //   // ... similar calls for rides and ratings
    // } else {
    //   this.errorMessage = 'User not authenticated. Please log in.';
    //   this.isLoading = false;
    //   this.router.navigate(['/login']);
    // }

    setTimeout(() => { // Simulate network delay
      this.userProfile = {
        id: 'user123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-987-6543',
        memberSince: 'March 2023',
        profileImageUrl: 'https://placehold.co/150x150/CCE2FF/000000?text=JD' // Placeholder for user image
      };

      this.bookedRides = [
        {
          id: 'ride001',
          pickupLocation: '123 Main St, Anytown',
          dropoffLocation: '456 Oak Ave, Anytown',
          date: '2024-06-20',
          time: '10:30 AM',
          status: 'Completed',
          fare: 25.50,
          driverName: 'Alice Smith',
          driverRating: 4.8
        },
        {
          id: 'ride002',
          pickupLocation: '789 Pine Ln, Cityville',
          dropoffLocation: '101 Elm Blvd, Cityville',
          date: '2024-07-01',
          time: '08:00 AM',
          status: 'Upcoming',
          fare: 18.00,
          driverName: 'Bob Johnson',
          driverRating: 4.5
        },
        {
          id: 'ride003',
          pickupLocation: 'Mall Entrance, Downtown',
          dropoffLocation: 'Airport Terminal 3',
          date: '2024-06-15',
          time: '04:15 PM',
          status: 'Completed',
          fare: 42.75,
          driverName: 'Charlie Brown',
          driverRating: 4.9
        }
      ];

      this.ratingsGiven = [
        {
          id: 'rating001',
          rideId: 'ride001',
          driverName: 'Alice Smith',
          rating: 5,
          comment: 'Excellent ride, very friendly driver!',
          date: '2024-06-20'
        },
        {
          id: 'rating002',
          rideId: 'ride003',
          driverName: 'Charlie Brown',
          rating: 4,
          comment: 'Good service, arrived on time.',
          date: '2024-06-15'
        }
      ];

      this.isLoading = false;
    }, 1000); // Simulate 1-second network delay
  }

  // Helper functions for star ratings display
  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStarArray(rating: number): number[] {
    return Array(5 - Math.ceil(rating)).fill(0);
  }

  hasHalfStar(rating: number): boolean {
    return rating % 1 !== 0;
  }
}
