import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
//import { AuthService } from '../services/auth.service'; // Import AuthService
import { AuthService } from '../../shared/services/auth'; // Adjusted import path for AuthService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.html', // Assuming login.html, adjust if it's login.component.html
  styleUrls: ['./login.css'] // Assuming login.css, adjust if it's login.component.css
})
export class LoginComponent {
  user = {
    email: '',
    password: ''
  };
  backendUrl = 'https://localhost:7109/api/User/login';
  loginError: string | null = null;

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) { } // Inject AuthService

  /**
   * Helper function to decode a JWT token (kept here for consistency, but AuthService also has similar logic).
   * @param token The full JWT string.
   * @returns The decoded payload, or null if decoding fails.
   */
  private decodeJwtToken(token: string): any | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Failed to decode JWT token:', e);
      return null;
    }
  }

  loginUser(): void {
    console.log('Attempting login with:', this.user);
    this.loginError = null;

    this.http.post<any>(this.backendUrl, this.user).subscribe({
      next: (response) => {
        console.log('Login successful!', response);

        if (response && response.token) {
          // Store token in localStorage (as per AuthService standard now)
          sessionStorage.setItem('jwt_token', response.token);
          console.log('JWT Token stored successfully.');

          // Notify AuthService about the successful login
          // The AuthService will extract the role from the token itself and update its state.
          this.authService.loginSuccess(response.token);

          // Get the role from the AuthService's current state for immediate redirection
          const userRole = this.authService.userRole;

          if (userRole) {
            console.log(`User role from AuthService: ${userRole}`);
            if (userRole === 'user') {
              this.router.navigate(['/user-dashboard']);
            } else if (userRole === 'driver') {
              this.router.navigate(['/driver-dashboard']);
            } else {
              this.loginError = 'Login successful, but role from token is unrecognized. Redirecting to default.';
              this.router.navigate(['/dashboard']);
            }
          } else {
            this.loginError = 'Login successful, but user role could not be determined from token.';
            this.router.navigate(['/dashboard']);
          }
        } else {
          this.loginError = 'Login successful, but no token received in response. Please try again.';
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Login failed!', error);
        if (error.status === 401 || error.status === 403) {
          this.loginError = 'Invalid email or password. Please check your credentials.';
        } else if (error.error && error.error.message) {
          this.loginError = `Login failed: ${error.error.message}`;
        } else {
          this.loginError = 'An unexpected error occurred during login. Please try again later.';
        }
      }
    });
  }
}
