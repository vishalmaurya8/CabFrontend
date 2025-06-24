import { Routes } from '@angular/router';
import { Registration } from './user/registration/registration';
import { LoginComponent } from './user/login/login';
// import { LoginComponent } from './login/login'; 
import { DashboardComponent } from './user/dashboard/dashboard'; 
import { HomepageComponent } from './homepage/homepage'; // Updated 
// import to HomepageComponent
import { ContactUsComponent } from './contact-us/contact-us'; // Import your new ContactUsComponent
import { AboutUsComponent } from './about/about'; // Import your new AboutUsComponent
import { User } from './user/user';
import { AuthGuard } from './user/auth-guard'; // Import AuthGuard

export const routes: Routes = [
  { path: 'register', component: Registration },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }, // Protect the dashboard route
  { path: 'contact-us', component: ContactUsComponent }, // Add this route
  { path: 'home', component: HomepageComponent }, // Updated component name in the route
  { path: 'about-us', component: AboutUsComponent }, // Add this route
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // {path: 'User', component: User},
];