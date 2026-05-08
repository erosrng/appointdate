import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

//MI MAQUINA
export const API_URL = 'http://localhost/demo/api/';
export const URLSOLA = 'http://localhost/';
export const PROTEO_URL_ALONE = 'http://localhost/demo/';

export const API_URLINTER = 'http://localhost/demo/api/';
export const URLSOLAINTER = 'http://localhost/';
export const PROTEO_URL_ALONEINTER = 'http://localhost/demo/';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
  ]
};
