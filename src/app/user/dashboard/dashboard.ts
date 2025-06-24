import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
 
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  constructor(private router: Router) { } // Inject Router
 
  logout() {
    localStorage.removeItem('jwt_token'); // Remove the token
    this.router.navigate(['/login']); // Go back to login page
  }
}