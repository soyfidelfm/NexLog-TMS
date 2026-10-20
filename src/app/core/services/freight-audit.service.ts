import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiClient } from '../api/api-client.service';
import { AuditStatus, FreightInvoice } from '../models';

/** FreightAudit microservice: /api/invoices */
@Injectable({ providedIn: 'root' })
export class FreightAuditService {
  private readonly api = inject(ApiClient);

  getInvoices(): Observable<FreightInvoice[]> {
    return this.api.list<FreightInvoice>('invoices');
  }

  updateStatus(id: string, status: AuditStatus): Observable<FreightInvoice | undefined> {
    const path = `invoices/${encodeURIComponent(id)}`;
    return this.api.get<FreightInvoice>(path).pipe(switchMap(inv => this.api.put<FreightInvoice>(path, { ...inv, status })));
  }
}
