import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';
import { describe, it, expect, beforeEach } from 'vitest';
import { ApiClient } from './api-client.service';
import { OrdersComponent } from '../../features/orders/orders.component';
import { CarrierManagementComponent } from '../../features/carrier-management/carrier-management.component';
import { TrackingComponent } from '../../features/tracking/tracking.component';
import { ClientPortalComponent } from '../../features/client-portal/client-portal.component';
import { DocumentsComponent } from '../../features/documents/documents.component';
import { LoadPlanningComponent } from '../../features/load-planning/load-planning.component';

registerLocaleData(localeEsMx, 'es-MX');

/** Wraps items in the PagedResult envelope every NexLog list endpoint returns. */
const paged = <T>(items: T[], page = 1, pageSize = 200, totalCount = items.length) =>
  ({ items, page, pageSize, totalCount, totalPages: Math.max(1, Math.ceil(totalCount / pageSize)) });

const city = (c: string) => ({ city: c, country: 'XX', flag: '' });
const fixtures: Record<string, unknown> = {
  orders: paged([{ id: 'ORD-T-1', origin: city('Ningbo'), destination: city('Felixstowe'), weight: 1, volume: 1, status: 'In Transit', carrier: 'COSCO', eta: 'May 25, 2025 01:10 PM', priority: 'Medium' }]),
  carriers: paged([{ id: 'CR-T', name: 'Swift Test Carrier', code: 'SWFT', status: 'Active', onTimePercent: 96, claimsRate: 1, rating: 4.5, totalLoads: 1, mcNumber: 'MC-1', dotNumber: 'D', contact: '', phone: '', email: '', city: '', state: '', equipment: [], notes: '' }]),
  shipments: paged([{ id: 'SHP-T-1', orderNumber: 'O1', origin: 'A', destination: 'B', driver: 'D', driverPhone: '1', vehicle: 'V', eta: 'Today 16:40', status: 'In Transit', progress: 10, color: '#000', routePath: '', position: { x: 1, y: 1 }, alerts: [], timeline: [] }]),
  'portal/shipments': paged([{ id: 'P1', trackingNumber: 'NL-T-1', origin: 'A', destination: 'B', status: 'In Transit', progress: 5, eta: '2026-10-18', documents: [] }]),
  documents: paged([{ id: 'DOC-T-1', type: 'BOL', name: 'x', status: 'Uploaded', uploadedAt: '2026-10-14 09:15', size: '1 KB', icon: 'file-text', loadId: null, orderId: null }]),
  epods: paged([{ id: 'POD-T', loadId: null, signature: '', photoUrl: '', gpsLat: 1, gpsLng: 1, address: 'Epod Address Test', deliveredAt: '2026-10-15 14:28', signedBy: 'Epod Signer', notes: null }]),
  'planning-orders': paged([{ id: 'PO-T-1', customer: 'C', origin: 'A', destination: 'B', weight: 1, volume: 1, priority: 'High' }]),
  trailers: paged([{ id: 'TRL-T', name: 'Trailer T', type: "Dry Van 53'", maxWeight: 100, maxVolume: 100, assigned: [] }]),
};

function flushAll(): void {
  const http = TestBed.inject(HttpTestingController);
  for (const req of http.match(() => true)) {
    const path = new URL(req.request.url).pathname.replace(/^\/api\//, '');
    req.flush(fixtures[path] ?? paged([]));
  }
}

async function render(component: new (...a: never[]) => unknown): Promise<HTMLElement> {
  const fixture = TestBed.createComponent(component as never);
  fixture.detectChanges();
  flushAll();
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('API contract: list screens paint data returned asynchronously', () => {
  beforeEach(() => {
    (window as unknown as { matchMedia?: unknown }).matchMedia ??= () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), provideTranslateService(), provideRouter([])] });
  });

  it('orders table shows the rows of a PagedResult (regression: empty table under OnPush)', async () => {
    const el = await render(OrdersComponent);
    expect(el.querySelectorAll('tbody tr').length).toBe(1);
    expect(el.textContent).toContain('ORD-T-1');
  });
  it('carrier list', async () => expect((await render(CarrierManagementComponent)).textContent).toContain('Swift Test Carrier'));
  it('tracking list', async () => expect((await render(TrackingComponent)).textContent).toContain('SHP-T-1'));
  it('client portal list', async () => expect((await render(ClientPortalComponent)).textContent).toContain('NL-T-1'));
  it('documents + ePOD', async () => expect((await render(DocumentsComponent)).textContent).toContain('Epod Signer'));
  it('load planning', async () => expect((await render(LoadPlanningComponent)).textContent).toContain('PO-T-1'));
});

describe('ApiClient.list', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] }));

  it('fetches every page when totalPages > 1 (API caps pageSize at 200)', () => {
    const api = TestBed.inject(ApiClient);
    const http = TestBed.inject(HttpTestingController);
    let result: number[] = [];
    api.list<number>('orders').subscribe(r => (result = r));
    http.expectOne(r => r.params.get('page') === '1').flush({ items: [1, 2], page: 1, pageSize: 2, totalCount: 3, totalPages: 2 });
    http.expectOne(r => r.params.get('page') === '2').flush({ items: [3], page: 2, pageSize: 2, totalCount: 3, totalPages: 2 });
    expect(result).toEqual([1, 2, 3]);
  });
});
