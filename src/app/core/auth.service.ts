import { Injectable, inject } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth0 = inject(Auth0Service);

  /** True when Auth0 reports an authenticated session */
  readonly isAuthenticated = toSignal(this.auth0.isAuthenticated$, { initialValue: false });

  /** Auth0 user profile (name, picture, email, etc.) */
  readonly user = toSignal(this.auth0.user$, { initialValue: null });

  loginWith(provider?: 'google-oauth2' | 'windowslive' | 'discord'): void {
    this.auth0.loginWithRedirect({
      appState: { target: '/dashboard' },
      authorizationParams: provider ? { connection: provider } : undefined
    });
  }

  logout(): void {
    this.auth0.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}
