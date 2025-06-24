// src/app/auth-guard.ts
 
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root' // Makes this guard a singleton and available throughout the app
})
export class AuthGuard implements CanActivate {
 
  constructor(private router: Router) {} // Inject the Router service
 
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
 
    const token = localStorage.getItem('jwt_token'); // Get the token from localStorage
 
    if (token) {
      // You might want to add token validation (e.g., check expiry) here later
      return true; // Token exists, allow access
    } else {
      // No token, redirect to login page
      this.router.navigate(['/login']);
      return false;
    }
  }
}