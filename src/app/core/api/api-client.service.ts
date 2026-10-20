import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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

/**
 * Thin HttpClient wrapper for the NexLog API Gateway (environment.apiUrl).
 * The Auth0 interceptor attaches the Bearer token; 401s are handled by apiErrorInterceptor.
 */
@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http = inject(HttpClient);
  readonly baseUrl = environment.apiUrl;

  page<T>(path: string, params: ListParams = {}): Observable<PagedResult<T>> {
    let p = new HttpParams();
    for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== '') p = p.set(k, String(v));
    return this.http.get<PagedResult<T>>(this.url(path), { params: p });
  }

  /** Items of a paged list (default up to 200 rows). Errors are logged and yield an empty list. */
  list<T>(path: string, params: ListParams = {}): Observable<T[]> {
    return this.page<T>(path, { pageSize: 200, ...params }).pipe(
      map(r => r.items ?? []),
      catchError(err => this.logAnd(err, of([] as T[])))
    );
  }

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(this.url(path));
  }

  /** GET that maps 404 to undefined. */
  find<T>(path: string): Observable<T | undefined> {
    return this.get<T>(path).pipe(
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

  private url(path: string): string {
    return `${this.baseUrl}/${path.replace(/^\/+/, '')}`;
  }
}
