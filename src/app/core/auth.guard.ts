import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { filter, map, switchMap, take } from 'rxjs/operators';

/** Waits for Auth0 to finish restoring the session (isLoading$) so reloads don't bounce to /login. */
export const authGuard: CanActivateFn = () => {
  const auth0 = inject(Auth0Service);
  const router = inject(Router);
  return auth0.isLoading$.pipe(
    filter(loading => !loading),
    take(1),
    switchMap(() => auth0.isAuthenticated$.pipe(take(1))),
    map(ok => (ok ? true : router.createUrlTree(['/login'])))
  );
};
