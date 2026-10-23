import { HttpClient, HttpContext, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { environment } from '../../../environments/environment';
import { ApiClient } from '../api/api-client.service';
import { LOADING_MIN_VISIBLE_MS, LOADING_SHOW_DELAY_MS, LoadingService } from '../loading/loading.service';
import { SKIP_LOADING, loadingInterceptor } from './loading.interceptor';

const API = environment.apiUrl;

describe('loadingInterceptor', () => {
  let http: HttpClient;
  let ctrl: HttpTestingController;
  let loading: LoadingService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([loadingInterceptor])), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpClient);
    ctrl = TestBed.inject(HttpTestingController);
    loading = TestBed.inject(LoadingService);
  });
  afterEach(() => {
    ctrl.verify();
    vi.useRealTimers();
  });

  it('increments while the request is in flight and decrements on success', () => {
    http.get(`${API}/orders`).subscribe();
    expect(loading.pending()).toBe(1);
    ctrl.expectOne(`${API}/orders`).flush({});
    expect(loading.pending()).toBe(0);
  });

  it('decrements on HTTP errors too', () => {
    let failed = false;
    http.get(`${API}/orders`).subscribe({ error: () => (failed = true) });
    expect(loading.pending()).toBe(1);
    ctrl.expectOne(`${API}/orders`).flush('boom', { status: 500, statusText: 'Server Error' });
    expect(failed).toBe(true);
    expect(loading.pending()).toBe(0);
  });

  it('decrements when the request is cancelled (unsubscribe)', () => {
    const sub = http.get(`${API}/orders`).subscribe();
    expect(loading.pending()).toBe(1);
    sub.unsubscribe();
    expect(loading.pending()).toBe(0);
    expect(ctrl.expectOne(`${API}/orders`).cancelled).toBe(true);
  });

  it('ignores requests marked SKIP_LOADING', () => {
    http.get(`${API}/orders`, { context: new HttpContext().set(SKIP_LOADING, true) }).subscribe();
    expect(loading.pending()).toBe(0);
    ctrl.expectOne(`${API}/orders`).flush({});
  });

  it('ignores requests that are not for our API', () => {
    http.get('https://example.com/other').subscribe();
    expect(loading.pending()).toBe(0);
    ctrl.expectOne('https://example.com/other').flush({});
  });

  it('shows the overlay only for slow requests', () => {
    http.get(`${API}/fast`).subscribe();
    vi.advanceTimersByTime(LOADING_SHOW_DELAY_MS / 2);
    ctrl.expectOne(`${API}/fast`).flush({});
    vi.advanceTimersByTime(1000);
    expect(loading.visible()).toBe(false);

    http.get(`${API}/slow`).subscribe();
    vi.advanceTimersByTime(LOADING_SHOW_DELAY_MS);
    expect(loading.visible()).toBe(true);
    ctrl.expectOne(`${API}/slow`).flush({});
    vi.advanceTimersByTime(LOADING_MIN_VISIBLE_MS);
    expect(loading.visible()).toBe(false);
  });

  describe('ApiClient', () => {
    const page = (items: number[], pageNo: number, totalPages: number) =>
      ({ items, page: pageNo, pageSize: 200, totalCount: 400, totalPages });

    it('multi-page list() keeps the counter above zero between pages (one continuous overlay)', () => {
      const api = TestBed.inject(ApiClient);
      const pendingAtEachStep: number[] = [];
      let result: number[] | undefined;
      api.list<number>('orders').subscribe(r => (result = r));
      pendingAtEachStep.push(loading.pending());

      ctrl.expectOne(r => r.url === `${API}/orders` && r.params.get('page') === '1').flush(page([1], 1, 2));
      pendingAtEachStep.push(loading.pending()); // page 2 already in flight, never 0 in between
      ctrl.expectOne(r => r.url === `${API}/orders` && r.params.get('page') === '2').flush(page([2], 2, 2));
      pendingAtEachStep.push(loading.pending());

      expect(pendingAtEachStep).toEqual([1, 1, 0]);
      expect(result).toEqual([1, 2]);
    });

    it('list()/get() with { silent: true } do not touch the counter', () => {
      const api = TestBed.inject(ApiClient);
      api.list<number>('orders', {}, { silent: true }).subscribe();
      api.get('orders/1', { silent: true }).subscribe();
      expect(loading.pending()).toBe(0);
      ctrl.match(() => true).forEach(r => r.flush({ items: [], totalPages: 1 }));
    });
  });
});

