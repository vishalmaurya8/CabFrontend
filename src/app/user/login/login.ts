import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Needed for *ngIf if you add messages

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.html', // Note: Using login.component.html as standard Angular practice
  styleUrls: ['./login.css'] // Note: Using login.component.css as standard Angular practice
})
export class LoginComponent {
  user = {
    email: '',
    password: ''
  };
  backendUrl = 'https://localhost:7109/api/User/login'; // Your backend login endpoint
  loginError: string | null = null; // Property to store and display login error messages

  constructor(private router: Router, private http: HttpClient) { }

  /**
   * Helper function to decode a JWT token.
   * This is a simple client-side decoder for demonstration.
   * In a more robust application, consider a dedicated library like 'jwt-decode'.
   * @param token The full JWT string.
   * @returns The decoded payload, or null if decoding fails.
   */
  private decodeJwtToken(token: string): any | null {
    try {
      const base64Url = token.split('.')[1]; // Get the payload part
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Convert base64url to base64
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
    this.loginError = null; // Clear any previous error messages

    this.http.post<any>(this.backendUrl, this.user).subscribe({
      next: (response) => {
        console.log('Login successful!', response);

        if (response && response.token) {
          localStorage.setItem('jwt_token', response.token);
          console.log('JWT Token stored successfully.');

          // --- IMPORTANT: Extracting User Role from JWT Token ---
          const decodedToken = this.decodeJwtToken(response.token);

          if (decodedToken) {
            // The role claim name from your JWT output
            const roleClaimName = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
            const userRole = decodedToken[roleClaimName];

            if (userRole) {
              // Store role in lowercase for consistent comparison
              localStorage.setItem('user_role', userRole.toLowerCase());
              console.log(`User role identified and stored from JWT: ${userRole}`);

              // Redirect based on the user's role
              if (userRole.toLowerCase() === 'user') {
                this.router.navigate(['/user-dashboard']);
              } else if (userRole.toLowerCase() === 'driver') {
                this.router.navigate(['/driver-dashboard']);
              } else {
                // Fallback for unexpected roles
                this.loginError = 'Login successful, but role from token is unrecognized. Redirecting to default.';
                this.router.navigate(['/dashboard']); // Or a generic dashboard if you have one
              }
            } else {
              this.loginError = 'Login successful, but user role claim not found in token.';
              this.router.navigate(['/dashboard']); // Fallback
            }
          } else {
            this.loginError = 'Login successful, but failed to decode JWT token.';
            this.router.navigate(['/dashboard']); // Fallback
          }
        } else {
          this.loginError = 'Login successful, but no token received. Please try again.';
          this.router.navigate(['/dashboard']); // Fallback
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
