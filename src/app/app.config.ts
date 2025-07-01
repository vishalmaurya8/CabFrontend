import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations'; // Import provideAnimations
import { routes } from './app.routes';
import { AuthService } from './shared/services/auth';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideToastr(),
    provideAnimations(), // Add animations support here
    AuthService
  ],
};

@NgModule({
  declarations: [
    // Your components
  ],
  imports: [
    BrowserModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center', // Set position to top-center
      preventDuplicates: true, // Optional: Prevent duplicate toasts
    }),
  ],
  providers: [],
  bootstrap: [/* Your root component */],
})
export class AppModule {}