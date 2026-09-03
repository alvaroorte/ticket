import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { routes } from './app.routes';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { HeaderInterceptor } from '@core/interceptors/header.interceptor';
import { LoaderInterceptor } from '@core/interceptors/loader.interceptor';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha-2';
import { environment } from '@core/environments/environment.development';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding()
    ), 
    provideAnimationsAsync(),
    providePrimeNG({ 
        theme: {
            preset: Lara,
            options: {
              prefix: 'p',
              darkModeSelector: '.ticket-mode-dark',
              cssLayer: false
            }
        },
        ripple: true,
    }),
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    BrowserModule,
    BrowserAnimationsModule,
    MessageService,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    importProvidersFrom(RecaptchaV3Module),
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptcha_site_key
    }
  ]

};
