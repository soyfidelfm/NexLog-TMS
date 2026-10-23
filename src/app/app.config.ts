import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, TitleStrategy } from '@angular/router';
import localeEsMx from '@angular/common/locales/es-MX';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { provideMaplibreWorker } from '@maplibre/ngx-maplibre-gl/config';
import { routes } from './app.routes';
import { LanguageService } from './core/language.service';
import { TranslatedTitleStrategy } from './core/translated-title.strategy';
import { environment } from '../environments/environment';
import { apiErrorInterceptor } from './core/interceptors/auth.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

registerLocaleData(localeEsMx, 'es-MX');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([loadingInterceptor, apiErrorInterceptor, authHttpInterceptorFn])),
    provideTranslateService({
      fallbackLang: 'es',
      loader: provideTranslateHttpLoader({ prefix: '/i18n/', suffix: '.json', useHttpBackend: true }),
    }),
    provideAppInitializer(() => inject(LanguageService).init()),
    { provide: TitleStrategy, useClass: TranslatedTitleStrategy },
    provideCharts(withDefaultRegisterables()),
    provideMaplibreWorker('maplibre-gl-worker.mjs'),
    provideAuth0({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: environment.auth0.audience
      },
      cacheLocation: 'localstorage',
      useRefreshTokens: true,
      // Attach the access token only to calls to our API Gateway.
      httpInterceptor: {
        allowedList: [
          {
            uri: `${environment.apiUrl}/*`,
            tokenOptions: { authorizationParams: { audience: environment.auth0.audience } }
          }
        ]
      }
    })
  ],
};
