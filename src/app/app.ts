import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './Header/navbar/navbar';
import { ToastrModule } from 'ngx-toastr';
// import { Navbar } from './Header/navbar/navbar';
 
 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastrModule],
  templateUrl: './app.html',
  // styleUrls: ['./app.css'],
})
export class App {}