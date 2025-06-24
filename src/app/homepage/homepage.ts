import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for directives like ngFor if you add dynamic features later
import { RouterLink } from '@angular/router'; // Needed for routerLink directive in HTML

@Component({
  selector: 'app-homepage', // Updated selector
  standalone: true, // Declares this component as standalone, not requiring a separate NgModule
  imports: [CommonModule, RouterLink], // Imports CommonModule for common Angular directives, and RouterLink
  templateUrl: './homepage.html', // Links to the HTML template file
  styleUrls: ['./homepage.css'] // Links to the CSS styling file
})
export class HomepageComponent { // Updated class name
  // Define features to display in cards. This makes it easy to update or extend.
  features = [
    {
      icon: '🚗', // Car emoji for cab icon
      title: 'Effortless Booking',
      description: 'Book your ride in seconds with our intuitive and user-friendly interface. Just a few taps and you’re good to go!'
    },
    {
      icon: '📍', // Pin emoji for location
      title: 'Real-time Tracking',
      description: 'Track your cab in real-time, know its exact location, and get estimated arrival times for peace of mind.'
    },
    {
      icon: '💳', // Credit card emoji for payments
      title: 'Secure Payments',
      description: 'Enjoy secure and flexible payment options, including in-app payments, cash, and digital wallets.'
    },
    {
      icon: '⭐', // Star emoji for ratings
      title: 'Rated Drivers',
      description: 'Travel with confidence! All our drivers are professionally vetted and rated by fellow passengers.'
    },
    {
      icon: '⏰', // Alarm clock for 24/7
      title: '24/7 Availability',
      description: 'Need a ride at any hour? Our services are available around the clock, day and night.'
    },
    {
      icon: '💰', // Money bag for affordability
      title: 'Affordable Fares',
      description: 'Get the best rates without compromising on quality or comfort. Transparent pricing, no hidden fees.'
    }
  ];

  currentYear: number = new Date().getFullYear(); // Property to hold the current year for the footer

  // This component doesn't require complex logic for a static home page,
  // but you could add methods here for future interactivity.
  constructor() { }
}
