import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './Header/navbar/navbar';
 
 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  // styleUrls: ['./app.css'],
})
export class App {}