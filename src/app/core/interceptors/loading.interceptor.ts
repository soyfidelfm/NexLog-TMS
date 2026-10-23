import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoadingService } from '../loading/loading.service';

/**
 * Set to true in the request context for silent/background calls (polling, auto-refresh, typeahead)
 * that must not trigger the global loading overlay. `ApiClient` exposes it as `{ silent: true }`.
 */
export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);

/**
 * Feeds LoadingService with every request to our API. `finalize` runs on success, error and
 * unsubscribe (cancelled requests), so the counter can never leak.
 * Registered first (outermost) so the wait for the Auth0 access token is covered too.
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_LOADING) || !req.url.startsWith(environment.apiUrl)) return next(req);
  const release = inject(LoadingService).begin();
  return next(req).pipe(finalize(release));
};
