import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs'; // Import BehaviorSubject and Observable
import { Router } from '@angular/router'; // Import Router for logout redirection

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseURL = 'https://localhost:7109/api';

  // BehaviorSubject to hold and emit the login status
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  // Public Observable for other components to subscribe to login status
  isLoggedIn$: Observable<boolean> = this._isLoggedIn.asObservable();

  // BehaviorSubject to hold and emit the user's role
  private _userRole = new BehaviorSubject<string | null>(null);
  // Public Observable for other components to subscribe to user role
  userRole$: Observable<string | null> = this._userRole.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Initialize the authentication status when the service is created
    this.checkAuthStatus();
  }

  /**
   * Checks authentication status from localStorage (token and role)
   * and updates the BehaviorSubjects.
   * This is called on service initialization and after login/logout.
   */
  checkAuthStatus(): void {
    const token = sessionStorage.getItem('jwt_token'); // Using localStorage as per your login.ts
    const role = this.getRoleFromToken(token); // Extract role from token if present

    this._isLoggedIn.next(!!token); // Convert truthy (token exists) to true, falsy to false
    this._userRole.next(role ? role.toLowerCase() : null); // Store role in lowercase

    console.log('AuthService: Status Checked - LoggedIn:', this._isLoggedIn.getValue(), 'Role:', this._userRole.getValue());
  }

  /**
   * Helper to decode JWT token and extract the role claim.
   * @param token The JWT string.
   * @returns The extracted role string or null.
   */
  private getRoleFromToken(token: string | null): string | null {
    if (!token) return null;

    try {
      const base64Url = token.split('.')[1]; // Get the payload part
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Convert base64url to base64
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const payload = JSON.parse(jsonPayload);

      // Your specific role claim name from the JWT payload
      const roleClaimName = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
      return payload[roleClaimName] || null;

    } catch (e) {
      console.error('Failed to decode JWT token or extract role:', e);
      return null;
    }
  }

  /**
   * Extracts the user's name from the JWT token stored in sessionStorage.
   * @returns The user's name or null if not found.
   */
  getUserName(): string | null {
    const token = sessionStorage.getItem('jwt_token');
    if (!token) {
      console.warn('JWT token not found in sessionStorage.');
      return null;
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      console.log('Decoded JWT Payload:', payload);

      // Your specific name claim name from the JWT payload
      const nameClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
      return payload[nameClaim] || null;
    } catch (e) {
      console.error('Failed to decode JWT token:', e);
      return null;
    }
  }

  // --- API interaction methods ---
  createUser(formData: any) {
    return this.http.post(this.baseURL + '/User/register', formData);
  }

  login(formData: any): Observable<any> { // Make return type Observable<any>
    return this.http.post(this.baseURL + '/User/login', formData);
  }

  private getAuthHeaders() {
    const token = sessionStorage.getItem('jwt_token'); // Using localStorage here too
    return token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};
  }
  // --- End of API interaction methods ---

  /**
   * Call this from LoginComponent after successful login.
   * It re-checks the auth status and notifies subscribers.
   */
  loginSuccess(token: string): void {
    // Store token. Role will be extracted by checkAuthStatus()
    sessionStorage.setItem('jwt_token', token);
    this.checkAuthStatus(); // Update state based on new token
  }

  /**
   * Logs out the user. Clears local storage and resets auth state.
   */
  logout(): void {
    sessionStorage.removeItem('jwt_token');
    sessionStorage.removeItem('user_role'); // Also clear the user_role stored by login.ts if it exists
    this._isLoggedIn.next(false); // Emit logged out status
    this._userRole.next(null); // Emit null role
    this.router.navigate(['/login']); // Redirect to login page
    console.log('AuthService: User logged out.');
  }

  /**
   * Synchronous getter for current login status (useful for route guards)
   */
  get isLoggedIn(): boolean {
    return this._isLoggedIn.getValue();
  }

  /**
   * Synchronous getter for current user role (useful for route guards)
   */
  get userRole(): string | null {
    return this._userRole.getValue();
  }
}