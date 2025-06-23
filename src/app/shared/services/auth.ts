import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }
  baseURL = 'https://localhost:7109/api';
 
  createUser(formData: any) {
    return this.http.post(this.baseURL + '/User/register', formData);
  }
 
  login(formData: any) {
    return this.http.post(this.baseURL + '/User/login', formData);
  }
 
  private getAuthHeaders() {
    const token = sessionStorage.getItem('token');
    return token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};
  }
 
  getUserRoles(): string | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;
 
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
 
      const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      return role;
    } catch (e) {
      console.error('Failed to decode token payload', e);
      return null;
    }
  }
}