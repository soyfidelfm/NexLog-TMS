import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FreightInvoice, AuditStatus } from '../models';

@Injectable({ providedIn: 'root' })
export class FreightAuditService {
  private mockInvoices: FreightInvoice[] = [
    {
      id: 'INV-78421',
      carrier: 'Swift Transportation',
      loadId: 'LD-2026-0842',
      invoiceDate: '2026-10-14',
      status: 'Pending',
      lines: [
        { description: 'Linehaul / Base Rate', expected: 1850.00, billed: 1850.00 },
        { description: 'Fuel Surcharge', expected: 185.00, billed: 248.50 },
        { description: 'Detention (2h)', expected: 0, billed: 120.00 },
        { description: 'Accessorial - Liftgate', expected: 75.00, billed: 75.00 },
      ],
    },
    {
      id: 'INV-78435',
      carrier: 'Knight-Swift',
      loadId: 'LD-2026-0845',
      invoiceDate: '2026-10-13',
      status: 'Pending',
      lines: [
        { description: 'Linehaul / Base Rate', expected: 1420.00, billed: 1420.00 },
        { description: 'Fuel Surcharge', expected: 142.00, billed: 142.00 },
        { description: 'Toll', expected: 38.50, billed: 38.50 },
      ],
    },
    {
      id: 'INV-78448',
      carrier: 'Schneider',
      loadId: 'LD-2026-0848',
      invoiceDate: '2026-10-12',
      status: 'Disputed',
      lines: [
        { description: 'Linehaul / Base Rate', expected: 2100.00, billed: 2350.00 },
        { description: 'Fuel Surcharge', expected: 210.00, billed: 210.00 },
        { description: 'Stop-off Charge', expected: 0, billed: 85.00 },
      ],
    },
    {
      id: 'INV-78452',
      carrier: 'Werner Enterprises',
      loadId: 'LD-2026-0854',
      invoiceDate: '2026-10-15',
      status: 'Approved',
      lines: [
        { description: 'Linehaul / Base Rate', expected: 1680.00, billed: 1680.00 },
        { description: 'Fuel Surcharge', expected: 168.00, billed: 168.00 },
      ],
    },
  ];

  getInvoices(): Observable<FreightInvoice[]> {
    return of(this.mockInvoices);
  }

  updateStatus(id: string, status: AuditStatus): Observable<FreightInvoice | undefined> {
    const inv = this.mockInvoices.find(i => i.id === id);
    if (inv) inv.status = status;
    return of(inv);
  }
}
