import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Injector, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

let handlingUnauthorized = false;

/**
 * Bearer tokens are attached by Auth0's authHttpInterceptorFn (see app.config.ts, allowedList = environment.apiUrl/*).
 * This interceptor only handles auth failures from our API: a 401 (missing/expired/invalid token) or an Auth0
 * "login_required" error clears the local Auth0 session (no redirect to Auth0) and sends the user to /login.
 * Clearing the session avoids a loop where /login sees a stale session and bounces back to /dashboard.
 */
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  // Resolved lazily: injecting Router/Auth0 eagerly creates a DI cycle at startup.
  const injector = inject(Injector);
  return next(req).pipe(
    catchError((err: unknown) => {
      const isApi = req.url.startsWith(environment.apiUrl);
      const status = err instanceof HttpErrorResponse ? err.status : undefined;
      const auth0Error = (err as { error?: string })?.error;
      if (isApi && !handlingUnauthorized && (status === 401 || auth0Error === 'login_required' || auth0Error === 'consent_required')) {
        handlingUnauthorized = true;
        const router = injector.get(Router);
        injector.get(Auth0Service).logout({ openUrl: false }).subscribe({
          complete: () => {
            router.navigate(['/login'], { queryParams: { reason: 'session' } })
              .finally(() => (handlingUnauthorized = false));
          },
        });
      }
      return throwError(() => err);
    })
  );
};
