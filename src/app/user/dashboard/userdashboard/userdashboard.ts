import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/services/auth';
import { RideService } from '../../../shared/services/bookrideservice/bookrideservice';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: `./userdashboard.html`,
  styleUrls: [`./userdashboard.css`,],
})

export class UserDashboardComponent implements OnInit {
  //Class properties
  rideForm: FormGroup;
  userName: string | null = null; // Store the user's name retrieved from AuthService
  isLoading: boolean = false;
  rideHistory: any[] = []; // Store the user's ride history
  showRatingModal: boolean = false; // To toggle the rating modal
  selectedRide: any = null; // Store the selected ride for rating
  currentRating: number = 0; // Store the current rating
  ridesToShow: number = 5; // Number of rides to show initially

  constructor(
    //injecting service into component thru DI
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private rideService: RideService
  ) {
    //reactive form initialization
    this.rideForm = this.fb.group({
      pickupLocation: ['', Validators.required],
      dropoffLocation: ['', Validators.required],
    });
  }

  // Method to navigate to the Payment History page
  viewPaymentHistory(): void {
    console.log('Navigating to Payment History');
    this.router.navigate(['/payment-history']);
  }

  ngOnInit(): void {
    this.userName = this.authService.getUserName(); // Fetch the user's name
    this.fetchRideHistory(); // Fetch the user's ride history
  }

  bookRide(): void {
    if (this.rideForm.valid) {
      this.isLoading = true;
      const token = sessionStorage.getItem('jwt_token') || '';

      const rideDetails = {
        ...this.rideForm.value,
        driverId: 11, // Automatically assign driverId as 8
      };

      this.rideService.bookRide(rideDetails, token)
      .subscribe({
          next: (response) => {
            console.log('Ride booked successfully:', response);
            this.toastr.success('Ride booked successfully!', 'Success');
            this.rideForm.reset();
            this.isLoading = false;
            this.fetchRideHistory(); // Refresh ride history after booking
            // Navigate to RideDetailsComponent with ride details
            this.router.navigate(['/ride-details'], {
              state: { data: response },
            });
          },
          error: (error) => {
            console.error('Failed to book ride:', error);
            if (error.error && error.error.message) {
              this.toastr.error(error.error.message, 'Error');
            } else {
              this.toastr.error(
                'Failed to book ride. Please try again.',
                'Error'
              );
            }
            this.isLoading = false;
          },
        });
    }
  }

  fetchRideHistory(): void {
    const token = sessionStorage.getItem('jwt_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http
      .get<any[]>('https://localhost:7109/api/Customer/rides', { headers })
      .subscribe({
        next: (rides) => {
          this.fetchRatings(rides); // Fetch ratings and merge with rides
          this.cdr.detectChanges(); // Ensure the view updates
        },
        error: (error) => {
          console.error('Failed to fetch ride history:', error);
          this.toastr.error('Failed to load ride history.', 'Error');
        },
      });
  }

  fetchRatings(rides: any[]): void {
    const token = sessionStorage.getItem('jwt_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http
      .get<any[]>('https://localhost:7109/api/Rating', { headers })
      .subscribe({
        next: (ratings) => {
          console.log('Fetched Rides:', rides);
          console.log('Fetched Ratings:', ratings);

          // Merge ratings with rides based on rideId
          this.rideHistory = rides.map((ride) => {
            const rating = ratings.find((r) => r.rideId === ride.rideId);
            return {
              ...ride,
              rating: rating ? rating.score : 'N/A',
              comments: rating ? rating.comments : null,
            }; // Use 'score' for the rating
          });
          this.cdr.detectChanges(); // Trigger change detection

          console.log('Merged Ride History:', this.rideHistory);
        },
        error: (error) => {
          console.error('Failed to fetch ratings:', error);
          this.toastr.error('Failed to load ratings.', 'Error');
        },
      });
  }

  loadMore(): void {
    this.ridesToShow += 5; // Increase the number of rides to show
    console.log('Loading more rides, total now:', this.ridesToShow);
    this.cdr.detectChanges(); // Ensure the view updates
  }

  openRatingModal(ride: any): void {
    this.selectedRide = ride;
    this.currentRating = 0; // Reset the rating
    this.showRatingModal = true;
  }

  closeRatingModal(): void {
    this.showRatingModal = false;
    this.selectedRide = null;
  }

  setRating(rating: number): void {
    this.currentRating = rating;
  }

  comments: string = ''; // Store user comments

  submitRating(): void {
    if (!this.selectedRide || this.currentRating === 0) {
      this.toastr.error('Please select a rating before submitting.', 'Error');
      return;
    }

    const token = sessionStorage.getItem('jwt_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const requestBody = {
      rideId: this.selectedRide.rideId,
      score: this.currentRating,
      comments: this.comments || 'No comments provided', // Use user input or a default value
    };

    console.log('Request Body:', requestBody); // Debug log

    this.http
      .post('https://localhost:7109/api/Rating', requestBody, { headers })
      .subscribe({
        next: () => {
          this.toastr.success('Rating submitted successfully!', 'Success');
          this.selectedRide.rating = this.currentRating; // Update the rating locally
          this.selectedRide.comments = this.comments; // Update the comments locally
          this.closeRatingModal();
          this.cdr.detectChanges(); // Ensure the view updates
        },
        error: (error) => {
          console.error('Failed to submit rating:', error);
          if (error.error && error.error.errors) {
            console.error('Validation Errors:', error.error.errors); // Log validation errors
          }
          this.toastr.error(
            'Failed to submit rating. Please try again.',
            'Error'
          );
        },
      });
  }
}
