import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import Material from '@primeng/themes/material';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
  provideAnimationsAsync(),
  provideHttpClient(
    withFetch(),
    withInterceptors([authInterceptor])
  ),
  providePrimeNG({
    theme: {
      preset: Material,
      options: {
        prefix: 'p',
        darkModeSelector: 'false',
        cssLayer: false
      }
    }
  })
  ]
};
