import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // For *ngIf
import { RouterLink, Router } from '@angular/router'; // For routerLink and navigation
import { AuthService } from '../../shared/services/auth'; // Import the AuthService
import { Subscription } from 'rxjs'; // To manage subscriptions

@Component({
  selector: 'app-navbar',
  // Make it standalone as per previous discussions for other components
  standalone: true,
  imports: [CommonModule, RouterLink], // Ensure CommonModule and RouterLink are imported
  templateUrl: './navbar.html', // Assumed template file name
  styleUrls: ['./navbar.css'] // Assumed style file name
})
export class NavbarComponent implements OnInit, OnDestroy { // Renamed class to NavbarComponent
  menuOpen: boolean = false;
  isLoggedIn: boolean = false;
  userRole: string | null = null;
  private authSubscription!: Subscription;
  private roleSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Subscribe to isLoggedIn$ observable from AuthService
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      (status: boolean) => {
        this.isLoggedIn = status;
        console.log('NavbarComponent: Login status updated to', this.isLoggedIn);
      }
    );

    // Subscribe to userRole$ observable from AuthService
    this.roleSubscription = this.authService.userRole$.subscribe(
      (role: string | null) => {
        this.userRole = role;
        console.log('NavbarComponent: User role updated to', this.userRole);
      }
    );

    // Initial check when component loads to get current status
    // The AuthService constructor already calls checkAuthStatus(), so this is redundant but harmless.
    // this.authService.checkAuthStatus();
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  onLogout(): void {
    this.authService.logout();
    this.menuOpen = false; // Close menu after logout
  }

  // Helper to check if the current user is a 'user' role
  isUser(): boolean {
    return this.userRole === 'user'; // Assuming role is stored in lowercase
  }

  // Helper to check if the current user is a 'driver' role
  isDriver(): boolean {
    return this.userRole === 'driver'; // Assuming role is stored in lowercase
  }
}