import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router'; // For navigation
import { HttpClient } from '@angular/common/http'; // For HTTP requests
import { FormsModule } from '@angular/forms'; // For [(ngModel)]
import { HttpClientModule } from '@angular/common/http'; // Ensure this is imported

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, HttpClientModule], // Correct imports
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  user = {
    email: '',
    password: '',
  };

  backendUrl = 'https://localhost:7109/api/User/login'; // Backend login endpoint

  constructor(private router: Router, private http: HttpClient) {}

  loginUser() {
    console.log('Trying to log in with:', this.user);

    this.http.post<any>(this.backendUrl, this.user).subscribe({
      next: (response) => {
        console.log('Login successful!', response);

        if (response && response.token) {
          localStorage.setItem('jwt_token', response.token);
          console.log('Token stored in localStorage.');
          this.router.navigate(['/dashboard']); // Redirect to dashboard
        } else {
          console.warn('Login successful, but no token received in response.');
        }

        // this.router.navigate(['/dashboard']); // Navigate to the dashboard
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }
}