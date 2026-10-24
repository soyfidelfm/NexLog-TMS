import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/auth.service';

/** Shared TestBed providers for the chat specs: no Auth0, no HTTP, translations return their keys. */
export function chatTestProviders() {
  const auth = {
    isAuthenticated: signal(true),
    user: signal({ sub: 'auth0|tester', name: 'Test User', email: 'tester@example.com', picture: null }),
  };
  return [
    provideTranslateService(),
    provideRouter([]),
    { provide: AuthService, useValue: auth },
  ];
}
