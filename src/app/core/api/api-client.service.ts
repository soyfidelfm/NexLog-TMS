import { HttpClient, HttpContext, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SKIP_LOADING } from '../interceptors/loading.interceptor';

/** Paged list envelope returned by every NexLog list endpoint. */
export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  descending?: boolean;
}

/** `silent: true` keeps a background call (polling, auto-refresh, typeahead) from showing the global loading overlay. */
export interface ApiOptions {
  silent?: boolean;
}

/**
 * Thin HttpClient wrapper for the NexLog API Gateway (environment.apiUrl).
 * The Auth0 interceptor attaches the Bearer token; 401s are handled by apiErrorInterceptor.
 */
@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http = inject(HttpClient);
  readonly baseUrl = environment.apiUrl;

  page<T>(path: string, params: ListParams = {}, opts?: ApiOptions): Observable<PagedResult<T>> {
    let p = new HttpParams();
    for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== '') p = p.set(k, String(v));
    return this.http.get<PagedResult<T>>(this.url(path), { params: p, context: this.context(opts) });
  }

  /**
   * All items of a paged list. The API caps pageSize at 200, so further pages are fetched when totalPages > 1
   * (previously anything beyond row 200 was silently dropped). Errors are logged and yield an empty list.
   * The follow-up pages are subscribed before the first request completes, so the loading overlay stays up
   * continuously for the whole multi-page fetch.
   */
  list<T>(path: string, params: ListParams = {}, opts?: ApiOptions): Observable<T[]> {
    const size = { pageSize: 200, ...params };
    return this.page<T>(path, { ...size, page: 1 }, opts).pipe(
      switchMap(first => {
        const rest = Array.from({ length: Math.max(0, (first.totalPages ?? 1) - 1) }, (_, i) =>
          this.page<T>(path, { ...size, page: i + 2 }, opts));
        if (!rest.length) return of(first.items ?? []);
        return forkJoin(rest).pipe(map(pages => [first, ...pages].flatMap(r => r.items ?? [])));
      }),
      catchError(err => this.logAnd(err, of([] as T[])))
    );
  }

  get<T>(path: string, opts?: ApiOptions): Observable<T> {
    return this.http.get<T>(this.url(path), { context: this.context(opts) });
  }

  /** GET that maps 404 to undefined. */
  find<T>(path: string, opts?: ApiOptions): Observable<T | undefined> {
    return this.get<T>(path, opts).pipe(
      catchError((err: HttpErrorResponse) => err.status === 404 ? of(undefined) : this.logAnd(err, of(undefined)))
    );
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.url(path), body);
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(this.url(path), body);
  }

  delete(path: string): Observable<void> {
    return this.http.delete<void>(this.url(path));
  }

  /** Swallows non-auth errors for read calls so screens render empty instead of crashing. */
  private logAnd<R>(err: unknown, fallback: Observable<R>): Observable<R> {
    const status = (err as HttpErrorResponse)?.status;
    if (status === 401) return EMPTY; // interceptor already redirected to login
    console.error('[NexLog API]', err);
    return fallback ?? throwError(() => err);
  }

  private context(opts?: ApiOptions): HttpContext {
    return new HttpContext().set(SKIP_LOADING, !!opts?.silent);
  }

  private url(path: string): string {
    return `${this.baseUrl}/${path.replace(/^\/+/, '')}`;
  }
}
