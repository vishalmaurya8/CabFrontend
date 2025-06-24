import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // For directives like *ngFor, if needed
import { RouterLink } from '@angular/router'; // For routerLink directive

@Component({
  selector: 'app-about-us', // Selector for this component
  standalone: true, // Declares this component as standalone
  imports: [CommonModule, RouterLink], // Imports necessary Angular modules
  templateUrl: './about.html', // Links to the HTML template
  styleUrls: ['./about.css'] // Links to the CSS styling
})
export class AboutUsComponent {
  companyName: string = 'CabWise Bookings'; // Your company name

  // Details about the company
  aboutDetails = {
    introduction: `Welcome to ${this.companyName}, your trusted partner for seamless and reliable transportation. Founded with the vision to revolutionize urban mobility, we are committed to providing a safe, comfortable, and efficient cab booking experience for everyone.`,
    mission: `Our mission is to connect passengers with reliable drivers, making daily commutes and special journeys effortless. We strive to offer unparalleled convenience, exceptional service, and innovative solutions that cater to the evolving needs of our users.`,
    vision: `To be the leading cab booking platform globally, recognized for our commitment to safety, technological innovation, and outstanding customer satisfaction. We envision a future where transportation is accessible, sustainable, and stress-free for all.`,
    values: [
      {
        icon: '✅', // Checkmark emoji
        title: 'Safety First',
        description: 'Ensuring the well-being of our passengers and drivers is our top priority through rigorous checks and real-time tracking.'
      },
      {
        icon: '💡', // Lightbulb emoji
        title: 'Innovation',
        description: 'Continuously developing cutting-edge technology to enhance the booking experience and operational efficiency.'
      },
      {
        icon: '🤝', // Handshake emoji
        title: 'Reliability',
        description: 'Providing consistent and dependable service, ensuring you always reach your destination on time.'
      },
      {
        icon: '💖', // Heart emoji
        title: 'Customer Centricity',
        description: 'Placing our customers at the heart of everything we do, offering personalized support and services.'
      }
    ]
  };

  // URL for a relevant image. Using a placeholder for now.
  // You can replace this with your own image URL.
  aboutImageUrl: string = 'https://tse3.mm.bing.net/th/id/OIP.KMSWgk8nxGKsfEBwCuv4JwHaHa?w=180&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3';
  // Example: 'https://example.com/images/our-team.jpg';

  constructor() { }
}
