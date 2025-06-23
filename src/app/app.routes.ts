import { Routes } from '@angular/router';
import { Registration } from './user/registration/registration';
import { User } from './user/user';

export const routes: Routes = [
  { path: 'register', component: Registration },
  // {path: 'User', component: User},
  // { path: '', redirectTo: 'register', pathMatch: 'full' },
];