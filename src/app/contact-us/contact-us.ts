import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for directives like ngIf, ngFor (though not strictly used here, good practice for new components)
import { RouterLink } from '@angular/router'; // If you add any internal links later

@Component({
  selector: 'app-contact-us', // Selector for this component
  standalone: true, // Declares this component as standalone
  imports: [CommonModule, RouterLink], // Imports necessary Angular modules
  templateUrl: './contact-us.html', // Links to the HTML template
  styleUrls: ['./contact-us.css'] // Links to the CSS styling
})
export class ContactUsComponent {
  // Company contact details
  company = {
    name: 'TapRide', // Your Cab Booking Company Name
    mail: 'support@tapride.com',
    phone: '+1 (555) 123-4567',
    address: '123 Cab Lane, City Center, State, 12345'
  };

  // URL for a friendly contact image. Using a placeholder for now.
  // You can replace this with your own image URL.
  contactImageUrl: string = 'https://img.freepik.com/free-vector/contact-us-background-design_23-2147626813.jpg?size=626&ext=jpg';
  // Example of a more specific image if you have one hosted:
  // contactImageUrl: string = 'https://example.com/images/friendly-support.jpg';

  constructor() { }
}
