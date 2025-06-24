import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [], // Add CommonModule here if you use things like ngIf, ngFor in your HTML
  templateUrl: './dashboard.html',   // <--- Path adjusted to match 'dashboard.html'
  styleUrls: ['./dashboard.css']     // <--- Path adjusted to match 'dashboard.css' (and ensures it's plural)
})
export class DashboardComponent { // This class name must be 'DashboardComponent'

}